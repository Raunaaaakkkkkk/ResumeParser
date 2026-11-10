import React from "react";
import { InterviewQuestion } from "../types/ats";

interface InterviewPrepCardProps {
  questions: InterviewQuestion[];
  tailoringRecommendations?: string[];
}

export const InterviewPrepCard: React.FC<InterviewPrepCardProps> = ({
  questions = [],
  tailoringRecommendations = [],
}) => {
  if (questions.length === 0 && (!tailoringRecommendations || tailoringRecommendations.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Targeted Interview Questions */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
          <div className="pb-4 mb-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-base">
              Gap-Targeted Technical Screening Questions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted questions to evaluate candidate depth in requisite areas absent from resume documentation
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-violet-700">
                    Question {idx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Focus: {q.focus_area}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-snug mb-2.5">
                  "{q.question}"
                </p>

                <div className="text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-violet-400">
                  <strong className="text-slate-800">Recruiter Rationale:</strong> {q.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tailoring Recommendations */}
      {tailoringRecommendations && tailoringRecommendations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80">
          <div className="pb-4 mb-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-base">
              Requisition Optimization & Document Advisory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific modifications to increase keyword alignment and parsing confidence for this role
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tailoringRecommendations.map((tip, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                <span className="text-violet-600 font-bold shrink-0 mt-0.5">→</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
