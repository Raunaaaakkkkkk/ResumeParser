import React, { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { ATSEvaluationResult } from "../types/ats";

interface JsonInspectorProps {
  data: ATSEvaluationResult;
}

export const JsonInspector: React.FC<JsonInspectorProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const candidateName = data.candidate_profile?.name?.toLowerCase().replace(/\s+/g, "_") || "candidate";
    const filename = `${candidateName}_ats_evaluation.json`;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-900/10 border border-sky-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>Strict Schema-Conforming JSON Output</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct ATS machine-readable evaluation payload matching specification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      <pre className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700 leading-relaxed shadow-inner">
        {jsonString}
      </pre>
    </div>
  );
};
