import React, { useState } from "react";
import { FileText, CheckCircle2, X, Eye, EyeOff, FileCheck } from "lucide-react";

interface PdfPreviewCardProps {
  fileName: string;
  fileSize: string;
  mimeType: string;
  onRemove: () => void;
  extractedSnippet?: string;
}

export const PdfPreviewCard: React.FC<PdfPreviewCardProps> = ({
  fileName,
  fileSize,
  mimeType,
  onRemove,
  extractedSnippet,
}) => {
  const [showSnippet, setShowSnippet] = useState(false);
  const isPdf = mimeType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Document Icon & Metadata */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative shrink-0">
            {isPdf ? (
              <div className="w-12 h-14 bg-rose-50 border border-rose-200 rounded-xl flex flex-col items-center justify-center text-rose-600 shadow-2xs">
                <FileText className="w-6 h-6 stroke-[1.75]" />
                <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5 font-mono">PDF</span>
              </div>
            ) : (
              <div className="w-12 h-14 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col items-center justify-center text-indigo-600 shadow-2xs">
                <FileCheck className="w-6 h-6 stroke-[1.75]" />
                <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5 font-mono">TXT</span>
              </div>
            )}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-slate-900 text-sm truncate max-w-xs sm:max-w-md font-sans" title={fileName}>
                {fileName}
              </h4>
              <span className="text-emerald-700 text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Document Selected</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
              <span className="text-slate-700 font-medium">{fileSize}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span>{isPdf ? "PDF Document" : "Text Document"}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-600 font-sans">Ready for evaluation</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {extractedSnippet && (
            <button
              type="button"
              onClick={() => setShowSnippet(!showSnippet)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {showSnippet ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
              <span>{showSnippet ? "Hide Text" : "View Extracted Text"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            title="Replace document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Text Snippet */}
      {showSnippet && extractedSnippet && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 animate-in fade-in">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Extracted Document Content ({extractedSnippet.length} characters)</span>
            <span className="text-emerald-700 font-mono text-[10px]">Verified</span>
          </div>
          <pre className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-mono text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {extractedSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
