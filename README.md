<div align="center">

# ⚡ WATTWISE
### Household Energy Intelligence Platform
*Know your power. Before the bill.*

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Compliance-IEC_62053--21-7939E8?style=for-the-badge)](https://www.iec.ch/)

---
</div>

## 📌 Executive Overview

**WattWise** is a high-precision, industrial-grade residential energy intelligence platform designed to disaggregate electrical loads, monitor consumption profiles in real-time, detect micro-anomalies, and forecast electricity billing across regional Indian utility structures before the meter bill is generated.

Built with an **instrument-panel aesthetic**, WattWise pairs high-contrast monospace telemetry readouts with creamy off-white tones, dense structural layouts, and deep violet accent signatures (`#7939E8`).

---

## 🎨 Visual Language & Design System

* **Base Canvas**: Warm creamy off-white (`#FCF9F2` / `#ECE8DE`)
* **Surfaces & Borders**: High-contrast black (`#111111`) panels, instrument frames, and borders (`#DEDBD4` / `#D5D0C8`)
* **Telemetry Accents**: Vivid electric violet (`#7939E8`) for anomalous spikes, active states, and real-time markers
* **Typography**: Heavy condensed geometric headings paired with monospace status identifiers and instrument readouts
* **System Metrics**: Compliance markers matching `IEC 62053-21` accuracy standards for static electricity meters

---

## 🚀 Key Modules & Architecture

### 1. Landing Interface (`/`)
* **Live 24-Hour Telemetry Profile**: Interactive continuous curve illustrating baseline residential loads against critical outlier spikes (e.g., peak surge events at 14:20 IST).
* **Operational Protocol (4-Stage Pipeline)**:
  * `01 // HARDWARE MEASURE`: Sub-100ms hardware telemetry delay.
  * `02 // MODELING ANALYZE`: High-resolution machine learning disaggregation.
  * `03 // ACTIVE ALERT`: Real-time anomaly interception.
  * `04 // AUDIT SAVE`: Targeted 28% run-rate efficiency optimization.

### 2. Authentication Gateway (`/auth` & `/auth/signup`)
* Encrypted Node ID session authorization (`AUTH.PORTAL // NODE #4092`).
* Access key / cipher authentication with real-time length and validation checks.
* Optional hardware-token bus integration (`IEC 62053-21 compliant`).
* Smooth session switching between Operator Log In and New Node Registration.

### 3. 4-Stage Household Setup Wizard (`/setup`)
* **Step 1 // Household Profile**:
  * Household nickname identification (e.g. *Bandra Residence*).
  * Resident occupancy selector (`1`, `2`, `3`, `4`, `5+`).
  * Comprehensive Indian geographic coverage: **100+ cities** across all 28 states and 8 union territories with searchable autocomplete.
  * Housing typology selection: *Apartment*, *Independent House*, *Villa*, *Penthouse / Duplex*.
  * Sanctioned load stepper (`1.0` to `50.0 kW`) and connection type (*Single Phase* / *Three Phase*).
* **Step 2 // Tariff & Rate Specification**:
  * **Dynamic City-to-DISCOM Resolution**: Automatic mapping to local distribution companies (e.g., Adani Electricity Mumbai Ltd, Tata Power, BESCOM, BSES Rajdhani/Yamuna, TANGEDCO, TSSPDCL, MSEDCL, CESC, Torrent Power, etc.).
  * **Billing Rate Architecture**: Toggle between *Flat Rate Computation* and progressive *Slab-Based Tiered* modeling (`0-100`, `101-300`, `301-500`, `>500 kWh`).
  * **Projected Envelope vs. Cap**: Real-time gauge comparing baseline run-rates against user monthly budgets with variance indicators (`EXCEEDS BUDGET (+₹2631)`).
* **Step 3 // Connected Loads Decomposition**:
  * Pre-calibrated multi-appliance breakdown:
    * Dual Inverter ACs (1450W, 60% compressor duty)
    * Frost-Free Refrigerators (180W, 24/7 cyclic)
    * BLDC Ceiling Fans (32W, multi-room)
    * Storage Geysers (2000W, resistive spike)
    * OLED Television & Entertainment Bays (140W)
    * Front Load Washing Machines (650W, motor pulse)
  * Real-time calculation summing to baseline `31.69 kWh/day` and `950.8 kWh/mo`.
  * **Custom Equipment Ingestion**: Inline modal to inject custom devices (e.g., EV Chargers, Induction hobs, Microwaves).
* **Step 4 // Telemetry Data Source**:
  * *Historical Indian Household Dataset*: 90-day pre-calibrated baseline (15-min resolution, 8,640 rows, zero latency).
  * *Real-Time Virtual Telemetry Node*: 1-second WebSocket emission with ±4.2% stochastic noise and simulated voltage dips.
  * *Connected Physical Sensors*: MQTT / PZEM-004T split-core CT clamp ingestion.

### 4. Energy Overview Dashboard (`/dashboard`)
* **Dark Instrument Sidebar**: Quick-access switches for Overview, Appliances, Analytics, Bill Estimator, Anomalies, Insights, and Settings.
* **Telemetry Executive Cards**: Today's Usage (`12.4 kWh`), Today's Cost (`₹99 INR`), Oct Bill Projection (`₹2,850`), and Needs Attention Alert Count (`2`).
* **Interactive 7-Day Usage Bar Chart**:
  * Real-time baseline comparison against `11.4 kWh` standard threshold.
  * Distinct visual styling for outlier anomaly days (e.g., **20 Oct** at `18.9 kWh`).
  * **Floating Telemetry Tooltip**: Hovering over any day reveals date, energy consumption, typical baseline, cost in INR, and root-cause diagnostics.
* **Top Power Consumers Breakdown**: Live load decomposition table with status flags (*⚡ High Draw*, *Normal*, *⚠️ Possible Leak*).
* **Anomaly Detection Engine**:
  * *Water Geyser Night Leak*: Detects unexpected draw between 03:14 AM and 05:40 AM with excess cost computation.
  * *Master Bed AC Cycling Surge*: Intercepts erratic compressor duty cycles.
  * Interactive audit modals with circuit-breaker cycling simulation.
* **Export Report**: One-click generation and instant download of comprehensive `.csv` reports.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript 5 (Strict Mode) |
| **UI & Styling** | Tailwind CSS v4 + Vanilla CSS Design Tokens |
| **Charts & Visuals** | Native Scalable Vector Graphics (SVG) + CSS Gradients |
| **State & Calculations** | Pure React Hooks (`useState`, `useMemo`, `useEffect`, `useRef`) |
| **Icons** | Custom Industrial SVG Glyph Set |

---

## ⚙️ Quickstart & Local Setup

### 1. Prerequisites
Ensure you have **Node.js 18+** installed:
```bash
node -v
npm -v
```

### 2. Clone the Repository
```bash
git clone https://github.com/Krish01Cse/WattWise.git
cd WattWise
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📁 Repository Structure

```
WattWise/
├── public/                 # Static assets & SVG icons
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/  # Energy Overview Dashboard (/dashboard)
│   │   │   └── layout.tsx  # Telemetry Shell layout with Sidebar
│   │   ├── auth/           # Login & Signup Gateway (/auth)
│   │   ├── setup/          # 4-Stage Household Wizard (/setup)
│   │   ├── globals.css     # Design tokens & Tailwind CSS v4 entry
│   │   ├── layout.tsx      # Root HTML & Metadata layout
│   │   └── page.tsx        # Public Landing Page (/)
│   ├── components/
│   │   └── layout/
│   │       └── Sidebar.tsx # Dark instrument telemetry sidebar
│   └── data/
│       ├── discoms.ts      # Indian electricity distribution utilities (DISCOMs)
│       └── indianCities.ts # Database of 100+ Indian cities, states & base tariffs
├── next.config.ts          # Turbopack & Next.js configuration
├── package.json            # Scripts & dependencies
├── postcss.config.mjs      # Tailwind v4 PostCSS configuration
├── tsconfig.json           # TypeScript configuration with path aliases
└── README.md               # Project documentation
```

---

## 📊 Telemetry Calculation Formula

$$\text{Daily kWh} = \sum_{i=1}^{N} \left( \frac{\text{Count}_i \times \text{Rating (W)}_i \times \text{Hours}_i}{1000} \right)$$

$$\text{Estimated Monthly Usage (kWh)} = \text{Daily kWh} \times 30$$

$$\text{Monthly Projected Bill (₹)} = \text{Monthly kWh} \times \text{Effective Base Tariff (₹/kWh)}$$

---

## 📄 License & Attribution

Developed with precision for smart residential energy monitoring.
**WattWise © 2025–2026 • Household Energy Intelligence Platform**.
