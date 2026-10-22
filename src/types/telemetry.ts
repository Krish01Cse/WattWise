export type TelemetrySourceType = 'historical_preloaded' | 'custom_upload' | 'virtual_simulator' | 'hardware_bridge';

export interface DatasetMetadata {
  name: string;
  rowCount: number;
  dateSpan: string;
  samplingIntervalMinutes: number;
  features: string[];
  inferredApplianceTypes: string[];
}

export interface NilmInferenceResult {
  householdId: string;
  timestamp: string;
  aggregatePowerWatts: number;
  disaggregatedLoads: {
    applianceName: string;
    powerWatts: number;
    probabilityScore: number;
  }[];
  isAnomalous: boolean;
  anomalyConfidenceScore?: number;
}
