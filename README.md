# Acuity ATS & Recruiter Engine

Acuity is an automated resume analysis and candidate screening engine. It parses candidate profiles from PDF or text resumes, evaluates them against job descriptions, flags ATS formatting issues, and generates tailored technical interview questions.

## Features

- **Resume Parsing**: Extracts candidate name, contact details, work history, education, and certifications directly from PDF uploads or raw text.
- **Hybrid AI & Deterministic Architecture**: Uses Google Gemini for deep semantic evaluation with a pure-TypeScript deterministic fallback engine when running offline or without an API key.
- **Job Description Matching**: Evaluates candidates across skills overlap, seniority alignment, domain relevance, and credential requirements (0-100% match score).
- **ATS Health Audit**: Generates an overall ATS parse rate, formatting grade (A to F), readability score, red flags, and strengths.
- **Project & Internship Extraction**: Recognizes both traditional employment and technical projects for early-career and full-stack candidates.
- **Executive Dossier**: Produces a print-ready executive evaluation report with a verified candidate timeline and targeted interview screening probes.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, TypeScript (tsx)
- **PDF Extraction**: pdf-parse
- **AI Integration**: Google Gemini API (`@google/genai`)

## Quickstart

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment (Optional)

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

If no Gemini API key is configured, the system automatically runs the high-speed deterministic ATS engine.

### 3. Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## API Reference

### `POST /api/analyze`

Analyzes a resume against an optional job description.

**Request Body:**

```json
{
  "resumeText": "Raw text of the resume (optional if fileData provided)",
  "jobDescription": "Full job description text (optional)",
  "targetRoleTitle": "Job Title (optional)",
  "fileData": {
    "base64": "Base64-encoded PDF string (optional)",
    "fileName": "Resume.pdf",
    "fileType": "application/pdf"
  }
}
```

**Response:**

Returns a structured JSON payload:
- `candidate_profile`: Contact coordinates, verified total experience, seniority tier, standardized skills, chronological work history, education, and certifications.
- `ats_audit`: Overall parse rate, formatting grade, readability index, red flags, and strengths.
- `jd_analysis`: Objective match score, fit level, scoring breakdown, matched/missing skills, actionable recommendation, interview questions, and tailoring suggestions.

## License

MIT
