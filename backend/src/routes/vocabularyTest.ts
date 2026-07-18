import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { startTest, submitTest, getTestHistory, getTestReport } from '../controllers/vocabularyTestController';

const router = Router();

router.post('/start', authenticate, startTest);
router.post('/submit', authenticate, submitTest);
router.get('/history', authenticate, getTestHistory);
router.get('/report/:id', authenticate, getTestReport);

export default router;
