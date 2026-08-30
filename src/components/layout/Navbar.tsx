import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const changeLanguage = (lng: 'fr' | 'en') => i18n.changeLanguage(lng);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.certifications'), path: '/certifications' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col items-start z-50 shrink-0">
            <img src="/images/logo.png" alt="Sakina Massage 974" className="h-10 md:h-14 w-auto" />
            <span className="hidden md:block text-[10px] tracking-widest text-olive uppercase mt-0.5 whitespace-nowrap">
              {t('nav.tagline')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs lg:text-sm tracking-widest text-charcoal hover:text-gold transition-colors uppercase whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-1.5 border-l border-gray-300 pl-5 lg:pl-6">
              <button
                onClick={() => changeLanguage('fr')}
                className={`text-xs font-medium tracking-widest transition-colors ${i18n.language === 'fr' ? 'text-gold' : 'text-gray-400 hover:text-charcoal'}`}
              >
                FR
              </button>
              <span className="text-gray-300 text-xs">/</span>
              <button
                onClick={() => changeLanguage('en')}
                className={`text-xs font-medium tracking-widest transition-colors ${i18n.language === 'en' ? 'text-gold' : 'text-gray-400 hover:text-charcoal'}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs lg:text-sm text-charcoal whitespace-nowrap">
                  <User className="w-4 h-4 text-gold shrink-0" />
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-charcoal transition-colors"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-xs lg:text-sm tracking-widest text-charcoal hover:text-gold transition-colors uppercase whitespace-nowrap">
                {t('nav.login')}
              </Link>
            )}

            <Link to="/cart" className="relative text-charcoal hover:text-gold transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/book"
              className="bg-charcoal text-cream px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-gold transition-colors duration-300"
            >
              {t('nav.book')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden z-50 flex items-center gap-4">
            <Link to="/cart" className="relative text-charcoal">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-charcoal p-2 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-cream z-40 flex flex-col justify-center items-center space-y-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xl font-serif tracking-widest text-charcoal hover:text-gold transition-colors uppercase"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => changeLanguage('fr')}
                className={`text-sm font-medium tracking-widest transition-colors ${i18n.language === 'fr' ? 'text-gold' : 'text-gray-400 hover:text-charcoal'}`}
              >
                FR
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => changeLanguage('en')}
                className={`text-sm font-medium tracking-widest transition-colors ${i18n.language === 'en' ? 'text-gold' : 'text-gray-400 hover:text-charcoal'}`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex flex-col items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-charcoal">
                  <User className="w-4 h-4 text-gold" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs tracking-widest text-gray-400 hover:text-charcoal transition-colors uppercase"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium tracking-widest text-charcoal hover:text-gold transition-colors uppercase"
              >
                {t('nav.login')}
              </Link>
            )}

            <Link
              to="/book"
              className="bg-charcoal text-cream px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold transition-colors duration-300 mt-4"
            >
              {t('nav.book')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
