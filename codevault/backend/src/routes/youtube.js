import express from 'express';
import { searchVideos, getVideoDetails } from '../controllers/youtube.js';

const router = express.Router();

router.get('/search', searchVideos);
router.get('/details', getVideoDetails);

export default router;
