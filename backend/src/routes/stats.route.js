import { Router } from 'express';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';
import { getStats } from '../controllers/stats.controller.js';

const router = Router();

router.get('/', protectRoute, requireAdmin, getStats);

export default router;
