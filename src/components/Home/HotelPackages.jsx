import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Crown } from 'lucide-react';

/* ─── skeleton ────────────────────────────────────────────── */
const HotelPackagesSkeleton = () => (
    <section className="py-20 bg-white animate-pulse">
        <div className="container mx-auto px-4 md:px-12 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="h-10 w-40 bg-slate-100 rounded-full mb-6" />
                    <div className="h-12 w-96 bg-slate-100 rounded mb-3" />
                </div>
                <div className="h-14 w-44 bg-slate-100 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <div className="bg-slate-100 rounded-3xl h-[490px]" />
                    <div className="bg-slate-100 rounded-2xl h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-slate-100 rounded-3xl h-[288px]" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);

/* ─── helpers ─────────────────────────────────────────────── */
function parseImages(raw) {
    if (!raw) return [];
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [parsed].filter(Boolean);
    } catch {
        return typeof raw === 'string' ? [raw] : [];
    }
}

/** Fill exactly `count` slots by cycling hotel images */
function buildSlots(images, count = 5) {
    if (!images || images.length === 0) return [];
    return Array.from({ length: count }, (_, i) => images[i % images.length]);
}

/* ─── Large card ──────────────────────────────────────────── */
const LargeCard = ({ image, hotel }) => (
    <div className="relative rounded-3xl overflow-hidden group cursor-pointer h-full">
        <img
            src={image}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Logo — top right */}
        <div className="absolute top-5 right-5 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 p-1">
            <div className="bg-white rounded-xl w-full h-full flex items-center justify-center overflow-hidden">
                {hotel.logo
                    ? <img src={hotel.logo} alt="logo" className="w-8 h-8 object-contain p-0.5" />
                    : <Crown size={20} className="text-[#FDB338]" />
                }
            </div>
        </div>

        {/* Info — bottom */}
        <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-white/70 text-xs mb-2">
                <MapPin size={13} className="text-[#FDB338]" />
                <span>{hotel.location}</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight line-clamp-2">
                {hotel.name}
            </h4>
            {hotel.desc && (
                <p className="text-white/60 text-xs line-clamp-2 font-medium leading-relaxed">
                    {hotel.desc}
                </p>
            )}
        </div>
    </div>
);

/* ─── Promotion banner ────────────────────────────────────── */
const PromoBanner = ({ promoImage, promoText }) => (
    <div className="relative flex items-center bg-[#FFF0F5] border border-dashed border-[#F472B6]/60 rounded-2xl overflow-visible">
        {/* Badge — overflows left edge slightly */}
        {promoImage && (
            <div className="shrink-0 -ml-3 pl-2 py-3 w-[100px] h-[100px] flex items-center justify-center z-10">
                <img
                    src={promoImage}
                    alt="promotion"
                    className="w-full h-full object-contain drop-shadow-sm"
                />
            </div>
        )}
        {/* Promo text */}
        {promoText && (
            <p className="flex-1 pr-5 text-[#E91E8C] font-bold text-base sm:text-lg leading-snug">
                {promoText}
            </p>
        )}
    </div>
);

/* ─── Small card ──────────────────────────────────────────── */
const SmallCard = ({ image, hotel }) => (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer h-full">
        <img
            src={image}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
            <p className="text-white text-[13px] font-semibold line-clamp-1 drop-shadow">
                {hotel.name}
            </p>
        </div>
    </div>
);

/* ─── Main component ──────────────────────────────────────── */
export default function HotelPackages({ hotels: apiHotels, content, loading }) {
    const defaultContent = {
        subtitle:  'Premium Hotels',
        heading:   'Discover Exclusive',
        highlight: 'Hotel Packages',
    };
    const sectionContent = { ...defaultContent, ...content };

    /* One slide per hotel, skip hotels with no images */
    const slides = (apiHotels && apiHotels.length > 0)
        ? apiHotels
            .map(h => {
                const images = parseImages(h.images);
                if (images.length === 0) return null;
                return {
                    hotel: {
                        id:         h.id,
                        name:       h.name,
                        location:   h.country || h.address || '',
                        desc:       h.overview || h.description || '',
                        logo:       h.hotel_logo_image || null,
                        promoText:  h.promotion_text  || null,
                        promoImage: h.promotion_image || null,
                    },
                    slots: buildSlots(images, 5), // [0]=large, [1-4]=small grid
                };
            })
            .filter(Boolean)
        : [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (slides.length > 0 && currentIndex >= slides.length) setCurrentIndex(0);
    }, [slides.length]);

    const startTimer = () => {
        clearInterval(timerRef.current);
        if (slides.length <= 1) return;
        timerRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 5000);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, [slides.length]);

    const goTo = (idx) => { setCurrentIndex(idx); startTimer(); };

    if (loading) return <HotelPackagesSkeleton />;
    if (slides.length === 0) return null;

    const { hotel, slots } = slides[currentIndex];
    const hasPromo = !!(hotel.promoText || hotel.promoImage);

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-12 lg:px-16">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 sm:mb-12">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 bg-[#F2F5FF] px-6 py-3 rounded-full mb-6 border border-gray-100 shadow-sm">
                            <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-brand-magic">
                                {sectionContent.subtitle}
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-brand-heading leading-[1.1]">
                            {sectionContent.heading}{' '}
                            <span className="text-[#FFA500]">{sectionContent.highlight}</span>
                        </h2>
                    </div>
                    <Link href="/hotels">
                        <button className="bg-brand-magic hover:opacity-90 text-white px-8 py-4 rounded-[2rem] font-heading font-bold transition-all flex items-center gap-4 group shadow-lg w-fit whitespace-nowrap">
                            <span>Explore more</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
                        </button>
                    </Link>
                </div>

                {/* Slide */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* ── Left column: large card + optional promo banner ── */}
                        <div className="flex flex-col gap-4">
                            {/* Large card — shrinks slightly when promo banner is present */}
                            <div className={hasPromo
                                ? 'h-[400px] sm:h-[460px] lg:h-[490px]'
                                : 'h-[400px] sm:h-[500px] lg:h-[600px]'
                            }>
                                <LargeCard image={slots[0]} hotel={hotel} />
                            </div>

                            {/* Promotion banner — only when data exists */}
                            {hasPromo && (
                                <PromoBanner
                                    promoImage={hotel.promoImage}
                                    promoText={hotel.promoText}
                                />
                            )}
                        </div>

                        {/* ── Right column: 2×2 small cards ── */}
                        <div className="grid grid-cols-2 gap-4 h-[400px] sm:h-[500px] lg:h-[600px]">
                            {slots.slice(1).map((img, i) => (
                                <SmallCard key={i} image={img} hotel={hotel} />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                {slides.length > 1 && (
                    <div className="flex justify-center gap-3 mt-10">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    i === currentIndex
                                        ? 'bg-brand-magic w-8'
                                        : 'bg-gray-200 hover:bg-gray-300 w-2.5'
                                }`}
                            />
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}
