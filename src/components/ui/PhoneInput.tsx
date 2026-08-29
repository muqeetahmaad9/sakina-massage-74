import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { countries, flagFromCode } from '../../data/countries';

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  countryDial: string;
  onCountryChange: (dial: string) => void;
  required?: boolean;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  countryDial,
  onCountryChange,
  required = false,
  className = '',
}: PhoneInputProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.dial === countryDial) ?? countries[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex ${className}`}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-full flex items-center gap-1.5 px-3 py-3 bg-white border border-gray-200 border-r-0 rounded-l-xl hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg leading-none">{flagFromCode(selectedCountry.code)}</span>
          <span className="text-sm text-charcoal font-light">{selectedCountry.dial}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {open && (
          <div className="absolute z-20 top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="relative border-b border-gray-100">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('phoneInput.searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-400">{t('phoneInput.noResults')}</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onCountryChange(c.dial);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-left ${
                      c.dial === countryDial ? 'text-gold font-medium' : 'text-charcoal'
                    }`}
                  >
                    <span className="text-lg leading-none">{flagFromCode(c.code)}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-gray-400 shrink-0">{c.dial}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <input
        type="tel"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="6 92 12 34 56"
        className="flex-1 min-w-0 px-4 py-3 bg-white border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-gold outline-none"
      />
    </div>
  );
}
