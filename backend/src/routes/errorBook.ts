import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getErrorBook, removeFromErrorBook, addNote,
  exportToWordbook, toggleCollect,
} from '../controllers/errorBookController';

const router = Router();

router.get('/', authenticate, getErrorBook);
router.delete('/:wordId', authenticate, removeFromErrorBook);
router.post('/note/:wordId', authenticate, addNote);
router.post('/export', authenticate, exportToWordbook);
router.post('/collect/:wordId', authenticate, toggleCollect);

export default router;
