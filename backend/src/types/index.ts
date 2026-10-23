export type HousingType = 'apartment' | 'independent_house' | 'villa' | 'penthouse';
export type PhaseType = 'single_phase' | 'three_phase';
export type TariffStructure = 'flat' | 'slab';
export type TelemetrySource = 'dataset_historical' | 'virtual_simulator' | 'physical_sensors';
export type ApplianceStatus = 'normal' | 'high_draw' | 'possible_leak';
export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';
export type AnomalyStatus = 'active' | 'investigating' | 'resolved' | 'ignored';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  nodeId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisteredUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  nodeId: string;
  createdAt: string;
}

export interface Household {
  id: string;
  profileId: string;
  residenceName: string;
  residentsCount: number;
  city: string;
  state: string;
  housingType: HousingType;
  sanctionedLoadKw: number;
  phaseType: PhaseType;
  
  // Tariff
  discomName: string;
  discomCode: string;
  tariffStructure: TariffStructure;
  baseTariffInr: number;
  monthlyBudgetInr: number;

  // Telemetry
  telemetrySource: TelemetrySource;
  hardwareBridgeConnected: boolean;
  hardwareNodeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appliance {
  id: string;
  householdId: string;
  name: string;
  specification?: string;
  roomLocation?: string;
  category: string;
  count: number;
  wattage: number;
  hoursPerDay: number;
  dailyKwh: number;
  monthlyCostInr?: number;
  dataSource?: string;
  icon: string;
  status: ApplianceStatus;
  statusLabel?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryLog {
  id: string;
  householdId: string;
  timestamp: string;
  date: string;
  dayLabel: string;
  energyKwh: number;
  typicalBaselineKwh: number;
  costInr: number;
  peakPowerWatts: number;
  isAnomalous: boolean;
  anomalyReason?: string | null;
}

export interface Anomaly {
  id: string;
  householdId: string;
  title: string;
  description: string;
  applianceTag: string;
  timeWindow: string;
  excessCostInr: number;
  estimatedExcessKwh: number;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  recommendedAction: string;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface TelemetryOverview {
  todayUsageKwh: number;
  todayCostInr: number;
  projectedMonthBillInr: number;
  alertsCount: number;
  baselineKwh: number;
  budgetCapInr: number;
  budgetUtilizationPct: number;
  hardwareStatus: {
    connected: boolean;
    nodeId: string;
    protocol: string;
    syncLatencyMs: number;
  };
}

export interface SimulatorConfig {
  baseWatts: number;
  voltageMin: number;
  voltageMax: number;
  noisePct: number;
  surgeMultiplier: number;
  samplingIntervalSec: number;
}

export interface TrainedModel {
  architecture: string;
  datasetName: string;
  totalRecords: number;
  epochs: number;
  finalLoss: number;
  r2Accuracy: number;
  mape: number;
  calibratedBaselineKwh: number;
  surgeAnomalyThresholdKwh: number;
  trainedAt: string;
  status: 'untrained' | 'training' | 'trained';
  applianceWeights: Record<string, number>;
}

export interface EpochLog {
  epoch: number;
  loss: number;
  r2: number;
  stage: string;
}

export interface UserSettings {
  demoMode: boolean;
  telemetrySource: TelemetrySource;
  hardwareNodeId: string;
  hardwareBridgeConnected: boolean;
  alertOvernight: boolean;
  alertMultiHeavy: boolean;
  alertPowerSpikes: boolean;
  receiveEmail: boolean;
  emailAddress: string;
  receiveWhatsApp: boolean;
  phoneNumber: string;
  receiveBrowser: boolean;
  operatorName: string;
  operatorRole: string;
  residenceName: string;
  isCloudSynced?: boolean;
}

export interface UserCredentialRecord {
  id?: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  residenceName?: string;
  housingType?: string;
  sanctionedLoadKw?: number;
  discomName?: string;
  tariffStructure?: string;
  monthlyBudgetInr?: number;
  signupDetails?: Record<string, any>;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}


