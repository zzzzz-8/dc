import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMembership, purchaseMembership, getCredits, purchaseCredits } from '../controllers/membershipController';

const router = Router();

router.get('/', authenticate, getMembership);
router.post('/purchase', authenticate, purchaseMembership);
router.get('/credits', authenticate, getCredits);
router.post('/credits/purchase', authenticate, purchaseCredits);

export default router;
