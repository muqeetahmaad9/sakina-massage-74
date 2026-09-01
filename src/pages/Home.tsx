import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const reviewKeys = ['review1', 'review2', 'review3', 'review4', 'review5', 'review6'];

const services = [
  {
    key: 'headSpaPremium',
    title: 'Head Spa Premium',
    price: '100 €',
    image: '/images/flyers/headspa-japonais-flyer.jpg',
    isFlyerImage: true
  },
  {
    key: 'roseTherapie',
    title: 'La Rose Thérapie & Body Touch Oriental',
    price: '150 €',
    image: '/images/flyers/rose-therapie-flyer.jpg',
    isFlyerImage: true
  },
  {
    key: 'deepTissueCupping',
    title: 'Massage Deep Tissue + Ventouse',
    price: '110 €',
    image: '/images/flyers/massage-relaxant-cupping-flyer.jpg',
    isFlyerImage: true
  }
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.pexels.com/photos/9146378/pexels-photo-9146378.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920"
            alt="Sakina Massage 974 Spa Environment"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-charcoal/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-gold tracking-[0.3em] uppercase text-sm font-medium mb-6 block">
              {t('nav.tagline')}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-cream mb-8 leading-tight">
              {t('home.hero.title.line1')} <br className="hidden md:block" />{t('home.hero.title.line2')}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <Link
                to="/book"
                className="bg-cream text-charcoal px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold hover:text-cream transition-all duration-300 w-full sm:w-auto text-center"
              >
                {t('home.hero.bookCta')}
              </Link>
              <a
                href="#services"
                className="text-cream px-8 py-4 text-sm tracking-widest uppercase border border-cream/30 hover:bg-cream/10 transition-all duration-300 w-full sm:w-auto text-center"
              >
                {t('home.hero.discoverCta')}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-cream/70 text-xs tracking-widest uppercase writing-vertical">{t('home.hero.scroll')}</span>
          <div className="w-[1px] h-12 bg-cream/30 relative overflow-hidden">
            <motion.div
              className="w-full h-1/2 bg-cream absolute top-0"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-tl-[100px] rounded-br-[100px]">
                <img
                  src="/images/anissah-portrait.jpg"
                  alt="Anissah, praticienne Sakina Massage 974"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gold/10 rounded-full -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm tracking-[0.2em] text-olive uppercase mb-4">{t('home.about.eyebrow')}</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-charcoal mb-8 leading-tight">
                {t('home.about.title.line1')} <br/>{t('home.about.title.line2')}
              </h3>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                {t('home.about.paragraph1')}
              </p>
              <p className="text-gray-600 mb-10 font-light leading-relaxed">
                {t('home.about.paragraph2')}
              </p>
              <Link to="/contact" className="inline-flex items-center text-sm tracking-widest uppercase text-charcoal hover:text-gold transition-colors font-medium">
                {t('home.about.learnMore')} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm tracking-[0.2em] text-olive uppercase mb-4">{t('home.services.eyebrow')}</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-charcoal">{t('home.services.title')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group cursor-pointer bg-cream p-4 rounded-2xl hover:shadow-xl transition-all duration-500"
              >
                <div
                  className={`overflow-hidden rounded-xl mb-6 relative aspect-[4/3] ${
                    service.isFlyerImage ? 'bg-[#f6f1e7]' : ''
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full group-hover:scale-105 transition-transform duration-700 ${
                      service.isFlyerImage ? 'object-contain' : 'object-cover'
                    }`}
                  />
                  <div className="absolute top-4 right-4 bg-cream/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-charcoal">
                    {t(`home.services.items.${service.key}.time`)}
                  </div>
                </div>
                <div className="px-4 pb-6 text-center">
                  <h4 className="text-xl font-serif text-charcoal mb-3">{service.title}</h4>
                  <p className="text-sm text-gray-500 mb-6 font-light line-clamp-2">{t(`home.services.items.${service.key}.desc`)}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-medium text-olive">{service.price}</span>
                    <Link to="/book" className="text-xs tracking-widest uppercase font-semibold text-charcoal hover:text-gold transition-colors">
                      {t('home.services.bookLink')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/services" className="inline-flex items-center justify-center bg-charcoal text-cream px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold transition-all duration-300">
              {t('home.services.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="relative py-32 overflow-hidden bg-charcoal">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="https://videos.pexels.com/video-files/9154526/9154526-uhd_4096_2160_25fps.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-serif text-cream mb-8 leading-tight">
            {t('home.video.title')}
          </h2>
          <p className="text-lg text-cream/80 font-light mb-12 max-w-2xl mx-auto">
            {t('home.video.text')}
          </p>
          <Link to="/book" className="inline-block bg-gold text-charcoal px-10 py-4 text-sm tracking-widest uppercase hover:bg-cream transition-all duration-300 font-medium">
            {t('home.video.cta')}
          </Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm tracking-[0.2em] text-olive uppercase mb-4">{t('home.reviews.eyebrow')}</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-charcoal">{t('home.reviews.title')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviewKeys.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-cream p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-gray-600 font-light leading-relaxed mb-6 italic">
                  "{t(`home.reviews.items.${key}.text`)}"
                </p>
                <p className="text-sm font-medium text-charcoal tracking-wide">
                  {t(`home.reviews.items.${key}.author`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm tracking-[0.2em] text-olive uppercase mb-4">@sakina_massage974</h2>
          <h3 className="text-3xl md:text-4xl font-serif text-charcoal mb-12">{t('home.instagram.title')}</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              'https://images.pexels.com/photos/6186738/pexels-photo-6186738.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/11001991/pexels-photo-11001991.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/6628649/pexels-photo-6628649.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/9146378/pexels-photo-9146378.jpeg?auto=compress&cs=tinysrgb&w=600'
            ].map((src, i) => (
              <a
                key={i}
                href="https://www.instagram.com/sakina_massage974/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-light block"
              >
                <img
                  src={src}
                  alt="Instagram Post"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium tracking-widest uppercase">{t('home.instagram.viewOn')}</span>
                </div>
              </a>
            ))}
          </div>

          <a
            href="https://www.instagram.com/sakina_massage974/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm tracking-widest uppercase text-charcoal hover:text-gold transition-colors font-medium border-b border-charcoal hover:border-gold pb-1"
          >
            {t('home.instagram.followUs')}
          </a>
        </div>
      </section>
    </div>
  );
}
