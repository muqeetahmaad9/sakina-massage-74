import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';
import { generateInvoicePdf } from '../invoice.js';
import { generateInvoiceNumber } from '../invoiceNumber.js';
import { sendNotificationEmail, sendCustomerEmail, orderEmailHtml, customerOrderEmailHtml } from '../email.js';

const router = Router();

// POST /api/orders — create an order for the logged-in user
// body: { items: [{ productId: string, quantity: number }] }
router.post('/', requireAuth, async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Le panier est vide.' });
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    return res.status(400).json({ success: false, message: 'Un ou plusieurs produits sont introuvables.' });
  }

  const productById = Object.fromEntries(products.map((p) => [p.id, p]));
  const totalPrice = items.reduce((sum, i) => sum + productById[i.productId].price * i.quantity, 0);
  const invoiceNumber = generateInvoiceNumber();

  const order = await prisma.order.create({
    data: {
      userId: req.userId,
      invoiceNumber,
      totalPrice,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: productById[i.productId].price,
        })),
      },
    },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });

  const lineItems = order.items.map((oi) => ({
    label: oi.product.name,
    price: oi.unitPrice,
    quantity: oi.quantity,
  }));

  try {
    const pdfBuffer = await generateInvoicePdf({
      invoiceNumber,
      date: new Date(),
      customer: { name: order.user.name, email: order.user.email, phone: `${order.user.countryDial} ${order.user.phone}` },
      lineItems,
      total: totalPrice,
      kind: 'Commande',
    });

    await sendNotificationEmail({
      subject: `Nouvelle commande boutique — ${order.user.name} — ${totalPrice.toFixed(2)} €`,
      html: orderEmailHtml({ user: order.user, order, lineItems, total: totalPrice, invoiceNumber }),
      pdfBuffer,
      pdfFilename: `facture-${invoiceNumber}.pdf`,
    });

    // Send the customer their own confirmation + invoice copy too.
    await sendCustomerEmail({
      to: order.user.email,
      subject: `Votre commande est confirmée — ${invoiceNumber}`,
      html: customerOrderEmailHtml({ user: order.user, lineItems, total: totalPrice, invoiceNumber }),
      pdfBuffer,
      pdfFilename: `facture-${invoiceNumber}.pdf`,
    });
  } catch (err) {
    console.error('Failed to generate/send order invoice email:', err);
  }

  const { user: orderUser, ...orderWithoutUser } = order;
  const { passwordHash: _unused, ...safeUser } = orderUser;
  res.status(201).json({ success: true, order: { ...orderWithoutUser, user: safeUser } });
});

// GET /api/orders/mine — all orders for the logged-in user
router.get('/mine', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, orders });
});

export default router;
