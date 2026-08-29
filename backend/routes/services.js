import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/services — public list of all services
router.get('/', async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
  res.json({ success: true, services });
});

export default router;
