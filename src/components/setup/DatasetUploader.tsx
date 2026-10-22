"use client";

import React from "react";

interface DatasetUploaderProps {
  uploadedFileName: string;
  uploadedRowCount: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

export function DatasetUploader({
  uploadedFileName,
  uploadedRowCount,
  onFileUpload,
  onDownloadTemplate,
}: DatasetUploaderProps) {
  return (
    <div className="mt-3 space-y-3 font-mono">
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#7939E8] bg-white p-5 cursor-pointer hover:bg-[#faf7ff] transition-all">
        <svg className="w-8 h-8 text-[#7939E8] mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="text-xs font-bold text-black">
          {uploadedFileName ? `✓ Staged: ${uploadedFileName}` : "Click to Browse or Drag & Drop Telemetry (.CSV / .JSON)"}
        </span>
        <span className="text-[10px] text-[#777] mt-1">
          Expected headers: timestamp, active_power_w, voltage_v, current_a, appliance_tag
        </span>
        <input
          type="file"
          accept=".csv,.json,text/csv,application/json"
          onChange={onFileUpload}
          className="hidden"
        />
      </label>

      {uploadedFileName && (
        <div className="border border-[#7939E8]/30 bg-[#f4efff] p-3 text-xs space-y-1">
          <div className="flex justify-between text-black font-bold">
            <span>FILE: {uploadedFileName}</span>
            <span className="text-[#7939E8]">{uploadedRowCount.toLocaleString()} RECORDS DETECTED</span>
          </div>
          <div className="text-[10px] text-[#555]">
            Format: CSV Validated • Target Model: NILM-DisaggNet v2.4 • Ready for Epoch Training
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="text-[10px] font-bold text-[#7939E8] underline hover:text-[#5c24c2] flex items-center gap-1"
        >
          <span>↓ Download Sample Telemetry CSV Template</span>
        </button>
      </div>
    </div>
  );
}
