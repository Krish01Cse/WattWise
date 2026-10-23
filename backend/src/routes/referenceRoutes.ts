import { Router } from 'express';
import { ReferenceController } from '../controllers/referenceController.js';

const router = Router();

router.get('/cities', ReferenceController.getCities);
router.get('/discoms', ReferenceController.getDiscoms);

export default router;
