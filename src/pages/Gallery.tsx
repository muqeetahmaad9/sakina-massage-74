import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GalleryImage {
  src: string;
  altKey: string;
}

interface GallerySection {
  key: string;
  title: string;
  images: GalleryImage[];
}

const sections: GallerySection[] = [
  {
    key: 'nails',
    title: 'Nails',
    images: [
      {
        src: 'https://images.pexels.com/photos/34885844/pexels-photo-34885844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'nails1',
      },
      {
        src: 'https://images.pexels.com/photos/34835304/pexels-photo-34835304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'nails2',
      },
      {
        src: 'https://images.pexels.com/photos/7066298/pexels-photo-7066298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'nails3',
      },
      {
        src: 'https://images.pexels.com/photos/5871920/pexels-photo-5871920.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'nails4',
      },
    ],
  },
  {
    key: 'headSpa',
    title: 'Head Spa',
    images: [
      {
        src: 'https://images.pexels.com/photos/7755473/pexels-photo-7755473.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'headSpa1',
      },
      {
        src: 'https://images.pexels.com/photos/23349902/pexels-photo-23349902.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'headSpa2',
      },
      {
        src: 'https://images.pexels.com/photos/23349910/pexels-photo-23349910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'headSpa3',
      },
    ],
  },
  {
    key: 'wellnessCenter',
    title: 'Centre de Bien-être',
    images: [
      {
        src: 'https://images.pexels.com/photos/1926811/pexels-photo-1926811.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'wellness1',
      },
      {
        src: 'https://images.pexels.com/photos/6560273/pexels-photo-6560273.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'wellness2',
      },
      {
        src: 'https://images.pexels.com/photos/6724539/pexels-photo-6724539.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'wellness3',
      },
      {
        src: 'https://images.pexels.com/photos/8789649/pexels-photo-8789649.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'wellness4',
      },
    ],
  },
  {
    key: 'anissahCare',
    title: "Les soins d'Anissah",
    images: [
      {
        src: 'https://images.pexels.com/photos/6560283/pexels-photo-6560283.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'anissah1',
      },
      {
        src: 'https://images.pexels.com/photos/6186750/pexels-photo-6186750.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'anissah2',
      },
      {
        src: 'https://images.pexels.com/photos/6628700/pexels-photo-6628700.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'anissah3',
      },
      {
        src: 'https://images.pexels.com/photos/5888064/pexels-photo-5888064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600',
        altKey: 'anissah4',
      },
    ],
  },
  {
    key: 'salon',
    title: 'Le Salon',
    images: [
      { src: '/images/salon/salon-01.jpg', altKey: 'salon1' },
      { src: '/images/salon/salon-02.jpg', altKey: 'salon2' },
      { src: '/images/salon/salon-03.jpg', altKey: 'salon3' },
      { src: '/images/salon/salon-04.jpg', altKey: 'salon4' },
      { src: '/images/salon/salon-05.jpg', altKey: 'salon5' },
      { src: '/images/salon/salon-06.jpg', altKey: 'salon6' },
      { src: '/images/salon/salon-07.jpg', altKey: 'salon7' },
      { src: '/images/salon/salon-08.jpg', altKey: 'salon8' },
      { src: '/images/salon/salon-09.jpg', altKey: 'salon9' },
      { src: '/images/salon/salon-10.jpg', altKey: 'salon10' },
      { src: '/images/salon/salon-11.jpg', altKey: 'salon11' },
      { src: '/images/salon/salon-12.jpg', altKey: 'salon12' },
      { src: '/images/salon/salon-13.jpg', altKey: 'salon13' },
      { src: '/images/salon/salon-14.jpg', altKey: 'salon14' },
      { src: '/images/salon/salon-15.jpg', altKey: 'salon15' },
      { src: '/images/salon/salon-16.jpg', altKey: 'salon16' },
    ],
  },
];

export default function Gallery() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20">
      <div className="bg-[#c9d6bd] py-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-serif text-charcoal italic"
        >
          Gallery
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sections.map((section, sIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: sIndex * 0.05 }}
            className="mb-16 last:mb-0"
          >
            <h2 className="text-2xl font-serif italic text-charcoal mb-8">{section.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {section.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(image)}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                >
                  <img
                    src={image.src}
                    alt={t(`gallery.alt.${image.altKey}`)}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
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
              alt={t(`gallery.alt.${selected.altKey}`)}
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
