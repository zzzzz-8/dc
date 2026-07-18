import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  listWordbooks, getWordbook, getWordbookWords,
  createCustomWordbook, updateWordbook, deleteWordbook,
  addToMyWordbooks, getMyWordbooks, removeMyWordbook,
} from '../controllers/wordbookController';

const router = Router();

router.get('/', listWordbooks);
router.get('/mine', authenticate, getMyWordbooks);
router.get('/:id', getWordbook);
router.get('/:id/words', getWordbookWords);
router.post('/custom', authenticate, createCustomWordbook);
router.put('/:id', authenticate, updateWordbook);
router.delete('/:id', authenticate, deleteWordbook);
router.post('/:id/subscribe', authenticate, addToMyWordbooks);
router.delete('/:id/subscribe', authenticate, removeMyWordbook);

export default router;
