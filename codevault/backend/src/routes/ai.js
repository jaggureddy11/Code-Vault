import express from 'express';
import { analyzeCode } from '../controllers/ai.js';

const router = express.Router();

router.post('/analyze', analyzeCode);

export default router;
