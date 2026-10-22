"use client";

import React from "react";

interface VirtualSimulatorControlsProps {
  baseWatts: number;
  setBaseWatts: React.Dispatch<React.SetStateAction<number>>;
  voltageMin: number;
  setVoltageMin: (v: number) => void;
  voltageMax: number;
  setVoltageMax: (v: number) => void;
  noisePct: number;
  setNoisePct: (v: number) => void;
  surgeMultiplier: number;
  setSurgeMultiplier: (v: number) => void;
  livePulse: { volts: number; amps: number; watts: number; pf: number; hz: number };
}

export function VirtualSimulatorControls({
  baseWatts,
  setBaseWatts,
  voltageMin,
  setVoltageMin,
  voltageMax,
  setVoltageMax,
  noisePct,
  setNoisePct,
  surgeMultiplier,
  setSurgeMultiplier,
  livePulse,
}: VirtualSimulatorControlsProps) {
  return (
    <div className="mt-4 border-t border-[#dedbd4] pt-4 space-y-4 font-mono">
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-black">
        <span>SIMULATOR RUNTIME PARAMETERS:</span>
        <span className="text-[#7939E8]">REAL-TIME RECONFIGURABLE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* PARAM 1 */}
        <div className="border border-[#dedbd4] bg-white p-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#666] mb-1">
            <span>BASE CONTINUOUS LOAD</span>
            <span className="text-black font-black">{baseWatts} W</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="200"
              max="10000"
              step="50"
              value={baseWatts}
              onChange={(e) => setBaseWatts(Math.max(200, Number(e.target.value) || 200))}
              className="w-full border border-[#dedbd4] px-2 py-1 text-sm text-black focus:outline-none focus:border-[#7939E8]"
            />
            <button
              type="button"
              onClick={() => setBaseWatts((prev) => Math.max(200, prev - 100))}
              className="border border-[#dedbd4] bg-[#f4f2ec] px-2 py-1 hover:bg-[#eae6dc]"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setBaseWatts((prev) => prev + 100)}
              className="border border-[#dedbd4] bg-[#f4f2ec] px-2 py-1 hover:bg-[#eae6dc]"
            >
              +
            </button>
          </div>
        </div>

        {/* PARAM 2 */}
        <div className="border border-[#dedbd4] bg-white p-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#666] mb-1">
            <span>GRID VOLTAGE RANGE</span>
            <span className="text-black font-black">{voltageMin}V – {voltageMax}V</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="180"
              max="230"
              value={voltageMin}
              onChange={(e) => setVoltageMin(Number(e.target.value))}
              className="w-1/2 border border-[#dedbd4] px-2 py-1 text-xs text-black focus:outline-none focus:border-[#7939E8]"
            />
            <span className="text-[#888]">-</span>
            <input
              type="number"
              min="230"
              max="260"
              value={voltageMax}
              onChange={(e) => setVoltageMax(Number(e.target.value))}
              className="w-1/2 border border-[#dedbd4] px-2 py-1 text-xs text-black focus:outline-none focus:border-[#7939E8]"
            />
          </div>
        </div>

        {/* PARAM 3 */}
        <div className="border border-[#dedbd4] bg-white p-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#666] mb-1">
            <span>STOCHASTIC NOISE</span>
            <span className="text-[#7939E8] font-black">±{noisePct}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15.0"
            step="0.1"
            value={noisePct}
            onChange={(e) => setNoisePct(Number(e.target.value))}
            className="w-full accent-[#7939E8] cursor-pointer"
          />
        </div>

        {/* PARAM 4 */}
        <div className="border border-[#dedbd4] bg-white p-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#666] mb-1">
            <span>PEAK INRUSH MULTIPLIER</span>
            <span className="text-black font-black">{surgeMultiplier}x</span>
          </div>
          <input
            type="number"
            min="1.0"
            max="5.0"
            step="0.1"
            value={surgeMultiplier}
            onChange={(e) => setSurgeMultiplier(Number(e.target.value))}
            className="w-full border border-[#dedbd4] px-2 py-1 text-xs text-black focus:outline-none focus:border-[#7939E8]"
          />
        </div>
      </div>

      {/* LIVE MONITOR */}
      <div className="border border-black bg-black text-[#58ff78] p-3 text-xs shadow-inner">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#333] text-[10px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#58ff78] animate-ping" />
            <span className="text-white font-bold tracking-widest uppercase">
              SIMULATOR TELEMETRY STREAM
            </span>
          </div>
          <span className="text-[#aaa]">SAMPLING: 1 Hz (1-SEC)</span>
        </div>

        <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          <div className="border border-[#222] bg-[#111] p-1.5">
            <span className="block text-[8px] text-[#888]">VOLTAGE</span>
            <span className="text-sm font-bold text-white">{livePulse.volts} V</span>
          </div>
          <div className="border border-[#222] bg-[#111] p-1.5">
            <span className="block text-[8px] text-[#888]">CURRENT</span>
            <span className="text-sm font-bold text-white">{livePulse.amps} A</span>
          </div>
          <div className="border border-[#222] bg-[#111] p-1.5">
            <span className="block text-[8px] text-[#888]">ACTIVE POWER</span>
            <span className="text-sm font-bold text-[#58ff78]">{livePulse.watts} W</span>
          </div>
          <div className="border border-[#222] bg-[#111] p-1.5">
            <span className="block text-[8px] text-[#888]">POWER FACTOR</span>
            <span className="text-sm font-bold text-white">{livePulse.pf}</span>
          </div>
          <div className="border border-[#222] bg-[#111] p-1.5">
            <span className="block text-[8px] text-[#888]">GRID FREQ</span>
            <span className="text-sm font-bold text-white">{livePulse.hz} Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
}
