import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WHATSAPP_NUMBER = "262692208484"; // Configurable

export default function WhatsAppButton() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Navigate the current tab (instead of opening a new one) so it goes straight into
    // the WhatsApp chat — on mobile this hands off to the app directly; on desktop it
    // avoids an extra blank tab before WhatsApp Web takes over.
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.message'))}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          <div className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-charcoal hidden md:block border border-gray-100">
            {t('whatsapp.needHelp')}
          </div>
          <button
            onClick={handleClick}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
            aria-label="Contact us on WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
