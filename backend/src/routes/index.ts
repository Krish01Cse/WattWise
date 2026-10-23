import { Router } from 'express';
import authRoutes from './authRoutes.js';
import householdRoutes from './householdRoutes.js';
import applianceRoutes from './applianceRoutes.js';
import telemetryRoutes from './telemetryRoutes.js';
import anomalyRoutes from './anomalyRoutes.js';
import reportRoutes from './reportRoutes.js';
import referenceRoutes from './referenceRoutes.js';
import settingsRoutes from './settingsRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/households', householdRoutes);
apiRouter.use('/appliances', applianceRoutes);
apiRouter.use('/telemetry', telemetryRoutes);
apiRouter.use('/anomalies', anomalyRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/reference', referenceRoutes);
apiRouter.use('/settings', settingsRoutes);

export default apiRouter;
