import { Droplet, Leaf, PersonStanding } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PackageFlyerProps {
  title: string;
  subtitle: string;
  sessions: number;
  price: number;
  benefits: { icon: 'droplet' | 'leaf' | 'legs'; label: string }[];
  className?: string;
}

const iconMap = {
  droplet: Droplet,
  leaf: Leaf,
  legs: PersonStanding,
};

export default function PackageFlyer({ title, subtitle, sessions, price, benefits, className = '' }: PackageFlyerProps) {
  const { t } = useTranslation();

  return (
    <div className={`relative w-full h-full bg-gradient-to-b from-[#f6f1e7] to-[#efe6d3] p-6 flex flex-col ${className}`}>
      {/* Decorative corner leaves */}
      <svg className="absolute top-3 left-3 w-10 h-10 text-olive/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 20c6-1 10-6 10-14C8 8 4 12 4 20z" />
      </svg>
      <svg className="absolute bottom-3 right-3 w-10 h-10 text-olive/30 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 20c6-1 10-6 10-14C8 8 4 12 4 20z" />
      </svg>

      {/* Brand */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-1 mb-1">
          <svg viewBox="0 0 100 20" className="w-24 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 15 Q 20 2, 35 12 T 70 8 T 98 14" />
          </svg>
        </div>
        <p className="text-[10px] tracking-[0.25em] text-charcoal uppercase font-semibold">Sakina Massage 974</p>
        <p className="text-[8px] tracking-[0.2em] text-olive uppercase mt-0.5">{t('packageFlyer.tagline')}</p>
      </div>

      {/* Title */}
      <div className="text-center mb-3">
        <h3 className="text-xl font-serif text-charcoal leading-tight">{title}</h3>
        <p className="text-[10px] tracking-widest text-gray-500 uppercase mt-1">{subtitle}</p>
      </div>

      {/* Sessions + Price badges */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-charcoal text-cream rounded-full px-4 py-1.5 text-xs font-medium tracking-wide">
          {t('packageFlyer.sessions', { count: sessions })}
        </div>
        <div className="border border-gold rounded-full px-4 py-1.5 text-xs font-medium text-charcoal">
          {price}&nbsp;€
        </div>
      </div>

      {/* Benefits */}
      <div className="flex-1 space-y-2.5 mb-2">
        {benefits.map((b, i) => {
          const Icon = iconMap[b.icon];
          return (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-olive/15 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-olive" />
              </div>
              <p className="text-[11px] text-gray-700 font-light leading-snug">{b.label}</p>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[10px] italic text-gray-500 font-serif mt-auto">
        {t('packageFlyer.footerText')}
      </p>
    </div>
  );
}
