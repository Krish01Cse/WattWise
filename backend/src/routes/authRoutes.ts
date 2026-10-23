import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.get('/me', AuthController.me);

export default router;
