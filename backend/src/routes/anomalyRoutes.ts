import { Router } from 'express';
import { AnomalyController } from '../controllers/anomalyController.js';

const router = Router();

router.get('/ml-metrics', AnomalyController.mlMetrics);
router.post('/spikes/:id/status', AnomalyController.updateSpikeStatus);
router.get('/', AnomalyController.list);
router.post('/:id/resolve', AnomalyController.resolve);

export default router;
