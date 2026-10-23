import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController.js';

const router = Router();

router.get('/', SettingsController.getSettings);
router.put('/', SettingsController.updateSettings);
router.post('/change-password', SettingsController.changePassword);
router.post('/reset', SettingsController.resetSettings);

export default router;
