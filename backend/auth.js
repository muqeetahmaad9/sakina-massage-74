import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'sakina_session';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// In production the frontend (Vercel) and backend (Render) live on different domains, so the
// session cookie must be sent cross-site. That requires SameSite=None, which browsers only
// honor when the cookie is also Secure (HTTPS) — both hosts are HTTPS in production, so this
// is safe. Locally frontend and backend are on different ports of the same "site" (localhost),
// where Lax works fine and doesn't require HTTPS.
const isProduction = process.env.NODE_ENV === 'production';

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: SEVEN_DAYS_MS,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

// Middleware: attaches req.userId if a valid session cookie is present, else 401.
export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ success: false, message: 'Non authentifié' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session invalide ou expirée' });
  }
}

// Like requireAuth but doesn't fail if there's no session — just leaves req.userId undefined.
export function optionalAuth(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.userId;
    } catch {
      // ignore invalid token, treat as anonymous
    }
  }
  next();
}
