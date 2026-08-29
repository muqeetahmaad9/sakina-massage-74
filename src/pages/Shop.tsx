import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart, type Product } from '../context/CartContext';
import PackageFlyer from '../components/ui/PackageFlyer';
import { API_BASE } from '../config';

function ProductCard({ product }: { product: Product }) {
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

export default function Shop() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products.map((p: Product) => ({ ...p, image: '' })));
        }
      })
      .finally(() => setLoading(false));
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
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{t('shop.pageTitle')}</h1>
          <p className="text-gray-400 font-light max-w-xl mx-auto">
            {t('shop.pageSubtitle')}
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <p className="text-center text-gray-400 py-12">{t('shop.loading')}</p>
        ) : (
          <div className="space-y-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
