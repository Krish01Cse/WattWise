/**
 * WATTWISE CALIBRATION SYSTEM CONFIGURATION
 */
export const TELEMETRY_CONFIG = {
  standard: "IEC 62053-21",
  accuracyClass: "1.0",
  nominalVoltageVolts: 230,
  nominalFrequencyHz: 50.0,
  voltageTolerancePct: 10.0, // ±10% per Indian Electricity Rules
  defaultBaselineDailyKwh: 11.40,
  defaultBudgetInr: 4500,
  defaultTariffInr: 7.50,
  samplingRateSeconds: 1,
  nilmModelVersion: "2.4.0",
} as const;
