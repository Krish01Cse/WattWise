import { Router } from 'express';
import { AnomalyController } from '../controllers/anomalyController.js';

const router = Router();

router.get('/', AnomalyController.list);
router.post('/:id/resolve', AnomalyController.resolve);

export default router;
