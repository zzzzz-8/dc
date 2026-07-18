import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { register, login, refresh, getProfile, updateProfile } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
