"use client";

import React from "react";

interface ModelTrainingModalProps {
  isOpen: boolean;
  trainingProgress: number;
  trainingEpoch: number;
  trainingLoss: number;
  trainingR2: number;
  trainingStage: string;
  trainingLogs: string[];
  isTrainingComplete: boolean;
  dataSourceLabel: string;
  totalRecords: number;
}

export function ModelTrainingModal({
  isOpen,
  trainingProgress,
  trainingEpoch,
  trainingLoss,
  trainingR2,
  trainingStage,
  trainingLogs,
  isTrainingComplete,
  dataSourceLabel,
  totalRecords,
}: ModelTrainingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 animate-fade-in font-mono">
      <div className="relative w-full max-w-2xl border-2 border-black bg-[#FCF9F2] shadow-2xl p-6 sm:p-8 text-xs">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dedbd4] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7939E8] animate-ping" />
            <span className="font-bold tracking-wider text-black text-sm">
              WATTWISE // NILM-DISAGGNET CALIBRATION PIPELINE
            </span>
          </div>
          <span className="border border-black bg-black px-2 py-0.5 text-[9px] font-bold text-[#58ff78]">
            IEC 62053-21 COMPLIANT
          </span>
        </div>

        {/* Model Architecture & Source */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#555]">
          <div>
            <span className="text-[#888]">MODEL: </span>
            <span className="font-bold text-black">NILM-DisaggNet v2.4 (Bi-LSTM + Fourier)</span>
          </div>
          <div>
            <span className="text-[#888]">DATA SOURCE: </span>
            <span className="font-bold text-[#7939E8]">{dataSourceLabel}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-black">TRAINING PROGRESS: {trainingProgress}%</span>
            <span className="text-[#7939E8]">EPOCH {trainingEpoch} OF 5</span>
          </div>
          <div className="h-3 w-full border border-black bg-white p-0.5">
            <div
              className="h-full bg-[#7939E8] transition-all duration-300"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
        </div>

        {/* Metric Tiles */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="border border-[#dedbd4] bg-white p-3">
            <span className="block text-[9px] text-[#777]">CONVERGENCE LOSS</span>
            <span className="text-base font-black text-black">{trainingLoss.toFixed(4)}</span>
            <span className="block text-[8px] text-[#58ff78] font-bold">↓ DESCENDING</span>
          </div>

          <div className="border border-[#dedbd4] bg-white p-3">
            <span className="block text-[9px] text-[#777]">R² ACCURACY SCORE</span>
            <span className="text-base font-black text-[#7939E8]">{trainingR2.toFixed(1)}%</span>
            <span className="block text-[8px] text-[#777]">TARGET &gt; 95%</span>
          </div>

          <div className="border border-[#dedbd4] bg-white p-3">
            <span className="block text-[9px] text-[#777]">TELEMETRY FRAMES</span>
            <span className="text-base font-black text-black">{totalRecords.toLocaleString()}</span>
            <span className="block text-[8px] text-[#777]">POINTS INGESTED</span>
          </div>
        </div>

        {/* Active Stage Indicator */}
        <div className="mt-4 border border-[#e8e4dc] bg-[#f4f1ea] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#7939E8] animate-pulse" />
            <span className="font-bold text-black text-[11px]">{trainingStage}</span>
          </div>
          <span className="text-[10px] text-[#666]">ACCURACY CLASS 1.0</span>
        </div>

        {/* Terminal Log Box */}
        <div className="mt-4 border border-black bg-[#0d0d0d] p-3 text-[#58ff78] h-40 overflow-y-auto space-y-1 text-[11px] shadow-inner">
          <div className="text-[10px] text-[#888] pb-1 border-b border-[#222]">
            ─── LIVE TERMINAL TELEMETRY LOG ───
          </div>
          {trainingLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>

        {/* Status Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-[#dedbd4] pt-3 text-[10px]">
          <div className="flex items-center gap-2">
            {isTrainingComplete ? (
              <span className="text-[#059669] font-bold flex items-center gap-1 text-xs">
                ✓ MODEL CALIBRATION LOCKED &amp; DEPLOYED
              </span>
            ) : (
              <span className="text-[#666] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7939E8] animate-ping" />
                <span>FITTING NON-INTRUSIVE LOAD MONITORING WEIGHTS...</span>
              </span>
            )}
          </div>

          <span className="font-bold text-black">
            {isTrainingComplete ? "REDIRECTING..." : "DO NOT CLOSE WINDOW"}
          </span>
        </div>
      </div>
    </div>
  );
}
