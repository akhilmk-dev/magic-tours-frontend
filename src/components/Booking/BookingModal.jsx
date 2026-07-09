"use client";

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Calendar, Users,
    CheckCircle, Loader2, Plus, Minus,
    ArrowRight, Info, Globe, AlertCircle, Building2, Mail, Phone
} from 'lucide-react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SALUTATIONS = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof'];

// ─── Guest Types ──────────────────────────────────────────────────────────────

const GUEST_TYPES = [
    { id: 'adultSingle', label: 'Adult Single Occupancy', apiKey: 'adult_single', roomSize: 1, passengerType: 'Adult' },
    { id: 'adultDouble', label: 'Adult Double Sharing', apiKey: 'adult_double', roomSize: 2, passengerType: 'Adult' },
    { id: 'adultTriple', label: 'Adult Triple Sharing', apiKey: 'adult_triple', roomSize: 3, passengerType: 'Adult' },
    { id: 'adultQuad', label: 'Adult Quad Sharing', apiKey: 'adult_quad', roomSize: 4, passengerType: 'Adult' },
    { id: 'childBed', label: 'Child with Bed', apiKey: 'child_with_bed', roomSize: 1, passengerType: 'Child' },
    { id: 'childNoBed', label: 'Child without Bed', apiKey: 'child_no_bed', roomSize: 1, passengerType: 'Child' },
    { id: 'infant', label: 'Infant', apiKey: 'infant', roomSize: 1, passengerType: 'Infant' },
];

const CHILD_INFANT_TYPES = ['childBed', 'childNoBed', 'infant'];

let _guestKeyCounter = 0;
const makeGuest = (type = 'adultDouble') => ({
    _key: ++_guestKeyCounter,
    salutation: '',
    fullName: '',
    dob: '',
    passportExpiry: '',
    type,
});

const buildGuestCounts = (guests) => {
    const result = {};
    GUEST_TYPES.forEach(t => {
        const persons = guests.filter(g => g.type === t.id).length;
        result[t.apiKey] = t.roomSize > 1 ? Math.ceil(persons / t.roomSize) : persons;
    });
    return result;
};

// ─── Confirmation Screen ──────────────────────────────────────────────────────

const ConfirmationScreen = ({ data, onClose }) => {
    const { res, isFixed, isPriced } = data;
    const isBooking = res?.type === 'booking';
    const ref = res?.booking_id || res?.request_id || res?.display_id || res?.id;

    let title, message;
    if (isFixed || isBooking) {
        title = 'Booking Confirmed!';
        message = `Your booking is confirmed! Booking ID: ${ref || 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    } else if (isPriced) {
        title = 'Request Submitted!';
        message = `Your booking request has been submitted! Our team will confirm shortly. Reference: ${ref || 'REQ-' + Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    } else {
        title = 'Enquiry Submitted!';
        message = `Your enquiry has been submitted. Since your selected date is outside standard availability, our team will review and contact you with pricing. Reference: ${ref || 'REQ-' + Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="bg-white w-full md:max-w-lg md:rounded-[2.5rem] rounded-t-[2rem] shadow-2xl p-10 text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-[#113A74] mb-4">{title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm mx-auto">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-[#113A74] text-white rounded-full px-10 py-3.5 font-black text-sm uppercase tracking-widest hover:bg-[#1a4a8d] transition-colors"
                >
                    Done
                </button>
            </motion.div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const BookingModal = ({ isOpen, onClose, pkg, user }) => {
    const { error: toastError } = useToast();
    const { selectedCurrency, formatPrice } = useCurrency();
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState('');
    const [quoteResult, setQuoteResult] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [departureDatesKey, setDepartureDatesKey] = useState(0);
    const [showAllCities, setShowAllCities] = useState(false);

    const bookingType = pkg?.booking_type || 'fixed_departure';
    const isFixed = bookingType === 'fixed_departure';

    const quoteTimerRef = useRef(null);

    const toDateStr = (v) => { if (!v) return null; const d = new Date(v); return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0]; };
    const validFrom = toDateStr(pkg?.valid_from);
    const validTo = toDateStr(pkg?.valid_to);

    const blackoutDates = useMemo(() => {
        if (!pkg?.blackout_dates) return [];
        const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        return pkg.blackout_dates.reduce((acc, b) => {
            const s = new Date(b.from || b.start_date);
            const e = new Date(b.to   || b.end_date);
            if (isNaN(s.getTime()) || isNaN(e.getTime())) return acc;
            acc.push({
                start: s.toISOString().split('T')[0],
                end:   e.toISOString().split('T')[0],
                label: `${fmt(s)} – ${fmt(e)}`,
            });
            return acc;
        }, []);
    }, [pkg?.blackout_dates]);

    const getBlackoutRange = (dateStr) => {
        if (!dateStr || !blackoutDates.length) return null;
        return blackoutDates.find(b => dateStr >= b.start && dateStr <= b.end) || null;
    };

    const availableDepartureDates = useMemo(() => {
        if (!pkg?.departure_dates) return [];
        const today = new Date().toISOString().split('T')[0];
        return pkg.departure_dates.filter(d => {
            if (d.status === 'expired') return false;
            if (!d.departure_date) return false;
            const parsed = new Date(d.departure_date);
            if (isNaN(parsed.getTime())) return false;
            return parsed.toISOString().split('T')[0] >= today;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pkg?.departure_dates, departureDatesKey]);

    // ── Quote API ─────────────────────────────────────────────────────────────
    const callQuote = useCallback(async ({ departureDateId, travelDate, guestCounts }) => {
        if (!pkg?.id) return;
        const totalGuests = Object.values(guestCounts).reduce((a, b) => a + b, 0);
        if (totalGuests === 0) { setQuoteResult(null); return; }
        if (isFixed && !departureDateId) return;
        if (!isFixed && !travelDate) return;

        setQuoteLoading(true);
        try {
            const body = isFixed
                ? { departure_date_id: departureDateId, guest_counts: guestCounts }
                : { travel_date: travelDate, guest_counts: guestCounts };
            const res = await api.post(`/packages/${pkg.id}/quote`, body);
            setQuoteResult(res);
        } catch {
            setQuoteResult(null);
        } finally {
            setQuoteLoading(false);
        }
    }, [pkg?.id, isFixed]);

    const scheduleQuote = useCallback((params) => {
        if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
        quoteTimerRef.current = setTimeout(() => callQuote(params), 500);
    }, [callQuote]);

    // ── Validation schema ─────────────────────────────────────────────────────
    const validationSchema = useMemo(() => {
        const guestShape = Yup.object().shape({
            salutation: Yup.string().required('Salutation is required'),
            fullName: Yup.string().required('Full name is required'),
            dob: Yup.string().when('type', {
                is: (type) => CHILD_INFANT_TYPES.includes(type),
                then: (schema) => schema.required('Date of birth is required'),
                otherwise: (schema) => schema.optional().test('adult-18+', 'Adult must be 18 years or older', (value) => {
                    if (!value) return true;
                    const dob = new Date(value);
                    const cutoff = new Date();
                    cutoff.setFullYear(cutoff.getFullYear() - 18);
                    return dob <= cutoff;
                }),
            }),
            passportExpiry: Yup.string()
                .required('Passport expiry date is required')
                .test('min-6-months', 'Passport must be valid for at least 6 months from today', (value) => {
                    if (!value) return false;
                    const expiry = new Date(value);
                    const sixMonths = new Date();
                    sixMonths.setMonth(sixMonths.getMonth() + 6);
                    return expiry >= sixMonths;
                }),
        });

        if (isFixed) {
            return Yup.object().shape({
                departureDateId: Yup.string().required('Please select a departure date'),
                guests: Yup.array().of(guestShape).min(1, 'At least one traveler is required'),
            });
        }
        return Yup.object().shape({
            travelDate: Yup.string()
                .required('Please select a travel date')
                .test('not-blackout', '', function (value) {
                    if (!value) return true;
                    const range = blackoutDates.find(b => value >= b.start && value <= b.end);
                    if (range) return this.createError({ message: `Unavailable: ${range.label}. Please choose a different date.` });
                    return true;
                }),
            guests: Yup.array().of(guestShape).min(1, 'At least one traveler is required'),
        });
    }, [isFixed, blackoutDates]);

    const initialValues = useMemo(() => ({
        departureDateId: isFixed ? (availableDepartureDates[0]?.id || '') : '',
        travelDate: '',
        guests: [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [pkg?.id, isFixed]);

    const getRoomLabel = (guestType, positionWithinType) => {
        const gt = GUEST_TYPES.find(t => t.id === guestType);
        const size = gt?.roomSize || 1;
        const roomNumber = Math.floor(positionWithinType / size) + 1;
        const personNumber = (positionWithinType % size) + 1;
        return `${gt?.label || 'Room'} ${roomNumber}, Person ${personNumber}`;
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (values) => {
        if (!user) { toastError('Please login to continue booking.'); return; }
        setSubmitting(true);
        try {
            setProgress('Finalising submission…');

            const typeCounters = {};
            const passengers = values.guests.map(g => {
                typeCounters[g.type] = typeCounters[g.type] ?? 0;
                const pos = typeCounters[g.type]++;
                const gt = GUEST_TYPES.find(t => t.id === g.type);
                return {
                    salutation: g.salutation,
                    name: g.fullName,
                    dob: g.dob || null,
                    passport_expiry: g.passportExpiry,
                    photo_url: '',
                    passport_copy_url: '',
                    passenger_type: gt?.passengerType || 'Adult',
                    room_label: getRoomLabel(g.type, pos),
                };
            });

            const countOf = (id) => {
                const t = GUEST_TYPES.find(gt => gt.id === id);
                const persons = values.guests.filter(g => g.type === id).length;
                return (t?.roomSize ?? 1) > 1 ? Math.ceil(persons / (t?.roomSize ?? 1)) : persons;
            };

            const payload = {
                package_id: pkg.id,
                guest_adult_single: countOf('adultSingle'),
                guest_adult_double: countOf('adultDouble'),
                guest_adult_triple: countOf('adultTriple'),
                guest_adult_quad: countOf('adultQuad'),
                guest_child_with_bed: countOf('childBed'),
                guest_child_no_bed: countOf('childNoBed'),
                guest_infant: countOf('infant'),
                currency: selectedCurrency.code || pkg.currency || 'QAR',
                notes: '',
                passengers,
                ...(isFixed
                    ? { departure_date_id: values.departureDateId }
                    : { travel_date: values.travelDate }),
            };

            const res = await api.post('/bookings/frontend/create', payload);
            const isPriced = quoteResult?.priced !== false;
            setConfirmation({ res, isFixed, isPriced });
        } catch (err) {
            const msg = err.message || 'Failed to place booking. Please try again.';
            if (isFixed && msg.toLowerCase().includes('not enough slots')) {
                toastError('Sorry, this departure date just sold out. Please select another date.');
                setDepartureDatesKey(k => k + 1);
            } else {
                toastError(msg);
            }
        } finally {
            setSubmitting(false);
            setProgress('');
        }
    };

    if (!isOpen || !pkg) return null;

    if (confirmation) {
        return (
            <ConfirmationScreen
                data={confirmation}
                onClose={() => { setConfirmation(null); onClose(); }}
            />
        );
    }

    const quoteTotal = quoteResult?.total ?? quoteResult?.price ?? null;
    const showPrice = quoteResult?.priced !== false && quoteTotal !== null;
    const isOutsideValidity = quoteResult?.priced === false;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue, errors }) => {
                    const totalGuests = values.guests.length;

                    let buttonLabel;
                    if (isFixed) {
                        buttonLabel = showPrice ? `Confirm & Pay — ${formatPrice(quoteTotal)}` : 'Confirm Booking';
                    } else if (isOutsideValidity) {
                        buttonLabel = 'Send Enquiry';
                    } else {
                        buttonLabel = 'Send Booking Request';
                    }

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                            className="bg-white w-full md:max-w-6xl md:rounded-[2.5rem] rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[95svh] md:max-h-[95vh] md:h-auto"
                        >
                            {/* ── Left: Summary panel ─────────────────────── */}
                            <div className="w-full md:w-[300px] md:min-w-[300px] bg-[#113A74] text-white relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                                {/* Mobile: compact bar */}
                                <div className="md:hidden flex items-center justify-between px-6 py-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#FFA500] flex items-center justify-center">
                                            <Globe size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white/50 uppercase tracking-wide">Booking</p>
                                            <p className="text-sm font-black line-clamp-1">{pkg.title}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-white/40 uppercase">Total</p>
                                        {showPrice
                                            ? <p className="text-base font-black text-[#FFA500]">{formatPrice(quoteTotal)}</p>
                                            : <p className="text-base font-black text-white/30">—</p>
                                        }
                                    </div>
                                </div>

                                {/* Desktop: full sidebar */}
                                <div className="hidden md:flex flex-col p-8 h-full">
                                    <div className="relative z-10 mb-6">
                                        <h2 className="text-2xl font-black tracking-tight mb-1">
                                            My <span className="text-[#FFA500]">Trip</span>
                                        </h2>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest line-clamp-2">
                                            {pkg.title}
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#FFA500] flex items-center justify-center shadow-md shadow-[#FFA500]/30 shrink-0 mt-0.5">
                                            <Globe size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-white/40 uppercase tracking-wide mb-1">Destination</p>
                                            {pkg.cities?.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {(showAllCities ? pkg.cities : pkg.cities.slice(0, 2)).map((c, i) => (
                                                        <span key={i} className="text-xs font-semibold bg-white/10 text-white px-2 py-0.5 rounded-full">
                                                            {c.name || c}
                                                        </span>
                                                    ))}
                                                    {pkg.cities.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAllCities(v => !v)}
                                                            className="text-[10px] font-black text-[#FFA500] hover:text-[#FFA500]/80 transition-colors px-1.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10"
                                                        >
                                                            {showAllCities ? 'less' : `+${pkg.cities.length - 2} more`}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm font-bold">{pkg.location || 'International'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isFixed ? 'bg-[#FFA500]/20 text-[#FFA500]' : 'bg-white/10 text-white/60'}`}>
                                            <Calendar size={10} />
                                            {isFixed ? 'Fixed Departure' : 'Flexible Date'}
                                        </span>
                                    </div>

                                    {/* Pricing breakdown */}
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                                        <p className="text-xs font-black text-white/40 uppercase tracking-wide border-b border-white/10 pb-2 mb-2">
                                            Pricing Breakdown
                                        </p>

                                        {quoteLoading ? (
                                            <div className="flex items-center gap-2 text-xs text-white/40">
                                                <Loader2 size={12} className="animate-spin" />
                                                Calculating…
                                            </div>
                                        ) : showPrice ? (
                                            <>
                                                {quoteResult?.breakdown
                                                    ? Object.entries(quoteResult.breakdown).map(([k, v]) =>
                                                        v > 0 ? (
                                                            <div key={k} className="flex justify-between items-center text-xs font-semibold gap-4">
                                                                <span className="text-white/70 min-w-0 capitalize">{k.replace(/_/g, ' ')}</span>
                                                                <span className="text-white whitespace-nowrap shrink-0">{formatPrice(v)}</span>
                                                            </div>
                                                        ) : null
                                                    )
                                                    : GUEST_TYPES.map(t => {
                                                        const count = values.guests.filter(g => g.type === t.id).length;
                                                        if (!count) return null;
                                                        return (
                                                            <div key={t.id} className="flex justify-between items-center text-xs font-semibold gap-4">
                                                                <span className="text-white/70 min-w-0">{t.label} × {count}</span>
                                                                <span className="text-white whitespace-nowrap shrink-0">—</span>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                                                    <span className="text-xs font-black uppercase text-[#FFA500]">Grand Total</span>
                                                    <span className="text-2xl font-black text-white tracking-tight">{formatPrice(quoteTotal)}</span>
                                                </div>
                                            </>
                                        ) : isOutsideValidity ? (
                                            <div className="flex items-start gap-2">
                                                <Info size={12} className="text-[#FFA500] shrink-0 mt-0.5" />
                                                <p className="text-xs text-white/50 italic leading-relaxed">Price not available for this date. Our team will contact you.</p>
                                            </div>
                                        ) : !isFixed && !values.travelDate ? (
                                            <p className="text-xs text-white/30 italic">Select a travel date to see pricing</p>
                                        ) : (
                                            <p className="text-xs text-white/30 italic">Add travelers to see pricing</p>
                                        )}
                                    </div>

                                    <div className="mt-4 bg-slate-900/40 rounded-xl p-4 border border-white/5 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Info size={13} className="text-[#FFA500]" />
                                            <span className="text-xs font-black uppercase tracking-wide text-white/60">Note</span>
                                        </div>
                                        <p className="text-xs leading-relaxed text-white/40 italic">
                                            Passport expiry must be valid for at least 6 months from travel date.
                                        </p>
                                    </div>

                                    {/* Vendor / Tour Operator */}
                                    {pkg.vendor && (
                                        <div className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Building2 size={13} className="text-[#FFA500]" />
                                                <span className="text-xs font-black uppercase tracking-wide text-white/60">Tour Operator</span>
                                            </div>
                                            <p className="text-sm font-black text-white truncate">{pkg.vendor.name}</p>
                                            {pkg.vendor.email && (
                                                <div className="flex items-center gap-2 text-xs text-white/50">
                                                    <Mail size={11} className="shrink-0" />
                                                    <span className="truncate">{pkg.vendor.email}</span>
                                                </div>
                                            )}
                                            {pkg.vendor.phone && (
                                                <div className="flex items-center gap-2 text-xs text-white/50">
                                                    <Phone size={11} className="shrink-0" />
                                                    <span>{pkg.vendor.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <User size={15} className="text-[#FFA500]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white/40 uppercase tracking-wide">Logged in as</p>
                                            <p className="text-sm font-black truncate max-w-[140px]">{user?.name || 'Guest'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right: Form panel ───────────────────────── */}
                            <div className="flex-1 flex flex-col overflow-hidden bg-white min-h-0">
                                <Form className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="px-8 py-5 flex justify-between items-center border-b border-slate-100 shrink-0">
                                        <div>
                                            <h3 className="text-xl font-black text-[#113A74] tracking-tight">
                                                {isFixed ? 'Book Your Trip' : 'Request / Enquire'}
                                            </h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                                {isFixed ? 'Choose date & configure travelers' : 'Select date & configure travelers'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                                                <Users size={13} className="text-[#113A74]" />
                                                <span className="text-xs font-black text-[#113A74]">{totalGuests} Traveler{totalGuests !== 1 ? 's' : ''}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 group"
                                            >
                                                <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable body */}
                                    <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#f1f1f1 transparent' }}>

                                        {/* ① Date Selection */}
                                        <section className="space-y-3">
                                            <h4 className="text-xs font-black text-[#113A74] uppercase tracking-[0.2em]">
                                                <span className="text-[#FFA500] mr-2">01</span>
                                                {isFixed ? 'Choose Departure Date' : 'Choose Travel Date'}
                                            </h4>

                                            {isFixed ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {availableDepartureDates.length > 0 ? (
                                                        availableDepartureDates.map(d => {
                                                            const avail = Math.max(0, (d.slots || 0) - (d.booked_slots || 0));
                                                            const isSoldOut = avail === 0;
                                                            const selected = values.departureDateId === d.id;
                                                            const date = new Date(d.departure_date);
                                                            return (
                                                                <button
                                                                    key={d.id}
                                                                    type="button"
                                                                    disabled={isSoldOut}
                                                                    onClick={() => {
                                                                        setFieldValue('departureDateId', d.id);
                                                                        scheduleQuote({
                                                                            departureDateId: d.id,
                                                                            travelDate: null,
                                                                            guestCounts: buildGuestCounts(values.guests),
                                                                        });
                                                                    }}
                                                                    className={`relative flex-1 min-w-[140px] p-4 rounded-2xl border-2 transition-all flex flex-col gap-0.5 text-left ${
                                                                        isSoldOut
                                                                            ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                                                            : selected
                                                                                ? 'border-[#113A74] bg-[#113A74] text-white shadow-lg shadow-[#113A74]/20'
                                                                                : 'border-slate-100 bg-white text-[#113A74] hover:border-slate-200 hover:shadow-sm'
                                                                    }`}
                                                                >
                                                                    <span className={`text-xs font-black uppercase tracking-widest ${selected && !isSoldOut ? 'text-white/60' : 'text-slate-400'}`}>
                                                                        {date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                                    </span>
                                                                    <span className={`text-xl font-black tracking-tighter ${isSoldOut ? 'text-slate-400' : ''}`}>
                                                                        {date.getDate()}
                                                                        <span className={`text-sm font-bold ml-1.5 ${selected && !isSoldOut ? 'text-white/70' : 'text-slate-400'}`}>
                                                                            {date.toLocaleDateString(undefined, { weekday: 'short' })}
                                                                        </span>
                                                                    </span>
                                                                    <div className="mt-1 text-[10px] font-black uppercase tracking-wider">
                                                                        {isSoldOut
                                                                            ? <span className="text-red-500">Sold Out</span>
                                                                            : <span className={selected ? 'text-[#FFA500]' : 'text-green-600'}>{avail} Seat{avail !== 1 ? 's' : ''} Left</span>
                                                                        }
                                                                    </div>
                                                                    {selected && !isSoldOut && (
                                                                        <CheckCircle size={14} className="absolute top-3 right-3 text-[#FFA500]" />
                                                                    )}
                                                                </button>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="w-full p-6 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                                                            <Calendar size={22} className="text-slate-300 mx-auto mb-2" />
                                                            <p className="text-sm font-bold text-slate-400">No departure dates available.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {validFrom && validTo && (
                                                        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
                                                            <Info size={13} className="text-green-600 shrink-0" />
                                                            <p className="text-xs font-bold text-green-700">
                                                                Package valid from{' '}
                                                                {new Date(validFrom).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                {' '}to{' '}
                                                                {new Date(validTo).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {blackoutDates.length > 0 && (
                                                        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <AlertCircle size={13} className="text-amber-600 shrink-0" />
                                                                <p className="text-xs font-bold text-amber-700">Unavailable dates:</p>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {blackoutDates.map((b, i) => (
                                                                    <span key={i} className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                                                                        {b.label}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <Field name="travelDate">
                                                        {({ field, form }) => {
                                                            const blackedOut = getBlackoutRange(field.value);
                                                            return (
                                                                <>
                                                                    <input
                                                                        type="date"
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            form.setFieldValue('travelDate', val);
                                                                            form.setFieldTouched('travelDate', true, false);
                                                                            if (val && !getBlackoutRange(val)) {
                                                                                scheduleQuote({
                                                                                    departureDateId: null,
                                                                                    travelDate: val,
                                                                                    guestCounts: buildGuestCounts(values.guests),
                                                                                });
                                                                            } else {
                                                                                setQuoteResult(null);
                                                                            }
                                                                        }}
                                                                        className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 outline-none transition-all text-base font-semibold text-[#113A74] ${
                                                                            blackedOut
                                                                                ? 'border-red-300 bg-red-50'
                                                                                : 'border-transparent focus:border-[#FFA500]/40 focus:bg-white'
                                                                        }`}
                                                                    />
                                                                    {blackedOut && (
                                                                        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start gap-2">
                                                                            <AlertCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
                                                                            <p className="text-xs font-bold text-red-700">
                                                                                Unavailable: {blackedOut.label}. Please choose a different date.
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        }}
                                                    </Field>
                                                    <ErrorMessage name="travelDate">
                                                        {msg => !msg?.startsWith('Unavailable') && (
                                                            <div className="text-red-500 text-xs font-bold uppercase">{msg}</div>
                                                        )}
                                                    </ErrorMessage>

                                                    {isOutsideValidity && values.travelDate && !getBlackoutRange(values.travelDate) && (
                                                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2">
                                                            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                                            <p className="text-xs text-blue-700 leading-relaxed">
                                                                The selected date is outside this package&apos;s standard validity. You can still submit a request and our team will get back to you with pricing.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {isFixed && <ErrorMessage name="departureDateId" component="div" className="text-red-500 text-xs font-bold uppercase" />}
                                        </section>

                                        {/* ② Travelers & Passenger Forms */}
                                        <FieldArray name="guests">
                                            {() => {
                                                const _mcp = pkg?.pricing_info?.current_pricing;
                                                const _mdp = pkg?.pricing_info?.default_pricing;
                                                const mergedPricing = {};
                                                GUEST_TYPES.forEach(t => {
                                                    const fromInfo = (_mcp?.[t.apiKey] || 0) || (_mdp?.[t.apiKey] || 0);
                                                    const fromDirect = Number(pkg?.[`default_price_${t.apiKey}`]) || 0;
                                                    mergedPricing[t.apiKey] = fromInfo || fromDirect;
                                                });
                                                const anyPriceSet = GUEST_TYPES.some(t => mergedPricing[t.apiKey] > 0);
                                                const visibleGuestTypes = anyPriceSet
                                                    ? GUEST_TYPES.filter(t => mergedPricing[t.apiKey] > 0)
                                                    : GUEST_TYPES;

                                                return (
                                                    <div className="space-y-8">
                                                        {/* Counter grid — compact 2-column */}
                                                        <section className="space-y-3">
                                                            <h4 className="text-xs font-black text-[#113A74] uppercase tracking-[0.2em]">
                                                                <span className="text-[#FFA500] mr-2">02</span>Add Travelers
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {visibleGuestTypes.map(t => {
                                                                    const guestCount = values.guests.filter(g => g.type === t.id).length;
                                                                    const roomCount = Math.ceil(guestCount / t.roomSize);
                                                                    return (
                                                                        <div
                                                                            key={t.id}
                                                                            className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                                                                        >
                                                                            <span className="text-xs font-bold text-[#113A74] whitespace-nowrap">{t.label}</span>
                                                                            <div className="flex items-center gap-1 shrink-0">
                                                                                <button
                                                                                    type="button"
                                                                                    disabled={roomCount === 0}
                                                                                    onClick={() => {
                                                                                        const newGuests = [...values.guests];
                                                                                        for (let i = 0; i < t.roomSize; i++) {
                                                                                            const idx = newGuests.findLastIndex(g => g.type === t.id);
                                                                                            if (idx !== -1) newGuests.splice(idx, 1);
                                                                                        }
                                                                                        setFieldValue('guests', newGuests);
                                                                                        scheduleQuote({
                                                                                            departureDateId: values.departureDateId,
                                                                                            travelDate: values.travelDate,
                                                                                            guestCounts: buildGuestCounts(newGuests),
                                                                                        });
                                                                                    }}
                                                                                    className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-20"
                                                                                >
                                                                                    <Minus size={9} strokeWidth={3} />
                                                                                </button>
                                                                                <span className="w-5 text-center text-xs font-black text-[#113A74]">{roomCount}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const newGuests = [...values.guests];
                                                                                        for (let i = 0; i < t.roomSize; i++) {
                                                                                            newGuests.push(makeGuest(t.id));
                                                                                        }
                                                                                        setFieldValue('guests', newGuests);
                                                                                        scheduleQuote({
                                                                                            departureDateId: values.departureDateId,
                                                                                            travelDate: values.travelDate,
                                                                                            guestCounts: buildGuestCounts(newGuests),
                                                                                        });
                                                                                    }}
                                                                                    className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#FFA500] hover:text-[#FFA500] transition-all"
                                                                                >
                                                                                    <Plus size={9} strokeWidth={3} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            {errors.guests && typeof errors.guests === 'string' && (
                                                                <div className="text-red-500 text-xs font-black uppercase tracking-wider mt-2 pl-1">
                                                                    {errors.guests}
                                                                </div>
                                                            )}
                                                        </section>

                                                        {/* Passenger forms — grouped per type, appear when count > 0 */}
                                                        {visibleGuestTypes.map(t => {
                                                            const typeGuests = values.guests
                                                                .map((g, idx) => ({ g, idx }))
                                                                .filter(({ g }) => g.type === t.id);
                                                            if (!typeGuests.length) return null;
                                                            const requiresDob = CHILD_INFANT_TYPES.includes(t.id);
                                                            return (
                                                                <section key={t.id} className="space-y-3">
                                                                    <h4 className="text-xs font-black text-[#113A74] uppercase tracking-[0.2em]">
                                                                        {t.label} Details
                                                                    </h4>
                                                                    <AnimatePresence initial={false}>
                                                                        {typeGuests.map(({ g: guest, idx: index }, posWithinType) => (
                                                                            <motion.div
                                                                                key={guest._key}
                                                                                initial={{ opacity: 0, y: 12 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                                                                transition={{ duration: 0.18 }}
                                                                                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-8 h-8 rounded-xl bg-[#113A74] text-white flex items-center justify-center font-black text-sm shrink-0">
                                                                                        {posWithinType + 1}
                                                                                    </div>
                                                                                    <p className="text-sm font-black text-[#113A74]">
                                                                                        Passenger
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-wrap gap-3">
                                                                                    {/* Salutation */}
                                                                                    <div className="space-y-1 w-24 shrink-0">
                                                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
                                                                                            Salutation <span className="text-red-400">*</span>
                                                                                        </label>
                                                                                        <Field
                                                                                            as="select"
                                                                                            name={`guests.${index}.salutation`}
                                                                                            className="w-full bg-white border border-slate-200 focus:border-[#FFA500]/60 rounded-lg py-2 px-2 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                                                                        >
                                                                                            <option value="">—</option>
                                                                                            {SALUTATIONS.map(s => (
                                                                                                <option key={s} value={s}>{s}</option>
                                                                                            ))}
                                                                                        </Field>
                                                                                        <ErrorMessage name={`guests.${index}.salutation`} component="div" className="text-red-500 text-[10px] font-bold pl-1" />
                                                                                    </div>

                                                                                    {/* Full Name */}
                                                                                    <div className="space-y-1 flex-1 min-w-[140px]">
                                                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
                                                                                            Full Name <span className="text-red-400">*</span>
                                                                                        </label>
                                                                                        <Field
                                                                                            type="text"
                                                                                            name={`guests.${index}.fullName`}
                                                                                            placeholder={t.label}
                                                                                            autoComplete="name"
                                                                                            className="w-full bg-white border border-slate-200 focus:border-[#FFA500]/60 rounded-lg py-2 px-3 outline-none transition-all text-sm font-semibold text-[#113A74] placeholder:text-slate-300"
                                                                                        />
                                                                                        <ErrorMessage name={`guests.${index}.fullName`} component="div" className="text-red-500 text-[10px] font-bold pl-1" />
                                                                                    </div>

                                                                                    {/* DOB */}
                                                                                    <div className="space-y-1 w-36 shrink-0">
                                                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
                                                                                            DOB{' '}
                                                                                            {requiresDob
                                                                                                ? <span className="text-red-400">*</span>
                                                                                                : <span className="text-slate-300 normal-case font-normal">(opt.)</span>
                                                                                            }
                                                                                        </label>
                                                                                        <Field
                                                                                            type="date"
                                                                                            name={`guests.${index}.dob`}
                                                                                            className="w-full bg-white border border-slate-200 focus:border-[#FFA500]/60 rounded-lg py-2 px-2 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                                                                        />
                                                                                        <ErrorMessage name={`guests.${index}.dob`} component="div" className="text-red-500 text-[10px] font-bold pl-1" />
                                                                                    </div>

                                                                                    {/* Passport Expiry */}
                                                                                    <div className="space-y-1 w-36 shrink-0">
                                                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
                                                                                            Passport Expiry <span className="text-red-400">*</span>
                                                                                        </label>
                                                                                        <Field
                                                                                            type="date"
                                                                                            name={`guests.${index}.passportExpiry`}
                                                                                            className="w-full bg-white border border-slate-200 focus:border-[#FFA500]/60 rounded-lg py-2 px-2 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                                                                        />
                                                                                        <ErrorMessage name={`guests.${index}.passportExpiry`} component="div" className="text-red-500 text-[10px] font-bold pl-1" />
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        ))}
                                                                    </AnimatePresence>
                                                                </section>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </FieldArray>

                                        {/* Submit section */}
                                        <div className="pt-6 pb-8 border-t border-slate-50 flex flex-col items-center gap-6 text-center">
                                            <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
                                                By submitting you agree to the booking terms. All information is securely handled.
                                            </p>

                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="group bg-[#113A74] hover:bg-[#1a4a8d] text-white rounded-full py-5 px-14 font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-[#113A74]/25 active:scale-95 disabled:opacity-60 flex items-center gap-3"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {submitting ? (
                                                        <motion.span key="loading" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                            <Loader2 size={16} className="animate-spin" />
                                                            {progress || 'Processing…'}
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span key="ready" className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                            {buttonLabel}
                                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        </div>

                                    </div>
                                </Form>
                            </div>
                        </motion.div>
                    );
                }}
            </Formik>
        </div>
    );
};

export default BookingModal;
