import React from "react";
import { History, Trash2 } from "lucide-react";
import { ATSEvaluationResult } from "../types/ats";

interface StoredEvaluation {
  id: string;
  timestamp: number;
  result: ATSEvaluationResult;
}

interface CandidateHistoryBarProps {
  history: StoredEvaluation[];
  currentId: string | null;
  onSelect: (item: StoredEvaluation) => void;
  onClear: () => void;
}

export const CandidateHistoryBar: React.FC<CandidateHistoryBarProps> = ({
  history,
  currentId,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-lg shadow-sky-950/5 mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-violet-600" />
          <span>Recently Evaluated Candidates ({history.length})</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
        {history.map((item) => {
          const profile = item?.result?.candidate_profile;
          const jd = item?.result?.jd_analysis;
          if (!profile || !profile.name) return null;
          const isSelected = item.id === currentId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs text-left shrink-0 transition-all ${
                isSelected
                  ? "bg-slate-900 border-slate-900 text-white shadow-xs font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-medium"
              }`}
            >
              <span>{profile.name}</span>
              <span className={isSelected ? "text-slate-400" : "text-slate-300"}>·</span>
              <div className="font-mono text-[11px]">
                {jd?.evaluated_against_jd ? (
                  <span className={isSelected ? "text-white font-bold" : "text-slate-900 font-bold"}>
                    {jd.match_score ?? 0}%
                  </span>
                ) : (
                  <span className={isSelected ? "text-slate-300" : "text-slate-500"}>Audit</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
