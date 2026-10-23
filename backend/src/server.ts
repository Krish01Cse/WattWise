import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { isSupabaseConfigured } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// 1. SECURITY & LOGGING MIDDLEWARE
app.use(helmet());
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(morgan('dev'));

// 2. ROOT & HEALTH CHECK ROUTES
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: '⚡ WATTWISE BACKEND API',
    tagline: 'Household Energy Intelligence Platform',
    standard: 'IEC 62053-21 Class 1.0/2.0 Compliant',
    version: '1.0.0',
    status: 'ONLINE',
    database: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local In-Memory Telemetry Engine',
    documentation: '/api',
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: isSupabaseConfigured,
      driver: isSupabaseConfigured ? 'supabase-js / postgres' : 'in-memory-zero-config',
    },
  });
});

// 3. MOUNT CORE TELEMETRY API ROUTES
app.use('/api', apiRoutes);

// 4. 404 CATCH-ALL
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Telemetry node endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// 5. GLOBAL ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal telemetry system failure',
  });
});

// 6. START SERVER
app.listen(PORT, () => {
  console.log(`
╔═════════════════════════════════════════════════════════════════╗
║  ⚡ WATTWISE TELEMETRY BACKEND SERVER ONLINE                     ║
║  URL: http://localhost:${PORT}                                    ║
║  Health Check: http://localhost:${PORT}/api/health               ║
║  Standard: IEC 62053-21 Static Watt-hour Accuracy               ║
║  Database: ${isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local In-Memory Telemetry Engine'}               ║
╚═════════════════════════════════════════════════════════════════╝
  `);
});

export default app;
