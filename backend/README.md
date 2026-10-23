# ⚡ WATTWISE BACKEND API
### Household Energy Intelligence Platform Engine
*Standard: IEC 62053-21 Class 1.0/2.0 Static Watt-hour Accuracy*

---

## 📌 Overview

`wattwise-backend` is the dedicated Express.js & TypeScript microservice powering the **WattWise** energy monitoring platform. It implements data ingestion, load decomposition, regional Indian tariff computation (Flat & Slab tiers), anomaly detection, and real-time telemetry streaming backed by **Supabase PostgreSQL**.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Copy the example environment configuration:
```bash
cp .env.example .env
```

If you have a Supabase project, supply your credentials in `.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
> **Note**: Even without Supabase keys set up yet, the backend automatically boots with an **in-memory telemetry store** pre-seeded with identical data matching your frontend!

### 3. Supabase Database Setup
1. Open your project on [Supabase.com](https://supabase.com).
2. Go to **SQL Editor**.
3. Copy and run the entire content of [`supabase/schema.sql`](supabase/schema.sql).
4. This creates all tables (`profiles`, `households`, `appliances`, `telemetry_logs`, `anomalies`), creates indexes, sets RLS policies, and inserts default demo records.

### 4. Run Development Server
```bash
npm run dev
```
The server will boot on **`http://localhost:5001`**.

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/signup` - Register a new operator node with email and cipher.
* `POST /api/auth/login` - Authenticate operator and receive session token.
* `GET /api/auth/me` - Fetch authenticated operator profile & active household link.

### 🏡 Household Setup & Tariff (`/api/households`)
* `GET /api/households/current` - Retrieve active household profile, phase, and DISCOM tariff.
* `PUT /api/households/current` - Update household parameters.
* `POST /api/households/setup` - Ingest 4-stage wizard payload (Residence details, DISCOM choice, tariffs, appliances, and telemetry bridge mode).

### 🔌 Connected Loads & Appliances (`/api/appliances`)
* `GET /api/appliances` - List all connected appliances with wattage, duty cycles, daily kWh, and load status (`high_draw`, `normal`, `possible_leak`).
* `POST /api/appliances` - Ingest a new custom appliance (e.g. EV charger, induction hob).
* `DELETE /api/appliances/:id` - Remove appliance from decomposition model.

### 📊 Telemetry & Real-Time Monitoring (`/api/telemetry`)
* `GET /api/telemetry/overview` - Real-time executive metrics: Today's Usage (kWh), Today's Cost (₹), Projected Month Bill (₹), Needs Attention Alerts count, and budget cap utilization.
* `GET /api/telemetry/history?range=7D` - 7-day daily series (15 Oct to 21 Oct) with baseline (`11.4 kWh`) and anomaly tags for chart rendering.
* `GET /api/telemetry/live` - Sub-second live instantaneous power (Watts, Amps, Volts, Hz, Power Factor).
* `POST /api/telemetry/record` - Ingest hardware packet from ESP32 / PZEM-004T bridge.

### ⚠️ Anomaly Detection & Alerts (`/api/anomalies`)
* `GET /api/anomalies` - Active energy anomaly alerts (e.g., Water geyser 3 AM night leak, AC compressor cycling surge) with excess cost calculations.
* `POST /api/anomalies/:id/resolve` - Acknowledge and resolve an anomaly alert.

### 📥 Reports & Export (`/api/reports`)
* `GET /api/reports/export?range=7D&format=csv` - Generate and download `.csv` energy report matching frontend `EXPORT REPORT` button.

### 🗺️ Reference Data (`/api/reference`)
* `GET /api/reference/cities?search=mumbai` - 100+ Indian cities across all states and UTs.
* `GET /api/reference/discoms?city=Mumbai` - Regional distribution utilities (Adani, Tata Power, BESCOM, BSES, etc.) and tariff slabs.

---

## 🛠️ Verification & Testing
Test the health check endpoint:
```bash
curl http://localhost:5000/api/health
```
