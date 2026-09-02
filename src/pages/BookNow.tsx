import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ArrowLeft, Check, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

interface Service {
  id: string;
  category: string;
  name: string;
  duration: string;
  price: number;
}

const categoryOrder = [
  'Bundle Pack',
  'Massages By Anissah',
  "Les Cures d'Anissah",
  "Les Formules Head Spa d'Anissah",
  "Bon Cadeau d'Anissah",
  'Ventousothérapie / Cupping Therapy By Anissah',
  'Foot Spa',
];

// Real opening hours: Monday–Saturday 07:00–21:00, Sunday 08:00–17:00.
// Slots are generated every 1h30 (the longest session length) so no booking can run past closing time.
const SLOT_INTERVAL_MINUTES = 90;

function getHoursForDate(dateStr: string): { open: string; close: string } {
  const day = new Date(`${dateStr}T00:00:00`).getDay(); // 0 = Sunday
  return day === 0 ? { open: '08:00', close: '17:00' } : { open: '07:00', close: '21:00' };
}

function generateTimeSlots(dateStr: string): string[] {
  if (!dateStr) return [];
  const { open, close } = getHoursForDate(dateStr);
  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);

  const slots: string[] = [];
  let minutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  while (minutes + SLOT_INTERVAL_MINUTES <= closeMinutes) {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    minutes += SLOT_INTERVAL_MINUTES;
  }
  return slots;
}

export default function BookNow() {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; date: string; time: string; services: Service[] } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.services);
      })
      .finally(() => setServicesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    fetch(`${API_BASE}/bookings/availability?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBookedTimes(data.bookedTimes);
      });
  }, [selectedDate]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const toggleTreatment = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectedTreatments = services.filter((s) => selectedIds.includes(s.id));
  const totalPrice = selectedTreatments.reduce((sum, s) => sum + s.price, 0);
  const allTimeSlots = generateTimeSlots(selectedDate);
  const availableTimes = allTimeSlots.filter((t) => !bookedTimes.includes(t));

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          serviceIds: selectedIds,
          date: selectedDate,
          time: selectedTime,
          message,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmedBooking({ id: data.booking.id, date: selectedDate, time: selectedTime!, services: selectedTreatments });
        setStep(5);
      } else {
        setSubmitError(data.message || t('booknow.errors.generic'));
        if (res.status === 409) {
          // Slot was taken in the meantime — refresh availability and send back to time step
          const avail = await fetch(`${API_BASE}/bookings/availability?date=${selectedDate}`).then((r) => r.json());
          if (avail.success) setBookedTimes(avail.bookedTimes);
          setSelectedTime(null);
          setStep(3);
        }
      }
    } catch {
      setSubmitError(t('booknow.errors.server'));
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: t('booknow.steps.services') },
    { num: 2, title: t('booknow.steps.date') },
    { num: 3, title: t('booknow.steps.time') },
    { num: 4, title: t('booknow.steps.details') },
  ];

  return (
    <div className="min-h-screen pt-24 bg-cream pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-charcoal mb-4">{t('booknow.pageTitle')}</h1>
          <p className="text-gray-500 font-light">{t('booknow.pageSubtitle')}</p>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-12 relative">
            <div className="flex justify-between relative z-10">
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-serif transition-colors duration-300 ${
                      step >= s.num ? 'bg-charcoal text-white' : 'bg-white text-gray-400 border border-gray-200'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className={`text-xs mt-2 uppercase tracking-widest ${step >= s.num ? 'text-charcoal font-medium' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 w-full h-[1px] bg-gray-200 -z-0" />
            <div
              className="absolute top-5 left-0 h-[2px] bg-charcoal transition-all duration-500 -z-0"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        )}

        {/* Form Area */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: Choose Treatment(s) */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif text-charcoal mb-2">{t('booknow.step1.heading')}</h2>
                  <p className="text-sm text-gray-500 font-light">{t('booknow.step1.subheading')}</p>
                </div>

                {servicesLoading ? (
                  <p className="text-center text-gray-400 py-12">{t('booknow.step1.loading')}</p>
                ) : (
                  categoryOrder.map((category) => {
                    const categoryServices = services.filter((s) => s.category === category);
                    if (categoryServices.length === 0) return null;
                    return (
                      <div key={category} className="mb-8">
                        <h3 className="text-sm uppercase tracking-widest text-olive mb-4 font-medium border-b border-gray-100 pb-2">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryServices.map((service) => {
                            const isSelected = selectedIds.includes(service.id);
                            return (
                              <div
                                key={service.id}
                                onClick={() => toggleTreatment(service.id)}
                                className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                                  isSelected ? 'border-charcoal bg-gray-50' : 'border-gray-100 hover:border-gold hover:shadow-md'
                                }`}
                              >
                                <div
                                  className={`absolute top-4 right-4 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                    isSelected ? 'bg-charcoal border-charcoal' : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <h4 className="font-serif text-lg text-charcoal mb-1 pr-8">{service.name}</h4>
                                <div className="flex justify-between text-sm text-gray-500 font-light">
                                  <span>{service.duration}</span>
                                  <span>{service.price} €</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}

                <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    {selectedIds.length === 0 ? (
                      <span className="text-gray-400">{t('booknow.step1.noneSelected')}</span>
                    ) : (
                      <span>
                        <span className="font-medium text-charcoal">{selectedIds.length}</span>{' '}
                        {t('booknow.step1.selectedCount', { count: selectedIds.length })} ·{' '}
                        <span className="font-medium text-olive">{totalPrice} €</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={selectedIds.length === 0}
                    className="w-full sm:w-auto bg-charcoal text-cream px-8 py-3 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('booknow.continue')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Choose Date */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center mb-6">
                  <button onClick={handleBack} className="text-gray-400 hover:text-charcoal transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl font-serif text-charcoal text-center flex-1 pr-6">{t('booknow.step2.heading')}</h2>
                </div>

                <div className="max-w-sm mx-auto text-center">
                  <CalendarIcon className="w-12 h-12 text-gold mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 font-light mb-8">{t('booknow.step2.text')}</p>

                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (e.target.value) setTimeout(handleNext, 400);
                    }}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none text-center font-serif text-xl"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Choose Time */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center mb-6">
                  <button onClick={handleBack} className="text-gray-400 hover:text-charcoal transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl font-serif text-charcoal text-center flex-1 pr-6">{t('booknow.step3.heading')}</h2>
                </div>

                <p className="text-center text-sm text-gray-500 mb-8">
                  {t('booknow.step3.availabilityFor', {
                    date: selectedDate
                      ? new Date(selectedDate).toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })
                      : '',
                  })}
                </p>

                {availableTimes.length === 0 ? (
                  <p className="text-center text-gray-400">{t('booknow.step3.noSlots')}</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setTimeout(handleNext, 300);
                        }}
                        className={`py-4 rounded-xl border text-center transition-all ${
                          selectedTime === time ? 'bg-charcoal text-white border-charcoal' : 'border-gray-200 text-charcoal hover:border-gold hover:text-gold'
                        }`}
                      >
                        <span className="font-serif text-xl">{time}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Confirm + Login gate */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center mb-8">
                  <button onClick={handleBack} className="text-gray-400 hover:text-charcoal transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl font-serif text-charcoal text-center flex-1 pr-6">
                    {user ? t('booknow.step4.confirmHeading') : t('booknow.step4.loginHeading')}
                  </h2>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-8">
                  <ul className="space-y-2 text-sm mb-3">
                    {selectedTreatments.map((t) => (
                      <li key={t.id} className="flex justify-between">
                        <span className="text-charcoal">{t.name}</span>
                        <span className="text-gray-500">{t.price} €</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-sm font-medium text-charcoal border-t border-gray-200 pt-3 mb-3">
                    <span>{t('booknow.total')}</span>
                    <span className="text-olive">{totalPrice} €</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm border-t border-gray-200 pt-3">
                    <span className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" /> {new Date(selectedDate).toLocaleDateString(dateLocale)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> {selectedTime}
                    </span>
                  </div>
                </div>

                {!user ? (
                  <div className="text-center py-6">
                    <LogIn className="w-12 h-12 text-gold mx-auto mb-4 opacity-60" />
                    <p className="text-gray-500 font-light mb-8">
                      {t('booknow.step4.loginRequired')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                      <Link
                        to="/login"
                        className="flex-1 bg-charcoal text-cream px-6 py-3 rounded-xl text-sm tracking-widest uppercase text-center hover:bg-gold transition-colors"
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        to="/signup"
                        className="flex-1 border border-charcoal text-charcoal px-6 py-3 rounded-xl text-sm tracking-widest uppercase text-center hover:bg-gray-50 transition-colors"
                      >
                        {t('booknow.signup')}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submitBooking} className="space-y-6">
                    <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600">
                      {t('booknow.bookingInNameOf')} <span className="font-medium text-charcoal">{user.name}</span> ({user.email})
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('booknow.step4.messageLabel')}</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none resize-none"
                      ></textarea>
                    </div>

                    {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-charcoal text-cream py-4 rounded-xl text-sm tracking-widest uppercase font-medium hover:bg-gold transition-colors mt-8 disabled:opacity-60"
                    >
                      {submitting ? t('booknow.step4.confirming') : t('booknow.step4.confirmCta')}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* STEP 5: Confirmation */}
            {step === 5 && confirmedBooking && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-serif text-charcoal mb-4">{t('booknow.step5.title')}</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {t('booknow.step5.thanks', { name: user?.name.split(' ')[0] })}
                </p>

                <div className="bg-gray-50 p-6 rounded-2xl max-w-sm mx-auto text-left mb-10 border border-gray-100">
                  <h3 className="font-serif text-lg mb-4 text-charcoal border-b border-gray-200 pb-2">{t('booknow.step5.detailsTitle')}</h3>
                  <ul className="space-y-2 text-sm text-gray-600 mb-3">
                    {confirmedBooking.services.map((t) => (
                      <li key={t.id} className="flex justify-between">
                        <span>{t.name}</span>
                        <span className="font-medium text-charcoal">{t.price} €</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-3 text-sm text-gray-600 border-t border-gray-200 pt-3">
                    <li className="flex justify-between">
                      <span className="text-gray-400">{t('booknow.total')}</span>
                      <span className="font-medium text-olive">{totalPrice} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">{t('booknow.step5.dateLabel')}</span>
                      <span className="font-medium text-charcoal">{new Date(confirmedBooking.date).toLocaleDateString(dateLocale)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">{t('booknow.step5.timeLabel')}</span>
                      <span className="font-medium text-charcoal">{confirmedBooking.time}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                  <button
                    onClick={() => (window.location.href = `/consent?bookingId=${confirmedBooking.id}`)}
                    className="bg-charcoal text-white px-8 py-4 rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-gold transition-colors w-full"
                  >
                    {t('booknow.step5.consentCta')}
                  </button>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
                    <a
                      href={`https://wa.me/262692208484?text=${encodeURIComponent(
                        t('booknow.step5.whatsappMessage', {
                          services: confirmedBooking.services.map((t) => t.name).join(', '),
                          date: new Date(confirmedBooking.date).toLocaleDateString(dateLocale),
                          time: confirmedBooking.time,
                        })
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white px-6 py-3 rounded-xl text-xs font-medium hover:bg-[#20bd5a] transition-colors flex-1 text-center"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => (window.location.href = '/')}
                      className="border border-charcoal text-charcoal px-6 py-3 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors flex-1"
                    >
                      {t('booknow.step5.homeCta')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
