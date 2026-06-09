import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Ship, MapPin, CalendarDays, Anchor, Navigation } from 'lucide-react';
import cruiseBg from '../../assets/Cruise.png';

/* ─── helpers ─────────────────────────────────────────────── */
function formatDuration(days, nights) {
    const d = days ? `${days} Day${days !== 1 ? 's' : ''}` : '';
    const n = nights ? `${nights} Night${nights !== 1 ? 's' : ''}` : '';
    return [d, n].filter(Boolean).join(' & ') || null;
}
function formatPrice(price, currency = '') {
    if (!price) return null;
    const displayCurrency = currency === 'USD' ? 'QAR' : currency;
    return `${displayCurrency} ${Number(price).toLocaleString()}`;
}
function formatLocation(locationStr) {
    if (!locationStr) return null;
    const words = locationStr.split(/\s+/);
    if (words.length <= 4) {
        return <span>{locationStr}</span>;
    }
    const firstLine = words.slice(0, 4).join(' ');
    const secondLine = words.slice(4).join(' ');
    return (
        <span className="flex flex-col">
            <span>{firstLine}</span>
            <span>{secondLine}</span>
        </span>
    );
}

/* ─── skeleton ────────────────────────────────────────────── */
const CruiseCategoriesSkeleton = () => (
    <section className="relative min-h-[500px] lg:min-h-[680px] flex items-center bg-slate-900 animate-pulse py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-12 w-full">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                <div className="w-full lg:w-2/5 space-y-4">
                    <div className="h-9 w-32 bg-slate-700 rounded-full" />
                    <div className="h-11 w-full bg-slate-700 rounded" />
                    <div className="h-11 w-3/4 bg-slate-700 rounded" />
                    <div className="h-4 w-full bg-slate-700 rounded" />
                    <div className="h-12 w-36 bg-slate-700 rounded-full" />
                </div>
                <div className="w-full lg:flex-1 flex justify-center">
                    <div className="bg-white rounded-[20px] overflow-hidden w-full max-w-[370px] shadow">
                        <div className="bg-slate-200 h-[220px] w-full" />
                        <div className="p-4 space-y-2">
                            <div className="h-3 w-24 bg-slate-200 rounded mx-auto" />
                            <div className="h-5 w-3/4 bg-slate-200 rounded mx-auto" />
                            <div className="h-px bg-slate-100 w-full" />
                            <div className="h-4 w-2/3 bg-slate-200 rounded mx-auto" />
                            <div className="h-4 w-1/2 bg-slate-200 rounded mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ─── card ─────────────────────────────────────────────────── */
const CruiseCard = ({ cruise }) => {
    if (!cruise) return null;
    const name = cruise.name || '';
    const shipName = cruise.shipName || '';
    const destination = cruise.destination || '';
    const duration = cruise.duration || '';
    const departs = cruise.departs || '';
    const priceVal = cruise.priceVal;
    const currency = cruise.currency === 'USD' ? 'QAR' : (cruise.currency || '');
    const displayDates = cruise.departureDates || [];

    const iconColor = 'rgb(17, 58, 116)';

    return (
        <div className="w-full text-black select-none pb-2 h-full flex flex-col">
            {/* Image container with top rounded corners only */}
            <div className="relative w-full rounded-t-[16px] rounded-b-none overflow-hidden bg-slate-100 shrink-0" style={{ aspectRatio: '16/10' }}>
                {cruise.image ? (
                    <img
                        src={cruise.image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Ship size={48} className="text-slate-300" />
                    </div>
                )}
            </div>

            {/* Info container with bottom rounded corners only and no top margin gap */}
            <div className="bg-white rounded-b-[16px] rounded-t-none p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex-1 flex flex-col justify-between">
                <div>
                    {/* Cruise Name */}
                    <h3 className="text-left text-black text-[15px] font-medium leading-tight mb-0 font-sans line-clamp-2">
                        {name}
                    </h3>

                    {/* Subinfo Row: Duration, Region, Price */}
                    <div className="flex items-center justify-between gap-x-2 text-black text-[12px] mb-4 font-sans font-medium">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            {duration && <span className="shrink-0 text-gray-700">{duration}</span>}
                            {destination && (
                                <div className="flex items-center gap-0.5 min-w-0">
                                    <Anchor size={13} className="text-red-600 shrink-0" />
                                    <span className="text-black truncate" title={destination}>{destination}</span>
                                </div>
                            )}
                        </div>
                        {priceVal && (
                            <div className="text-right shrink-0 ml-2">
                                <div className="text-black font-bold text-[13px] leading-tight">
                                    <span className="text-red-600">{currency} </span>
                                    <span>{Number(priceVal).toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details list */}
                <div className="space-y-3 pt-1.5 font-sans">
                    {/* Ship row */}
                    {shipName && (
                        <div className="flex items-start gap-3">
                            <Ship size={17} style={{ color: iconColor, fill: iconColor }} className="shrink-0 mt-0.5" />
                            <span className="text-black text-[13px] font-medium font-sans leading-tight">{shipName}</span>
                        </div>
                    )}

                    {/* Pin row */}
                    {departs && (
                        <div className="flex items-start gap-3">
                            <MapPin size={17} style={{ color: iconColor, fill: iconColor }} className="shrink-0 mt-0.5" />
                            <span className="text-black text-[13px] font-medium font-sans leading-snug">
                                {formatLocation(departs)}
                            </span>
                        </div>
                    )}

                    {/* Schedules row */}
                    {displayDates && displayDates.length > 0 && (
                        <div className="flex items-start gap-3">
                            <Navigation size={17} style={{ color: iconColor, fill: iconColor }} className="shrink-0 mt-1 rotate-[45deg]" />
                            <div className="flex-1 space-y-1">
                                {displayDates.map((sched, sIdx) => (
                                    <div key={sIdx} className="flex text-[13px] font-medium leading-normal text-black">
                                        <span className="text-black w-12 shrink-0">{sched.year} :</span>
                                        <div className="text-black flex-1 pl-1">
                                            {sched.dates && sched.dates.map((dateLine, dIdx) => (
                                                <div key={dIdx}>{dateLine}</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── main component ──────────────────────────────────────── */
export default function CruiseCategories({ cruises: apiCruises, content, loading }) {
    const defaultContent = {
        subtitle: 'FEATURED CRUISES',
        heading: 'Explore The World',
        highlight: 'In Luxury',
        description: "Experience the finest cruise journeys across the world's most breathtaking destinations.",
    };
    const sectionContent = { ...defaultContent, ...content };
    const router = useRouter();

    const cruiseList = (apiCruises && apiCruises.length > 0)
        ? apiCruises.map((c, idx) => ({
            id: c.id || idx,
            name: c.name,
            cruiseLine: c.cruise_line?.trim() || null,
            shipName: c.ship_name?.trim() || null,
            image: c.images?.[0] || null,
            logoUrl: c.logo_url || null,
            duration: formatDuration(c.days, c.nights),
            destination: c.destination || null,
            departs: c.departs || null,
            priceVal: c.starting_price || null,
            currency: c.currency === 'USD' ? 'QAR' : (c.currency || ''),
            departureDates: c.departure_dates || null,
        }))
        : [];

    const displayCruises = cruiseList.slice(0, 2);

    if (loading) return <CruiseCategoriesSkeleton />;
    if (cruiseList.length === 0) return null;

    return (
        <section
            className="relative min-h-[500px] lg:min-h-[680px] flex items-center overflow-hidden py-12 lg:py-16 bg-cover bg-center"
            style={{ backgroundImage: `url(${cruiseBg.src || cruiseBg})` }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

                    {/* ── Left: text panel ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-2/5 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full mb-6 lg:mb-8 shadow-sm">
                            <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[13px] font-bold uppercase tracking-widest text-brand-magic">
                                {sectionContent.subtitle}
                            </span>
                        </div>

                        <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-white leading-[1.1] mb-1">
                            {sectionContent.heading}
                        </h2>
                        <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-[#FFA500] leading-[1.1] mb-4">
                            {sectionContent.highlight}
                        </h2>
                        <div className="w-10 h-[3px] bg-[#FFA500] rounded-full mb-6 mx-auto lg:mx-0" />

                        <p className="text-white/80 text-sm md:text-base mb-8 max-w-md mx-auto lg:mx-0 font-medium">
                            {sectionContent.description}
                        </p>

                        <button
                            onClick={() => router.push('/cruises')}
                            className="bg-[#FFA500] hover:bg-[#E59400] text-white font-bold py-4 px-8 rounded-full inline-flex items-center justify-center gap-3 transition-all shadow-[0_10px_20px_-5px_rgba(255,165,0,0.4)] mx-auto lg:mx-0 group"
                        >
                            <span className="text-[15px]">View Cruises</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* ── Right: card list ── */}
                    <div className="w-full lg:flex-1 flex justify-center">
                        <div className={`w-full grid gap-6 ${displayCruises.length === 1 ? 'max-w-[310px]' : 'max-w-[640px] grid-cols-1 sm:grid-cols-2'}`}>
                            {displayCruises.map((cruise) => (
                                <div
                                    key={cruise.id}
                                    className="cursor-pointer w-full h-full"
                                    onClick={() => router.push('/cruises')}
                                >
                                    <CruiseCard cruise={cruise} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
