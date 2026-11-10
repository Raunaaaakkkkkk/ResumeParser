import React from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { ATSAudit } from "../types/ats";

interface AtsAuditCardProps {
  audit: ATSAudit;
}

export const AtsAuditCard: React.FC<AtsAuditCardProps> = ({ audit }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">
            Document Readability & Parser Health Audit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated against applicant tracking system formatting and entity parsing criteria
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Format Grade:</span>
          <span className="text-xl font-bold font-mono text-slate-900 px-3 py-0.5 bg-slate-100 rounded-lg border border-slate-200">
            {audit.formatting_grade}
          </span>
        </div>
      </div>

      {/* Parse Scores Ledger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Entity Extraction Fidelity
            </span>
            <span className="text-sm font-black font-mono text-violet-700">
              {audit.overall_parse_rate}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, audit.overall_parse_rate))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Confidence score for automated name, date, role, and credential extraction.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Layout & Section Hierarchy
            </span>
            <span className="text-sm font-black font-mono text-emerald-600">
              {audit.readability_score}/100
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, audit.readability_score))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Reverse-chronological structure, standard headings, and bullet readability.
          </p>
        </div>
      </div>

      {/* Red Flags & Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-2xl border border-rose-200/80 bg-rose-50/40">
          <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Parser Warnings ({audit.red_flags.length})</span>
          </div>
          {audit.red_flags.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No critical parser issues detected.</p>
          ) : (
            <ul className="space-y-2 text-xs text-slate-700">
              {audit.red_flags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified ATS Strengths ({audit.strengths.length})</span>
          </div>
          {audit.strengths.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Standard parsing structure.</p>
          ) : (
            <ul className="space-y-2 text-xs text-slate-700">
              {audit.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
