import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OfferImage {
  src: string;
  alt: string;
}

export default function Offers() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<OfferImage | null>(null);

  const offers: OfferImage[] = [
    {
      src: i18n.language === 'fr' ? '/images/offers/chair-massage-fr.jpg' : '/images/offers/chair-massage-en.jpg',
      alt: t('offers.items.chairMassage'),
    },
    {
      src: '/images/offers/journee-bien-etre.jpg',
      alt: t('offers.items.journeeBienEtre'),
    },
  ];

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20">
      <div className="bg-charcoal text-cream py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t('offers.pageTitle')}</h1>
          <p className="text-gray-400 font-light max-w-xl mx-auto">{t('offers.pageSubtitle')}</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {offers.length === 0 ? (
          <p className="text-center text-gray-400 font-light py-20">{t('offers.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                onClick={() => setSelected(offer)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f6f1e7] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <img
                  src={offer.src}
                  alt={offer.alt}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/90 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selected.src}
              alt={selected.alt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 text-cream hover:text-gold transition-colors"
              aria-label={t('gallery.close')}
            >
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
