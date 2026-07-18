import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getReferralStats, getReferralRecords } from '../controllers/referralController';

const router = Router();

router.get('/stats', authenticate, getReferralStats);
router.get('/records', authenticate, getReferralRecords);

export default router;
