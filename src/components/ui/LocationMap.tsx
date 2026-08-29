import { useTranslation } from 'react-i18next';

// Static map thumbnail built from OpenStreetMap tiles (no API key required).
// Centered on: 130 Rue Marius et Ary Leblond, Saint-Paul, 97460, La Réunion
const LAT = -21.0071259;
const LON = 55.2735255;
const ZOOM = 16;
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=130+Rue+Marius+et+Ary+Leblond,+Saint-Paul,+97460,+La+R%C3%A9union';

function tileCoords(lat: number, lon: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const xtileF = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const ytileF = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return {
    x: Math.floor(xtileF),
    y: Math.floor(ytileF),
    fracX: xtileF - Math.floor(xtileF),
    fracY: ytileF - Math.floor(ytileF),
  };
}

const { x, y, fracX, fracY } = tileCoords(LAT, LON, ZOOM);

interface LocationMapProps {
  className?: string;
  aspect?: string;
  /** Number of tile columns/rows to fetch around the center point. Use a wider grid for wide banners. */
  cols?: number;
  rows?: number;
}

export default function LocationMap({ className = '', aspect = 'aspect-square', cols = 3, rows = 3 }: LocationMapProps) {
  const { t } = useTranslation();
  const colOffsets = Array.from({ length: cols }, (_, i) => i - Math.floor(cols / 2));
  const rowOffsets = Array.from({ length: rows }, (_, i) => i - Math.floor(rows / 2));

  // Pin position as a percentage within the composed grid (center tile + fractional offset within it)
  const pinLeftPct = ((Math.floor(cols / 2) + fracX) / cols) * 100;
  const pinTopPct = ((Math.floor(rows / 2) + fracY) / rows) * 100;

  return (
    <a
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden rounded-2xl ${aspect} ${className}`}
      aria-label={t('locationMap.ariaLabel')}
    >
      <div
        className="absolute inset-0 grid transition-transform duration-500 group-hover:scale-105"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {rowOffsets.map((dy) =>
          colOffsets.map((dx) => (
            <img
              key={`${dx}_${dy}`}
              src={`https://tile.openstreetmap.org/${ZOOM}/${x + dx}/${y + dy}.png`}
              alt=""
              className="block w-full h-full object-cover"
              loading="lazy"
            />
          ))
        )}
      </div>

      {/* Pin marker, positioned at the exact address within the tile grid */}
      <svg
        viewBox="0 0 24 24"
        className="absolute w-8 h-8 drop-shadow-md"
        style={{ left: `${pinLeftPct}%`, top: `${pinTopPct}%`, transform: 'translate(-50%, -95%)' }}
      >
        <path
          d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8z"
          fill="#c9a24b"
          stroke="#1c1c1c"
          strokeWidth="1"
        />
        <circle cx="12" cy="8" r="3" fill="#1c1c1c" />
      </svg>

      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />

      <div className="absolute bottom-0 left-0 right-0 bg-charcoal/80 backdrop-blur-sm text-cream text-xs tracking-widest uppercase text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {t('locationMap.viewDirections')}
      </div>
    </a>
  );
}
