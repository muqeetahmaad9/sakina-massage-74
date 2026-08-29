import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function Checkout() {
  const { t } = useTranslation();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen pt-24 bg-cream pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-3xl font-serif text-charcoal mb-4">{t('checkout.emptyCart.title')}</h1>
          <p className="text-gray-500 font-light mb-8">{t('checkout.emptyCart.text')}</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-charcoal text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold transition-all duration-300"
          >
            {t('checkout.emptyCart.cta')}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep('success');
        clearCart();
      } else {
        setError(data.message || t('checkout.errors.generic'));
      }
    } catch {
      setError(t('checkout.errors.server'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-charcoal mb-4">{t('checkout.pageTitle')}</h1>
          <p className="text-gray-500 font-light">{t('checkout.pageSubtitle')}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center mb-8">
                  <button onClick={() => navigate('/cart')} className="text-gray-400 hover:text-charcoal transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl font-serif text-charcoal text-center flex-1 pr-6">
                    {user ? t('checkout.confirmOrder') : t('checkout.loginToContinue')}
                  </h2>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-8">
                  <h3 className="text-sm uppercase tracking-widest text-charcoal font-medium mb-3">{t('checkout.summary')}</h3>
                  <ul className="space-y-2 text-sm text-gray-600 mb-3">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-charcoal">{(item.price * item.quantity).toFixed(2)} €</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-base font-medium text-charcoal border-t border-gray-200 pt-3">
                    <span>{t('checkout.total')}</span>
                    <span className="text-olive">{totalPrice.toFixed(2)} €</span>
                  </div>
                </div>

                {!user ? (
                  <div className="text-center py-6">
                    <LogIn className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" />
                    <p className="text-gray-500 font-light mb-8">
                      {t('checkout.loginRequired')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                      <Link
                        to="/login"
                        className="flex-1 bg-charcoal text-cream px-6 py-3 rounded-xl text-sm tracking-widest uppercase text-center hover:bg-gold transition-colors"
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        to="/signup"
                        className="flex-1 border border-charcoal text-charcoal px-6 py-3 rounded-xl text-sm tracking-widest uppercase text-center hover:bg-gray-50 transition-colors"
                      >
                        {t('checkout.signup')}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600">
                      {t('checkout.orderInNameOf')} <span className="font-medium text-charcoal">{user.name}</span> ({user.email})
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-charcoal text-cream py-4 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-gold transition-colors mt-8 disabled:opacity-60"
                    >
                      {submitting ? t('checkout.processing') : t('checkout.confirmOrder')}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-serif text-charcoal mb-4">{t('checkout.success.thanks', { name: user?.name.split(' ')[0] })}</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">
                  {t('checkout.success.text')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                  <Link
                    to="/book"
                    className="bg-charcoal text-white px-6 py-3 rounded-xl text-xs font-medium tracking-widest uppercase hover:bg-gold transition-colors flex-1 text-center"
                  >
                    {t('checkout.success.bookCta')}
                  </Link>
                  <Link
                    to="/"
                    className="border border-charcoal text-charcoal px-6 py-3 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors flex-1 text-center"
                  >
                    {t('checkout.success.homeCta')}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
