-- =====================================================================
-- WATTWISE // HOUSEHOLD ENERGY INTELLIGENCE PLATFORM
-- Supabase PostgreSQL Relational Schema & Compliance Definitions
-- Standard: IEC 62053-21 Accuracy Class 1.0 / 2.0 Static Watt-hour Meters
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE housing_type_enum AS ENUM ('apartment', 'independent_house', 'villa', 'penthouse');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE phase_type_enum AS ENUM ('single_phase', 'three_phase');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tariff_structure_enum AS ENUM ('flat', 'slab');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE telemetry_source_enum AS ENUM ('dataset_historical', 'virtual_simulator', 'physical_sensors');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appliance_status_enum AS ENUM ('normal', 'high_draw', 'possible_leak');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE anomaly_severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE anomaly_status_enum AS ENUM ('active', 'investigating', 'resolved', 'ignored');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase auth.users or standalone operator nodes)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT 'Operator',
    node_id TEXT NOT NULL DEFAULT ('NODE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6))),
    role TEXT NOT NULL DEFAULT 'operator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. HOUSEHOLDS TABLE (Setup Steps 1, 2, 4)
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    residence_name TEXT NOT NULL DEFAULT 'Primary Residence',
    residents_count INT NOT NULL DEFAULT 4,
    city TEXT NOT NULL DEFAULT 'Mumbai',
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    housing_type housing_type_enum NOT NULL DEFAULT 'apartment',
    sanctioned_load_kw NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    phase_type phase_type_enum NOT NULL DEFAULT 'single_phase',
    
    -- Tariff Specification
    discom_name TEXT NOT NULL DEFAULT 'Tata Power Mumbai',
    discom_code TEXT NOT NULL DEFAULT 'TPC-M',
    tariff_structure tariff_structure_enum NOT NULL DEFAULT 'slab',
    base_tariff_inr NUMERIC(6,2) NOT NULL DEFAULT 7.50,
    monthly_budget_inr NUMERIC(10,2) NOT NULL DEFAULT 4500.00,
    
    -- Telemetry Source
    telemetry_source telemetry_source_enum NOT NULL DEFAULT 'dataset_historical',
    hardware_bridge_connected BOOLEAN NOT NULL DEFAULT FALSE,
    hardware_node_id TEXT DEFAULT 'ESP32-CT-NODE-01',
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. APPLIANCES TABLE (Setup Step 3 & Dashboard Top Consumers)
CREATE TABLE IF NOT EXISTS public.appliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    count INT NOT NULL DEFAULT 1,
    wattage INT NOT NULL,
    hours_per_day NUMERIC(4,2) NOT NULL DEFAULT 4.0,
    daily_kwh NUMERIC(7,3) GENERATED ALWAYS AS ((count * wattage * hours_per_day) / 1000.0) STORED,
    icon TEXT NOT NULL DEFAULT '⚡',
    status appliance_status_enum NOT NULL DEFAULT 'normal',
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TELEMETRY LOGS TABLE (Historical & Real-time readings)
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    day_label TEXT NOT NULL, -- e.g. "15 Oct", "20 Oct"
    energy_kwh NUMERIC(7,3) NOT NULL,
    typical_baseline_kwh NUMERIC(7,3) NOT NULL DEFAULT 11.40,
    cost_inr NUMERIC(8,2) NOT NULL,
    peak_power_watts INT NOT NULL DEFAULT 3200,
    is_anomalous BOOLEAN NOT NULL DEFAULT FALSE,
    anomaly_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ANOMALIES & ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    appliance_tag TEXT NOT NULL,
    time_window TEXT NOT NULL, -- e.g. "03:14 AM - 05:40 AM"
    excess_cost_inr NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    estimated_excess_kwh NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    severity anomaly_severity_enum NOT NULL DEFAULT 'medium',
    status anomaly_status_enum NOT NULL DEFAULT 'active',
    recommended_action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 8. INDEXES FOR HIGH-THROUGHPUT TELEMETRY QUERIES
CREATE INDEX IF NOT EXISTS idx_telemetry_household_date ON public.telemetry_logs(household_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON public.telemetry_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_appliances_household ON public.appliances(household_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_household_status ON public.anomalies(household_id, status);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;

-- Allow public / anon read and write for development or API Service Key
DO $$ BEGIN
    CREATE POLICY "Allow public all access on profiles" ON public.profiles FOR ALL USING (true);
    CREATE POLICY "Allow public all access on households" ON public.households FOR ALL USING (true);
    CREATE POLICY "Allow public all access on appliances" ON public.appliances FOR ALL USING (true);
    CREATE POLICY "Allow public all access on telemetry_logs" ON public.telemetry_logs FOR ALL USING (true);
    CREATE POLICY "Allow public all access on anomalies" ON public.anomalies FOR ALL USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 10. PRE-POPULATED SEED DATA (Matching the Bandra Residence in Frontend)
DO $$
DECLARE
    demo_profile_id UUID;
    demo_household_id UUID;
BEGIN
    -- Check if demo profile exists
    SELECT id INTO demo_profile_id FROM public.profiles WHERE email = 'aditya.k@wattwise.internal' LIMIT 1;
    
    IF demo_profile_id IS NULL THEN
        INSERT INTO public.profiles (email, full_name, node_id, role)
        VALUES ('aditya.k@wattwise.internal', 'Aditya K.', 'NODE-4092-BNDR', 'lead_operator')
        RETURNING id INTO demo_profile_id;
    END IF;

    -- Check if demo household exists
    SELECT id INTO demo_household_id FROM public.households WHERE profile_id = demo_profile_id LIMIT 1;
    
    IF demo_household_id IS NULL THEN
        INSERT INTO public.households (
            profile_id, residence_name, residents_count, city, state, 
            housing_type, sanctioned_load_kw, phase_type,
            discom_name, discom_code, tariff_structure, base_tariff_inr, monthly_budget_inr,
            telemetry_source, hardware_bridge_connected, hardware_node_id
        )
        VALUES (
            demo_profile_id, 'Bandra Residence', 4, 'Mumbai', 'Maharashtra',
            'apartment', 5.00, 'single_phase',
            'Tata Power Mumbai', 'TPC-M', 'slab', 7.50, 4500.00,
            'dataset_historical', TRUE, 'ESP32-CT-NODE-01'
        )
        RETURNING id INTO demo_household_id;

        -- Seed 6 Baseline Appliances
        INSERT INTO public.appliances (household_id, name, category, count, wattage, hours_per_day, icon, status)
        VALUES
        (demo_household_id, 'Dual Inverter AC (1.5 Ton)', 'cooling', 2, 1450, 8.0, '❄️', 'high_draw'),
        (demo_household_id, 'Frost-Free Refrigerator (350L)', 'refrigeration', 1, 180, 24.0, '🧊', 'normal'),
        (demo_household_id, 'BLDC Ceiling Fans', 'fans', 5, 32, 14.0, '🌀', 'normal'),
        (demo_household_id, 'Storage Water Geyser (25L)', 'heating', 2, 2000, 1.5, '🔥', 'possible_leak'),
        (demo_household_id, '55" 4K OLED Television', 'entertainment', 1, 140, 5.0, '📺', 'normal'),
        (demo_household_id, 'Front Load Washing Machine', 'laundry', 1, 650, 1.2, '🧺', 'normal');

        -- Seed 7-Day Telemetry Logs (matching frontend 15 Oct to 21 Oct)
        INSERT INTO public.telemetry_logs (household_id, date, day_label, energy_kwh, typical_baseline_kwh, cost_inr, is_anomalous, anomaly_reason)
        VALUES
        (demo_household_id, '2026-10-15', '15 Oct', 11.20, 11.40, 89.60, FALSE, NULL),
        (demo_household_id, '2026-10-16', '16 Oct', 10.80, 11.40, 86.40, FALSE, NULL),
        (demo_household_id, '2026-10-17', '17 Oct', 12.10, 11.40, 96.80, FALSE, NULL),
        (demo_household_id, '2026-10-18', '18 Oct', 11.90, 11.40, 95.20, FALSE, NULL),
        (demo_household_id, '2026-10-19', '19 Oct', 13.40, 11.40, 107.20, FALSE, NULL),
        (demo_household_id, '2026-10-20', '20 Oct', 18.90, 11.40, 151.20, TRUE, 'Extended AC draw + 03:14 AM water geyser continuous heating cycle'),
        (demo_household_id, '2026-10-21', '21 Oct', 12.40, 11.40, 99.20, FALSE, NULL);

        -- Seed Anomalies
        INSERT INTO public.anomalies (household_id, title, description, appliance_tag, time_window, excess_cost_inr, estimated_excess_kwh, severity, status, recommended_action)
        VALUES
        (
            demo_household_id,
            'Water Geyser Active at 3:00 AM',
            'Water geyser in Master Bathroom showed continuous 2000W consumption from 03:14 AM to 05:40 AM with zero flow registered. Probable thermostat bypass or continuous recirculation failure.',
            'Master Bathroom Geyser (2000W)',
            '03:14 AM - 05:40 AM (2h 26m)',
            38.90,
            4.86,
            'high',
            'active',
            'Perform circuit-breaker cycle on breaker #4, inspect thermostat temperature cut-off sensor, and schedule technician diagnostic.'
        ),
        (
            demo_household_id,
            'Master Bed AC Cycling Surge',
            'Compressor duty cycle spiked to 92% between 01:00 PM and 04:30 PM compared to historical 55% average. Ambient temp 34°C, potential condenser coil fouling or low refrigerant pressure.',
            'Master Bed AC (1450W)',
            '01:00 PM - 04:30 PM (3h 30m)',
            24.50,
            3.06,
            'medium',
            'active',
            'Inspect outdoor condenser airflow clearance, check evaporator air filter for dust occlusion, verify setpoint is at 24°C.'
        );
    END IF;
END $$;

-- 11. CREDENTIALS & SIGNUP HASHMAP TABLE (Table: credinals / credentials)
CREATE TABLE IF NOT EXISTS public.credinals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT DEFAULT 'Operator',
    phone_number TEXT DEFAULT '+91 98921 12345',
    city TEXT DEFAULT 'Mumbai',
    state TEXT DEFAULT 'Maharashtra',
    residence_name TEXT DEFAULT 'Bandra Residence',
    housing_type TEXT DEFAULT 'apartment',
    sanctioned_load_kw NUMERIC(5,2) DEFAULT 5.00,
    discom_name TEXT DEFAULT 'Tata Power Mumbai',
    tariff_structure TEXT DEFAULT 'slab',
    monthly_budget_inr NUMERIC(10,2) DEFAULT 4500.00,
    signup_details JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT DEFAULT 'Operator',
    phone_number TEXT DEFAULT '+91 98921 12345',
    city TEXT DEFAULT 'Mumbai',
    state TEXT DEFAULT 'Maharashtra',
    residence_name TEXT DEFAULT 'Bandra Residence',
    housing_type TEXT DEFAULT 'apartment',
    sanctioned_load_kw NUMERIC(5,2) DEFAULT 5.00,
    discom_name TEXT DEFAULT 'Tata Power Mumbai',
    tariff_structure TEXT DEFAULT 'slab',
    monthly_budget_inr NUMERIC(10,2) DEFAULT 4500.00,
    signup_details JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.credinals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow public all access on credinals" ON public.credinals FOR ALL USING (true);
    CREATE POLICY "Allow public all access on credentials" ON public.credentials FOR ALL USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
