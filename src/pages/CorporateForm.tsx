import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

const initialForm = {
  firstName: '',
  lastName: '',
  birthDate: '',
  phone: '',
  organizationType: '',
  companyName: '',
  employeeCountRange: '',
  employeeCount: '',
  expectations: '',
  areasToTreat: '',
  medicalConditions: '',
  medications: '',
  allergies: '',
  pregnancy: '',
  regularActivity: '',
  hadProfessionalMassage: '',
  stressLevel: '',
  agreed: false,
  signature: '',
};

export default function CorporateForm() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [form, setForm] = useState(initialForm);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) => (value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormState('submitting');

    try {
      const res = await fetch(`${API_BASE}/corporate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, bookingId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFormState('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.message || t('corporate.errors.generic'));
        setFormState('idle');
      }
    } catch {
      setError(t('corporate.errors.server'));
      setFormState('idle');
    }
  };

  if (formState === 'success') {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-cream flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-lg w-full"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-charcoal mb-4">{t('corporate.success.title')}</h2>
          <p className="text-gray-500 mb-8">{t('corporate.success.text')}</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-charcoal text-white px-8 py-3 rounded-xl text-sm tracking-widest uppercase hover:bg-gold transition-colors w-full"
          >
            {t('corporate.success.homeCta')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-cream flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-lg w-full"
        >
          <LogIn className="w-14 h-14 text-gold mx-auto mb-6 opacity-70" />
          <h2 className="text-2xl font-serif text-charcoal mb-4">{t('corporate.loginRequired.title')}</h2>
          <p className="text-gray-500 mb-8">{t('corporate.loginRequired.text')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
            <Link to="/login" className="flex-1 bg-charcoal text-cream px-6 py-3 rounded-xl text-sm tracking-widest uppercase text-center hover:bg-gold transition-colors">
              {t('nav.login')}
            </Link>
            <Link to="/signup" className="flex-1 border border-charcoal text-charcoal px-6 py-3 rounded-xl text-sm tracking-widest uppercase text-center hover:bg-gray-50 transition-colors">
              {t('corporate.signup')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const orgTypeOptions: [string, string][] = [
    ['publique', t('corporate.options.publique')],
    ['privee', t('corporate.options.privee')],
  ];

  const rangeOptions: [string, string][] = [
    ['1-10', t('corporate.options.range1')],
    ['11-50', t('corporate.options.range2')],
    ['51-250', t('corporate.options.range3')],
    ['250+', t('corporate.options.range4')],
  ];

  const yesNoOptions: [string, string][] = [
    ['oui', t('corporate.options.yes')],
    ['non', t('corporate.options.no')],
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-2">SAKINA MASSAGE 974</h1>
          <h2 className="text-sm tracking-widest text-olive uppercase font-medium">{t('corporate.practitionerTitle')}</h2>
          <p className="mt-6 text-gray-500 font-light max-w-2xl mx-auto">{t('corporate.intro')}</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-12"
        >
          {/* INFORMATIONS PERSONNELLES */}
          <section>
            <div className="bg-charcoal text-cream text-sm tracking-widest uppercase py-2 px-4 inline-block mb-6 rounded-md">
              {t('corporate.sections.personalInfo')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.lastName')}</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => set('lastName')(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.firstName')}</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => set('firstName')(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.birthDate')}</label>
                <input
                  type="date"
                  required
                  value={form.birthDate}
                  onChange={(e) => set('birthDate')(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.phone')}</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => set('phone')(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
            </div>
          </section>

          {/* INFORMATIONS ENTREPRISE */}
          <section>
            <div className="bg-charcoal text-cream text-sm tracking-widest uppercase py-2 px-4 inline-block mb-6 rounded-md">
              {t('corporate.sections.companyInfo')}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('corporate.fields.organizationType')}</label>
                <div className="flex gap-6">
                  {orgTypeOptions.map(([val, text]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="organizationType"
                        value={val}
                        checked={form.organizationType === val}
                        onChange={() => set('organizationType')(val)}
                        required
                        className="w-4 h-4 text-gold accent-gold"
                      />
                      <span className="text-sm">{text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.companyName')}</label>
                  <input
                    type="text"
                    placeholder={t('corporate.fields.companyNamePlaceholder')}
                    required
                    value={form.companyName}
                    onChange={(e) => set('companyName')(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.employeeCount')}</label>
                  <input
                    type="text"
                    placeholder={t('corporate.fields.employeeCountPlaceholder')}
                    value={form.employeeCount}
                    onChange={(e) => set('employeeCount')(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('corporate.fields.employeeCountRange')}</label>
                <div className="flex flex-wrap gap-4">
                  {rangeOptions.map(([val, text]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="employeeCountRange"
                        value={val}
                        checked={form.employeeCountRange === val}
                        onChange={() => set('employeeCountRange')(val)}
                        className="w-4 h-4 text-gold accent-gold"
                      />
                      <span className="text-sm">{text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* OBJECTIFS DU MASSAGE */}
          <section>
            <div className="bg-charcoal text-cream text-sm tracking-widest uppercase py-2 px-4 inline-block mb-6 rounded-md">
              {t('corporate.sections.massageGoals')}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.expectations')}</label>
                <input
                  type="text"
                  placeholder={t('corporate.fields.expectationsPlaceholder')}
                  required
                  value={form.expectations}
                  onChange={(e) => set('expectations')(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.areasToTreat')}</label>
                <input
                  type="text"
                  placeholder={t('corporate.fields.areasToTreatPlaceholder')}
                  value={form.areasToTreat}
                  onChange={(e) => set('areasToTreat')(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
            </div>
          </section>

          {/* SANTÉ & BIEN-ÊTRE */}
          <section>
            <div className="bg-charcoal text-cream text-sm tracking-widest uppercase py-2 px-4 inline-block mb-6 rounded-md">
              {t('corporate.sections.healthStatus')}
            </div>
            <div className="space-y-6">
              <RadioRow
                label={t('corporate.fields.medicalConditions')}
                name="medicalConditions"
                value={form.medicalConditions}
                onChange={set('medicalConditions')}
                options={yesNoOptions}
              />
              <RadioRow
                label={t('corporate.fields.medications')}
                name="medications"
                value={form.medications}
                onChange={set('medications')}
                options={yesNoOptions}
              />
              <RadioRow
                label={t('corporate.fields.allergies')}
                name="allergies"
                value={form.allergies}
                onChange={set('allergies')}
                options={yesNoOptions}
              />
              <RadioRow
                label={t('corporate.fields.pregnancy')}
                name="pregnancy"
                value={form.pregnancy}
                onChange={set('pregnancy')}
                options={yesNoOptions}
              />
            </div>
          </section>

          {/* HABITUDES & BIEN-ÊTRE */}
          <section>
            <div className="bg-charcoal text-cream text-sm tracking-widest uppercase py-2 px-4 inline-block mb-6 rounded-md">
              {t('corporate.sections.habitsWellbeing')}
            </div>
            <div className="space-y-6">
              <RadioRow
                label={t('corporate.fields.regularActivity')}
                name="regularActivity"
                value={form.regularActivity}
                onChange={set('regularActivity')}
                options={yesNoOptions}
              />
              <RadioRow
                label={t('corporate.fields.hadProfessionalMassage')}
                name="hadProfessionalMassage"
                value={form.hadProfessionalMassage}
                onChange={set('hadProfessionalMassage')}
                options={yesNoOptions}
              />
              <RadioRow
                label={t('corporate.fields.stressLevel')}
                name="stressLevel"
                value={form.stressLevel}
                onChange={set('stressLevel')}
                options={[
                  ['oui', t('corporate.options.yes')],
                  ['par_periode', t('corporate.options.sometimes')],
                  ['non', t('corporate.options.no')],
                ]}
              />
            </div>
          </section>

          {/* CONSENTEMENT */}
          <section className="bg-light p-6 rounded-2xl border border-gray-200">
            <div className="bg-charcoal text-cream text-sm tracking-widest uppercase py-2 px-4 inline-block mb-6 rounded-md">
              {t('corporate.sections.consent')}
            </div>

            <label className="flex items-start gap-4 cursor-pointer group mb-6">
              <div className="mt-1">
                <input
                  type="checkbox"
                  required
                  checked={form.agreed}
                  onChange={(e) => set('agreed')(e.target.checked)}
                  className="w-5 h-5 text-gold accent-gold border-gray-300 rounded cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-700 leading-relaxed group-hover:text-charcoal transition-colors">
                {t('corporate.attestation')}
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('corporate.fields.signature')}</label>
              <input
                type="text"
                required
                placeholder={t('corporate.fields.signaturePlaceholder')}
                value={form.signature}
                onChange={(e) => set('signature')(e.target.value)}
                className="w-full sm:max-w-md px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none font-serif italic"
              />
            </div>
          </section>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="w-full bg-charcoal text-cream py-4 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-gold transition-colors flex items-center justify-center disabled:opacity-70 mt-8"
          >
            {formState === 'submitting' ? t('corporate.sending') : t('corporate.submitCta')}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

function RadioRow({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
      <label className="text-sm font-medium text-gray-700 mb-3 sm:mb-0">{label}</label>
      <div className="flex gap-4">
        {options.map(([val, text]) => (
          <label key={val} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={val}
              checked={value === val}
              onChange={() => onChange(val)}
              required
              className="w-4 h-4 text-gold accent-gold"
            />{' '}
            <span className="text-sm">{text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
