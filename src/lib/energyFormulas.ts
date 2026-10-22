/**
 * WATTWISE ENERGY MATHEMATICAL FORMULAS
 * Standard: IEC 62053-21 Static Watt-hour Meter Calculations
 */

/**
 * Calculates daily kilowatt-hours for a single electrical device
 */
export function calculateApplianceDailyKwh(count: number, wattage: number, hoursPerDay: number): number {
  if (count <= 0 || wattage <= 0 || hoursPerDay <= 0) return 0;
  return Number(((count * wattage * hoursPerDay) / 1000).toFixed(3));
}

/**
 * Calculates progressive multi-tier Indian slab billing
 * @param totalMonthlyKwh Total energy in kWh
 * @param baseTariff Base rate in INR/kWh
 */
export function calculateSlabBill(totalMonthlyKwh: number, baseTariff: number): number {
  if (totalMonthlyKwh <= 0 || baseTariff <= 0) return 0;
  let remaining = totalMonthlyKwh;
  let bill = 0;

  // Tier 1: 0 - 100 kWh (75% base)
  const tier1 = Math.min(remaining, 100);
  bill += tier1 * (baseTariff * 0.75);
  remaining -= tier1;

  // Tier 2: 101 - 300 kWh (95% base)
  if (remaining > 0) {
    const tier2 = Math.min(remaining, 200);
    bill += tier2 * (baseTariff * 0.95);
    remaining -= tier2;
  }

  // Tier 3: 301 - 500 kWh (115% base)
  if (remaining > 0) {
    const tier3 = Math.min(remaining, 200);
    bill += tier3 * (baseTariff * 1.15);
    remaining -= tier3;
  }

  // Tier 4: > 500 kWh (135% base)
  if (remaining > 0) {
    bill += remaining * (baseTariff * 1.35);
  }

  return Math.round(bill);
}

/**
 * Calculates instantaneous apparent and reactive power
 */
export function calculatePowerMetrics(volts: number, amps: number, powerFactor: number) {
  const apparentVa = Number((volts * amps).toFixed(2));
  const activeWatts = Number((apparentVa * powerFactor).toFixed(2));
  const sinPhi = Math.sqrt(Math.max(0, 1 - powerFactor * powerFactor));
  const reactiveVar = Number((apparentVa * sinPhi).toFixed(2));
  return { apparentVa, activeWatts, reactiveVar };
}
