# WattWise System Architecture
## IEC 62053-21 Compliant Household Energy Intelligence Platform

---

### 1. Architectural Layers

```
┌────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER                    │
│      Next.js 16 (App Router + Turbopack + React 19)    │
│  • Public Landing (/)          • Setup Wizard (/setup) │
│  • Auth Portal (/auth)         • Overview (/dashboard) │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON & WebSockets
┌──────────────────────────▼─────────────────────────────┐
│                    DATA ENGINE TIER                    │
│          Express.js 4.21 + TypeScript Microservice     │
│  • /api/auth           • /api/telemetry                │
│  • /api/households     • /api/anomalies                │
│  • /api/appliances     • /api/reference                │
└──────────────────────────┬─────────────────────────────┘
                           │ PostgreSQL Wire / Realtime
┌──────────────────────────▼─────────────────────────────┐
│                   PERSISTENCE TIER                     │
│               Supabase PostgreSQL + RLS                │
│  • profiles            • telemetry_logs                │
│  • households          • anomalies                     │
│  • appliances          • rate_schedules                │
└────────────────────────────────────────────────────────┘
```

---

### 2. Telemetry Ingestion Modes

1. **Pre-calibrated Historical Baseline**: 90-day 8,640-row dataset capturing AC inrush currents and holiday variations.
2. **Virtual Stochastic Node**: WebSocket/HTTP simulator generating RMS current, active power, and reactive harmonics.
3. **Hardware Bridge**: ESP32 + PZEM-004T split-core CT sensor broadcasting via MQTT / RS-485 Modbus.
