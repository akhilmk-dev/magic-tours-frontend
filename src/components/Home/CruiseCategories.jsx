import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Ship, MapPin, CalendarDays } from 'lucide-react';
import cruiseBg from '../../assets/Cruise.png';

/* ─── helpers ─────────────────────────────────────────────── */
function formatDuration(days, nights) {
    const d = days   ? `${days} Day${days   !== 1 ? 's' : ''}` : '';
    const n = nights ? `${nights} Night${nights !== 1 ? 's' : ''}` : '';
    return [n, d].filter(Boolean).join(' / ') || null;
}
function formatPrice(price, currency = 'USD') {
    if (!price) return null;
    const sym = currency === 'USD' ? '$' : currency + ' ';
    return `From ${sym}${Number(price).toLocaleString()}`;
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
                    <div className="bg-white rounded-[20px] overflow-hidden w-full max-w-[420px] shadow">
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
const CruiseCard = ({ cruise }) => (
    <div className="bg-white rounded-[20px] shadow-[0_6px_30px_-6px_rgba(0,0,0,0.15)] w-full p-2 pb-1">
        {/* Image — rounded on all corners */}
        <div className="relative w-full rounded-[16px] overflow-hidden" style={{ aspectRatio: '16/10' }}>
            {cruise.image ? (
                <img
                    src={cruise.image}
                    alt={cruise.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Ship size={48} className="text-slate-300" />
                </div>
            )}
            {/* Price badge */}
            {cruise.price && (
                <div className="absolute top-3 right-3 bg-[#FFA500] text-white text-[12px] font-bold px-3.5 py-1.5 rounded-full shadow-md">
                    {cruise.price}
                </div>
            )}
        </div>

        {/* Info — left aligned */}
        <div className="pt-3 pb-1">
            {/* Cruise line label */}
            <p className="text-left text-[#2563EB] text-[13px] font-bold uppercase tracking-[0.12em] mb-1.5">
                {cruise.cruiseLine || 'Featured Cruise'}
            </p>

            {/* Cruise name */}
            <h3 className="text-left text-[#022C54] text-[20px] font-bold leading-snug mb-2.5 line-clamp-2">
                {cruise.name}
            </h3>

            {/* Info rows with dividers */}
            <div className="divide-y divide-gray-100">
                {cruise.shipName && (
                    <div className="flex items-center justify-start gap-2 py-2.5">
                        <Ship size={15} className="text-[#022C54] shrink-0" />
                        <span className="text-gray-600 text-[14px] capitalize">{cruise.shipName}</span>
                    </div>
                )}
                {cruise.destination && (
                    <div className="flex items-center justify-start gap-2 py-2.5">
                        <MapPin size={15} className="text-gray-400 shrink-0" />
                        <span className="text-gray-600 text-[14px]">{cruise.destination}</span>
                    </div>
                )}
                {cruise.duration && (
                    <div className="flex items-center justify-start gap-2 py-2.5">
                        <CalendarDays size={15} className="text-gray-400 shrink-0" />
                        <span className="text-gray-600 text-[14px]">{cruise.duration}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

/* ─── main component ──────────────────────────────────────── */
export default function CruiseCategories({ cruises: apiCruises, content, loading }) {
    const defaultContent = {
        subtitle:    'FEATURED CRUISES',
        heading:     'Explore The World',
        highlight:   'In Luxury',
        description: "Experience the finest cruise journeys across the world's most breathtaking destinations.",
    };
    const sectionContent = { ...defaultContent, ...content };
    const router = useRouter();

    const cruiseList = (apiCruises && apiCruises.length > 0)
        ? apiCruises.map((c, idx) => ({
            id:          c.id || idx,
            name:        c.name,
            cruiseLine:  c.cruise_line?.trim() || null,
            shipName:    c.ship_name?.trim()   || null,
            image:       c.images?.[0] || c.logo_url || null,
            duration:    formatDuration(c.days, c.nights),
            destination: c.destination || null,
            price:       formatPrice(c.starting_price, c.currency),
        }))
        : [];

    const count = cruiseList.length;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const isAnimating = useRef(false);
    const autoRef = useRef(null);

    const startAuto = () => {
        clearInterval(autoRef.current);
        if (count <= 1) return;
        autoRef.current = setInterval(() => navigate(1), 4500);
    };

    useEffect(() => {
        startAuto();
        return () => clearInterval(autoRef.current);
    }, [count]);

    const navigate = (dir) => {
        if (isAnimating.current || count <= 1) return;
        isAnimating.current = true;
        setDirection(dir);
        setCurrentIndex(prev => (prev + dir + count) % count);
        setTimeout(() => { isAnimating.current = false; }, 450);
    };

    const goTo = (idx) => {
        if (isAnimating.current || idx === currentIndex) return;
        setDirection(idx > currentIndex ? 1 : -1);
        setCurrentIndex(idx);
        startAuto();
    };

    if (loading) return <CruiseCategoriesSkeleton />;
    if (count === 0) return null;

    const variants = {
        enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
        center: { opacity: 1, x: 0 },
        exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
    };

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

                    {/* ── Right: card slider inside white panel ── */}
                    <div className="w-full lg:flex-1 flex justify-center">

                        {/* White outer panel */}
                        <div className="bg-white rounded-3xl shadow-2xl px-3 py-3 w-full max-w-[400px] flex flex-col items-center">

                            {/* Slider row */}
                            <div className="relative flex items-center gap-3 w-full">

                                {/* Left arrow */}
                                {count > 1 && (
                                    <button
                                        onClick={() => { navigate(-1); startAuto(); }}
                                        className="shrink-0 w-9 h-9 bg-gray-100 hover:bg-[#FFA500] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-all duration-200"
                                    >
                                        <ChevronLeft size={20} strokeWidth={2.5} />
                                    </button>
                                )}

                                {/* Card — slightly smaller inside the white panel */}
                                <div className="flex-1 overflow-hidden">
                                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                                        <motion.div
                                            key={currentIndex}
                                            custom={direction}
                                            variants={variants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => router.push('/cruises')}
                                            >
                                                <CruiseCard cruise={cruiseList[currentIndex]} />
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Right arrow */}
                                {count > 1 && (
                                    <button
                                        onClick={() => { navigate(1); startAuto(); }}
                                        className="shrink-0 w-9 h-9 bg-gray-100 hover:bg-[#FFA500] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-all duration-200"
                                    >
                                        <ChevronRight size={20} strokeWidth={2.5} />
                                    </button>
                                )}
                            </div>

                            {/* Dots inside white panel */}
                            {count > 1 && (
                                <div className="flex gap-2.5 mt-5">
                                    {cruiseList.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goTo(i)}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                i === currentIndex
                                                    ? 'bg-[#FFA500] w-6'
                                                    : 'bg-gray-200 hover:bg-gray-300 w-2'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
