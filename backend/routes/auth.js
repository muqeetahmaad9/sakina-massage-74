import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../db.js';
import { signToken, setSessionCookie, clearSessionCookie, requireAuth } from '../auth.js';
import { sendCustomerEmail } from '../email.js';

const router = Router();
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5174';

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, phone, countryDial, password, birthDate } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 6 caractères.' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Un compte existe déjà avec cet email.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      countryDial: countryDial || '+33',
      passwordHash,
      birthDate: birthDate || null,
    },
  });

  const token = signToken(user.id);
  setSessionCookie(res, token);

  res.status(201).json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
  }

  const token = signToken(user.id);
  setSessionCookie(res, token);

  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true });
});

// POST /api/auth/forgot-password
// body: { email }
// Always responds success (even if the email doesn't exist) so this endpoint can't be used
// to enumerate registered accounts.
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email requis.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    const resetUrl = `${FRONTEND_BASE_URL}/reset-password?token=${resetToken}`;

    try {
      await sendCustomerEmail({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe — Sakina Massage 974',
        html: `
          <div style="font-family: Georgia, serif; color: #2b2926; max-width: 560px;">
            <h2>Réinitialisation de mot de passe</h2>
            <p>Bonjour ${user.name.split(' ')[0]},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour en choisir un nouveau (valable 1 heure) :</p>
            <p><a href="${resetUrl}" style="color: #c9a24b;">${resetUrl}</a></p>
            <p style="color: #6b6b6b; font-size: 13px;">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Failed to send password reset email:', err);
    }
  }

  res.json({ success: true, message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' });
});

// POST /api/auth/reset-password
// body: { token, password }
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Jeton et nouveau mot de passe requis.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 6 caractères.' });
  }

  const user = await prisma.user.findUnique({ where: { resetToken: token } });

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ success: false, message: 'Ce lien de réinitialisation est invalide ou a expiré.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });

  res.json({ success: true, message: 'Votre mot de passe a été mis à jour.' });
});

// GET /api/auth/me — returns the current logged-in user, or 401 if none.
router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(401).json({ success: false, message: 'Utilisateur introuvable.' });

  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
  });
});

export default router;
