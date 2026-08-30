import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Certificate {
  src: string;
  titleKey: string;
  dateRange: string;
}

const certificates: Certificate[] = [
  { src: '/images/certifications/cert-magic-cupping.jpg', titleKey: 'magicCupping', dateRange: '14/02/24' },
  { src: '/images/certifications/cert-deep-tissue.jpg', titleKey: 'deepTissue', dateRange: '17/02/24 – 18/02/24' },
  { src: '/images/certifications/cert-massage-thailandais.jpg', titleKey: 'massageThailandais', dateRange: '15/02/24 – 16/02/24' },
  { src: '/images/certifications/cert-mix-massage-arts.jpg', titleKey: 'mixMassageArts', dateRange: '12/02/24 – 13/02/24' },
];

export default function Certifications() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20">
      <div className="bg-charcoal text-cream py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Award className="w-10 h-10 text-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t('certifications.pageTitle')}</h1>
          <p className="text-gray-400 font-light max-w-xl mx-auto">{t('certifications.pageSubtitle')}</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {certificates.map((cert, i) => (
            <motion.button
              key={cert.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setSelected(cert)}
              className="group text-left bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                {/* Source photos are portrait with the certificate top edge on the image's right side;
                    rotate counterclockwise to display landscape and right-side-up. To exactly cover
                    a 4:3 box after rotating, the pre-rotation box must be 3:4 (its width becomes
                    the visible height and vice versa) — so give the inner box aspect-[3/4] sized
                    to the container's diagonal-safe max dimension, then rotate. */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="w-full aspect-[3/4] -rotate-90" style={{ minWidth: '133.34%' }}>
                    <img
                      src={cert.src}
                      alt={t(`certifications.items.${cert.titleKey}`)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-charcoal mb-1">{t(`certifications.items.${cert.titleKey}`)}</h3>
                <p className="text-sm text-gray-500 font-light">{t('certifications.magicHands')} · {cert.dateRange}</p>
              </div>
            </motion.button>
          ))}
        </div>
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
              alt={t(`certifications.items.${selected.titleKey}`)}
              className="max-w-[85vh] max-h-[85vw] sm:max-w-[85vh] sm:max-h-[85vh] rounded-2xl object-contain -rotate-90"
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
