import React, { useState, useEffect } from "react";
import {
  Play,
  RefreshCw,
  Printer,
  ArrowLeft,
  Download,
} from "lucide-react";
import { PRESET_RESUMES, PRESET_JOB_DESCRIPTIONS } from "./data/presets";
import { ATSEvaluationResult, PresetResume, PresetJD } from "./types/ats";
import { ResumeUploader } from "./components/ResumeUploader";
import { JdSelector } from "./components/JdSelector";
import { CandidateHeroCard } from "./components/CandidateHeroCard";
import { SkillsMatrix } from "./components/SkillsMatrix";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { AtsAuditCard } from "./components/AtsAuditCard";
import { InterviewPrepCard } from "./components/InterviewPrepCard";
import { JsonInspector } from "./components/JsonInspector";
import { CandidateHistoryBar } from "./components/CandidateHistoryBar";
import { ExecutiveDossierPrintView } from "./components/ExecutiveDossierPrintView";

interface StoredEvaluation {
  id: string;
  timestamp: number;
  result: ATSEvaluationResult;
}

export default function App() {
  // Candidate Resume input state
  const [selectedFile, setSelectedFile] = useState<{
    mimeType: string;
    base64: string;
    fileName: string;
    fileSize: string;
  } | null>(null);
  const [resumeText, setResumeText] = useState<string>(PRESET_RESUMES[0].resumeText);
  const [activePresetResumeId, setActivePresetResumeId] = useState<string | null>(PRESET_RESUMES[0].id);

  // Job Description state
  const [enableJD, setEnableJD] = useState<boolean>(true);
  const [targetRoleTitle, setTargetRoleTitle] = useState<string>(PRESET_JOB_DESCRIPTIONS[0].title);
  const [jobDescription, setJobDescription] = useState<string>(PRESET_JOB_DESCRIPTIONS[0].jdText);
  const [activePresetJdId, setActivePresetJdId] = useState<string | null>(PRESET_JOB_DESCRIPTIONS[0].id);

  // Execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<ATSEvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputCollapsed, setInputCollapsed] = useState<boolean>(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "gap_matrix" | "timeline" | "ats_audit" | "interview_prep" | "raw_json"
  >("overview");
  const [showPdfTip, setShowPdfTip] = useState<boolean>(false);

  const handleDownloadPdf = () => {
    setShowPdfTip(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowPdfTip(false), 2500);
    }, 200);
  };

  // History state
  const [history, setHistory] = useState<StoredEvaluation[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  // Load history from localStorage with strict validation
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ats_eval_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item) => item?.result?.candidate_profile?.name
          );
          setHistory(valid);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToHistory = (result: ATSEvaluationResult) => {
    if (!result?.candidate_profile?.name) return;
    const id = "eval_" + Date.now();
    const newEntry: StoredEvaluation = {
      id,
      timestamp: Date.now(),
      result,
    };
    const updated = [
      newEntry,
      ...history.filter(
        (h) => h?.result?.candidate_profile?.name && h.result.candidate_profile.name !== result.candidate_profile.name
      ),
    ].slice(0, 8);
    setHistory(updated);
    setCurrentHistoryId(id);
    try {
      localStorage.setItem("ats_eval_history", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentHistoryId(null);
    localStorage.removeItem("ats_eval_history");
  };

  const handleSelectHistoryItem = (item: StoredEvaluation) => {
    setEvaluationResult(item.result);
    setCurrentHistoryId(item.id);
    setInputCollapsed(true);
  };

  // Run ATS analysis
  const handleAnalyze = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const payload: any = {};
      if (selectedFile) {
        payload.fileData = {
          mimeType: selectedFile.mimeType,
          base64: selectedFile.base64,
          fileName: selectedFile.fileName,
        };
      } else if (resumeText && resumeText.trim()) {
        payload.resumeText = resumeText.trim();
      }

      if (enableJD && jobDescription.trim()) {
        payload.jobDescription = jobDescription.trim();
        payload.targetRoleTitle = targetRoleTitle.trim();
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "Analysis failed to complete.");
      }

      setEvaluationResult(json.data);
      saveToHistory(json.data);
      setInputCollapsed(true);
      setActiveTab("overview");
    } catch (err: any) {
      console.error("Evaluation error:", err);
      setErrorMessage(err.message || "Failed to analyze resume. Please verify input document.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans antialiased relative overflow-x-hidden cloud-backdrop">
      {/* Floating Header */}
      <header className="sticky top-4 z-40 max-w-5xl mx-auto w-full px-4 no-print">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 sm:px-6 py-2.5 shadow-[0_4px_25px_rgb(0,0,0,0.06)] border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs bg-[#fafaf9] flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/assets/brand/logo.png"
                alt="Acuity Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif italic font-bold text-xl text-slate-900 tracking-tight">
                Acuity
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                Talent Dossier & Requisition Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {evaluationResult ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEvaluationResult(null);
                    setInputCollapsed(false);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back to Inputs</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
                  title="Export high-resolution PDF dossier"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download as PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs hidden sm:flex items-center gap-1.5"
                  title="Print dossier via system print"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-5 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm shadow-sky-600/25 flex items-center gap-1.5"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                <span>Evaluate</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Human Editorial Hero Section */}
      {!evaluationResult && (
        <section className="text-center pt-8 pb-6 px-4 max-w-4xl mx-auto space-y-3 no-print">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Executive Talent Operations & ATS Verification
          </div>

          <h2 className="font-serif italic font-normal text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
            Candidate Evaluation & Requisition Alignment
          </h2>

          <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed pt-1">
            Review applicant resumes, verify employment chronology, and evaluate technical competency alignment against open role specifications.
          </p>
        </section>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Candidate History */}
        <div className="no-print">
          <CandidateHistoryBar
            history={history}
            currentId={currentHistoryId}
            onSelect={handleSelectHistoryItem}
            onClear={handleClearHistory}
          />
        </div>

        {/* Input Configuration Workspace */}
        {(!inputCollapsed || !evaluationResult) && (
          <div className="space-y-5 no-print">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ResumeUploader
                onFileSelected={setSelectedFile}
                onTextChanged={setResumeText}
                resumeText={resumeText}
                selectedFile={selectedFile}
                activePresetId={activePresetResumeId}
                onSelectPreset={(preset: PresetResume | null) => {
                  setActivePresetResumeId(preset ? preset.id : null);
                }}
              />

              <JdSelector
                enableJD={enableJD}
                onToggleEnableJD={setEnableJD}
                jobDescription={jobDescription}
                onJdChanged={setJobDescription}
                targetRoleTitle={targetRoleTitle}
                onRoleTitleChanged={setTargetRoleTitle}
                activePresetJdId={activePresetJdId}
                onSelectPresetJd={(preset: PresetJD | null) => {
                  setActivePresetJdId(preset ? preset.id : null);
                }}
              />
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs shadow-xs">
                {errorMessage}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-3xl shadow-[0_10px_35px_rgba(2,132,199,0.08)] border border-sky-100">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900 block text-sm">
                  Executive ATS Analysis & Candidate Evaluation
                </span>
                <span className="mt-0.5 block text-slate-500">
                  Automated skill extraction, chronological tenure verification, and requisition fit scoring.
                </span>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 shrink-0 ${
                  isLoading
                    ? "bg-slate-300 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-600 via-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Candidate Profile...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span>
                      {selectedFile
                        ? `Evaluate Uploaded Resume (${selectedFile.fileName})`
                        : enableJD
                        ? "Run Requisition Alignment Evaluation"
                        : "Run Standalone Resume Audit"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Evaluation Results Dossier */}
        {evaluationResult && (
          <div className="space-y-6 animate-in fade-in">
            {/* Print-Ready PDF Dossier Layout (Active during print/PDF generation) */}
            <ExecutiveDossierPrintView data={evaluationResult} />

            {/* Screen-Only Interactive Evaluation Views */}
            <div className="screen-only space-y-6">
              {/* Back Button & PDF Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 no-print">
                <button
                  type="button"
                  onClick={() => {
                    setEvaluationResult(null);
                    setInputCollapsed(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-900 text-xs font-semibold tracking-wide transition-all shadow-xs border border-slate-200/90 self-start"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                  <span>← Back to Upload & Role Requirements</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-700 font-medium hidden md:block">
                    Candidate: <strong className="text-slate-900">{evaluationResult.candidate_profile.name}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-sm shadow-sky-600/25"
                    title="Export high-resolution PDF dossier"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download as PDF</span>
                  </button>
                </div>
              </div>

              {showPdfTip && (
                <div className="p-3 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-xs flex items-center justify-between animate-in fade-in no-print">
                  <span>
                    📄 <strong>PDF Export Ready:</strong> In your browser's print dialog, select <strong>Destination: "Save as PDF"</strong> to save this high-resolution vector dossier.
                  </span>
                  <span className="text-[11px] text-sky-700 font-mono">Format: A4 Portrait</span>
                </div>
              )}

              {/* Candidate Dossier Header */}
              <CandidateHeroCard
                profile={evaluationResult.candidate_profile}
                jdAnalysis={evaluationResult.jd_analysis}
                audit={evaluationResult.ats_audit}
              />

              {/* Navigation Tabs (Clean unboxed editorial tabs) */}
              <div className="flex items-center gap-1 border-b border-slate-200/80 bg-white/60 backdrop-blur-xs px-2 pt-1 rounded-t-xl no-print text-xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 px-3 font-semibold transition-all border-b-2 shrink-0 ${
                    activeTab === "overview"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Executive Scorecard
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("gap_matrix")}
                  className={`pb-3 px-3 font-semibold transition-all border-b-2 shrink-0 ${
                    activeTab === "gap_matrix"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Competency & Gap Matrix
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("timeline")}
                  className={`pb-3 px-3 font-semibold transition-all border-b-2 shrink-0 ${
                    activeTab === "timeline"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Work History ({evaluationResult.candidate_profile.work_experience.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ats_audit")}
                  className={`pb-3 px-3 font-semibold transition-all border-b-2 shrink-0 ${
                    activeTab === "ats_audit"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ATS Machine Audit ({evaluationResult.ats_audit.formatting_grade})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("interview_prep")}
                  className={`pb-3 px-3 font-semibold transition-all border-b-2 shrink-0 ${
                    activeTab === "interview_prep"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Screening Questions
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("raw_json")}
                  className={`pb-3 px-3 font-semibold transition-all border-b-2 shrink-0 ${
                    activeTab === "raw_json"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Schema JSON
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <SkillsMatrix
                    matchedSkills={evaluationResult.jd_analysis.matched_skills}
                    missingSkills={evaluationResult.jd_analysis.missing_skills}
                    allCandidateSkills={evaluationResult.candidate_profile.standardized_skills}
                    evaluatedAgainstJd={evaluationResult.jd_analysis.evaluated_against_jd}
                  />

                  <AtsAuditCard audit={evaluationResult.ats_audit} />
                </div>
              )}

              {/* Tab 2: Gap Matrix */}
              {activeTab === "gap_matrix" && (
                <SkillsMatrix
                  matchedSkills={evaluationResult.jd_analysis.matched_skills}
                  missingSkills={evaluationResult.jd_analysis.missing_skills}
                  allCandidateSkills={evaluationResult.candidate_profile.standardized_skills}
                  evaluatedAgainstJd={evaluationResult.jd_analysis.evaluated_against_jd}
                />
              )}

              {/* Tab 3: Timeline */}
              {activeTab === "timeline" && (
                <ExperienceTimeline
                  workExperience={evaluationResult.candidate_profile.work_experience}
                  education={evaluationResult.candidate_profile.education}
                  certifications={evaluationResult.candidate_profile.certifications}
                  totalYears={evaluationResult.candidate_profile.total_years_experience}
                  seniorityLevel={evaluationResult.candidate_profile.seniority_level}
                />
              )}

              {/* Tab 4: ATS Audit */}
              {activeTab === "ats_audit" && (
                <AtsAuditCard audit={evaluationResult.ats_audit} />
              )}

              {/* Tab 5: Screening Questions */}
              {activeTab === "interview_prep" && (
                <InterviewPrepCard
                  questions={evaluationResult.jd_analysis.suggested_interview_questions || []}
                  tailoringRecommendations={evaluationResult.jd_analysis.tailoring_recommendations || []}
                />
              )}

              {/* Tab 6: Raw JSON */}
              {activeTab === "raw_json" && (
                <JsonInspector data={evaluationResult} />
              )}

              {/* Bottom Back Button & Actions */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
                <button
                  type="button"
                  onClick={() => {
                    setEvaluationResult(null);
                    setInputCollapsed(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-all shadow-2xs border border-slate-200"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                  <span>← Back to Upload / Evaluate Another Candidate</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download as PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <Printer className="w-4 h-4 text-slate-300" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Human Editorial Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-600 font-medium no-print">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden border border-slate-200/90 shadow-2xs bg-[#fafaf9] flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/assets/brand/logo.png"
                alt="Acuity Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif italic text-sm text-slate-800 font-normal">
              Acuity · Recruiter Intelligence System
            </span>
          </div>
          <div className="text-slate-500 font-sans">
            Strict Fact-Checked Employment Verification & Zero Hallucination
          </div>
        </div>
      </footer>
    </div>
  );
}
