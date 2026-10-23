import pg from 'pg';

const { Client } = pg;

async function createCredentialsTable() {
  const connectionString = 'postgresql://postgres:Krish06%40200@db.qckzmbgttkqlhpcjaxns.supabase.co:5432/postgres';
  
  console.log('[SUPABASE] Connecting to create credinals & credentials tables...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('[SUPABASE] Connected successfully.');

    const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- 1. Create table credinals
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

      -- 2. Create table credentials as exact mirror / identical table
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

      -- Enable RLS
      ALTER TABLE public.credinals ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

      -- Allow full access for anon/service role
      DO $$ BEGIN
        CREATE POLICY "Allow public all access on credinals" ON public.credinals FOR ALL USING (true);
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE POLICY "Allow public all access on credentials" ON public.credentials FOR ALL USING (true);
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Seed initial demo record in both tables
      INSERT INTO public.credinals (email, password, full_name, phone_number, residence_name, city)
      VALUES ('aditya.k@residence.in', 'Passcode@2026', 'Aditya K.', '+91 98921 12345', 'Bandra Residence', 'Mumbai')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW();

      INSERT INTO public.credentials (email, password, full_name, phone_number, residence_name, city)
      VALUES ('aditya.k@residence.in', 'Passcode@2026', 'Aditya K.', '+91 98921 12345', 'Bandra Residence', 'Mumbai')
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW();
    `;

    console.log('[SUPABASE] Running SQL migration...');
    await client.query(sql);
    console.log('[SUPABASE] credinals & credentials tables successfully created and seeded!');

    // Verify
    const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_name IN (\'credinals\', \'credentials\');');
    console.log('[SUPABASE] Verified tables:', res.rows.map(r => r.table_name));

  } catch (err) {
    console.error('[SUPABASE ERROR]', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createCredentialsTable();
