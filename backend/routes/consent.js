import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';
import { sendNotificationEmail, consentFormEmailHtml } from '../email.js';
import { generateConsentPdf } from '../consentPdf.js';
import { generateInvoicePdf } from '../invoice.js';

const router = Router();

// POST /api/consent — submit a consent/intake form for the logged-in user
// body: { ...formFields, bookingId?: string }
router.post('/', requireAuth, async (req, res) => {
  const {
    bookingId,
    firstName,
    lastName,
    birthDate,
    phone,
    expectations,
    areasToTreat,
    medicalConditions,
    medications,
    allergies,
    pregnancy,
    regularActivity,
    hadProfessionalMassage,
    stressLevel,
    signature,
  } = req.body;

  if (!firstName || !lastName || !birthDate || !phone) {
    return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
  }

  // If a bookingId is provided, make sure it actually belongs to this user before linking it.
  let booking = null;
  if (bookingId) {
    booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: req.userId },
      include: { services: { include: { service: true } } },
    });
  }

  const form = await prisma.consentForm.create({
    data: {
      userId: req.userId,
      bookingId: booking?.id || null,
      firstName,
      lastName,
      birthDate,
      phone,
      expectations,
      areasToTreat,
      medicalConditions,
      medications,
      allergies,
      pregnancy,
      regularActivity,
      hadProfessionalMassage,
      stressLevel,
      signature,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  try {
    const consentPdf = await generateConsentPdf(form);
    const pdfs = [{ buffer: consentPdf, filename: `fiche-renseignements-${form.id}.pdf` }];

    if (booking) {
      const lineItems = booking.services.map((bs) => ({
        label: bs.service.name,
        detail: `${bs.service.duration} · ${bs.service.category}`,
        price: bs.service.price,
      }));
      const total = lineItems.reduce((sum, i) => sum + i.price, 0);

      const invoicePdf = await generateInvoicePdf({
        invoiceNumber: booking.invoiceNumber,
        date: booking.createdAt,
        customer: { name: user.name, email: user.email, phone: `${user.countryDial} ${user.phone}` },
        lineItems,
        total,
        kind: 'Réservation',
      });
      pdfs.push({ buffer: invoicePdf, filename: `facture-${booking.invoiceNumber}.pdf` });
    }

    await sendNotificationEmail({
      subject: `Nouvelle fiche de renseignements — ${firstName} ${lastName}`,
      html: consentFormEmailHtml({ user, form, booking }),
      pdfs,
    });
  } catch (err) {
    console.error('Failed to send consent form email:', err);
  }

  res.status(201).json({ success: true, form });
});

export default router;
