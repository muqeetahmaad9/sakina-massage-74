import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-charcoal mb-4">{t('cart.pageTitle')}</h1>
          <p className="text-gray-500 font-light">{t('cart.pageSubtitle')}</p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-charcoal mb-4">{t('cart.empty.title')}</h2>
            <p className="text-gray-500 font-light mb-8">{t('cart.empty.text')}</p>
            <Link
              to="/services"
              className="inline-flex items-center justify-center bg-charcoal text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold transition-all duration-300"
            >
              {t('cart.empty.cta')}
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
              <div className="space-y-6">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col sm:flex-row gap-4 sm:items-center pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <img src={item.image} alt={item.name} className="w-full sm:w-24 h-24 object-cover rounded-xl shrink-0" />

                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-charcoal mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 font-light">
                        {t('cart.sessionsAndValidity', { count: item.appointments, validity: item.validity })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:text-charcoal transition-colors"
                          aria-label={t('cart.decreaseQty')}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:text-charcoal transition-colors"
                          aria-label={t('cart.increaseQty')}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="w-20 text-right font-medium text-olive">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={t('cart.removeItem')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-serif text-charcoal">{t('cart.total')}</span>
                <span className="text-2xl font-medium text-olive">{totalPrice.toFixed(2)} €</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="flex-1 border border-charcoal text-charcoal px-8 py-4 text-sm tracking-widest uppercase text-center hover:bg-gray-50 transition-colors"
                >
                  {t('cart.continueShopping')}
                </Link>
                <Link
                  to="/checkout"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-charcoal text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold transition-all duration-300"
                >
                  {t('cart.checkout')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
