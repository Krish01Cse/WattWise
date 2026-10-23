import { Router } from 'express';
import { TelemetryController } from '../controllers/telemetryController.js';

const router = Router();

// Overview & History
router.get('/overview', TelemetryController.getOverview);
router.get('/history', TelemetryController.getHistory);
router.get('/live', TelemetryController.getLive);
router.post('/record', TelemetryController.record);

// Dataset Ingestion & Simulation Configuration
router.post('/upload-dataset', TelemetryController.uploadDataset);
router.post('/configure-simulator', TelemetryController.configureSimulator);

// Model Training Pipeline
router.post('/train-model', TelemetryController.trainModel);
router.get('/model-status', TelemetryController.getModelStatus);

export default router;
