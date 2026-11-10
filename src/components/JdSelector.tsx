import React from "react";
import { Briefcase, Check } from "lucide-react";
import { PRESET_JOB_DESCRIPTIONS } from "../data/presets";
import { PresetJD } from "../types/ats";

interface JdSelectorProps {
  enableJD: boolean;
  onToggleEnableJD: (enabled: boolean) => void;
  jobDescription: string;
  onJdChanged: (text: string) => void;
  targetRoleTitle: string;
  onRoleTitleChanged: (title: string) => void;
  activePresetJdId: string | null;
  onSelectPresetJd: (preset: PresetJD | null) => void;
}

export const JdSelector: React.FC<JdSelectorProps> = ({
  enableJD,
  onToggleEnableJD,
  jobDescription,
  onJdChanged,
  targetRoleTitle,
  onRoleTitleChanged,
  activePresetJdId,
  onSelectPresetJd,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_rgba(2,132,199,0.08)] border border-sky-100 flex flex-col justify-between transition-all">
      <div>
        {/* Header with Refined Switch (No Harsh Black Blocks) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">
              Target Requisition
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify open role qualifications for gap and semantic match evaluation
            </p>
          </div>

          {/* Refined Match Toggle */}
          <button
            type="button"
            onClick={() => onToggleEnableJD(!enableJD)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 self-start sm:self-center shadow-xs ${
              enableJD
                ? "bg-sky-50 border-sky-300 text-sky-800"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                enableJD ? "bg-sky-600 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>{enableJD ? "Requisition Matching Active" : "General Audit Only"}</span>
          </button>
        </div>

        {!enableJD ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center my-4">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-2.5 mx-auto text-slate-500">
              <Briefcase className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              General Candidate Audit Mode
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Evaluating resume structure, chronological clarity, and machine readability without role alignment.
            </p>
            <button
              type="button"
              onClick={() => onToggleEnableJD(true)}
              className="mt-4 px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-sm"
            >
              Enable Target Job Matching
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sample Requisitions (Refined Airy Cards, No Solid Black) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Sample Open Requisitions:
                </span>
                <span className="text-[10px] text-slate-400">Pre-calibrated specs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_JOB_DESCRIPTIONS.map((preset) => {
                  const isSelected = activePresetJdId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onSelectPresetJd(preset);
                        onRoleTitleChanged(preset.title);
                        onJdChanged(preset.jdText);
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all text-xs ${
                        isSelected
                          ? "bg-sky-50/90 border-sky-400 text-slate-900 shadow-sm ring-1 ring-sky-300"
                          : "bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span className="truncate">{preset.title}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                        {preset.department}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        {preset.companyTier}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Position Title Input with Icon */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Position Title
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={targetRoleTitle}
                  onChange={(e) => {
                    onRoleTitleChanged(e.target.value);
                    if (activePresetJdId) onSelectPresetJd(null);
                  }}
                  placeholder="e.g. Senior Full-Stack & Cloud Architect"
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all placeholder:text-slate-400 shadow-inner"
                />
              </div>
            </div>

            {/* Role Description Textarea */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Role Description & Requirements
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => {
                  onJdChanged(e.target.value);
                  if (activePresetJdId) onSelectPresetJd(null);
                }}
                placeholder="Paste the target job description, responsibilities, and qualification criteria..."
                rows={6}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all placeholder:text-slate-400 leading-relaxed shadow-inner"
              />
              {jobDescription && (
                <div className="text-[11px] text-slate-400 mt-1 flex justify-end font-mono">
                  {jobDescription.trim().split(/\s+/).length} words
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
