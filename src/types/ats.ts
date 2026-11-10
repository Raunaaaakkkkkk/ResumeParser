export interface WorkExperience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  duration?: string;
  location?: string;
  key_achievements: string[];
  verified_technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study?: string;
  graduation_year?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  year?: string;
}

export interface CandidateProfile {
  name: string;
  headline: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github_portfolio?: string;
  executive_summary: string;
  total_years_experience: number;
  seniority_level: string;
  standardized_skills: string[];
  work_experience: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
}

export interface ATSAudit {
  overall_parse_rate: number;
  formatting_grade: string;
  readability_score: number;
  red_flags: string[];
  strengths: string[];
}

export interface InterviewQuestion {
  question: string;
  focus_area: string;
  rationale: string;
}

export interface ScoringBreakdown {
  skills_match_score: number;
  seniority_alignment_score: number;
  domain_relevance_score: number;
  credentials_education_score?: number;
}

export interface JDAnalysis {
  evaluated_against_jd: boolean;
  target_role_title?: string;
  match_score: number;
  fit_level?: string;
  scoring_breakdown?: ScoringBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string; // Exactly 2 sentences
  executive_summary_gap_analysis?: string;
  suggested_interview_questions?: InterviewQuestion[];
  tailoring_recommendations?: string[];
}

export interface ATSEvaluationResult {
  candidate_profile: CandidateProfile;
  ats_audit: ATSAudit;
  jd_analysis: JDAnalysis;
}

export interface PresetResume {
  id: string;
  name: string;
  role: string;
  seniority: string;
  experienceYears: number;
  summary: string;
  resumeText: string;
}

export interface PresetJD {
  id: string;
  title: string;
  companyTier: string;
  department: string;
  jdText: string;
}
