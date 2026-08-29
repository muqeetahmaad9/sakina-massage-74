import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_BASE = 'http://localhost:5000/api';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSent(true);
      } else {
        setError(data.message || t('forgotPassword.errors.generic'));
      }
    } catch {
      setError(t('forgotPassword.errors.server'));
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
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-serif text-charcoal mb-4">{t('forgotPassword.sent.title')}</h1>
            <p className="text-gray-500 font-light mb-8">
              {t('forgotPassword.sent.text')}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center bg-charcoal text-cream px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold transition-all duration-300"
            >
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-charcoal mb-2">{t('forgotPassword.title')}</h1>
              <p className="text-gray-500 font-light text-sm">
                {t('forgotPassword.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('forgotPassword.emailLabel')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {submitting ? t('forgotPassword.sending') : t('forgotPassword.submitCta')}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 font-light mt-8">
              <Link to="/login" className="text-charcoal font-medium hover:text-gold transition-colors">
                {t('forgotPassword.backToLogin')}
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
