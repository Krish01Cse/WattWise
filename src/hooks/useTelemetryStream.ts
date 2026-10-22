"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface LiveTelemetryReading {
  voltageVolts: number;
  currentAmps: number;
  activePowerWatts: number;
  frequencyHz: number;
  powerFactor: number;
  timestamp: string;
}

export function useTelemetryStream(pollIntervalMs: number = 3000) {
  const [reading, setReading] = useState<LiveTelemetryReading>({
    voltageVolts: 230.4,
    currentAmps: 8.02,
    activePowerWatts: 1850,
    frequencyHz: 50.01,
    powerFactor: 0.96,
    timestamp: new Date().toISOString(),
  });
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLive() {
      try {
        const response = await api.telemetry.getLive();
        if (isMounted && response?.data) {
          setReading(response.data);
          setIsConnected(true);
        }
      } catch (err) {
        if (isMounted) setIsConnected(false);
      }
    }

    const interval = setInterval(fetchLive, pollIntervalMs);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollIntervalMs]);

  return { reading, isConnected };
}
