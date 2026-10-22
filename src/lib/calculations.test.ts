import { calculateApplianceDailyKwh, calculateSlabBill, calculatePowerMetrics } from "./energyFormulas";

describe("WattWise Telemetry Formula Tests", () => {
  test("calculateApplianceDailyKwh computes 1450W AC @ 8h correctly", () => {
    const kwh = calculateApplianceDailyKwh(2, 1450, 8);
    expect(kwh).toBe(23.2);
  });

  test("calculateSlabBill computes progressive tiered tariff", () => {
    const bill = calculateSlabBill(350, 7.5);
    expect(bill).toBeGreaterThan(0);
  });

  test("calculatePowerMetrics computes apparent and reactive power", () => {
    const metrics = calculatePowerMetrics(230, 10, 0.95);
    expect(metrics.apparentVa).toBe(2300);
    expect(metrics.activeWatts).toBe(2185);
  });
});
