import React, { useState, useMemo } from "react";
import { Check, X, Search } from "lucide-react";

interface SkillsMatrixProps {
  matchedSkills: string[];
  missingSkills: string[];
  allCandidateSkills: string[];
  evaluatedAgainstJd: boolean;
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({
  matchedSkills = [],
  missingSkills = [],
  allCandidateSkills = [],
  evaluatedAgainstJd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filterFn = (s: string) => !q || s.toLowerCase().includes(q);

    return {
      matched: matchedSkills.filter(filterFn),
      missing: missingSkills.filter(filterFn),
      allCandidate: allCandidateSkills.filter(filterFn),
    };
  }, [matchedSkills, missingSkills, allCandidateSkills, searchQuery]);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">
            Technical Competency & Gap Analysis Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Canonical skills cross-referenced between resume document and requisition specifications
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter competencies..."
            className="w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 placeholder:text-slate-400 font-mono"
          />
        </div>
      </div>

      {evaluatedAgainstJd ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Matched Skills */}
          <div className="border border-emerald-200/80 rounded-2xl p-4 bg-emerald-50/40">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200/60">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Matched Requisite Skills ({filteredData.matched.length})</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                Verified in Resume
              </span>
            </div>

            {filteredData.matched.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                {searchQuery ? "No matching skills match filter." : "No overlapping technical skills detected."}
              </p>
            ) : (
              <div className="divide-y divide-emerald-100">
                {filteredData.matched.map((skill, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{skill}</span>
                    <span className="text-[11px] font-mono text-emerald-700 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing Skills */}
          <div className="border border-rose-200/80 rounded-2xl p-4 bg-rose-50/40">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-200/60">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600" />
                <span>Missing Requisite Skills ({filteredData.missing.length})</span>
              </span>
              <span className="text-[11px] font-mono text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                Requisition Gaps
              </span>
            </div>

            {filteredData.missing.length === 0 ? (
              <p className="text-xs text-slate-600 italic py-2">
                {searchQuery ? "No missing skills match filter." : "All required core skills demonstrated in candidate profile."}
              </p>
            ) : (
              <div className="divide-y divide-rose-100">
                {filteredData.missing.map((skill, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{skill}</span>
                    <span className="text-[11px] font-mono text-rose-700 font-medium flex items-center gap-1">
                      <X className="w-3 h-3 text-rose-600" />
                      <span>Not Demonstrated</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Standardized Candidate Competencies ({filteredData.allCandidate.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredData.allCandidate.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
