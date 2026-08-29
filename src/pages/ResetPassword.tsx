import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen pt-24 bg-cream pb-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full text-center">
          <h1 className="text-2xl font-serif text-charcoal mb-4">{t('resetPassword.invalidLink.title')}</h1>
          <p className="text-gray-500 font-light mb-8">{t('resetPassword.invalidLink.text')}</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center bg-charcoal text-cream px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold transition-all duration-300"
          >
            {t('resetPassword.invalidLink.cta')}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('resetPassword.errors.tooShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('resetPassword.errors.mismatch'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || t('resetPassword.errors.generic'));
      }
    } catch {
      setError(t('resetPassword.errors.server'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full"
      >
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-serif text-charcoal mb-4">{t('resetPassword.success.title')}</h1>
            <p className="text-gray-500 font-light">{t('resetPassword.success.text')}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-charcoal mb-2">{t('resetPassword.title')}</h1>
              <p className="text-gray-500 font-light text-sm">{t('resetPassword.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('resetPassword.newPasswordLabel')} <span className="text-gray-400 font-light italic">{t('resetPassword.passwordHint')}</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('resetPassword.confirmLabel')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-charcoal text-cream py-4 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-gold transition-colors disabled:opacity-60"
              >
                {submitting ? t('resetPassword.submitting') : t('resetPassword.submitCta')}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
