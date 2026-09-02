import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocationMap from '../components/ui/LocationMap';

const WHATSAPP_NUMBER = "262692208484"; // Configurable
const PHONE_NUMBER = "0692 20 84 84"; // Configurable
const EMAIL = "sakinamassage974@gmail.com"; // Configurable

export default function Contact() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
      // Reset after 3 seconds
      setTimeout(() => setFormState('idle'), 3000);
    }, 1500);
  };

  const hours = [
    { day: t('contact.hours.monday'), time: '07:00 - 21:00' },
    { day: t('contact.hours.tuesday'), time: '07:00 - 21:00' },
    { day: t('contact.hours.wednesday'), time: '07:00 - 21:00' },
    { day: t('contact.hours.thursday'), time: '07:00 - 21:00' },
    { day: t('contact.hours.friday'), time: '07:00 - 21:00' },
    { day: t('contact.hours.saturday'), time: '07:00 - 21:00' },
    { day: t('contact.hours.sunday'), time: '08:00 - 17:00' },
  ];

  return (
    <div className="pt-24 bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-charcoal text-cream py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t('contact.pageTitle')}</h1>
          <p className="text-gray-400 font-light max-w-xl mx-auto">
            {t('contact.pageSubtitle')}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif text-charcoal mb-8">{t('contact.visitUs')}</h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-charcoal mb-1">{t('contact.address.label')}</h3>
                  <p className="text-gray-600 font-light">
                    Sakina Massage 974<br />
                    130 Rue Marius et Ary Leblond<br />
                    Saint-Paul, 97460<br />
                    La Réunion, France
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-charcoal mb-1">{t('contact.phone.label')}</h3>
                  <p className="text-gray-600 font-light mb-2">{PHONE_NUMBER}</p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold hover:text-charcoal transition-colors underline underline-offset-4"
                  >
                    {t('contact.phone.whatsappCta')}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-charcoal mb-1">{t('contact.email.label')}</h3>
                  <a href={`mailto:${EMAIL}`} className="text-gray-600 font-light hover:text-gold transition-colors">
                    {EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <div className="w-full">
                  <h3 className="font-serif text-lg text-charcoal mb-2">{t('contact.hours.label')}</h3>
                  <ul className="text-sm text-gray-600 font-light space-y-2">
                    {hours.map((h, i) => (
                      <li
                        key={h.day}
                        className={`flex justify-between ${i < hours.length - 1 ? 'border-b border-gray-200 pb-1' : ''}`}
                      >
                        <span>{h.day}</span>
                        <span>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <h2 className="text-3xl font-serif text-charcoal mb-6">{t('contact.form.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.nameLabel')}</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.emailLabel')}</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.phoneLabel')}</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.messageLabel')}</label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formState !== 'idle'}
                className="w-full bg-charcoal text-cream py-4 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-gold transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {formState === 'submitting' ? (
                  <span className="flex items-center">{t('contact.form.sending')}</span>
                ) : formState === 'success' ? (
                  <span className="flex items-center text-green-400">{t('contact.form.sent')}</span>
                ) : (
                  <span className="flex items-center">
                    {t('contact.form.sendCta')} <Send className="w-4 h-4 ml-2" />
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Map */}
      <LocationMap aspect="aspect-auto" className="w-full h-[400px] rounded-none" cols={7} rows={3} />
    </div>
  );
}
