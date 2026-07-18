import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getStudents, createStudent, updateStudent, deleteStudent, getScheduleStats } from '../controllers/userController';

const router = Router();

router.get('/students', authenticate, getStudents);
router.post('/students', authenticate, createStudent);
router.put('/students/:id', authenticate, updateStudent);
router.delete('/students/:id', authenticate, deleteStudent);
router.get('/schedule-stats', authenticate, getScheduleStats);

export default router;
