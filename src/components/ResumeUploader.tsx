import React, { useRef, useState } from "react";
import { Upload, Check, AlertCircle } from "lucide-react";
import { PRESET_RESUMES } from "../data/presets";
import { PresetResume } from "../types/ats";
import { PdfPreviewCard } from "./PdfPreviewCard";

interface ResumeUploaderProps {
  onFileSelected: (fileData: { mimeType: string; base64: string; fileName: string; fileSize: string } | null) => void;
  onTextChanged: (text: string) => void;
  resumeText: string;
  selectedFile: { fileName: string; fileSize: string; mimeType: string } | null;
  activePresetId: string | null;
  onSelectPreset: (preset: PresetResume | null) => void;
  extractedSnippet?: string;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onFileSelected,
  onTextChanged,
  resumeText,
  selectedFile,
  activePresetId,
  onSelectPreset,
  extractedSnippet,
}) => {
  const [mode, setMode] = useState<"file" | "text">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const processFile = (file: File) => {
    setFileError(null);
    onSelectPreset(null);

    if (file.size > 25 * 1024 * 1024) {
      setFileError("File exceeds 25MB limit. Please provide a smaller document.");
      return;
    }

    const isPdfOrImage = file.type === "application/pdf" || file.type.startsWith("image/");
    const isText = file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md");

    if (!isPdfOrImage && !isText) {
      setFileError("Supported formats: PDF (.pdf), high-resolution images, or plain text (.txt).");
      return;
    }

    const reader = new FileReader();

    if (isText) {
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        onTextChanged(text);
        onFileSelected(null);
      };
      reader.readAsText(file);
      setMode("text");
    } else {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Index = result.indexOf(",");
        const base64 = base64Index !== -1 ? result.substring(base64Index + 1) : result;
        onTextChanged("");
        onFileSelected({
          mimeType: file.type || "application/pdf",
          base64: base64,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
        });
      };
      reader.readAsDataURL(file);
      setMode("file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_rgba(2,132,199,0.08)] border border-sky-100 flex flex-col justify-between transition-all">
      <div>
        {/* Header with Clean Segmented Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">
              Candidate Resume
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload applicant PDF document or paste career history
            </p>
          </div>

          {/* Segmented Pill Switcher (Light & Refined) */}
          <div className="flex bg-slate-100/90 p-1 rounded-full border border-slate-200/70 text-xs self-start sm:self-center shadow-inner">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                mode === "file"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              PDF Document
            </button>
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                mode === "text"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Dedicated PDF Preview Card if file is selected */}
        {selectedFile && (
          <div className="mb-5 animate-in fade-in">
            <PdfPreviewCard
              fileName={selectedFile.fileName}
              fileSize={selectedFile.fileSize}
              mimeType={selectedFile.mimeType}
              onRemove={() => {
                onFileSelected(null);
                onTextChanged("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              extractedSnippet={extractedSnippet}
            />
          </div>
        )}

        {/* Beautiful, Airy Dropzone (File Mode & No file selected) */}
        {mode === "file" && !selectedFile && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center mb-5 ${
              isDragging
                ? "border-sky-500 bg-sky-50/60 scale-[1.01]"
                : "border-sky-200 hover:border-sky-400 bg-gradient-to-b from-sky-50/40 to-white hover:bg-sky-50/60"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,image/png,image/jpeg,image/webp,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center mb-2.5 text-sky-600">
              <Upload className="w-5 h-5 stroke-[2]" />
            </div>
            <p className="text-sm font-bold text-slate-900">
              Select or drop candidate PDF resume
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports standard <strong className="text-slate-700">PDF (.pdf)</strong> and plain text documents up to 25MB
            </p>
          </div>
        )}

        {/* Text Mode */}
        {mode === "text" && (
          <div className="mb-5">
            <textarea
              value={resumeText}
              onChange={(e) => {
                onTextChanged(e.target.value);
                if (activePresetId) onSelectPreset(null);
              }}
              placeholder="Paste candidate career history, roles, dates, technologies, and academic background..."
              rows={7}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all placeholder:text-slate-400 leading-relaxed shadow-inner"
            />
            {resumeText && (
              <div className="text-[11px] text-slate-400 mt-1 flex justify-end font-mono">
                {resumeText.trim().split(/\s+/).length} words · {resumeText.length} characters
              </div>
            )}
          </div>
        )}

        {fileError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Refined Sample Candidate Dossiers (No Heavy Black Boxes) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Or Try A Sample Candidate Dossier:
            </span>
            <span className="text-[10px] text-slate-400">Pre-calibrated profiles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESET_RESUMES.map((preset) => {
              const isSelected = activePresetId === preset.id && !selectedFile;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset);
                    onTextChanged(preset.resumeText);
                    onFileSelected(null);
                    setMode("text");
                  }}
                  className={`text-left p-3 rounded-2xl border transition-all text-xs ${
                    isSelected
                      ? "bg-sky-50/90 border-sky-400 text-slate-900 shadow-sm ring-1 ring-sky-300"
                      : "bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{preset.name}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                    {preset.role}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {preset.experienceYears}y exp · {preset.seniority}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
