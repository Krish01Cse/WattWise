import { Router } from 'express';
import { ApplianceController } from '../controllers/applianceController.js';

const router = Router();

router.get('/', ApplianceController.list);
router.post('/', ApplianceController.create);
router.delete('/:id', ApplianceController.remove);

export default router;
