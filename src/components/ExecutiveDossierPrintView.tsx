import React from "react";
import { ATSEvaluationResult } from "../types/ats";
import {
  CheckCircle2,
  XCircle,
  Briefcase,
  GraduationCap,
  Award,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

interface ExecutiveDossierPrintViewProps {
  data: ATSEvaluationResult;
}

export const ExecutiveDossierPrintView: React.FC<ExecutiveDossierPrintViewProps> = ({ data }) => {
  const { candidate_profile: profile, jd_analysis: jd, ats_audit: audit } = data;
  const isJdActive = jd.evaluated_against_jd;
  const matchScore = jd.match_score;
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="print-only text-slate-900 bg-white p-2 text-xs leading-relaxed font-sans">
      {/* Document Watermark & Brand Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border border-slate-300 p-1 bg-white flex items-center justify-center shrink-0">
            <img
              src="/assets/brand/logo.png"
              alt="Acuity Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif italic font-bold text-2xl text-slate-900 tracking-tight leading-none">
              Acuity
            </h1>
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mt-1">
              Executive Candidate Dossier & Requisition Audit
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-[10px] text-slate-500 space-y-0.5">
          <div className="font-bold text-slate-800">STRICT RECRUITER VERIFIED REPORT</div>
          <div>Generated: {formattedDate}</div>
          <div>Audit Reference: ACUITY-{Math.abs(profile.name.length * 9973).toString(16).toUpperCase()}</div>
        </div>
      </div>

      {/* Candidate Overview Card */}
      <div className="break-inside-avoid border border-slate-200 rounded-lg p-4 mb-4 bg-slate-50/50">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              {profile.seniority_level} · {profile.total_years_experience} Years Verified Experience
            </div>
            <h2 className="font-serif italic font-bold text-2xl text-slate-900 tracking-tight mt-0.5">
              {profile.name}
            </h2>
            <div className="text-sm font-semibold text-slate-700 mt-0.5">{profile.headline}</div>
          </div>

          {/* Quick Score Badge */}
          <div className="text-right border-l border-slate-200 pl-4 shrink-0">
            <div className="text-[10px] uppercase font-semibold text-slate-500">
              {isJdActive ? "Requisition Match" : "ATS Parse Fidelity"}
            </div>
            <div className="text-3xl font-mono font-extrabold text-slate-900">
              {isJdActive ? `${matchScore}%` : `${audit.overall_parse_rate}%`}
            </div>
            <div className="text-[10px] font-medium text-slate-600">
              {isJdActive
                ? matchScore >= 80
                  ? "Strong Alignment"
                  : matchScore >= 60
                  ? "Moderate Alignment"
                  : "Substantial Gap"
                : `Format Grade ${audit.formatting_grade}`}
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-mono mt-3 pt-3 border-t border-slate-200/60">
          {profile.location && <span>📍 {profile.location}</span>}
          {profile.email && <span>✉️ {profile.email}</span>}
          {profile.phone && <span>📞 {profile.phone}</span>}
          {profile.linkedin && <span>🔗 {profile.linkedin}</span>}
          {profile.github_portfolio && <span>💻 {profile.github_portfolio}</span>}
        </div>

        {/* Executive Summary */}
        <div className="mt-3 pt-2 text-xs text-slate-700 leading-normal">
          <strong className="text-slate-900">Executive Profile: </strong>
          {profile.executive_summary}
        </div>
      </div>

      {/* Recruiter Recommendation & Requisition Fit */}
      {isJdActive && (
        <div className="break-inside-avoid border border-sky-200 rounded-lg p-4 mb-4 bg-sky-50/60">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              Requisition Alignment: {jd.target_role_title || "Target Position"}
            </h3>
            <span className="font-mono text-[11px] font-bold text-sky-900">
              Fit Rating: {jd.fit_level || (matchScore >= 80 ? "High" : matchScore >= 60 ? "Moderate" : "Low")}
            </span>
          </div>

          <div className="p-3 bg-white rounded border border-sky-100 text-xs text-slate-900 font-medium italic mb-3">
            "{jd.recommendation}"
          </div>

          {jd.scoring_breakdown && (
            <div className="grid grid-cols-3 gap-3 text-center pt-1 border-t border-sky-200/60">
              <div className="p-1.5 bg-white rounded border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Skills Match (45%)</div>
                <div className="text-base font-mono font-bold text-slate-900">
                  {jd.scoring_breakdown.skills_match_score}%
                </div>
              </div>
              <div className="p-1.5 bg-white rounded border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Seniority Fit (30%)</div>
                <div className="text-base font-mono font-bold text-slate-900">
                  {jd.scoring_breakdown.seniority_alignment_score}%
                </div>
              </div>
              <div className="p-1.5 bg-white rounded border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Domain Fit (25%)</div>
                <div className="text-base font-mono font-bold text-slate-900">
                  {jd.scoring_breakdown.domain_relevance_score}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Competency & Skill Gap Analysis */}
      <div className="break-inside-avoid border border-slate-200 rounded-lg p-4 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-100">
          Canonical Competency Matrix
        </h3>

        {isJdActive ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-bold text-emerald-800 mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Matched Required Skills ({jd.matched_skills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jd.matched_skills.length > 0 ? (
                  jd.matched_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">No exact matched skills identified</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-rose-800 mb-1.5 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Missing Requisition Requirements ({jd.missing_skills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jd.missing_skills.length > 0 ? (
                  jd.missing_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-700 text-[11px]">No major skill omissions identified</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
              Verified Candidate Technical & Domain Skills ({profile.standardized_skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.standardized_skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chronological Work Experience */}
      <div className="break-inside-avoid border border-slate-200 rounded-lg p-4 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-600" />
          Verified Employment Chronology ({profile.work_experience.length} Roles)
        </h3>

        <div className="space-y-4">
          {profile.work_experience.map((exp, index) => (
            <div key={index} className="break-inside-avoid border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-slate-900 text-xs">
                  {exp.role} <span className="font-normal text-slate-600">at</span> {exp.company}
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-medium">
                  {exp.start_date} – {exp.end_date} {exp.duration ? `(${exp.duration})` : ""}
                </span>
              </div>

              {exp.location && (
                <div className="text-[10px] text-slate-500 mb-1">📍 {exp.location}</div>
              )}

              {exp.key_achievements && exp.key_achievements.length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                  {exp.key_achievements.map((ach, i) => (
                    <li key={i} className="leading-snug">{ach}</li>
                  ))}
                </ul>
              )}

              {exp.verified_technologies && exp.verified_technologies.length > 0 && (
                <div className="mt-1.5 text-[10px] font-mono text-slate-500">
                  <span className="font-semibold text-slate-700">Technologies: </span>
                  {exp.verified_technologies.join(" · ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications Row */}
      {(profile.education.length > 0 || (profile.certifications && profile.certifications.length > 0)) && (
        <div className="break-inside-avoid border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-2 gap-4">
          {profile.education.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                Education
              </h4>
              <div className="space-y-1.5">
                {profile.education.map((edu, i) => (
                  <div key={i} className="text-[11px] text-slate-700">
                    <div className="font-semibold text-slate-900">{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ""}</div>
                    <div className="text-slate-500 text-[10px]">{edu.institution} {edu.graduation_year ? `(${edu.graduation_year})` : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-600" />
                Certifications
              </h4>
              <div className="space-y-1 text-[11px] text-slate-700">
                {profile.certifications.map((cert, i) => (
                  <div key={i}>
                    <span className="font-medium text-slate-900">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-500 text-[10px]"> — {cert.issuer}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ATS Machine Audit & Formatting Breakdown */}
      <div className="break-inside-avoid border border-slate-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            ATS Machine-Readability & Format Audit
          </h3>
          <span className="font-mono text-xs font-bold text-slate-900">
            Parse Fidelity: {audit.overall_parse_rate}% (Grade {audit.formatting_grade})
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-[11px]">
          <div>
            <div className="font-semibold text-emerald-800 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Strengths
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[10px]">
              {audit.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold text-amber-800 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Flagged Items & Recommendations
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[10px]">
              {audit.red_flags.length > 0 ? (
                audit.red_flags.map((flag, i) => <li key={i}>{flag}</li>)
              ) : (
                <li className="text-emerald-700">Clean chronological document structure</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Targeted Interview Questions */}
      {jd.suggested_interview_questions && jd.suggested_interview_questions.length > 0 && (
        <div className="break-inside-avoid border border-slate-200 rounded-lg p-4 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            Recommended Executive Screening Questions
          </h3>

          <div className="space-y-2">
            {jd.suggested_interview_questions.slice(0, 3).map((q, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px]">
                <div className="font-semibold text-slate-900 mb-0.5">
                  Q{idx + 1}: {q.question}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Focus: {q.focus_area} · <span className="italic">{q.rationale}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-res Dossier Footer */}
      <div className="pt-3 border-t border-slate-200 text-center font-mono text-[9px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <img
            src="/assets/brand/logo.png"
            alt="Acuity"
            className="w-3.5 h-3.5 rounded object-contain"
          />
          <span>Acuity Recruiter Intelligence System · Automated Fact-Checking</span>
        </div>
        <div>Confidential Executive Dossier · Authorized Personnel Only</div>
      </div>
    </div>
  );
};
