import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getReviewPlan, getCycleStages, getCycleWords, processCycleReview } from '../controllers/reviewController';

const router = Router();

router.get('/plan', authenticate, getReviewPlan);
router.get('/cycle', authenticate, getCycleStages);
router.get('/cycle-words', authenticate, getCycleWords);
router.post('/cycle/:wordId', authenticate, processCycleReview);

export default router;
