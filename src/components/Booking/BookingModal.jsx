"use client";

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Calendar, Users, Camera, FileText,
    CheckCircle, Loader2, Plus, Minus,
    ArrowRight, Info, Globe, AlertCircle
} from 'lucide-react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    try {
        const data = await api.post('/upload/image', formData);
        return data.url;
    } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to upload file';
        throw new Error(msg);
    }
};

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

let _guestKeyCounter = 0;
const makeGuest = (type = 'adultDouble') => ({
    _key: ++_guestKeyCounter,
    fullName: '',
    dob: '',
    passportNo: '',
    passportExpiry: '',
    photo: '',
    passportCopy: '',
    type,
});

const buildGuestCounts = (guests) => {
    const result = {};
    GUEST_TYPES.forEach(t => {
        const persons = guests.filter(g => g.type === t.id).length;
        // Sharing types (double/triple/quad): send number of ROOMS, not persons
        result[t.apiKey] = t.roomSize > 1 ? Math.ceil(persons / t.roomSize) : persons;
    });
    return result;
};

// ─── FileUpload Sub-component ─────────────────────────────────────────────────

const FileUpload = ({ label, name, setFieldValue, value, icon: Icon, required = true }) => {
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            setFieldValue(name, file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                {label}{' '}
                {required
                    ? <span className="text-red-400">*</span>
                    : <span className="text-slate-300 normal-case font-normal">(optional)</span>
                }
            </label>
            <div className="relative h-32 w-full">
                <input
                    type="file"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*,application/pdf"
                />
                <div className={`w-full h-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 text-center ${value
                    ? 'border-green-200 bg-green-50/40'
                    : 'border-slate-100 bg-slate-50/50 hover:border-[#FFA500]/30 hover:bg-white'
                    }`}>
                    {value ? (
                        <div className="flex flex-col items-center gap-1">
                            {preview ? (
                                <img src={preview} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-green-100 shadow-sm" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <CheckCircle size={20} />
                                </div>
                            )}
                            <span className="text-xs font-bold text-slate-600 max-w-[120px] truncate">{value.name}</span>
                            <span className="text-[10px] text-green-600 font-black uppercase tracking-wide">Uploaded ✓</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                <Icon size={17} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Click to upload</span>
                            <span className="text-[10px] text-slate-300">Image or PDF (Max 5MB)</span>
                        </>
                    )}
                </div>
            </div>
            <ErrorMessage name={name} component="div" className="text-red-500 text-xs font-bold uppercase pl-1" />
        </div>
    );
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

    const bookingType = pkg?.booking_type || 'fixed_departure';
    const isFixed = bookingType === 'fixed_departure';

    const quoteTimerRef = useRef(null);

    // ── Valid date range for normal packages ──────────────────────────────────
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

    // ── Filtered departure dates for fixed packages ───────────────────────────
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
            fullName: Yup.string().required('Full name is required'),
            dob: Yup.date().required('Date of Birth is required').max(new Date(), 'DOB cannot be in the future'),
            passportNo: Yup.string().required('Passport number is required'),
            passportExpiry: Yup.date().required('Passport expiry is required').min(new Date(), 'Passport has expired'),
            photo: Yup.mixed()
                .required('Profile photo is required')
                .test('fileSize', 'Photo must be less than 5MB', v => !v || v.size <= MAX_FILE_SIZE),
            passportCopy: Yup.mixed()
                .test('fileSize', 'Passport copy must be less than 5MB', v => !v || v.size <= MAX_FILE_SIZE),
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

    // ── Room label & passenger type ───────────────────────────────────────────
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
            const guestsWithUrls = await Promise.all(
                values.guests.map(async (g, i) => {
                    setProgress(`Uploading documents for Guest ${i + 1}…`);
                    const [photoUrl, passportCopyUrl] = await Promise.all([
                        uploadFile(g.photo),
                        g.passportCopy ? uploadFile(g.passportCopy) : Promise.resolve(null),
                    ]);
                    return { ...g, photoUrl, passportCopyUrl };
                })
            );

            const typeCounters = {};
            const passengers = guestsWithUrls.map(g => {
                typeCounters[g.type] = typeCounters[g.type] ?? 0;
                const pos = typeCounters[g.type]++;
                const gt = GUEST_TYPES.find(t => t.id === g.type);
                return {
                    name: g.fullName,
                    dob: g.dob,
                    passport_number: g.passportNo,
                    passport_expiry: g.passportExpiry,
                    photo_url: g.photoUrl || '',
                    passport_copy_url: g.passportCopyUrl || '',
                    passenger_type: gt?.passengerType || 'Adult',
                    room_label: getRoomLabel(g.type, pos),
                };
            });

            const countOf = (id) => {
                const t = GUEST_TYPES.find(gt => gt.id === id);
                const persons = values.guests.filter(g => g.type === id).length;
                return (t?.roomSize ?? 1) > 1 ? Math.ceil(persons / (t?.roomSize ?? 1)) : persons;
            };
            setProgress('Finalising submission…');

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

    // ── Derived display values ────────────────────────────────────────────────
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

                    // Button label
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

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#FFA500] flex items-center justify-center shadow-md shadow-[#FFA500]/30 shrink-0">
                                            <Globe size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white/40 uppercase tracking-wide">Destination</p>
                                            <p className="text-sm font-bold">{pkg.location || 'International'}</p>
                                        </div>
                                    </div>

                                    {/* Package type badge */}
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
                                            Passport copies are required to process visa &amp; travel arrangements.
                                        </p>
                                    </div>

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
                                                // ── Fixed departure: date chips
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
                                                // ── Normal package: date picker
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

                                                    {/* Blackout ranges summary */}
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
                                                                    {/* Per-date blackout warning */}
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

                                        {/* ② Traveler Counts + ③ Guest Forms */}
                                        <FieldArray name="guests">
                                            {() => (
                                                <div className="space-y-10">

                                                    {/* ② Traveler Counters */}
                                                    <section className="space-y-3">
                                                        <h4 className="text-xs font-black text-[#113A74] uppercase tracking-[0.2em]">
                                                            <span className="text-[#FFA500] mr-2">02</span>Add Travelers
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {GUEST_TYPES.map(t => {
                                                                const guestCount = values.guests.filter(g => g.type === t.id).length;
                                                                const roomCount = Math.ceil(guestCount / t.roomSize);
                                                                return (
                                                                    <div
                                                                        key={t.id}
                                                                        className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                                                                    >
                                                                        <span className="text-sm font-bold text-[#113A74]">{t.label}</span>
                                                                        <div className="flex items-center gap-2">
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
                                                                                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-20"
                                                                            >
                                                                                <Minus size={12} strokeWidth={3} />
                                                                            </button>
                                                                            <span className="w-5 text-center text-sm font-black text-[#113A74]">{roomCount}</span>
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
                                                                                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#FFA500] hover:text-[#FFA500] transition-all"
                                                                            >
                                                                                <Plus size={12} strokeWidth={3} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        {errors.guests && typeof errors.guests === 'string' && (
                                                            <div className="text-red-500 text-xs font-black uppercase tracking-wider mt-3 pl-4">
                                                                {errors.guests}
                                                            </div>
                                                        )}
                                                    </section>

                                                    {/* ③ Passenger Detail Forms */}
                                                    <section className="space-y-4">
                                                        <h4 className="text-xs font-black text-[#113A74] uppercase tracking-[0.2em]">
                                                            <span className="text-[#FFA500] mr-2">03</span>Passenger Information
                                                        </h4>
                                                        <div className="space-y-8">
                                                            <AnimatePresence initial={false}>
                                                                {values.guests.map((guest, index) => (
                                                                    <motion.div
                                                                        key={guest._key}
                                                                        initial={{ opacity: 0, y: 16 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="p-7 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-6"
                                                                    >
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-10 h-10 rounded-xl bg-[#113A74] text-white flex items-center justify-center font-black text-base shrink-0">
                                                                                {index + 1}
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-black text-[#113A74] text-base leading-tight">
                                                                                    {GUEST_TYPES.find(t => t.id === guest.type)?.label}
                                                                                </p>
                                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-0.5">Passenger {index + 1}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                                            {[
                                                                                { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'As per passport' },
                                                                                { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '' },
                                                                                { name: 'passportNo', label: 'Passport No.', type: 'text', placeholder: 'e.g. A1234567' },
                                                                                { name: 'passportExpiry', label: 'Passport Expiry', type: 'date', placeholder: '' },
                                                                            ].map(f => (
                                                                                <div key={f.name} className="space-y-2">
                                                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">{f.label}</label>
                                                                                    <Field
                                                                                        type={f.type}
                                                                                        name={`guests.${index}.${f.name}`}
                                                                                        placeholder={f.placeholder}
                                                                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-[#FFA500]/40 focus:bg-white rounded-2xl py-4 px-5 outline-none transition-all text-base font-semibold text-[#113A74] placeholder:text-slate-300"
                                                                                    />
                                                                                    <ErrorMessage name={`guests.${index}.${f.name}`} component="div" className="text-red-500 text-xs font-bold uppercase pl-1" />
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                                                            <FileUpload
                                                                                label="Profile Photo"
                                                                                name={`guests.${index}.photo`}
                                                                                setFieldValue={setFieldValue}
                                                                                value={guest.photo}
                                                                                icon={Camera}
                                                                                required={true}
                                                                            />
                                                                            <FileUpload
                                                                                label="Passport Copy"
                                                                                name={`guests.${index}.passportCopy`}
                                                                                setFieldValue={setFieldValue}
                                                                                value={guest.passportCopy}
                                                                                icon={FileText}
                                                                                required={false}
                                                                            />
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </AnimatePresence>
                                                        </div>
                                                    </section>
                                                </div>
                                            )}
                                        </FieldArray>

                                        {/* Submit section */}
                                        <div className="pt-6 pb-8 border-t border-slate-50 flex flex-col items-center gap-6 text-center">
                                            <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
                                                By submitting you agree to the booking terms. All documents are securely handled.
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
