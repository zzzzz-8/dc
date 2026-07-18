import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getSchedule, createSchedule, completeSchedule, cancelSchedule } from '../controllers/scheduleController';

const router = Router();

router.get('/', authenticate, getSchedule);
router.post('/', authenticate, createSchedule);
router.put('/:id/complete', authenticate, completeSchedule);
router.put('/:id/cancel', authenticate, cancelSchedule);

export default router;
