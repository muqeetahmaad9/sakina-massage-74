import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';
import { sendNotificationEmail, corporateFormEmailHtml } from '../email.js';
import { generateCorporatePdf } from '../corporatePdf.js';

const router = Router();

// POST /api/corporate — submit a "Tarif Personnel" eligibility form for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  const { firstName, lastName, birthDate, phone, organizationType, companyName, employeeCountRange, employeeCount } = req.body;

  if (!firstName || !lastName || !birthDate || !phone) {
    return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
  }

  const form = await prisma.corporateForm.create({
    data: {
      userId: req.userId,
      firstName,
      lastName,
      birthDate,
      phone,
      organizationType,
      companyName,
      employeeCountRange,
      employeeCount,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  try {
    const pdf = await generateCorporatePdf(form);
    await sendNotificationEmail({
      subject: `Nouveau formulaire Tarif Personnel — ${firstName} ${lastName}`,
      html: corporateFormEmailHtml({ user, form }),
      pdfs: [{ buffer: pdf, filename: `tarif-personnel-${form.id}.pdf` }],
    });
  } catch (err) {
    console.error('Failed to send corporate form email:', err);
  }

  res.status(201).json({ success: true, form });
});

export default router;
