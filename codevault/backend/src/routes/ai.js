import express from 'express';
import { analyzeCode, chatWithAI } from '../controllers/ai.js';

const router = express.Router();

router.post('/analyze', analyzeCode);
router.post('/chat', chatWithAI);

export default router;
