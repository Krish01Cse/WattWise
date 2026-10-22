/**
 * WATTWISE FRONTEND TELEMETRY API CLIENT
 * Connects to the Express & Supabase backend at http://localhost:5001/api
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => fetchJson<{ status: string; uptimeSeconds: number }>('/health'),

  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchJson<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    signup: (data: { email: string; password: string; fullName?: string }) =>
      fetchJson<any>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMe: () => fetchJson<any>('/auth/me'),
  },

  // Household & Wizard Setup
  household: {
    getCurrent: () => fetchJson<any>('/households/current'),
    update: (updates: any) =>
      fetchJson<any>('/households/current', {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    completeSetup: (payload: any) =>
      fetchJson<any>('/households/setup', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Appliances
  appliances: {
    list: () => fetchJson<any>('/appliances'),
    add: (appliance: any) =>
      fetchJson<any>('/appliances', {
        method: 'POST',
        body: JSON.stringify(appliance),
      }),
    remove: (id: string) =>
      fetchJson<any>(`/appliances/${id}`, {
        method: 'DELETE',
      }),
  },

  // Telemetry & Monitoring
  telemetry: {
    getOverview: () => fetchJson<any>('/telemetry/overview'),
    getHistory: (range: string = '7D') => fetchJson<any>(`/telemetry/history?range=${range}`),
    getLive: () => fetchJson<any>('/telemetry/live'),
    record: (reading: { energyKwh: number; peakPowerWatts?: number; date?: string }) =>
      fetchJson<any>('/telemetry/record', {
        method: 'POST',
        body: JSON.stringify(reading),
      }),
    uploadDataset: (payload: { name?: string; csvContent?: string; totalRecords?: number; dataSourceType?: string }) =>
      fetchJson<any>('/telemetry/upload-dataset', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    configureSimulator: (params: {
      baseWatts?: number;
      voltageMin?: number;
      voltageMax?: number;
      noisePct?: number;
      surgeMultiplier?: number;
      samplingIntervalSec?: number;
    }) =>
      fetchJson<any>('/telemetry/configure-simulator', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    trainModel: (payload: { datasetName?: string; totalRecords?: number; epochs?: number; customWeights?: Record<string, number> }) =>
      fetchJson<any>('/telemetry/train-model', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getModelStatus: () => fetchJson<any>('/telemetry/model-status'),
  },

  // Anomalies
  anomalies: {
    list: () => fetchJson<any>('/anomalies'),
    resolve: (id: string) =>
      fetchJson<any>(`/anomalies/${id}/resolve`, {
        method: 'POST',
      }),
  },

  // Reports
  reports: {
    getExportUrl: (range: string = '7D') => `${API_BASE_URL}/reports/export?range=${range}&format=csv`,
  },

  // Reference lookups
  reference: {
    getCities: (search?: string) =>
      fetchJson<any>(`/reference/cities${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    getDiscoms: (city?: string, state?: string) =>
      fetchJson<any>(
        `/reference/discoms?city=${encodeURIComponent(city || '')}&state=${encodeURIComponent(state || '')}`
      ),
  },
};
