import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/services — public list of all services
router.get('/', async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });

  // Pin "Bundle Pack" first regardless of insertion order (it may have been seeded
  // after the original catalog on an existing database), then keep the rest as-is.
  services.sort((a, b) => {
    const aIsBundle = a.category === 'Bundle Pack' ? 0 : 1;
    const bIsBundle = b.category === 'Bundle Pack' ? 0 : 1;
    return aIsBundle - bIsBundle;
  });

  res.json({ success: true, services });
});

export default router;
