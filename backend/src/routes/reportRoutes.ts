import { Router } from 'express';
import { ReportController } from '../controllers/reportController.js';

const router = Router();

router.get('/export', ReportController.exportReport);

export default router;
