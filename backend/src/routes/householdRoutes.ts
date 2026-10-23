import { Router } from 'express';
import { HouseholdController } from '../controllers/householdController.js';

const router = Router();

router.get('/current', HouseholdController.getCurrent);
router.put('/current', HouseholdController.update);
router.post('/setup', HouseholdController.completeSetup);

export default router;
