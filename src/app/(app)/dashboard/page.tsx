"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DayData {
  id: string;
  dateLabel: string;
  fullDate: string;
  usageKwh: number;
  costInr: number;
  baselineKwh: number;
  isSpike: boolean;
  spikeReason?: string;
  isToday?: boolean;
}

const SEVEN_DAY_DATA: DayData[] = [
  {
    id: "18-oct",
    dateLabel: "18 Oct",
    fullDate: "OCT 18 (FRI)",
    usageKwh: 11.2,
    costInr: 91.84,
    baselineKwh: 11.4,
    isSpike: false,
  },
  {
    id: "19-oct",
    dateLabel: "19 Oct",
    fullDate: "OCT 19 (SAT)",
    usageKwh: 14.5,
    costInr: 118.9,
    baselineKwh: 11.8,
    isSpike: false,
  },
  {
    id: "20-oct",
    dateLabel: "20 Oct",
    fullDate: "OCT 20 (SUN)",
    usageKwh: 18.9,
    costInr: 151.2,
    baselineKwh: 12.5,
    isSpike: true,
    spikeReason: "Geyser ran 6.4h",
  },
  {
    id: "21-oct",
    dateLabel: "21 Oct",
    fullDate: "OCT 21 (MON)",
    usageKwh: 10.8,
    costInr: 88.56,
    baselineKwh: 11.2,
    isSpike: false,
  },
  {
    id: "22-oct",
    dateLabel: "22 Oct",
    fullDate: "OCT 22 (TUE)",
    usageKwh: 12.1,
    costInr: 99.22,
    baselineKwh: 11.4,
    isSpike: false,
  },
  {
    id: "23-oct",
    dateLabel: "23 Oct",
    fullDate: "OCT 23 (WED)",
    usageKwh: 11.5,
    costInr: 94.3,
    baselineKwh: 11.4,
    isSpike: false,
  },
  {
    id: "today",
    dateLabel: "Today",
    fullDate: "OCT 24 (TODAY)",
    usageKwh: 12.4,
    costInr: 99.0,
    baselineKwh: 10.6,
    isSpike: false,
    isToday: true,
  },
];

interface ConsumerAppliance {
  name: string;
  subtitle: string;
  hours: string;
  powerKwh: number;
  costInr: number;
  status: "high_draw" | "normal" | "possible_leak";
  isAnomaly?: boolean;
}

const TOP_APPLIANCES: ConsumerAppliance[] = [
  {
    name: "Master Bedroom AC",
    subtitle: "1.5 Ton Split Inverter",
    hours: "6.2 hrs",
    powerKwh: 5.8,
    costInr: 46.4,
    status: "high_draw",
  },
  {
    name: "Refrigerator",
    subtitle: "Kitchen • Double Door",
    hours: "24 hrs",
    powerKwh: 2.6,
    costInr: 20.8,
    status: "normal",
  },
  {
    name: "Water Geyser (Bathroom 1)",
    subtitle: "Ran unexpectedly at night",
    hours: "2.4 hrs",
    powerKwh: 2.1,
    costInr: 16.8,
    status: "possible_leak",
    isAnomaly: true,
  },
  {
    name: "Ceiling Fans (3 units)",
    subtitle: "Living room & bedrooms",
    hours: "14.0 hrs",
    powerKwh: 1.1,
    costInr: 8.8,
    status: "normal",
  },
  {
    name: "Washing Machine",
    subtitle: "Utility balcony • 1 wash cycle",
    hours: "48 mins",
    powerKwh: 0.8,
    costInr: 6.4,
    status: "normal",
  },
];

const ADDITIONAL_APPLIANCES: ConsumerAppliance[] = [
  {
    name: "Television (55\" OLED)",
    subtitle: "Living Room Bay",
    hours: "4.5 hrs",
    powerKwh: 0.63,
    costInr: 5.16,
    status: "normal",
  },
  {
    name: "Microwave Oven",
    subtitle: "Kitchen Prep Counter",
    hours: "22 mins",
    powerKwh: 0.44,
    costInr: 3.6,
    status: "normal",
  },
  {
    name: "Water Purifier (RO)",
    subtitle: "Continuous Circulation",
    hours: "6.0 hrs",
    powerKwh: 0.35,
    costInr: 2.87,
    status: "normal",
  },
  {
    name: "Smart Lighting Circuits",
    subtitle: "All Zones (LED)",
    hours: "8.5 hrs",
    powerKwh: 0.72,
    costInr: 5.9,
    status: "normal",
  },
];

export default function EnergyOverviewDashboard() {
  const [selectedRange, setSelectedRange] = useState<"TODAY" | "7D" | "30D" | "CUSTOM">("TODAY");
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(SEVEN_DAY_DATA[2]); // Default highlight 20 Oct matching Screenshot 3
  const [showAllAppliances, setShowAllAppliances] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [activeModalAlert, setActiveModalAlert] = useState<string | null>(null);

  // Trigger CSV export of report
  function handleExportReport() {
    const csvRows = [
      ["WATTWISE RESIDENTIAL ENERGY REPORT"],
      ["Household", "Bandra Residence - Main"],
      ["Location", "Mumbai, Maharashtra"],
      ["Grid Node ID", "ESP32-NODE-04892"],
      ["Effective Tariff", "₹8.20 / unit"],
      ["Report Date", "Oct 24, 2025"],
      [],
      ["--- 7-DAY TELEMETRY PROFILE ---"],
      ["Date", "Usage (kWh)", "Cost (INR)", "Baseline (kWh)", "Spike Status"],
      ...SEVEN_DAY_DATA.map((d) => [
        d.dateLabel,
        d.usageKwh.toFixed(1),
        `₹${d.costInr.toFixed(2)}`,
        d.baselineKwh.toFixed(1),
        d.isSpike ? `Spike (${d.spikeReason})` : "Normal",
      ]),
      [],
      ["--- APPLIANCE LOAD DECOMPOSITION ---"],
      ["Appliance", "Category", "Hours Active", "Power (kWh)", "Cost (INR)", "Status"],
      ...[...TOP_APPLIANCES, ...ADDITIONAL_APPLIANCES].map((a) => [
        a.name,
        a.subtitle,
        a.hours,
        a.powerKwh.toFixed(2),
        `₹${a.costInr.toFixed(2)}`,
        a.status.toUpperCase(),
      ]),
      [],
      ["--- DETECTED ANOMALIES ---"],
      ["1", "Water Geyser Ran at Night (Bathroom 1)", "2h 26m", "+₹12 extra", "Thermostat inspection required"],
      ["2", "Master Bed AC Surge (1.5T Split)", "60% excessive draw", "+₹24 extra", "Compressor cycling anomaly"],
      [],
      ["Summary", "Total 7-day usage: 91.4 kWh | Baseline variance: +14.6%"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WattWise_Energy_Report_Bandra_Residence_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("✓ Energy report generated & exported as CSV successfully!");
    setTimeout(() => setToastMessage(""), 4000);
  }

  const displayedAppliances = showAllAppliances
    ? [...TOP_APPLIANCES, ...ADDITIONAL_APPLIANCES]
    : TOP_APPLIANCES;

  return (
    <div className="flex-1 bg-[#fcf9f2] text-[#111111] pb-12">
      
      {/* TOAST BANNER */}
      {toastMessage && (
        <div className="fixed top-4 right-6 z-50 flex items-center gap-3 bg-black text-white px-5 py-3 font-mono text-xs border border-[#7939E8] shadow-2xl animate-bounce">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage("")} className="text-white hover:text-[#7939E8]">
            ✕
          </button>
        </div>
      )}

      {/* TOP BAR / SYS RANGE STRIP */}
      <header className="flex flex-wrap items-center justify-between border-b border-[#dedbd4] bg-[#fcf9f2] px-6 py-3 gap-3">
        {/* SYS RANGE */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#55515a]">
            SYS RANGE
          </span>

          <div className="flex items-center gap-2 border border-[#dedbd4] bg-white px-2.5 py-1 font-mono text-xs text-[#222]">
            <span>📅</span>
            <span>Today, Oct 24, 2025</span>
          </div>

          <div className="flex border border-[#dedbd4] bg-[#f4f2ec] p-0.5 font-mono text-[10px] font-bold">
            {(["TODAY", "7D", "30D", "CUSTOM"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 transition-colors ${
                  selectedRange === range
                    ? "bg-black text-white shadow-sm"
                    : "text-[#55515a] hover:text-black"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* DATA SOURCE & NOTIFICATION ICONS */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-[#d5d0c8] bg-[#f0eee7] px-3 py-1 font-mono text-[10px] font-bold text-[#333]">
            <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>DATA SOURCE: VIRTUAL TELEMETRY NODE // 1S INTERVAL - LIVE</span>
          </div>

          {/* Bell Icon with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="flex h-8 w-8 items-center justify-center border border-[#dedbd4] bg-white hover:bg-[#f4f2ec] transition-colors"
              aria-label="Alerts notification"
            >
              <svg className="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#7939E8] text-white text-[9px] font-mono font-bold px-1 rounded-sm">
                3
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotificationDrawer && (
              <div className="absolute right-0 top-10 z-50 w-80 border border-[#dedbd4] bg-white p-3 shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#eee] pb-2">
                  <span className="font-bold text-black">SYSTEM NOTIFICATIONS</span>
                  <span className="text-[10px] text-[#7939E8]">3 UNREAD</span>
                </div>
                <div className="divide-y divide-[#f0f0f0] mt-2 space-y-2">
                  <div className="pt-2">
                    <span className="font-bold text-[#d32f2f] block">⚠️ Geyser Leak Warning</span>
                    <span className="text-[11px] text-[#555]">Bathroom 1 draw active 2.4h during off-peak night.</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-[#d32f2f] block">⚡ AC Surge Spike</span>
                    <span className="text-[11px] text-[#555]">Master Bedroom AC cycling duty exceeded 60%.</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-[#10b981] block">● Node Telemetry Calibrated</span>
                    <span className="text-[11px] text-[#555]">ESP32 telemetry stream synchronized with Bandra grid.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Circle Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <div className="px-6 py-6 sm:px-8 space-y-6 max-w-[1600px] mx-auto">
        
        {/* TITLE SECTION & ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[1.5px] text-[#55515a]">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span>SYSTEM LIVE &amp; MONITORING</span>
            </div>
            <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-[-1px] text-black">
              Energy Overview
            </h1>
            <p className="mt-1 text-xs text-[#666]">
              Real-time consumption and anomaly alerts for Bandra Residence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 border border-[#dedbd4] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#222]">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span>Rate: ₹8.20 / unit</span>
            </div>

            <button
              type="button"
              onClick={handleExportReport}
              className="flex items-center gap-2 border border-black bg-white px-3.5 py-1.5 font-mono text-xs font-bold tracking-wider text-black transition-colors hover:bg-black hover:text-white"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>EXPORT REPORT</span>
            </button>
          </div>
        </div>

        {/* TOP 4 METRIC TILES */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* TILE 1: TODAY'S USAGE */}
          <div className="border border-[#dedbd4] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-[1px] text-[#555]">
              <span>TODAY'S USAGE</span>
              <span className="text-sm">→</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-black tracking-tight">12.4</span>
              <span className="font-mono text-sm text-[#555]">kWh</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 font-mono text-xs">
              <span className="font-bold text-[#d32f2f]">▲ +1.8 kWh</span>
              <span className="text-[#666]">higher than typical</span>
            </div>
          </div>

          {/* TILE 2: TODAY'S COST */}
          <div className="border border-[#dedbd4] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-[1px] text-[#555]">
              <span>TODAY'S COST</span>
              <span className="text-sm">→</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-black tracking-tight">₹99</span>
              <span className="font-mono text-xs text-[#555]">INR</span>
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-xs">
              <span className="text-[#666]">at ₹8.20 / unit</span>
              <span className="border border-[#dedbd4] bg-[#f0eee7] px-1.5 py-0.5 text-[9px] font-bold text-[#555]">
                NORMAL TIER
              </span>
            </div>
          </div>

          {/* TILE 3: ESTIMATED MONTHLY BILL */}
          <div className="border border-[#dedbd4] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-[1px] text-[#555]">
              <span>ESTIMATED MONTHLY BILL</span>
              <span className="text-sm">→</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-black tracking-tight">₹2,850</span>
              <span className="font-mono text-[9px] text-[#777] font-bold">OCT PROJECTION</span>
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-xs">
              <span className="text-[#666]">Budget: ₹3,200</span>
              <span className="font-bold text-[#10b981] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                ON TRACK
              </span>
            </div>
          </div>

          {/* TILE 4: ALERTS */}
          <div className="border border-[#dedbd4] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[1px] text-[#7939E8]">
                <span className="h-2 w-2 rounded-full bg-[#7939E8]" />
                ALERTS
              </span>
              <span className="bg-[#7939E8] px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-white">
                NEEDS ATTENTION
              </span>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-black text-black">2</span>
              <span className="ml-2 font-mono text-sm font-bold text-[#7939E8]">
                Unusual Spikes
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveModalAlert("water_geyser")}
              className="mt-3 flex w-full items-center justify-between text-xs text-[#555] hover:text-[#7939E8] font-mono group"
            >
              <span>Geyser Leak &amp; AC Surge</span>
              <span className="text-[#7939E8] group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* LAST 7 DAYS USAGE CHART PANEL */}
        <div className="border border-[#dedbd4] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative">
          {/* Header & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dedbd4] pb-4">
            <h2 className="font-black text-lg text-black">
              Last 7 Days Usage
            </h2>

            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#555]">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 bg-black inline-block" />
                <span>Daily Usage</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 border-t-2 border-dashed border-[#888] inline-block" />
                <span>Usual Baseline (11.4 kWh)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 bg-[#7939E8] inline-block" />
                <span className="text-[#7939E8] font-bold">Unusual Spike Day</span>
              </span>
            </div>
          </div>

          {/* SVG Bar Chart with Hover Tooltip */}
          <div className="relative mt-8 pt-4 pb-2">
            
            {/* FLOATING HOVER TOOLTIP (MATCHING SCREENSHOT 3) */}
            {hoveredDay && (
              <div
                className="absolute z-20 pointer-events-none transition-all duration-150"
                style={{
                  top: "0px",
                  left: `${
                    hoveredDay.id === "18-oct" ? "8%" :
                    hoveredDay.id === "19-oct" ? "21%" :
                    hoveredDay.id === "20-oct" ? "35%" :
                    hoveredDay.id === "21-oct" ? "49%" :
                    hoveredDay.id === "22-oct" ? "63%" :
                    hoveredDay.id === "23-oct" ? "77%" : "82%"
                  }`,
                }}
              >
                <div className="border-2 border-black bg-white p-3 shadow-xl font-mono text-xs min-w-[210px]">
                  <div className="flex items-center justify-between border-b border-[#eee] pb-1.5">
                    <strong className="text-black">{hoveredDay.fullDate}</strong>
                    <strong className="text-black">₹{hoveredDay.costInr.toFixed(2)}</strong>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#666]">Total Usage:</span>
                      <span className="font-bold text-black">{hoveredDay.usageKwh.toFixed(1)} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">Typical Baseline:</span>
                      <span className="font-bold text-black">{hoveredDay.baselineKwh.toFixed(1)} kWh</span>
                    </div>
                  </div>
                  {hoveredDay.isSpike && (
                    <div className="mt-2 pt-1.5 border-t border-[#eee] text-[#7939E8] font-bold text-[11px]">
                      Unusual spike: {hoveredDay.spikeReason}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chart Area */}
            <div className="relative h-[220px] w-full flex items-end justify-between px-6 sm:px-12">
              
              {/* Horizontal Gridlines & Y-Axis Labels */}
              <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center w-full border-b border-[#f0eee7]">
                  <span className="font-mono text-[10px] text-[#888] w-12 text-left">20 kWh</span>
                  <div className="flex-1 border-b border-[#eae6dc]" />
                </div>
                <div className="flex items-center w-full border-b border-[#f0eee7]">
                  <span className="font-mono text-[10px] text-[#888] w-12 text-left">15 kWh</span>
                  <div className="flex-1 border-b border-[#eae6dc]" />
                </div>
                <div className="flex items-center w-full border-b border-[#f0eee7]">
                  <span className="font-mono text-[10px] text-[#888] w-12 text-left">10 kWh</span>
                  <div className="flex-1 border-b border-[#eae6dc]" />
                </div>
                <div className="flex items-center w-full border-b border-[#f0eee7]">
                  <span className="font-mono text-[10px] text-[#888] w-12 text-left">5 kWh</span>
                  <div className="flex-1 border-b border-[#eae6dc]" />
                </div>
                <div className="flex items-center w-full">
                  <span className="font-mono text-[10px] text-[#888] w-12 text-left">0</span>
                  <div className="flex-1 border-b border-black" />
                </div>
              </div>

              {/* Dotted Baseline Line at 11.4 kWh (57% height) */}
              <div
                className="absolute inset-x-12 border-t-2 border-dashed border-[#888] pointer-events-none z-0"
                style={{ bottom: `${(11.4 / 20) * 100}%` }}
              />

              {/* Day Bars */}
              {SEVEN_DAY_DATA.map((day) => {
                const heightPercent = (day.usageKwh / 20) * 100;
                const isHovered = hoveredDay?.id === day.id;

                return (
                  <div
                    key={day.id}
                    onMouseEnter={() => setHoveredDay(day)}
                    className="relative flex flex-col items-center justify-end h-full z-10 cursor-pointer group px-2 sm:px-4"
                  >
                    {/* Spike label for 20 Oct */}
                    {day.isSpike && (
                      <div className="absolute top-0 font-mono text-[10px] font-bold text-[#7939E8] whitespace-nowrap mb-1">
                        Unusual spike (18.9 kWh)
                      </div>
                    )}

                    {/* Value above bar */}
                    <span
                      className={`font-mono text-xs font-bold mb-1.5 transition-colors ${
                        day.isSpike ? "text-[#7939E8]" : "text-black"
                      }`}
                    >
                      {day.isToday ? `${day.usageKwh}*` : day.usageKwh}
                    </span>

                    {/* Bar rectangle */}
                    <div className="relative">
                      {/* Purple outline border for spike */}
                      {day.isSpike && (
                        <div className="absolute -inset-1 border-2 border-dashed border-[#7939E8] pointer-events-none" />
                      )}
                      
                      <div
                        className={`w-9 sm:w-11 transition-all duration-200 ${
                          day.isSpike
                            ? "bg-[#7939E8]"
                            : "bg-[#19191c] hover:bg-[#333]"
                        } ${isHovered ? "ring-2 ring-black ring-offset-2" : ""}`}
                        style={{ height: `${(heightPercent / 100) * 165}px` }}
                      />
                    </div>

                    {/* X-axis date label */}
                    <span
                      className={`mt-2 font-mono text-xs font-bold ${
                        day.isSpike
                          ? "text-[#7939E8]"
                          : isHovered
                          ? "text-black underline"
                          : "text-[#555]"
                      }`}
                    >
                      {day.dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Summary Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between border-t border-[#dedbd4] pt-4 font-mono text-xs text-[#555]">
            <div className="flex flex-wrap items-center gap-6">
              <span>Total 7-day usage: <strong className="text-black">91.4 kWh</strong></span>
              <span>Daily average: <strong className="text-black">13.0 kWh</strong></span>
              <span>Difference vs baseline: <strong className="text-[#d32f2f]">+14.6%</strong></span>
            </div>
            <span className="text-[#777]">Updated 2 minutes ago</span>
          </div>
        </div>

        {/* BOTTOM SECTION: 2 COLUMNS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* LEFT COLUMN: TOP POWER CONSUMERS TODAY (7 COLS) */}
          <div className="lg:col-span-7 border border-[#dedbd4] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between border-b border-[#dedbd4] pb-3">
              <h3 className="font-black text-lg text-black">
                Top Power Consumers Today
              </h3>
              <span className="border border-[#dedbd4] bg-[#f8f6f0] px-2.5 py-0.5 font-mono text-[10px] text-[#555] font-bold">
                {showAllAppliances ? "9 of 9 active appliances" : "5 of 9 active appliances"}
              </span>
            </div>

            {/* Consumers Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#dedbd4] text-[10px] text-[#777] font-bold tracking-wider">
                    <th className="py-2">APPLIANCE</th>
                    <th className="py-2 text-center">HOURS USED</th>
                    <th className="py-2 text-center">POWER (KWH)</th>
                    <th className="py-2 text-center">COST (₹)</th>
                    <th className="py-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeae3]">
                  {displayedAppliances.map((app, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#faf8f4] transition-colors ${
                        app.isAnomaly ? "bg-[#fdfaff]" : ""
                      }`}
                    >
                      {/* Name & Subtitle */}
                      <td className="py-3 pr-2">
                        <div className="font-bold text-black">{app.name}</div>
                        <div
                          className={`text-[10px] ${
                            app.isAnomaly ? "text-[#7939E8] font-bold" : "text-[#777]"
                          }`}
                        >
                          {app.subtitle}
                        </div>
                      </td>

                      {/* Hours */}
                      <td
                        className={`py-3 text-center ${
                          app.isAnomaly ? "text-[#7939E8] font-bold" : "text-[#222]"
                        }`}
                      >
                        {app.hours}
                      </td>

                      {/* Power */}
                      <td
                        className={`py-3 text-center ${
                          app.isAnomaly ? "text-[#7939E8] font-bold" : "text-[#222]"
                        }`}
                      >
                        {app.powerKwh.toFixed(1)} kWh
                      </td>

                      {/* Cost */}
                      <td
                        className={`py-3 text-center ${
                          app.isAnomaly ? "text-[#7939E8] font-bold" : "text-[#222]"
                        }`}
                      >
                        ₹{app.costInr.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="py-3 text-right">
                        {app.status === "high_draw" && (
                          <span className="inline-block border border-[#d9c8fa] bg-[#f5efff] px-2 py-0.5 text-[10px] font-bold text-[#7939E8]">
                            ⚡ High Draw
                          </span>
                        )}
                        {app.status === "normal" && (
                          <span className="inline-block border border-[#dedbd4] bg-[#f0eee7] px-2 py-0.5 text-[10px] text-[#555]">
                            Normal
                          </span>
                        )}
                        {app.status === "possible_leak" && (
                          <span className="inline-block border border-[#7939E8] bg-white px-2 py-0.5 text-[10px] font-bold text-[#d97706]">
                            ⚠️ Possible Leak
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-[#dedbd4] pt-3 font-mono text-xs">
              <span className="text-[#777]">
                {showAllAppliances ? "Showing all 9 appliances" : "Showing top 5 energy consumers"}
              </span>
              <button
                type="button"
                onClick={() => setShowAllAppliances(!showAllAppliances)}
                className="font-bold text-black hover:text-[#7939E8] underline"
              >
                {showAllAppliances ? "← Show top 5 only" : "View all 9 appliances →"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: UNUSUAL ACTIVITY & SAVINGS TIPS (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* UNUSUAL ACTIVITY (2 ALERTS) CARD */}
            <div className="border-2 border-[#7939E8] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                <div className="flex items-center gap-2 font-black text-base text-black">
                  <span className="h-2 w-2 rounded-full bg-[#7939E8]" />
                  <span>Unusual Activity (2 Alerts)</span>
                </div>
                <span className="bg-[#7939E8] px-2 py-0.5 font-mono text-[9px] font-bold text-white">
                  NEEDS ATTENTION
                </span>
              </div>

              {/* Alert 1 */}
              <div className="mt-4 border border-[#dedbd4] bg-[#fcfbf8] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base text-[#7939E8]">🚿</span>
                    <div>
                      <strong className="block text-xs font-bold text-black font-mono">
                        Water Geyser ran for 2h 26m at night
                      </strong>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-bold text-[#d32f2f]">
                    +₹12 extra
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#55515a] leading-relaxed">
                  Active between 3:14 AM and 5:40 AM when no one was awake. Thermostat might be stuck.
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eee]">
                  <span className="text-xs text-[#7939E8] font-mono font-medium">
                    Action: Turn off or inspect thermostat
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveModalAlert("water_geyser")}
                    className="bg-[#7939E8] hover:bg-[#682ed4] text-white px-3 py-1 font-mono text-xs font-bold transition-colors"
                  >
                    Inspect Appliance
                  </button>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="mt-3 border border-[#dedbd4] bg-[#fcfbf8] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base text-[#7939E8]">❄️</span>
                    <div>
                      <strong className="block text-xs font-bold text-black font-mono">
                        Master Bed AC used 60% more power
                      </strong>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-bold text-[#d32f2f]">
                    +₹24 extra
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#55515a] leading-relaxed">
                  Higher draw between 1:20 PM and 2:45 PM. The compressor was turning on and off unusually often.
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eee]">
                  <span className="text-xs text-[#7939E8] font-mono font-medium">
                    Action: Check filters or temp setting
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveModalAlert("ac_surge")}
                    className="border border-[#7939E8] text-[#7939E8] hover:bg-[#f5efff] px-3 py-1 font-mono text-xs font-bold transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* TIPS TO SAVE MONEY CARD */}
            <div className="border border-[#dedbd4] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between border-b border-[#dedbd4] pb-3">
                <div className="flex items-center gap-2 font-black text-base text-black">
                  <span>💡</span>
                  <span>Tips to Save Money</span>
                </div>
                <span className="bg-[#e8f5e9] border border-[#c8e6c9] px-2 py-0.5 font-mono text-xs font-bold text-[#2e7d32]">
                  Save up to ₹410/mo
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {/* Tip 1 */}
                <div className="border border-[#dedbd4] bg-[#fcfbf8] p-3.5 flex gap-3 items-start">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center bg-black text-white font-mono text-xs font-bold">
                    1
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <strong className="font-mono text-xs text-black font-bold">
                        Shift Geyser heating to early morning
                      </strong>
                      <span className="font-mono text-xs font-bold text-[#2e7d32] shrink-0">
                        Save ~₹180/mo
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#55515a] leading-relaxed">
                      Heating before 6:00 AM avoids peak tariff hours and keeps hot water ready without daytime spikes.
                    </p>
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="border border-[#dedbd4] bg-[#fcfbf8] p-3.5 flex gap-3 items-start">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#dedbd4] bg-white text-black font-mono text-xs font-bold">
                    2
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <strong className="font-mono text-xs text-black font-bold">
                        Set AC to 24°C instead of 21°C
                      </strong>
                      <span className="font-mono text-xs font-bold text-[#2e7d32] shrink-0">
                        Save ~₹230/mo
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#55515a] leading-relaxed">
                      Increasing thermostat by just 3°C reduces compressor workload significantly without affecting comfort.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ANOMALY DIAGNOSTIC MODAL */}
      {activeModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="border-2 border-black bg-white max-w-lg w-full p-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eee] pb-3">
              <span className="font-bold text-sm text-black">
                {activeModalAlert === "water_geyser"
                  ? "ANOMALY AUDIT: WATER GEYSER (BATHROOM 1)"
                  : "ANOMALY AUDIT: MASTER BEDROOM AC SURGE"}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalAlert(null)}
                className="text-black font-bold text-lg hover:text-[#7939E8]"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="border border-[#e5a09b] bg-[#fff0f0] p-3 text-[#b82e2e]">
                {activeModalAlert === "water_geyser"
                  ? "CRITICAL: Continual heating duty cycle observed between 03:14 IST and 05:40 IST (Total: 2.4 kWh resistive load). Probable thermostat contact weld or pipe micro-leak."
                  : "WARNING: High compressor cycling frequency (14 cycle events/hour). Air filter particulate resistance or low refrigerant pressure suspected."}
              </div>

              <div className="bg-[#f8f6f0] p-3 border border-[#dedbd4] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#666]">Appliance:</span>
                  <span className="font-bold text-black">
                    {activeModalAlert === "water_geyser" ? "Water Geyser (25L Storage)" : "AC (1.5T Split Dual Inverter)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Timestamp:</span>
                  <span className="font-bold text-black">Today, 03:14 AM - 05:40 AM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Excess Cost:</span>
                  <span className="font-bold text-[#d32f2f]">
                    {activeModalAlert === "water_geyser" ? "+₹12.00 (Unnecessary Run)" : "+₹24.00 (Efficiency Loss)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#eee]">
              <button
                type="button"
                onClick={() => {
                  alert("Remote relay command sent: Power circuit cycled.");
                  setActiveModalAlert(null);
                }}
                className="border border-black px-4 py-2 hover:bg-[#f0ece1]"
              >
                CYCLE CIRCUIT BREAKER
              </button>
              <button
                type="button"
                onClick={() => {
                  setToastMessage("✓ Diagnostic report filed and alert acknowledged.");
                  setActiveModalAlert(null);
                }}
                className="bg-[#7939E8] text-white px-4 py-2 font-bold hover:bg-[#682ed4]"
              >
                ACKNOWLEDGE &amp; DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
