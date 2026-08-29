import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PhoneInput from '../components/ui/PhoneInput';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryDial: '+33',
    password: '',
    confirmPassword: '',
    birthDate: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError(t('signup.errors.passwordTooShort'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.errors.passwordMismatch'));
      return;
    }
    if (!agreed) {
      setError(t('signup.errors.mustAgree'));
      return;
    }

    setSubmitting(true);
    const result = await signup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      countryDial: formData.countryDial,
      password: formData.password,
      birthDate: formData.birthDate,
    });
    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(result.message || t('signup.errors.generic'));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 bg-cream pb-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-md w-full"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-serif text-charcoal mb-4">{t('signup.success.title')}</h1>
          <p className="text-gray-500 font-light">{t('signup.success.text')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthLayout>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">{t('signup.title')}</h1>
          <p className="text-gray-500 font-light text-sm">{t('signup.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.fullNameLabel')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.emailLabel')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.phoneLabel')}</label>
            <PhoneInput
              value={formData.phone}
              onChange={(v) => setFormData({ ...formData, phone: v })}
              countryDial={formData.countryDial}
              onCountryChange={(dial) => setFormData({ ...formData, countryDial: dial })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('signup.passwordLabel')} <span className="text-gray-400 font-light italic">{t('signup.passwordHint')}</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.confirmPasswordLabel')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('signup.birthDateLabel')}</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-600 font-light pt-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-gold"
            />
            <span>
              {t('signup.agreePrefix')}{' '}
              <Link to="#" className="text-charcoal underline hover:text-gold">
                {t('signup.privacyPolicy')}
              </Link>{' '}
              {t('signup.agreeAnd')}{' '}
              <Link to="#" className="text-charcoal underline hover:text-gold">
                {t('signup.terms')}
              </Link>
              .
            </span>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-charcoal text-cream py-4 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-gold transition-colors disabled:opacity-60"
          >
            {submitting ? t('signup.submitting') : t('signup.submitCta')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-light mt-8">
          {t('signup.hasAccount')}{' '}
          <Link to="/login" className="text-charcoal font-medium hover:text-gold transition-colors">
            {t('signup.loginLink')}
          </Link>
        </p>
    </AuthLayout>
  );
}
