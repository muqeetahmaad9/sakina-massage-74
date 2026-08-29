import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/products — public list of shop products/packages
router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  res.json({ success: true, products });
});

export default router;
