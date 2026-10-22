"use client";

import React from "react";

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "PROCESSING TELEMETRY..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3 font-mono text-xs">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7939E8] border-t-transparent" />
      <span className="font-bold tracking-widest text-[#555] uppercase">{label}</span>
    </div>
  );
}
