import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LocationMap from '../ui/LocationMap';
import LogoMark from '../ui/Logo';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();

  const hours = [
    { day: t('footer.hours.monday'), time: '07:00 - 21:00' },
    { day: t('footer.hours.tuesday'), time: '07:00 - 21:00' },
    { day: t('footer.hours.wednesday'), time: '07:00 - 21:00' },
    { day: t('footer.hours.thursday'), time: '07:00 - 21:00' },
    { day: t('footer.hours.friday'), time: '07:00 - 21:00' },
    { day: t('footer.hours.saturday'), time: '07:00 - 21:00' },
    { day: t('footer.hours.sunday'), time: '08:00 - 17:00' },
  ];

  return (
    <footer className="bg-charcoal text-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LogoMark className="w-10 h-10 shrink-0" gradientId="footer-logo-gradient" />
              <h3 className="font-serif text-2xl tracking-widest">SAKINA MASSAGE 974</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">
              {t('footer.brandText')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/sakina_massage974/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-widest uppercase">{t('footer.navigation')}</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-gold transition-colors">{t('nav.book')}</Link>
              </li>
              <li>
                <Link to="/consent" className="hover:text-gold transition-colors">{t('footer.consentForm')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-widest uppercase">{t('nav.contact')}</h4>
            <LocationMap className="mb-4 w-full max-w-[180px] border border-gray-800" />
            <ul className="space-y-4 text-sm text-gray-400 font-light">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-gold shrink-0" />
                <span>130 Rue Marius et Ary Leblond<br />Saint-Paul, 97460<br />La Réunion, France</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gold" />
                <span>+92 303 5442047</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gold" />
                <span>contact@sakinamassage974.fr</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-widest uppercase">{t('footer.hoursTitle')}</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              {hours.map((h, i) => (
                <li
                  key={h.day}
                  className={`flex justify-between ${i < hours.length - 1 ? 'border-b border-gray-800 pb-2' : ''}`}
                >
                  <span>{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="#" className="hover:text-cream">{t('footer.legalNotice')}</Link>
            <Link to="#" className="hover:text-cream">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
