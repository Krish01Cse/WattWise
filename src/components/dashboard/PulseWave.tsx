"use client";

import React from "react";

interface PulseWaveProps {
  watts: number;
  isSpike?: boolean;
}

export function PulseWave({ watts, isSpike = false }: PulseWaveProps) {
  return (
    <div className="relative h-12 w-full overflow-hidden border border-[#dedbd4] bg-black p-2 font-mono text-[9px]">
      <div className="flex items-center justify-between text-[#888] mb-1">
        <span>OSCILLOSCOPE WAVEFORM</span>
        <span className={isSpike ? "text-[#e040fb] font-bold" : "text-[#58ff78]"}>
          {watts} W {isSpike && "• SURGE DETECTED"}
        </span>
      </div>
      <svg className="h-6 w-full" viewBox="0 0 300 24" preserveAspectRatio="none">
        <path
          d={
            isSpike
              ? "M 0 12 Q 25 2 50 12 T 100 12 T 125 0 T 135 24 T 150 12 T 200 12 T 250 12 T 300 12"
              : "M 0 12 Q 25 6 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12"
          }
          fill="none"
          stroke={isSpike ? "#e040fb" : "#58ff78"}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
