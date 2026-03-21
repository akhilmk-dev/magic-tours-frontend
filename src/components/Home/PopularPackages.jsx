"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { motion, useAnimation } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Calendar, MapPin } from 'lucide-react';
import FavoriteButton from '../common/FavoriteButton';

const staticPackageData = [
    {
        id: 1,
        title: "Japan Tour Package",
        location: "Japantown, San Francisco, CA",
        duration: "5 Days, 3 Nights",
        type: "Budget, Honeymoon",
        price: 1000,
        currency: "USD",
        description: "Good place to visit",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "South Korea Tour",
        location: "Seoul, South Korea",
        duration: "6 Days, 4 Nights",
        type: "Adventure, Family",
        price: 1200,
        currency: "USD",
        description: "Experience beautiful Korean culture and landscapes.",
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Switzerland Alps",
        location: "Zurich, Switzerland",
        duration: "7 Days, 5 Nights",
        type: "Luxury, Honeymoon",
        price: 2500,
        currency: "USD",
        description: "Breathtaking mountain landscapes and luxury experiences.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Dubai Desert Safari",
        location: "Dubai, UAE",
        duration: "4 Days, 3 Nights",
        type: "Adventure, Budget",
        price: 900,
        currency: "AED",
        description: "Golden sands and world-class city experiences await you.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop"
    }
];

const PopularPackagesSkeleton = () => (
    <section className="py-16 bg-white animate-pulse">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="h-8 w-32 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4" />
                <div className="h-4 w-96 bg-gray-200 rounded mx-auto" />
            </div>
            <div className="flex justify-center gap-6 overflow-hidden">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-[320px] h-[560px] bg-gray-100 rounded-[2rem] flex flex-col">
                        <div className="h-[40%] bg-gray-200" />
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
                                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="h-8 w-24 bg-gray-200 rounded" />
                                <div className="h-10 w-24 bg-gray-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default function PopularPackages({ packages: apiPackages, content, loading }) {
    const defaultContent = {
        subtitle: "Packages",
        heading: "Popular Travel",
        highlight: "Packages",
        description: "Experience stunning landscapes, iconic landmarks, and rich cultures. Our travel packages are designed for comfort, adventure, and discovery. Start your next unforgettable journey with us today."
    };

    const sectionContent = { ...defaultContent, ...content };
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const controls = useAnimation();
    const isTransitioning = useRef(false);
    const cardWidth = 344; // 320px card + 24px gap

    useEffect(() => {
        setMounted(true);
    }, []);

    const parseCategories = (cat) => {
        if (!cat) return "";
        if (Array.isArray(cat)) return cat.join(', ');
        if (typeof cat === 'string') {
            try {
                const parsed = JSON.parse(cat);
                if (Array.isArray(parsed)) return parsed.join(', ');
                return cat;
            } catch (e) { return cat; }
        }
        return String(cat);
    };

    const packageData = (apiPackages && apiPackages.length > 0)
        ? apiPackages.map(p => ({
            id: p.id,
            title: p.title || "Untitled Package",
            location: p.location || "Location TBD",
            duration: (p.days > 0 || p.nights > 0) ? `${p.days} Days, ${p.nights} Nights` : (p.duration || "Contact for duration"),
            type: parseCategories(p.category),
            price: p.price || 0,
            currency: p.currency || 'AED',
            description: p.description || "",
            image: p.image || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop",
            slug: p.slug
        }))
        : staticPackageData;

    const [currentIndex, setCurrentIndex] = useState(packageData.length * 2);

    useEffect(() => {
        if (!loading && mounted) {
            const startIdx = packageData.length * 2;
            setCurrentIndex(startIdx);
            controls.set({ x: -startIdx * cardWidth });
        }
    }, [loading, mounted, packageData.length]);

    if (loading) return <PopularPackagesSkeleton />;

    const extendedData = [...packageData, ...packageData, ...packageData, ...packageData, ...packageData];

    const slide = async (direction) => {
        if (isTransitioning.current || !mounted) return;
        isTransitioning.current = true;

        const nextIndex = currentIndex + direction;
        setCurrentIndex(nextIndex);

        await controls.start({
            x: -nextIndex * cardWidth,
            transition: {
                type: "spring",
                stiffness: 450,
                damping: 40,
                mass: 1,
                restDelta: 0.1
            }
        });

        const len = packageData.length;
        let finalIndex = nextIndex;
        const middleStart = len * 2;
        const middleEnd = len * 3 - 1;

        if (nextIndex > middleEnd) {
            finalIndex = middleStart + (nextIndex % len);
        } else if (nextIndex < middleStart) {
            finalIndex = middleEnd - (Math.abs(nextIndex - middleEnd) % len);
        }

        if (finalIndex !== nextIndex) {
            controls.set({ x: -finalIndex * cardWidth });
            setCurrentIndex(finalIndex);
        }

        setTimeout(() => {
            isTransitioning.current = false;
        }, 30);
    };

    if (!mounted) return <PopularPackagesSkeleton />;

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none">
                    <path d="M50 150 Q 300 50, 600 200 T 1200 150" stroke="#113A74" strokeWidth="2" strokeDasharray="12 12" />
                    <path d="M100 650 Q 400 550, 750 700 T 1350 650" stroke="#113A74" strokeWidth="2" strokeDasharray="12 12" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-3 bg-[#EEF8FF] px-6 py-3 rounded-full mb-6">
                        <svg className="text-brand-magic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                        </svg>
                        <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">
                            {sectionContent.subtitle}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-brand-heading mb-6 leading-tight">
                        {sectionContent.heading}{" "}
                        <span className="text-[#FFA500]">{sectionContent.highlight}</span>
                    </h2>
                    <p className="text-[#4F5B6D] text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        {sectionContent.description}
                    </p>
                </div>

                <div className="relative max-w-[1050px] mx-auto px-4 md:px-12 flex items-center justify-center min-h-[750px] overflow-visible">
                    <motion.div
                        className="flex gap-6 absolute left-1/2 items-center"
                        animate={controls}
                        style={{ marginLeft: -160 }}
                        initial={{ x: -(packageData.length * 2) * cardWidth }}
                    >
                        {extendedData.map((pkg, idx) => {
                            // Only the exact current index card is "focused" (white/active)
                            // OR any card the user is currently hovering over
                            const isFocused = idx === currentIndex;
                            const isActive = isFocused;
                            
                            const distance = Math.abs(idx - currentIndex);
                            const opacityLevel = distance > 1.5 ? 0 : 1;

                            return (
                                <motion.div
                                    key={`${pkg.id}-${idx}`}
                                    animate={{
                                        scale: isActive ? 1.04 : 0.97,
                                        zIndex: isActive ? 20 : 10,
                                        opacity: opacityLevel,
                                        height: isActive ? 640 : 560,
                                    }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    onClick={() => router.push(`/packages/${pkg.slug || pkg.id}`)}
                                    className="relative w-[320px] shrink-0 rounded-[2rem] overflow-hidden cursor-pointer flex flex-col shadow-xl hover:shadow-2xl"
                                    style={{
                                        backgroundColor: isActive ? "#FFFFFF" : "#113A74"
                                    }}
                                >
                                    {/* Image Section - 40% of card height */}
                                    <div className="relative flex-shrink-0 w-full" style={{ height: isActive ? '256px' : '224px' }}>
                                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                                        {/* Duration badge */}
                                        <div className="absolute top-4 left-0 bg-brand-magic text-white py-2 px-4 rounded-r-2xl flex items-center gap-2">
                                            <Calendar size={13} className="text-white flex-shrink-0" />
                                            <span className="text-[10px] font-bold whitespace-nowrap">{pkg.duration}</span>
                                        </div>
                                        {/* Favorite button */}
                                        <FavoriteButton packageId={pkg.id} className="absolute top-4 right-4 z-20" />
                                        {/* Location overlay at the bottom of the image */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white z-10">
                                            <MapPin size={16} fill="white" className="text-white flex-shrink-0" />
                                            <span className="text-[13px] font-medium line-clamp-1">{pkg.location}</span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    {isActive ? (
                                        /* ======= HOVER / ACTIVE STATE: White with rounded top overlap ======= */
                                        <div className="flex-1 bg-white rounded-t-[2.5rem] -mt-8 relative z-10 p-6 flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                                            <h3 title={pkg.title} className="text-[22px] font-bold text-[#16243D] mb-1 line-clamp-1">{pkg.title}</h3>
                                            <p title={pkg.description} className="text-[12px] text-[#6B7280] leading-relaxed mb-4 line-clamp-2">{pkg.description}</p>

                                            {/* Details info box */}
                                            <div className="bg-[#F7F8FC] rounded-[1.5rem] p-4 mb-5 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={16} className="text-[#1A73E8] flex-shrink-0" />
                                                    <span className="text-[#16243D] font-semibold text-[13px]">{pkg.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Star size={16} fill="#FACC15" className="text-[#FACC15] flex-shrink-0" />
                                                    <span title={pkg.type} className="text-[#16243D] font-semibold text-[13px] line-clamp-1">Tour Type :{pkg.type}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin size={16} className="text-[#1A73E8] flex-shrink-0" />
                                                    <span title={pkg.location} className="text-[#16243D] font-semibold text-[13px] line-clamp-1">{pkg.location}</span>
                                                </div>
                                                <div>
                                                    <span title={pkg.type} className="inline-block bg-[#FFA500] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider line-clamp-1">
                                                        {pkg.type}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price and Book Now */}
                                            <div className="mt-auto flex items-end justify-between">
                                                <div>
                                                    <span className="text-[#FFA500] text-[22px] font-extrabold leading-none">{pkg.currency} {pkg.price}</span>
                                                    <span className="block text-[10px] font-bold uppercase text-gray-400 mt-0.5">Onwards</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); router.push(`/packages/${pkg.slug || pkg.id}?book=true`); }}
                                                    className="px-6 py-3 rounded-full bg-[#113A74] text-white font-bold text-[13px] shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ======= DEFAULT STATE: Navy background ======= */
                                        <div className="flex-1 bg-[#113A74] p-6 flex flex-col">
                                            <h3 title={pkg.title} className="text-[22px] font-bold text-white mb-2 line-clamp-1">{pkg.title}</h3>
                                            <p title={pkg.description} className="text-[12px] text-white/75 leading-relaxed mb-4 line-clamp-2">{pkg.description}</p>

                                            {/* Tour Type row */}
                                            <div className="flex items-center gap-2 mb-auto">
                                                <Star size={14} fill="#FFA500" className="text-[#FFA500] flex-shrink-0" />
                                                <span title={pkg.type} className="text-[#FFA500] font-bold text-[13px] line-clamp-1">Tour Type :{pkg.type}</span>
                                            </div>

                                            {/* Price and Book Now */}
                                            <div className="mt-5 flex items-end justify-between">
                                                <div>
                                                    <span className="text-[#FFA500] text-[22px] font-extrabold leading-none">{pkg.currency} {pkg.price}</span>
                                                    <span className="block text-[10px] font-bold uppercase text-white/50 mt-0.5">Onwards</span>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); router.push(`/packages/${pkg.slug || pkg.id}`); }}
                                                        className="text-[12px] font-bold text-white/60 hover:text-white transition-colors mt-1 text-left"
                                                    >
                                                        See More
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); router.push(`/packages/${pkg.slug || pkg.id}?book=true`); }}
                                                    className="px-6 py-3 rounded-full bg-[#FFA500] text-[#113A74] font-bold text-[13px] shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Carousel arrows */}
                    <button
                        onClick={() => slide(-1)}
                        className="absolute left-[-20px] md:left-[-30px] top-1/2 -translate-y-1/2 w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white shadow-xl z-[60] hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => slide(1)}
                        className="absolute right-[-20px] md:right-[-30px] top-1/2 -translate-y-1/2 w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white shadow-xl z-[60] hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <ArrowRight size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </section>
    );
}
