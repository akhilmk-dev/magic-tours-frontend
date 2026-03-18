"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Calendar, Users, Camera, FileText,
    CheckCircle, Loader2, Plus, Minus,
    ArrowRight, Info, Globe
} from 'lucide-react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    try {
        const data = await api.post('/upload/image', formData);
        return data.url;
    } catch (err) {
        console.error('File upload failed:', err);
        throw new Error('Failed to upload file');
    }
};

const validationSchema = Yup.object().shape({
    departureDateId: Yup.string().required('Please select a departure date'),
    guests: Yup.array()
        .of(
            Yup.object().shape({
                fullName: Yup.string().required('Full name is required'),
                dob: Yup.date().required('Date of Birth is required').max(new Date(), 'DOB cannot be in the future'),
                passportNo: Yup.string().required('Passport number is required'),
                passportExpiry: Yup.date().required('Passport expiry is required').min(new Date(), 'Passport has expired'),
                photo: Yup.mixed().required('Profile photo is required'),
                passportCopy: Yup.mixed().required('Passport copy is required'),
            })
        )
        .min(1, 'At least one traveler is required')
});

// ─── FileUpload Sub-component ─────────────────────────────────────────────────

const FileUpload = ({ label, name, setFieldValue, value, icon: Icon }) => {
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
                {label} <span className="text-red-400">*</span>
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
                            <span className="text-[10px] text-slate-300">Image or PDF</span>
                        </>
                    )}
                </div>
            </div>
            <ErrorMessage name={name} component="div" className="text-red-500 text-xs font-bold uppercase pl-1" />
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const GUEST_TYPES = [
    { id: 'adultSingle', label: 'Adult Single', roomSize: 1 },
    { id: 'adultDouble', label: 'Adult Double', roomSize: 2 },
    { id: 'adultTriple', label: 'Adult Triple', roomSize: 3 },
    { id: 'childBed', label: 'Child with Bed', roomSize: 1 },
    { id: 'childNoBed', label: 'Child No Bed', roomSize: 1 },
    { id: 'infant', label: 'Infant', roomSize: 1 },
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

const BookingModal = ({ isOpen, onClose, pkg, user }) => {
    const { success, error: toastError } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState('');

    // ── Pricing helpers ───────────────────────────────────────────────────────

    const getActivePricing = (dateStr) => {
        if (!pkg?.pricing || !dateStr) return null;
        const d = new Date(dateStr).toISOString().split('T')[0];
        return pkg.pricing.find(p => {
            const from = new Date(p.valid_from).toISOString().split('T')[0];
            const to = new Date(p.valid_to).toISOString().split('T')[0];
            return d >= from && d <= to;
        }) || null;
    };

    const getPrice = (type, dateId) => {
        if (!pkg) return 0;
        const dep = pkg.departure_dates?.find(d => d.id === dateId);
        const pricing = dep ? getActivePricing(dep.departure_date) : null;
        const base = pkg.price || 0;
        const map = {
            adultSingle: pricing?.price_adult_single ?? pkg.default_price_adult_single ?? base,
            adultDouble: pricing?.price_adult_double ?? pkg.default_price_adult_double ?? base,
            adultTriple: pricing?.price_adult_triple ?? pkg.default_price_adult_triple ?? base,
            childBed: pricing?.price_child_with_bed ?? pkg.default_price_child_with_bed ?? (base * 0.7),
            childNoBed: pricing?.price_child_no_bed ?? pkg.default_price_child_no_bed ?? (base * 0.5),
            infant: pricing?.price_infant ?? pkg.default_price_infant ?? (base * 0.2),
        };
        return map[type] ?? base;
    };

    const calcTotal = (dateId, guests) => {
        const types = ['adultSingle', 'adultDouble', 'adultTriple', 'childBed', 'childNoBed', 'infant'];
        let total = 0;
        types.forEach(type => {
            const count = (guests || []).filter(g => g.type === type).length;
            if (count > 0) {
                const roomSize = GUEST_TYPES.find(gt => gt.id === type).roomSize;
                const units = Math.ceil(count / roomSize);
                total += units * getPrice(type, dateId);
            }
        });
        return total;
    };

    // ── Formik setup ──────────────────────────────────────────────────────────

    const initialValues = useMemo(() => ({
        departureDateId: pkg?.departure_dates?.[0]?.id || '',
        guests: [], // Start empty to ensure room logic matches form counts
    }), [pkg?.id]);

    // Derive a human-readable room_label for each guest.
    // Room grouping: Single=1 person/room, Double=2/room, Triple=3/room
    const getRoomLabel = (guestType, positionWithinType) => {
        const roomSizeMap = {
            adultSingle: { roomName: 'Single Room', size: 1 },
            adultDouble: { roomName: 'Double Room', size: 2 },
            adultTriple: { roomName: 'Triple Room', size: 3 },
            childBed: { roomName: 'Child Bed', size: 1 },
            childNoBed: { roomName: 'Child No Bed', size: 1 },
            infant: { roomName: 'Infant', size: 1 },
        };
        const { roomName, size } = roomSizeMap[guestType] || { roomName: 'Room', size: 1 };
        const roomNumber = Math.floor(positionWithinType / size) + 1;
        const personNumber = (positionWithinType % size) + 1;
        return `${roomName} ${roomNumber}, Person ${personNumber}`;
    };

    const getPassengerType = (guestType) => {
        if (guestType === 'infant') return 'Infant';
        if (guestType === 'childBed' || guestType === 'childNoBed') return 'Child';
        return 'Adult';
    };

    const handleSubmit = async (values) => {
        if (!user) { toastError('Please login to continue booking.'); return; }

        setSubmitting(true);
        try {
            // Upload files for all guests
            const guestsWithUrls = await Promise.all(
                values.guests.map(async (g, i) => {
                    setProgress(`Uploading documents for Guest ${i + 1}…`);
                    const [photoUrl, passportCopyUrl] = await Promise.all([
                        uploadFile(g.photo),
                        uploadFile(g.passportCopy),
                    ]);
                    return { ...g, photoUrl, passportCopyUrl };
                })
            );

            // Track per-type position to compute room labels
            const typeCounters = {};

            const passengers = guestsWithUrls.map(g => {
                typeCounters[g.type] = (typeCounters[g.type] ?? 0);
                const pos = typeCounters[g.type];
                typeCounters[g.type]++;
                return {
                    name: g.fullName,
                    dob: g.dob,
                    passport_number: g.passportNo,
                    passport_expiry: g.passportExpiry,
                    photo_url: g.photoUrl || '',
                    passport_copy_url: g.passportCopyUrl || '',
                    passenger_type: getPassengerType(g.type),
                    room_label: getRoomLabel(g.type, pos),
                };
            });

            const dep = pkg.departure_dates.find(d => d.id === values.departureDateId);
            const countOf = (type) => values.guests.filter(g => g.type === type).length;

            // Determine if this should be a manual request or a confirmed booking
            const avail = dep ? Math.max(0, (dep.slots || 0) - (dep.booked_slots || 0)) : 0;
            const isWaitlist = values.guests.length > avail;

            setProgress('Finalising submission…');

            let res;
            if (isWaitlist) {
                // Explicitly use the request endpoint for waitlist/manual cases
                res = await api.post('/bookings/frontend/request', {
                    package_id: pkg.id,
                    departure_date_id: values.departureDateId,
                    travel_date: dep.departure_date,
                    guest_counts: {
                        adult_single: countOf('adultSingle'),
                        adult_double: countOf('adultDouble'),
                        adult_triple: countOf('adultTriple'),
                        child_with_bed: countOf('childBed'),
                        child_no_bed: countOf('childNoBed'),
                        infant: countOf('infant'),
                    },
                    currency: pkg.currency || 'AED',
                    notes: '',
                    passengers,
                });
            } else {
                // Standard confirmed booking flow
                res = await api.post('/bookings/frontend/create', {
                    package_id: pkg.id,
                    departure_date_id: values.departureDateId,
                    travel_date: dep.departure_date,
                    guest_adult_single: countOf('adultSingle'),
                    guest_adult_double: countOf('adultDouble'),
                    guest_adult_triple: countOf('adultTriple'),
                    guest_child_with_bed: countOf('childBed'),
                    guest_child_no_bed: countOf('childNoBed'),
                    guest_infant: countOf('infant'),
                    currency: pkg.currency || 'AED',
                    notes: '',
                    passengers,
                });
            }

            if (isWaitlist || res.type === 'waitlist') {
                success(res.message || 'Booking request submitted. Our team will contact you soon.');
            } else {
                success('Booking placed successfully!');
            }
            onClose();
        } catch (err) {
            toastError(err.message || 'Failed to place booking. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
            setProgress('');
        }
    };

    if (!isOpen || !pkg) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue, errors, touched }) => {
                    const total = calcTotal(values.departureDateId, values.guests);

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
                                        <p className="text-base font-black text-[#FFA500]">{pkg.currency || 'AED'} {total.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Desktop: full sidebar */}
                                <div className="hidden md:flex flex-col p-8 h-full">
                                    <div className="relative z-10 mb-8">
                                        <h2 className="text-2xl font-black tracking-tight mb-1">
                                            My <span className="text-[#FFA500]">Trip</span>
                                        </h2>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest line-clamp-2">
                                            {pkg.title}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-2xl bg-[#FFA500] flex items-center justify-center shadow-md shadow-[#FFA500]/30 shrink-0">
                                            <Globe size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white/40 uppercase tracking-wide">Destination</p>
                                            <p className="text-sm font-bold">{pkg.location || 'International'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3 flex-1 overflow-y-auto underline-none scrollbar-hide">
                                        <p className="text-xs font-black text-white/40 uppercase tracking-wide border-b border-white/10 pb-2 mb-2">
                                            Pricing Breakdown
                                        </p>
                                        {GUEST_TYPES.map(t => {
                                            const count = values.guests.filter(g => g.type === t.id).length;
                                            if (!count) return null;
                                            const units = Math.ceil(count / t.roomSize);
                                            return (
                                                <div key={t.id} className="flex justify-between items-center text-xs font-semibold">
                                                    <span className="text-white/70">
                                                        {units} × {t.label} {t.roomSize > 1 ? 'Room' : ''} ({count} Guests)
                                                    </span>
                                                    <span className="text-white">
                                                        {pkg.currency || 'AED'} {(units * getPrice(t.id, values.departureDateId)).toLocaleString()}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                                            <span className="text-xs font-black uppercase text-[#FFA500]">Grand Total</span>
                                            <div>
                                                <span className="text-xs font-black mr-1">{pkg.currency || 'AED'}</span>
                                                <span className="text-2xl font-black text-white tracking-tight">
                                                    {total.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
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
                                    {/* header */}
                                    <div className="px-8 py-5 flex justify-between items-center border-b border-slate-100 shrink-0">
                                        <div>
                                            <h3 className="text-xl font-black text-[#113A74] tracking-tight">Trip Details</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                                Choose date & configure travelers
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                                                <Users size={13} className="text-[#113A74]" />
                                                <span className="text-xs font-black text-[#113A74]">{values.guests.length} Traveler{values.guests.length !== 1 ? 's' : ''}</span>
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

                                    {/* scrollable body */}
                                    <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#f1f1f1 transparent' }}>

                                        {/* ① Date Selection */}
                                        <section className="space-y-3">
                                            <h4 className="text-xs font-black text-[#113A74] uppercase tracking-[0.2em]">
                                                <span className="text-[#FFA500] mr-2">01</span>Choose Departure Date
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {pkg.departure_dates?.length > 0 ? (
                                                    pkg.departure_dates.map(d => {
                                                        const selected = values.departureDateId === d.id;
                                                        const date = new Date(d.departure_date);
                                                        return (
                                                            <button
                                                                key={d.id}
                                                                type="button"
                                                                onClick={() => setFieldValue('departureDateId', d.id)}
                                                                className={`relative flex-1 min-w-[140px] p-4 rounded-2xl border-2 transition-all flex flex-col gap-0.5 text-left ${selected
                                                                    ? 'border-[#113A74] bg-[#113A74] text-white shadow-lg shadow-[#113A74]/20'
                                                                    : 'border-slate-100 bg-white text-[#113A74] hover:border-slate-200 hover:shadow-sm'
                                                                    }`}
                                                            >
                                                                <span className={`text-xs font-black uppercase tracking-widest ${selected ? 'text-white/60' : 'text-slate-400'}`}>
                                                                    {date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                                </span>
                                                                <span className="text-xl font-black tracking-tighter">
                                                                    {date.getDate()}
                                                                    <span className={`text-sm font-bold ml-1.5 ${selected ? 'text-white/70' : 'text-slate-400'}`}>
                                                                        {date.toLocaleDateString(undefined, { weekday: 'short' })}
                                                                    </span>
                                                                </span>
                                                                
                                                                {/* Availability Indicator */}
                                                                {(() => {
                                                                    const avail = Math.max(0, (d.slots || 0) - (d.booked_slots || 0));
                                                                    return (
                                                                        <div className={`mt-1 text-[10px] font-black uppercase tracking-wider ${selected ? 'text-white/50' : 'text-slate-400'}`}>
                                                                            {avail > 0 ? (
                                                                                <span className={selected ? 'text-[#FFA500]' : 'text-green-600'}>{avail} Slot{avail > 1 ? 's' : ''} Left</span>
                                                                            ) : (
                                                                                <span className="text-red-400">Waitlist Only</span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}

                                                                {selected && (
                                                                    <CheckCircle size={14} className="absolute top-3 right-3 text-[#FFA500]" />
                                                                )}
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="w-full p-6 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                                                        <Calendar size={22} className="text-slate-300 mx-auto mb-2" />
                                                        <p className="text-sm font-bold text-slate-400">No scheduled departure dates yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                            <ErrorMessage name="departureDateId" component="div" className="text-red-500 text-xs font-bold uppercase" />
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
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <span className="text-sm font-bold text-[#113A74]">{t.label}</span>
                                                                            <span className="text-xs text-slate-400 font-medium">
                                                                                {t.roomSize > 1 ? `${t.roomSize} pax/room · ` : ''}{pkg.currency || 'AED'} {getPrice(t.id, values.departureDateId).toLocaleString()} / {t.roomSize > 1 ? 'Room' : 'Pax'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                type="button"
                                                                                disabled={roomCount === 0}
                                                                                onClick={() => {
                                                                                    let newGuests = [...values.guests];
                                                                                    for (let i = 0; i < t.roomSize; i++) {
                                                                                        const idx = newGuests.findLastIndex(g => g.type === t.id);
                                                                                        if (idx !== -1) newGuests.splice(idx, 1);
                                                                                    }
                                                                                    setFieldValue('guests', newGuests);
                                                                                }}
                                                                                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-20"
                                                                            >
                                                                                <Minus size={12} strokeWidth={3} />
                                                                            </button>
                                                                            <span className="w-5 text-center text-sm font-black text-[#113A74]">{roomCount}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    let newGuests = [...values.guests];
                                                                                    for (let i = 0; i < t.roomSize; i++) {
                                                                                        newGuests.push(makeGuest(t.id));
                                                                                    }
                                                                                    setFieldValue('guests', newGuests);
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

                                                    {/* ③ Guest Detail Forms */}
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
                                                                        {/* Guest header */}
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

                                                                        {/* Input fields */}
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

                                                                        {/* File uploads */}
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                                                            <FileUpload
                                                                                label="Profile Photo"
                                                                                name={`guests.${index}.photo`}
                                                                                setFieldValue={setFieldValue}
                                                                                value={guest.photo}
                                                                                icon={Camera}
                                                                            />
                                                                            <FileUpload
                                                                                label="Passport Copy"
                                                                                name={`guests.${index}.passportCopy`}
                                                                                setFieldValue={setFieldValue}
                                                                                value={guest.passportCopy}
                                                                                icon={FileText}
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

                                        <div className="pt-6 pb-8 border-t border-slate-50 flex flex-col items-center gap-6 text-center">
                                            <div className="space-y-4">
                                                <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
                                                    By submitting you agree to the booking terms. All documents are securely handled.
                                                </p>
                                                {(() => {
                                                    const dep = pkg.departure_dates?.find(d => d.id === values.departureDateId);
                                                    const avail = dep ? Math.max(0, (dep.slots || 0) - (dep.booked_slots || 0)) : 0;
                                                    const isWaitlist = values.guests.length > avail;
                                                    if (isWaitlist) {
                                                        return (
                                                            <div className="bg-[#FFA500]/10 border border-[#FFA500]/20 rounded-xl p-3 flex items-center gap-3 max-w-md mx-auto">
                                                                <Info size={16} className="text-[#FFA500] shrink-0" />
                                                                <p className="text-[11px] font-bold text-[#113A74] text-left leading-tight">
                                                                    WAITLIST REQUEST: Since you've requested {values.guests.length} slots and only {avail} are available, this will be processed as a manual booking request.
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>

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
                                                            {(() => {
                                                                const dep = pkg.departure_dates?.find(d => d.id === values.departureDateId);
                                                                const avail = dep ? Math.max(0, (dep.slots || 0) - (dep.booked_slots || 0)) : 0;
                                                                const isWaitlist = values.guests.length > avail;
                                                                return isWaitlist ? 'Submit Booking Request' : `Confirm & Pay — ${pkg.currency || 'AED'} ${total.toLocaleString()}`;
                                                            })()}
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
