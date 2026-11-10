import React from "react";
import { MapPin, Mail, Phone, Linkedin, Github } from "lucide-react";
import { CandidateProfile, JDAnalysis, ATSAudit } from "../types/ats";

interface CandidateHeroCardProps {
  profile: CandidateProfile;
  jdAnalysis: JDAnalysis;
  audit: ATSAudit;
}

export const CandidateHeroCard: React.FC<CandidateHeroCardProps> = ({
  profile,
  jdAnalysis,
  audit,
}) => {
  const isJdActive = jdAnalysis.evaluated_against_jd;
  const matchScore = jdAnalysis.match_score;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
      {/* Dossier Header with Acuity Logo */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded overflow-hidden border border-slate-200 bg-[#fafaf9] flex items-center justify-center p-0.5">
            <img
              src="/assets/brand/logo.png"
              alt="Acuity"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-serif italic font-semibold text-slate-800 text-sm">
            Acuity Executive Dossier
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
          Confidential Evaluation
        </span>
      </div>

      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
            <span className="font-semibold text-slate-700">{profile.seniority_level}</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span>{profile.total_years_experience} Years Verified Experience</span>
          </div>

          <h2 className="font-serif italic font-normal text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {profile.name}
          </h2>

          <p className="text-sm font-semibold text-slate-700">
            {profile.headline}
          </p>

          {/* Contact coordinates as clean unboxed text */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono">
            {profile.location && (
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.email}
                </span>
              </>
            )}
            {profile.phone && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone}
                </span>
              </>
            )}
            {profile.linkedin && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors underline"
                >
                  <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                  <span>LinkedIn</span>
                </a>
              </>
            )}
            {profile.github_portfolio && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <a
                  href={profile.github_portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors underline"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub</span>
                </a>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            {profile.executive_summary}
          </p>
        </div>

        {/* Right Scorecard Panel */}
        <div className="shrink-0 w-full lg:w-64 bg-slate-50 p-5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {isJdActive ? "Requisition Match" : "ATS Parse Fidelity"}
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-900">
                {isJdActive ? `${matchScore}%` : `${audit.overall_parse_rate}%`}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {isJdActive
                  ? matchScore >= 80
                    ? "Strong Fit"
                    : matchScore >= 60
                    ? "Moderate Fit"
                    : "Low Alignment"
                  : `Grade ${audit.formatting_grade}`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden my-2.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isJdActive
                    ? matchScore >= 80
                      ? "bg-emerald-600"
                      : matchScore >= 60
                      ? "bg-amber-500"
                      : "bg-rose-500"
                    : "bg-slate-700"
                }`}
                style={{ width: `${isJdActive ? matchScore : audit.overall_parse_rate}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-500">
              {isJdActive
                ? `${jdAnalysis.target_role_title}`
                : "Machine-readability benchmark"}
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Fit Assessment (The 2-Sentence Recommendation) */}
      {isJdActive && jdAnalysis.recommendation && (
        <div className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Recruiter Fit Recommendation
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              2-Sentence Assessment
            </span>
          </div>
          <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
            "{jdAnalysis.recommendation}"
          </p>
        </div>
      )}

      {/* 4-Pillar Scoring Breakdown */}
      {isJdActive && jdAnalysis.scoring_breakdown && (
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
              Skills Overlap (45%)
            </span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {jdAnalysis.scoring_breakdown.skills_match_score}%
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
              Seniority Scope (30%)
            </span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {jdAnalysis.scoring_breakdown.seniority_alignment_score}%
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
              Domain Fit (25%)
            </span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {jdAnalysis.scoring_breakdown.domain_relevance_score}%
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
              Credentials & Edu
            </span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {jdAnalysis.scoring_breakdown.credentials_education_score ?? 90}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
