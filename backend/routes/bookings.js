import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';
import { generateInvoicePdf } from '../invoice.js';
import { generateInvoiceNumber } from '../invoiceNumber.js';
import { sendNotificationEmail, sendCustomerEmail, bookingEmailHtml, customerBookingEmailHtml } from '../email.js';

const router = Router();

// GET /api/bookings/availability?date=2026-09-10 — times already booked on that date
router.get('/availability', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ success: false, message: 'Paramètre date requis.' });

  const bookings = await prisma.booking.findMany({
    where: { date, status: 'confirmed' },
    select: { time: true },
  });

  res.json({ success: true, bookedTimes: bookings.map((b) => b.time) });
});

// POST /api/bookings — create a booking for the logged-in user
// body: { serviceIds: string[], date: "2026-09-10", time: "14:00", message?: string }
router.post('/', requireAuth, async (req, res) => {
  const { serviceIds, date, time, message } = req.body;

  if (!Array.isArray(serviceIds) || serviceIds.length === 0 || !date || !time) {
    return res.status(400).json({ success: false, message: 'Service(s), date et heure requis.' });
  }

  // Prevent double-booking the same slot (single practitioner = one booking per date+time)
  const clash = await prisma.booking.findUnique({ where: { date_time: { date, time } } });
  if (clash) {
    return res.status(409).json({ success: false, message: 'Ce créneau vient d\'être réservé. Merci d\'en choisir un autre.' });
  }

  const invoiceNumber = generateInvoiceNumber();

  const booking = await prisma.booking.create({
    data: {
      userId: req.userId,
      date,
      time,
      message: message || null,
      invoiceNumber,
      services: {
        create: serviceIds.map((serviceId) => ({ serviceId })),
      },
    },
    include: {
      user: true,
      services: { include: { service: true } },
    },
  });

  const lineItems = booking.services.map((bs) => ({
    label: bs.service.name,
    detail: `${bs.service.duration} · ${bs.service.category}`,
    price: bs.service.price,
  }));
  const total = lineItems.reduce((sum, i) => sum + i.price, 0);

  // Generate PDF invoice + notify the business owner by email.
  // This runs after the booking is already saved, so a slow/failed email never blocks the booking itself.
  try {
    const pdfBuffer = await generateInvoicePdf({
      invoiceNumber,
      date: new Date(),
      customer: { name: booking.user.name, email: booking.user.email, phone: `${booking.user.countryDial} ${booking.user.phone}` },
      lineItems,
      total,
      kind: 'Réservation',
    });

    await sendNotificationEmail({
      subject: `Nouvelle réservation — ${booking.user.name} — ${new Date(date).toLocaleDateString('fr-FR')} ${time}`,
      html: bookingEmailHtml({ user: booking.user, booking, lineItems, total, invoiceNumber }),
      pdfBuffer,
      pdfFilename: `facture-${invoiceNumber}.pdf`,
    });

    // Send the customer their own confirmation + invoice copy too.
    await sendCustomerEmail({
      to: booking.user.email,
      subject: `Votre réservation est confirmée — ${new Date(date).toLocaleDateString('fr-FR')} ${time}`,
      html: customerBookingEmailHtml({ user: booking.user, booking, lineItems, total, invoiceNumber }),
      pdfBuffer,
      pdfFilename: `facture-${invoiceNumber}.pdf`,
    });
  } catch (err) {
    console.error('Failed to generate/send booking invoice email:', err);
  }

  const { user: bookingUser, ...bookingWithoutUser } = booking;
  const { passwordHash: _unused, ...safeUser } = bookingUser;
  res.status(201).json({ success: true, booking: { ...bookingWithoutUser, user: safeUser } });
});

// GET /api/bookings/mine — all bookings for the logged-in user
router.get('/mine', requireAuth, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.userId },
    include: { services: { include: { service: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, bookings });
});

export default router;
