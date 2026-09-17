import { useTranslation } from 'react-i18next';

export const BANNER_HEIGHT_PX = 36;

export default function AnnouncementBanner() {
  const { t } = useTranslation();
  const message = t('announcementBanner.message');
  // Repeat the message so the marquee loops seamlessly regardless of viewport width.
  const items = Array.from({ length: 8 });

  return (
    <div
      className="fixed top-0 left-0 w-full z-[60] bg-charcoal text-gold overflow-hidden flex items-center"
      style={{ height: BANNER_HEIGHT_PX }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((_, i) => (
          <span key={i} className="text-xs tracking-widest uppercase font-medium px-8">
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
