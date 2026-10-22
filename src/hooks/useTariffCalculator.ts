"use client";

import { useMemo } from "react";
import { calculateSlabBill } from "@/lib/energyFormulas";

export function useTariffCalculator(
  dailyKwh: number,
  baseRateInr: number,
  mode: "FLAT" | "SLAB" = "FLAT",
  budgetCapInr: number = 4500
) {
  return useMemo(() => {
    const monthlyKwh = Number((dailyKwh * 30).toFixed(1));
    const projectedMonthlyBill =
      mode === "FLAT" ? Math.round(monthlyKwh * baseRateInr) : calculateSlabBill(monthlyKwh, baseRateInr);

    const varianceInr = projectedMonthlyBill - budgetCapInr;
    const isOverBudget = varianceInr > 0;
    const utilizationPct = Math.min(100, Math.round((projectedMonthlyBill / budgetCapInr) * 100));

    return {
      monthlyKwh,
      projectedMonthlyBill,
      varianceInr: Math.abs(varianceInr),
      isOverBudget,
      utilizationPct,
    };
  }, [dailyKwh, baseRateInr, mode, budgetCapInr]);
}
