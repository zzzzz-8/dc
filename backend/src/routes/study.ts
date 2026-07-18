import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getTodayStudy, recordStudy, getProgress, getStudyRecords, getUserWords } from '../controllers/studyController';

const router = Router();

router.get('/today', authenticate, getTodayStudy);
router.post('/record', authenticate, recordStudy);
router.get('/progress', authenticate, getProgress);
router.get('/records', authenticate, getStudyRecords);
router.get('/user-words', authenticate, getUserWords);

export default router;
