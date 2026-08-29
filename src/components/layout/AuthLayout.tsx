import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BG_IMAGE = 'https://images.pexels.com/photos/6628689/pexels-photo-6628689.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 bg-cream flex">
      {/* Left: background image, hidden on smaller screens to keep the form full-width there */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={BG_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-cream">
          <p className="text-sm tracking-[0.2em] uppercase text-gold mb-3">Sakina Massage 974</p>
          <h2 className="text-3xl font-serif leading-tight">
            {t('authLayout.title.line1')} <br />{t('authLayout.title.line2')}
          </h2>
        </div>
      </div>

      {/* Right: the form, passed in as children */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
