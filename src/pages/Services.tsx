import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Clock, Sparkles, Check, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart, type Product } from '../context/CartContext';
import PackageFlyer from '../components/ui/PackageFlyer';
import { API_BASE } from '../config';

interface Service {
  key: string;
  name: string;
  duration: string;
  price: string;
  image: string;
  hasDetails?: boolean;
  hasBenefits?: boolean;
  hasIdealFor?: boolean;
  hasNote?: boolean;
}

interface Category {
  key: string;
  title: string;
  services: Service[];
}

const categories: Category[] = [
  {
    key: 'massagesByAnissah',
    title: 'Massages By Anissah',
    services: [
      {
        key: 'massageDuo',
        name: 'Massage Duo - Résa Uniquement Le Samedi',
        duration: '1 heure',
        price: '120 €',
        image: 'https://images.pexels.com/photos/7365434/pexels-photo-7365434.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasDetails: true,
        hasNote: true,
      },
      {
        key: 'roseTherapieBodyTouch',
        name: 'La Rose Thérapie & Massage Body Touch Oriental',
        duration: '1h30',
        price: '150 €',
        image: 'https://images.pexels.com/photos/6186755/pexels-photo-6186755.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasDetails: true,
        hasBenefits: true,
        hasNote: true,
      },
    ],
  },
  {
    key: 'curesAnissah',
    title: "Les Cures d'Anissah",
    services: [
      {
        key: 'massageDrainant',
        name: 'Massage Drainant',
        duration: '1 heure',
        price: '75 €',
        image: 'https://images.pexels.com/photos/5888064/pexels-photo-5888064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasBenefits: true,
        hasIdealFor: true,
      },
    ],
  },
  {
    key: 'headSpaFormulas',
    title: "Les Formules Head Spa d'Anissah",
    services: [
      {
        key: 'headSpaPremium',
        name: 'Head Spa Premium',
        duration: '1 heure',
        price: '100 €',
        image: 'https://images.pexels.com/photos/3865827/pexels-photo-3865827.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasBenefits: true,
      },
      {
        key: 'headSpaMassageRelaxant',
        name: 'Head Spa + Massage Relaxant',
        duration: '1 heure',
        price: '100 €',
        image: 'https://images.pexels.com/photos/6629547/pexels-photo-6629547.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasDetails: true,
        hasBenefits: true,
        hasNote: true,
      },
      {
        key: 'headSpaMassageRelaxantDuo',
        name: 'Head Spa + Massage Relaxant En Duo',
        duration: '1h30',
        price: '150 €',
        image: 'https://images.pexels.com/photos/6188051/pexels-photo-6188051.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasDetails: true,
        hasBenefits: true,
        hasNote: true,
      },
    ],
  },
  {
    key: 'bonCadeau',
    title: "Bon De Cadeau D'anissah",
    services: [
      {
        key: 'bonCadeauMassageRelaxant',
        name: 'Bon Cadeau - Massage Relaxant',
        duration: '1 heure',
        price: '60 €',
        image: 'https://images.pexels.com/photos/12899589/pexels-photo-12899589.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasDetails: true,
      },
    ],
  },
  {
    key: 'cuppingTherapy',
    title: 'Ventousothérapie / Cupping Therapy By Anissah',
    services: [
      {
        key: 'deepTissueCupping',
        name: 'Massage Deep Tissue + Ventouse',
        duration: '1 heure',
        price: '110 €',
        image: 'https://images.pexels.com/photos/8312867/pexels-photo-8312867.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasDetails: true,
      },
    ],
  },
  {
    key: 'footSpa',
    title: 'Foot Spa',
    services: [
      {
        key: 'footSpa',
        name: 'Foot Spa',
        duration: '1 heure',
        price: '100 €',
        image: 'https://images.pexels.com/photos/4085445/pexels-photo-4085445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
        hasDetails: true,
        hasBenefits: true,
        hasNote: true,
      },
    ],
  },
];

function PackageCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row">
      <div className="md:w-80 shrink-0 aspect-[4/3] overflow-hidden">
        <PackageFlyer
          title="Massage Drainage Lymphatique"
          subtitle={t('shop.flyer.subtitle')}
          sessions={product.appointments}
          price={product.price}
          benefits={[
            { icon: 'droplet', label: t('shop.flyer.benefit1') },
            { icon: 'leaf', label: t('shop.flyer.benefit2') },
            { icon: 'legs', label: t('shop.flyer.benefit3') },
          ]}
        />
      </div>

      <div className="p-6 md:p-10 flex-1 flex flex-col">
        <h4 className="text-2xl font-serif text-charcoal mb-2">{product.name}</h4>
        <p className="text-lg font-medium text-olive mb-6">{product.price.toFixed(2)} €</p>

        <ul className="text-sm text-gray-600 font-light space-y-2 mb-8">
          <li>
            <span className="font-medium text-charcoal">{t('shop.applicableServices')} </span>
            {product.applicableServices}
          </li>
          <li>
            <span className="font-medium text-charcoal">{t('shop.sessionsCount')} </span>
            {product.appointments}
          </li>
          <li>
            <span className="font-medium text-charcoal">{t('shop.validity')} </span>
            {product.validity}
          </li>
        </ul>

        <button
          onClick={handleAdd}
          className={`mt-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 self-start ${
            added ? 'bg-green-600 text-white' : 'bg-charcoal text-cream hover:bg-gold'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> {t('shop.added')}
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> {t('shop.addToCart')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products.map((p: Product) => ({ ...p, image: '' })));
        }
      })
      .finally(() => setProductsLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20">
      {/* Header */}
      <div className="bg-charcoal text-cream py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t('services.pageTitle')}</h1>
          <p className="text-gray-400 font-light max-w-xl mx-auto">
            {t('services.pageSubtitle')}
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: catIndex * 0.05 }}
            className="mb-16 last:mb-0"
          >
            <div className="text-center mb-10">
              <h2 className="text-sm tracking-[0.2em] text-olive uppercase mb-3">{t('services.categoryLabel')}</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-charcoal">{category.title}</h3>
            </div>

            <div className="space-y-8">
              {category.services.map((service) => {
                const base = `services.items.${service.key}`;
                const benefits = service.hasBenefits ? (t(`${base}.benefits`, { returnObjects: true }) as string[]) : [];
                const idealFor = service.hasIdealFor ? (t(`${base}.idealFor`, { returnObjects: true }) as string[]) : [];
                const details = service.hasDetails ? (t(`${base}.details`, { returnObjects: true }) as string[]) : [];

                return (
                  <div
                    key={service.name}
                    className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row"
                  >
                    <div className="md:w-80 shrink-0 aspect-[4/3] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="p-6 md:p-10 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <h4 className="text-2xl font-serif text-charcoal">{service.name}</h4>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="flex items-center text-sm text-gray-500 font-light">
                            <Clock className="w-4 h-4 mr-1.5 text-gold" />
                            {service.duration}
                          </span>
                          <span className="text-lg font-medium text-olive">{service.price}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 font-light leading-relaxed mb-4">{t(`${base}.intro`)}</p>

                      {details.map((para, i) => (
                        <p key={i} className="text-gray-600 font-light leading-relaxed mb-4">
                          {para}
                        </p>
                      ))}

                      {service.hasBenefits && (
                        <div className="mb-4">
                          <h5 className="text-sm uppercase tracking-widest text-charcoal font-medium mb-3 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-gold" />
                            {t('services.benefitsLabel')}
                          </h5>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {benefits.map((b, i) => (
                              <li key={i} className="text-sm text-gray-600 font-light flex items-start">
                                <span className="text-gold mr-2">•</span>
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.hasIdealFor && (
                        <div className="mb-4">
                          <h5 className="text-sm uppercase tracking-widest text-charcoal font-medium mb-3">{t('services.idealForLabel')}</h5>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {idealFor.map((b, i) => (
                              <li key={i} className="text-sm text-gray-600 font-light flex items-start">
                                <span className="text-gold mr-2">•</span>
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.hasNote && (
                        <p className="text-sm text-gray-500 italic font-light mb-6">{t(`${base}.note`)}</p>
                      )}

                      <Link
                        to="/book"
                        className="inline-flex items-center justify-center bg-charcoal text-cream px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold transition-all duration-300"
                      >
                        {t('services.bookCta')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Package deals (formerly the standalone Shop page) */}
        {!productsLoading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 last:mb-0"
          >
            <div className="text-center mb-10">
              <h2 className="text-sm tracking-[0.2em] text-olive uppercase mb-3">{t('services.categoryLabel')}</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-charcoal">{t('shop.pageTitle')}</h3>
              <p className="text-gray-500 font-light max-w-xl mx-auto mt-4">{t('shop.pageSubtitle')}</p>
            </div>

            <div className="space-y-8">
              {products.map((product) => (
                <PackageCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
