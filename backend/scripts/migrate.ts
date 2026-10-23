import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

async function runMigration() {
  const connectionString = 'postgresql://postgres:Krish06%40200@db.qckzmbgttkqlhpcjaxns.supabase.co:5432/postgres';
  
  console.log('[MIGRATION] Connecting to Supabase PostgreSQL: db.qckzmbgttkqlhpcjaxns.supabase.co:5432...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('[MIGRATION] Successfully connected to Supabase PostgreSQL database.');

    const schemaPath = path.resolve(process.cwd(), 'supabase/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[MIGRATION] Executing schema.sql statements...');
    await client.query(sql);

    console.log('[MIGRATION] Schema executed successfully! All tables and seed data created.');

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('[MIGRATION] Public tables found in Supabase:');
    res.rows.forEach(row => console.log('  -> ' + row.table_name));

    // Verify row counts
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM public.households) AS households_count,
        (SELECT COUNT(*) FROM public.appliances) AS appliances_count,
        (SELECT COUNT(*) FROM public.telemetry_logs) AS telemetry_count,
        (SELECT COUNT(*) FROM public.anomalies) AS anomalies_count,
        (SELECT COUNT(*) FROM public.profiles) AS profiles_count;
    `);
    console.log('[MIGRATION] Current Seed Record Counts:', counts.rows[0]);

  } catch (err) {
    console.error('[MIGRATION ERROR]', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
