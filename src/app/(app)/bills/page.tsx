"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";

interface AnomalyItem {
  id: string;
  title: string;
  description: string;
  applianceTag: string;
  timeWindow: string;
  excessCostInr: number;
  estimatedExcessKwh: number;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "investigating" | "resolved" | "ignored";
  recommendedAction: string;
  createdAt: string;
}

export default function BillAndAnomaliesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "estimator" | "anomalies">("all");
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [activeCount, setActiveCount] = useState<number>(2);
  const [totalExcessCost, setTotalExcessCost] = useState<number>(63.4);
  const [loading, setLoading] = useState<boolean>(true);
  const [budgetCap, setBudgetCap] = useState<number>(4500);
  const [projectedUnits, setProjectedUnits] = useState<number>(420);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Fetch anomalies from backend / Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.anomalies.list();
        if (res && res.data) {
          setAnomalies(res.data.anomalies || []);
          setActiveCount(res.data.summary?.activeCount ?? 2);
          setTotalExcessCost(res.data.summary?.totalExcessCostInr ?? 63.4);
        }
      } catch (err) {
        console.warn("Could not load anomalies from API, using fallback state:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      setResolvingId(id);
      await api.anomalies.resolve(id);
      setAnomalies((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a))
      );
      setActiveCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to resolve anomaly:", err);
      // Optimistic update
      setAnomalies((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a))
      );
      setActiveCount((prev) => Math.max(0, prev - 1));
    } finally {
      setResolvingId(null);
    }
  };

  // Tariff calculation for Tata Power Mumbai slab
  const calculateBill = (units: number) => {
    let energyCharge = 0;
    if (units <= 100) {
      energyCharge = units * 3.25;
    } else if (units <= 300) {
      energyCharge = 100 * 3.25 + (units - 100) * 7.45;
    } else if (units <= 500) {
      energyCharge = 100 * 3.25 + 200 * 7.45 + (units - 300) * 10.15;
    } else {
      energyCharge = 100 * 3.25 + 200 * 7.45 + 200 * 10.15 + (units - 500) * 12.5;
    }
    const fixedDemand = 135;
    const fac = units * 0.45;
    const duty = (energyCharge + fixedDemand + fac) * 0.16;
    const total = energyCharge + fixedDemand + fac + duty;

    return {
      energyCharge: Math.round(energyCharge),
      fixedDemand,
      fac: Math.round(fac),
      duty: Math.round(duty),
      total: Math.round(total),
    };
  };

  const billCalc = calculateBill(projectedUnits);
  const budgetUtilization = Math.min(100, Math.round((billCalc.total / budgetCap) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] text-[#111111]">
      {/* TOP HEADER BAR */}
      <header className="h-[65px] border-b border-[#dedbd4] bg-[#fcf9f2] px-6 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs text-[#55515a]">
          <span className="font-bold text-black text-sm">Bill Estimator &amp; Anomalies</span>
          <span className="text-[#a09c95]">●</span>
          <span className="text-[#727782]">Financial Projections &amp; Leak Diagnostic</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-[#d5d0c8] bg-white px-3 py-1 font-mono text-xs text-[#222] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span>Tata Power Mumbai (TPC-M)</span>
          </div>

          {/* User Circle Avatar with Interactive Profile Dropdown */}
          <UserProfileMenu />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 px-6 sm:px-8 py-7 space-y-7 max-w-[1500px] w-full mx-auto">
        {/* TITLE & TABS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-1px] text-black">
              Bill Estimator &amp; Anomalies
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#666]">
              Real-time tariff projection, monthly budget tracking, and automated leak detection.
            </p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center border border-[#dedbd4] bg-white p-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 font-bold transition-colors ${
                activeTab === "all" ? "bg-black text-white" : "text-[#666] hover:text-black"
              }`}
            >
              All Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("estimator")}
              className={`px-3 py-1 font-bold transition-colors ${
                activeTab === "estimator" ? "bg-black text-white" : "text-[#666] hover:text-black"
              }`}
            >
              Bill Estimator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("anomalies")}
              className={`px-3 py-1 font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "anomalies" ? "bg-black text-white" : "text-[#666] hover:text-black"
              }`}
            >
              <span>Active Anomalies</span>
              {activeCount > 0 && (
                <span className="bg-[#7939E8] text-white text-[9px] px-1 py-0.2 rounded">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Projected Bill */}
          <div className="border border-[#dedbd4] bg-white p-4 shadow-sm">
            <div className="font-mono text-[10px] font-bold text-[#727782] tracking-wider uppercase">
              PROJECTED MONTH BILL
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-black font-mono">
                ₹{billCalc.total.toLocaleString()}
              </span>
              <span className="text-xs text-[#727782] font-mono">
                / ₹{budgetCap.toLocaleString()} cap
              </span>
            </div>
            <div className="mt-3 w-full bg-[#eee] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  budgetUtilization > 90 ? "bg-red-500" : "bg-[#7939E8]"
                }`}
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-[#666]">
              <span>{budgetUtilization}% of budget</span>
              <span className="text-[#10b981] font-bold">₹{Math.max(0, budgetCap - billCalc.total)} margin</span>
            </div>
          </div>

          {/* Card 2: Active Anomalies */}
          <div className="border border-[#dedbd4] border-l-4 border-l-[#7939E8] bg-white p-4 shadow-sm">
            <div className="font-mono text-[10px] font-bold text-[#727782] tracking-wider uppercase flex items-center justify-between">
              <span>ACTIVE ANOMALIES</span>
              <span className="bg-[#7939E8] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                {activeCount} ALERTS
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#dc2626] font-mono">
                +₹{totalExcessCost.toFixed(0)}
              </span>
              <span className="text-xs text-[#727782] font-mono">estimated waste</span>
            </div>
            <p className="mt-3 text-xs text-[#555] font-mono">
              2 appliances exceeding nominal runtime profile.
            </p>
          </div>

          {/* Card 3: Tariff Tier */}
          <div className="border border-[#dedbd4] bg-white p-4 shadow-sm">
            <div className="font-mono text-[10px] font-bold text-[#727782] tracking-wider uppercase">
              ACTIVE TARIFF SLAB
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-black font-mono">
                ₹7.45
              </span>
              <span className="text-xs text-[#727782] font-mono">/ kWh</span>
            </div>
            <div className="mt-3 font-mono text-xs text-[#555]">
              Tier 2: 101 – 300 Units (Residential LT-1)
            </div>
          </div>

          {/* Card 4: Forecast Units */}
          <div className="border border-[#dedbd4] bg-white p-4 shadow-sm">
            <div className="font-mono text-[10px] font-bold text-[#727782] tracking-wider uppercase">
              FORECAST CONSUMPTION
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-black font-mono">
                {projectedUnits}
              </span>
              <span className="text-xs text-[#727782] font-mono">kWh / month</span>
            </div>
            <div className="mt-3 font-mono text-xs text-[#10b981] font-bold">
              ● 8.4% lower than last cycle
            </div>
          </div>
        </div>

        {/* SECTION 1: ACTIVE ANOMALIES (SHOWN IN 'all' AND 'anomalies') */}
        {(activeTab === "all" || activeTab === "anomalies") && (
          <section className="border border-[#dedbd4] border-l-4 border-l-[#7939E8] bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <h2 className="font-bold text-base text-black">
                  Active Consumption Anomalies &amp; Off-Peak Leaks
                </h2>
              </div>
              <span className="font-mono text-xs text-[#7939E8] font-bold">
                {activeCount} Requiring Action
              </span>
            </div>

            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`border p-4 transition-colors ${
                    anomaly.status === "resolved"
                      ? "border-[#d1d5db] bg-[#f9fafb] opacity-60"
                      : "border-[#e7e3da] bg-[#faf8f3]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-black">
                          {anomaly.title}
                        </span>
                        <span
                          className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                            anomaly.severity === "high"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {anomaly.severity}
                        </span>
                        <span className="font-mono text-xs text-[#666]">
                          • {anomaly.applianceTag}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-[#555] leading-relaxed max-w-3xl">
                        {anomaly.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono">
                        <span className="text-sm font-black text-[#dc2626] block">
                          +₹{anomaly.excessCostInr}
                        </span>
                        <span className="text-[10px] text-[#727782]">
                          ~{anomaly.estimatedExcessKwh} kWh excess
                        </span>
                      </div>

                      {anomaly.status !== "resolved" ? (
                        <button
                          type="button"
                          disabled={resolvingId === anomaly.id}
                          onClick={() => handleResolve(anomaly.id)}
                          className="px-3 py-1.5 bg-[#7939E8] hover:bg-[#682cd1] text-white font-mono text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
                        >
                          {resolvingId === anomaly.id ? "Resolving..." : "Resolve"}
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-bold text-[#10b981] flex items-center gap-1">
                          ✓ Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#ede9df] flex flex-wrap items-center justify-between text-xs font-mono text-[#666]">
                    <div>
                      <strong className="text-black">Recommended Action:</strong>{" "}
                      <span>{anomaly.recommendedAction}</span>
                    </div>
                    <div className="text-[#888]">{anomaly.timeWindow}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: BILL ESTIMATOR & TARIFF SLAB CALCULATOR (SHOWN IN 'all' AND 'estimator') */}
        {(activeTab === "all" || activeTab === "estimator") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left: Interactive Slab Calculator */}
            <div className="lg:col-span-7 border border-[#dedbd4] bg-white p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <h2 className="font-bold text-base text-black">
                    Tata Power Mumbai Tariff Slab Breakdown
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#555]">
                  Sanctioned Load: 5.0 kW
                </span>
              </div>

              {/* Monthly Units Slider */}
              <div className="bg-[#faf8f3] border border-[#e7e3da] p-4 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="units-slider" className="font-bold text-black">SIMULATE MONTHLY UNITS (KWH)</label>
                  <span className="text-sm font-bold text-[#7939E8]">
                    {projectedUnits} kWh
                  </span>
                </div>
                <input
                  id="units-slider"
                  type="range"
                  min="100"
                  max="1000"
                  step="10"
                  value={projectedUnits}
                  onChange={(e) => setProjectedUnits(Number(e.target.value))}
                  className="w-full accent-[#7939E8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#888]">
                  <span>100 kWh (Low)</span>
                  <span>420 kWh (Typical)</span>
                  <span>1,000 kWh (Heavy Summer)</span>
                </div>
              </div>

              {/* Slabs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border border-[#eee]">
                  <thead className="bg-[#faf8f3] border-b border-[#dedbd4] text-[#666] text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Consumption Tier</th>
                      <th className="p-3">Base Rate</th>
                      <th className="p-3">Units In Tier</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee]">
                    <tr>
                      <td className="p-3 font-bold text-black">0 – 100 kWh</td>
                      <td className="p-3 text-[#555]">₹3.25 / unit</td>
                      <td className="p-3 text-[#555]">
                        {Math.min(projectedUnits, 100)} kWh
                      </td>
                      <td className="p-3 text-right font-bold text-black">
                        ₹{(Math.min(projectedUnits, 100) * 3.25).toFixed(0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-black">101 – 300 kWh</td>
                      <td className="p-3 text-[#555]">₹7.45 / unit</td>
                      <td className="p-3 text-[#555]">
                        {Math.max(0, Math.min(projectedUnits - 100, 200))} kWh
                      </td>
                      <td className="p-3 text-right font-bold text-black">
                        ₹{(Math.max(0, Math.min(projectedUnits - 100, 200)) * 7.45).toFixed(0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-black">301 – 500 kWh</td>
                      <td className="p-3 text-[#555]">₹10.15 / unit</td>
                      <td className="p-3 text-[#555]">
                        {Math.max(0, Math.min(projectedUnits - 300, 200))} kWh
                      </td>
                      <td className="p-3 text-right font-bold text-black">
                        ₹{(Math.max(0, Math.min(projectedUnits - 300, 200)) * 10.15).toFixed(0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-black">&gt; 500 kWh</td>
                      <td className="p-3 text-[#555]">₹12.50 / unit</td>
                      <td className="p-3 text-[#555]">
                        {Math.max(0, projectedUnits - 500)} kWh
                      </td>
                      <td className="p-3 text-right font-bold text-black">
                        ₹{(Math.max(0, projectedUnits - 500) * 12.5).toFixed(0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Estimated Bill Invoice Breakdown */}
            <div className="lg:col-span-5 border border-[#dedbd4] bg-white p-5 sm:p-6 shadow-sm space-y-5 font-mono">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧾</span>
                  <h3 className="font-bold text-sm text-black">
                    Estimated Billing Receipt
                  </h3>
                </div>
                <span className="text-[10px] text-[#727782] font-bold">
                  OCT 2026 CYCLE
                </span>
              </div>

              <div className="space-y-3 text-xs divide-y divide-[#eee]">
                <div className="flex justify-between pt-1">
                  <span className="text-[#666]">Energy Charges</span>
                  <span className="font-bold text-black">₹{billCalc.energyCharge}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#666]">Fixed Demand Charge (5 kW)</span>
                  <span className="font-bold text-black">₹{billCalc.fixedDemand}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#666]">Fuel Adjustment Charge (FAC)</span>
                  <span className="font-bold text-black">₹{billCalc.fac}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#666]">Electricity Duty (16%)</span>
                  <span className="font-bold text-black">₹{billCalc.duty}</span>
                </div>
                <div className="flex justify-between pt-3 text-sm border-t-2 border-black">
                  <strong className="text-black font-black">ESTIMATED TOTAL</strong>
                  <strong className="text-black font-black text-base">
                    ₹{billCalc.total}
                  </strong>
                </div>
              </div>

              {/* Energy Saving Opportunity */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3 text-xs text-[#166534]">
                <span className="font-bold block">💡 Tariff Optimization Tip:</span>
                Keeping monthly consumption below 300 units avoids the higher ₹10.15/kWh third tier, saving an estimated ₹540/month.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
