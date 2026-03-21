import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import bgImage from '../../assets/wandersofqadar.png';
import slide1Image from '../../assets/Image 4.png';

const WondersOfQatarSkeleton = () => (
    <section className="relative min-h-[400px] flex items-center overflow-hidden py-16 animate-pulse bg-slate-900">
        <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-10">
            <div className="w-[320px] h-[320px] bg-slate-800/50 rounded-3xl" />
            <div className="flex-1 text-center">
                <div className="h-10 w-48 bg-slate-800/50 rounded-full mx-auto mb-6" />
                <div className="h-14 w-[500px] bg-slate-800/50 rounded mx-auto mb-4" />
                <div className="h-4 w-[400px] bg-slate-800/50 rounded mx-auto" />
            </div>
        </div>
    </section>
);

export default function WondersOfQatar({ spotlights: apiSpotlights, content, loading }) {
    const defaultContent = {
        subtitle: "Destination Spotlight",
        heading1: "Explore the",
        highlight: "Wonders of Qatar",
        description: "Experience the perfect blend of tradition and modernity. From the bustling Souq Waqif to the futuristic skyline of West Bay, Qatar offers an unforgettable journey through culture and innovation.",
        link_text: "Explore More"
    };

    const sectionContent = { ...defaultContent, ...content };

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const items = apiSpotlights && apiSpotlights.length > 0 ? apiSpotlights.map((s, idx) => ({
        id: s.id || idx,
        image: s.image || (slide1Image.src || slide1Image),
        title: s.heading,
        subtitle: 'See More',
    })) : [];



    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => items.length ? (prev + 1) % items.length : 0);
    }, [items.length]);

    // Autoplay
    useEffect(() => {
        if (items.length === 0) return;
        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer);
    }, [nextSlide, items.length]);
    if (loading) return <WondersOfQatarSkeleton />;
    if (items.length === 0) return null;

    return (
        <section className="relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage.src || bgImage}
                    alt="Qatar Skyline"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20 md:py-24 lg:py-32">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 xl:gap-24">

                    {/* Left Side - Slider Card */}
                    <div className="w-full sm:w-[300px] md:w-[340px] lg:w-[320px] xl:w-[360px] shrink-0">
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/20">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
                                {/* Image Slider */}
                                <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden mb-4">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={items[currentSlide].id}
                                            src={items[currentSlide].image}
                                            alt={items[currentSlide].title}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.6 }}
                                            className="w-full h-full object-cover absolute inset-0"
                                        />
                                    </AnimatePresence>
                                </div>

                                {/* Card Text */}
                                <div className="text-center pb-2">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={items[currentSlide].id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <h3 className="text-brand-magic text-lg sm:text-xl font-bold mb-1">
                                                {items[currentSlide].title}
                                            </h3>
                                            <span className="text-gray-400 text-xs font-heading font-medium tracking-normal">
                                                {items[currentSlide].subtitle}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Dot Indicators */}
                                <div className="flex justify-center gap-2 pt-3 pb-1">
                                    {items.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'w-7 h-2.5 bg-brand-magic'
                                                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 sm:mb-8 border border-white/15">
                            <svg className="text-white/80" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-white/90 font-jakarta">
                                {sectionContent.subtitle}
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-white leading-[1.1] mb-5 sm:mb-6 md:mb-8">
                            {sectionContent.heading1} <br />
                            {sectionContent.highlight}
                        </h2>

                        <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg">
                            {sectionContent.description}
                        </p>

                        <Link href="/destinations" className="inline-flex items-center gap-3 sm:gap-4 bg-[#FDB338] hover:bg-[#e9a42f] text-brand-magic font-heading font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-[15px] transition-all hover:-translate-y-1 shadow-xl shadow-[#FDB338]/20 group">
                            {sectionContent.link_text}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
