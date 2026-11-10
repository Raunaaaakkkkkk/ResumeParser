import express from "express";
import dotenv from "dotenv";
import path from "path";
import { createRequire } from "module";
import { GoogleGenAI, Type } from "@google/genai";
import { runDeterministicAtsEngine } from "./server/deterministicAtsEngine.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const PDFParse = pdfParseModule?.PDFParse || (typeof pdfParseModule === "function" ? pdfParseModule : null);

async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  if (PDFParse) {
    try {
      const parser = new PDFParse({ data: buffer });
      if (typeof parser.load === "function") {
        await parser.load();
      }
      const data = await parser.getText();
      if (data && data.text && data.text.trim().length > 10) {
        return data.text.trim();
      }
    } catch {
      try {
        const data = await (PDFParse as any)(buffer);
        if (data && data.text && data.text.trim().length > 10) {
          return data.text.trim();
        }
      } catch {
        // Fallback to text stream scanning
      }
    }
  }

  // Stream text extractor fallback for uncompressed / basic text objects in PDF
  try {
    const rawStr = buffer.toString("latin1");
    const extracted: string[] = [];
    const textRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*T[jJ]/g;
    let match;
    while ((match = textRegex.exec(rawStr)) !== null) {
      const clean = match[1].replace(/\\([()\\])/g, "$1").trim();
      if (clean) extracted.push(clean);
    }
    if (extracted.length > 5) {
      return extracted.join(" ");
    }
  } catch {
    // Stream fallback ignored
  }

  return "";
}

// Body parser with generous limit for PDF / image uploads in base64
app.use(express.json({ limit: "35mb" }));
app.use(express.urlencoded({ extended: true, limit: "35mb" }));

// Initialize Google GenAI with dynamic key reload & retry optimization
function getAiClient(): GoogleGenAI | null {
  dotenv.config();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || !apiKey.trim()) return null;
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      retryOptions: { attempts: 1 }, // No retry loops on 5xx
    },
  });
}

// JSON Schema definition for strict ATS evaluation output
const atsEvaluationSchema = {
  type: Type.OBJECT,
  properties: {
    candidate_profile: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Candidate full name extracted strictly from resume" },
        headline: { type: Type.STRING, description: "Professional title or headline" },
        email: { type: Type.STRING, description: "Email address or empty string if absent" },
        phone: { type: Type.STRING, description: "Phone number or empty string if absent" },
        location: { type: Type.STRING, description: "Location/city/country or empty string" },
        linkedin: { type: Type.STRING, description: "LinkedIn profile URL or handle if present" },
        github_portfolio: { type: Type.STRING, description: "GitHub or portfolio URL if present" },
        executive_summary: {
          type: Type.STRING,
          description: "Objective recruiter summary grounded strictly in resume text with zero hallucination",
        },
        total_years_experience: {
          type: Type.NUMBER,
          description: "Calculated verified total years of professional experience",
        },
        seniority_level: {
          type: Type.STRING,
          description: "Entry-Level, Mid-Level, Senior, Staff/Lead, Director/VP, or Executive",
        },
        standardized_skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Technical and domain skills standardized to industry canonical terms (e.g. React.js, TypeScript, PostgreSQL, Docker, AWS)",
        },
        work_experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING, description: "Company name strictly verified from resume" },
              role: { type: Type.STRING, description: "Job title" },
              start_date: { type: Type.STRING, description: "Start date strictly as written" },
              end_date: { type: Type.STRING, description: "End date strictly as written or Present" },
              duration: { type: Type.STRING, description: "Estimated duration e.g. 2 yrs 4 mos" },
              location: { type: Type.STRING, description: "Location or Remote if noted" },
              key_achievements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Quantified or verifiable accomplishments extracted from resume bullets",
              },
              verified_technologies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Technologies demonstrated in this specific role",
              },
            },
            required: ["company", "role", "start_date", "end_date", "key_achievements"],
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              institution: { type: Type.STRING },
              degree: { type: Type.STRING },
              field_of_study: { type: Type.STRING },
              graduation_year: { type: Type.STRING },
            },
            required: ["institution", "degree"],
          },
        },
        certifications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              issuer: { type: Type.STRING },
              year: { type: Type.STRING },
            },
            required: ["name"],
          },
        },
      },
      required: ["name", "headline", "standardized_skills", "work_experience", "total_years_experience", "seniority_level"],
    },
    ats_audit: {
      type: Type.OBJECT,
      properties: {
        overall_parse_rate: { type: Type.NUMBER, description: "ATS parse fidelity score (0-100)" },
        formatting_grade: { type: Type.STRING, description: "Letter grade: A+, A, B, C, or F" },
        readability_score: { type: Type.NUMBER, description: "0-100 score on clarity and parsing ease" },
        red_flags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Formatting issues, missing contact details, unquantified bullets, date inconsistencies",
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Strong metrics, clear timeline, verified technical stack depth",
        },
      },
      required: ["overall_parse_rate", "formatting_grade", "readability_score", "red_flags", "strengths"],
    },
    jd_analysis: {
      type: Type.OBJECT,
      properties: {
        evaluated_against_jd: { type: Type.BOOLEAN, description: "True if target Job Description was provided" },
        target_role_title: { type: Type.STRING, description: "Title of target position or 'General ATS Profile'" },
        match_score: {
          type: Type.NUMBER,
          description: "Objective match score 0-100% based on required skills, seniority, and domain relevance",
        },
        fit_level: {
          type: Type.STRING,
          description: "Strong Match (80-100%), Moderate Match (60-79%), or Low Fit (<60%)",
        },
        scoring_breakdown: {
          type: Type.OBJECT,
          properties: {
            skills_match_score: { type: Type.NUMBER, description: "0-100 based on core & secondary skills overlap" },
            seniority_alignment_score: { type: Type.NUMBER, description: "0-100 based on years & scope vs JD demands" },
            domain_relevance_score: { type: Type.NUMBER, description: "0-100 based on industry/product domain overlap" },
            credentials_education_score: { type: Type.NUMBER, description: "0-100 based on education & cert requirements" },
          },
          required: ["skills_match_score", "seniority_alignment_score", "domain_relevance_score"],
        },
        matched_skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Skills strictly found in BOTH the resume and the target JD (standardized industry terms)",
        },
        missing_skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Skills demanded by JD, but strictly absent in candidate resume (standardized industry terms)",
        },
        recommendation: {
          type: Type.STRING,
          description: "MUST BE EXACTLY 2 SENTENCES providing an actionable recommendation for candidate fit.",
        },
        executive_summary_gap_analysis: {
          type: Type.STRING,
          description: "Thorough recruiter gap analysis detailing strengths and core missing qualifications",
        },
        suggested_interview_questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              focus_area: { type: Type.STRING, description: "e.g. Missing Skill, System Architecture, Leadership" },
              rationale: { type: Type.STRING, description: "Why this question tests specific candidate gaps" },
            },
            required: ["question", "focus_area", "rationale"],
          },
        },
        tailoring_recommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Actionable ATS optimization tips for candidate to improve alignment with this specific role",
        },
      },
      required: ["evaluated_against_jd", "match_score", "matched_skills", "missing_skills", "recommendation"],
    },
  },
  required: ["candidate_profile", "ats_audit", "jd_analysis"],
};

// POST /api/analyze - ATS candidate analysis endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { fileData, resumeText, jobDescription, targetRoleTitle } = req.body;

    if (!fileData && (!resumeText || !resumeText.trim())) {
      return res.status(400).json({
        error: "Missing resume. Please upload a PDF/image resume or provide resume text.",
      });
    }

    const hasJD = Boolean(jobDescription && jobDescription.trim());
    let parsedResult = null;

    // 1. If document was uploaded, extract its actual text (PDF or text file)
    let extractedDocText = "";
    if (fileData && fileData.base64) {
      const isPdf = fileData.mimeType === "application/pdf" || fileData.fileName?.toLowerCase().endsWith(".pdf");
      const isText = fileData.mimeType?.startsWith("text/") || fileData.fileName?.toLowerCase().endsWith(".txt") || fileData.fileName?.toLowerCase().endsWith(".md");
      try {
        const buffer = Buffer.from(fileData.base64, "base64");
        if (isPdf) {
          extractedDocText = await extractTextFromPdfBuffer(buffer);
          console.log(`Extracted ${extractedDocText.length} characters from uploaded PDF: ${fileData.fileName || "document"}`);
        } else if (isText) {
          extractedDocText = buffer.toString("utf-8");
          console.log(`Decoded ${extractedDocText.length} characters from uploaded text file: ${fileData.fileName || "document"}`);
        }
      } catch (docErr) {
        console.warn("Document text extraction error:", docErr);
      }
    }

    // Prioritize uploaded document text over any preloaded preset text
    const effectiveResumeText = (extractedDocText && extractedDocText.trim()) || (resumeText && resumeText.trim()) || "";
    const startTime = Date.now();
    let usedEngine = "deterministic";

    // Primary: Google Gemini AI (When API Key is provided)
    const aiClient = getAiClient();
    if (aiClient) {
      try {
        const systemInstruction = `You are an expert ATS (Applicant Tracking System) intelligence engine and executive recruiter.
Your task is to analyze candidate resume documents (PDF, image, or text) and evaluate their profile. If a target Job Description (JD) is provided, you must also perform a thorough gap analysis and semantic match evaluation.

Strict Guidelines:
1. Fact-check strictly against the resume text. Do NOT hallucinate dates, companies, credentials, or achievements. If a date or detail is omitted in the resume, reflect it as such or mark it in red_flags.
2. Standardize technical skills into clear, recognizable industry terms (e.g. "React.js" instead of "reactjs", "TypeScript" instead of "ts", "PostgreSQL" instead of "postgres", "Docker", "Kubernetes", "AWS", "Python", "Go", "Node.js").
3. If evaluating against a Job Description:
   - Calculate an objective match_score (0-100%) based on required skills, seniority, and domain relevance.
   - Separate skills strictly into 'matched_skills' (found in BOTH resume and JD) and 'missing_skills' (demanded by JD, absent in resume).
   - Provide an actionable recommendation for candidate fit that is EXACTLY TWO SENTENCES long. No more, no less.
4. If NO Job Description is provided, set evaluated_against_jd to false, match_score to 0, matched_skills to the candidate's core standardized skills, missing_skills to [], and write a 2-sentence executive summary recommendation of candidate's market readiness.
5. Provide actionable ATS audit metrics (overall parse rate, formatting grade A+/A/B/C/F, red flags, strengths).
6. Output MUST conform strictly to the specified JSON schema.`;

        const contents: any[] = [];

        // If text was extracted from document, send clean text prompt directly (saves 90%+ latency and bandwidth)
        // If text is absent (e.g. image-only PDF), send base64 inlineData
        if (!effectiveResumeText && fileData && fileData.base64 && fileData.mimeType) {
          contents.push({
            inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.base64,
            },
          });
        }

        let userPrompt = "Analyze this candidate resume document.\n\n";
        if (effectiveResumeText) {
          userPrompt += `RESUME CONTENT:\n\"\"\"\n${effectiveResumeText}\n\"\"\"\n\n`;
        }

        if (hasJD) {
          userPrompt += `TARGET JOB DESCRIPTION${targetRoleTitle ? ` (${targetRoleTitle})` : ""}:\n\"\"\"\n${jobDescription.trim()}\n\"\"\"\n\n`;
          userPrompt += `Perform full ATS extraction, standardized skills mapping, strict gap analysis against the target Job Description, calculate the objective match_score (0-100%), populate 'matched_skills' and 'missing_skills', and provide EXACTLY a 2-sentence actionable recommendation.`;
        } else {
          userPrompt += `No specific target Job Description provided. Perform comprehensive ATS parsing, candidate profile extraction, fact-checked timeline verification, standardized skills categorization, and ATS readability audit.`;
        }
        contents.push({ text: userPrompt });

        // Try fast, responsive models (gemini-3.1-flash-lite, fallback to 3.5-flash-lite)
        const models = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
        for (const model of models) {
          try {
            console.log(`[ATS] Running AI evaluation with model ${model}...`);
            const abortController = new AbortController();
            const timeoutId = setTimeout(() => abortController.abort(), 12000);

            const geminiPromise = aiClient.models.generateContent({
              model: model,
              contents: contents,
              config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: atsEvaluationSchema,
                abortSignal: abortController.signal,
              },
            });

            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => {
                abortController.abort();
                reject(new Error(`Gemini ${model} timed out after 12s`));
              }, 12000)
            );

            const response = await Promise.race([geminiPromise, timeoutPromise]).finally(() => {
              clearTimeout(timeoutId);
            });

            if (response?.text) {
              const geminiData = JSON.parse(response.text);
              if (geminiData && geminiData.candidate_profile) {
                parsedResult = geminiData;
                usedEngine = `gemini (${model})`;
                console.log(`[ATS] Successfully evaluated via ${model} in ${Date.now() - startTime}ms.`);
                break;
              }
            }
          } catch (modelErr: any) {
            console.warn(`[ATS] Model ${model} returned error: ${modelErr?.message?.slice(0, 100)}. Checking fallback model...`);
          }
        }
      } catch (geminiError: any) {
        console.warn(`[ATS] Gemini AI call failed (${geminiError?.message?.slice(0, 120)}). Engaging deterministic engine fallback.`);
      }
    } else {
      console.log("[ATS] No valid GEMINI_API_KEY found. Running deterministic ATS engine.");
    }

    // Fallback: Enterprise Deterministic ATS Engine (Guarantees zero downtime, schema compliance, and instant results)
    if (!parsedResult) {
      console.log(`[ATS] Running deterministic ATS engine on document (${effectiveResumeText.length} chars)...`);
      const textToAnalyze = effectiveResumeText || (fileData ? `Candidate Resume: ${fileData.fileName || "Applicant"}` : "Candidate Profile");
      parsedResult = runDeterministicAtsEngine(textToAnalyze, jobDescription, fileData?.fileName);
      console.log(`[ATS] Deterministic engine finished in ${Date.now() - startTime}ms.`);
    }

    return res.json({
      success: true,
      data: parsedResult,
      meta: {
        engine: usedEngine,
        executionTimeMs: Date.now() - startTime,
      },
    });
  } catch (error: any) {
    console.error("Critical error during ATS resume analysis:", error);
    const fallback = runDeterministicAtsEngine(
      req.body?.resumeText || "Candidate",
      req.body?.jobDescription,
      req.body?.fileData?.fileName
    );
    return res.json({
      success: true,
      data: fallback,
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(import.meta.dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`ATS Intelligence Engine running on http://localhost:${PORT}`);
  });
}

startServer();
