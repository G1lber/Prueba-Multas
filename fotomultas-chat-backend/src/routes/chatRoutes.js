import express from 'express';
import { sendMessage, clearChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', sendMessage);
router.delete('/clear', clearChat);

export default router;