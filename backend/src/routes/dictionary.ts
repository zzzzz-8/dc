import { Router } from 'express';
import { searchDictionary, getDictionarySources } from '../controllers/dictionaryController';

const router = Router();

router.get('/search', searchDictionary);
router.get('/sources', getDictionarySources);

export default router;
