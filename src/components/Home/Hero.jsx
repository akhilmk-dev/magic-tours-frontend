import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Facebook, Twitter, Instagram } from 'lucide-react';

// Import assets
import image1 from '../../assets/link_image_01.png';
import image2 from '../../assets/link_image_02.png';
import image3 from '../../assets/Rectangle 640.png';
import backgroundNew from '../../assets/Background new.png';
import shapeImg from '../../assets/shape.png';

const staticSlides = [
    {
        id: 1,
        image: image1,
        location: "SAHARA DESERT - MOROCCO",
        title: "Bespoke",
        subtitle: "Journeys",
        description: "Beautifully Crafted and Fairly Priced. Experience the world in unparalleled luxury.",
        url: "/tours",
        button_text: "Plan My Trip"
    },
    {
        id: 2,
        image: image2,
        location: "MALDIVES - SOUTH ASIA",
        title: "Tropical",
        subtitle: "Escapes",
        description: "Discover hidden paradises and pristine beaches. Your dream vacation awaits.",
        url: "/tours",
        button_text: "Plan My Trip"
    },
    {
        id: 3,
        image: image3,
        location: "MOUNT BROMO - INDONESIA",
        title: "Global",
        subtitle: "Adventures",
        description: "Explore the majestic beauty of volcanic landscapes and misty valleys.",
        url: "/tours",
        button_text: "Plan My Trip"
    },
    {
        id: 4,
        image: backgroundNew,
        location: "SANTORINI - GREECE",
        title: "Serene",
        subtitle: "Getaways",
        description: "Unwind in the most exclusive resorts surrounded by crystal-clear waters.",
        url: "/tours",
        button_text: "Plan My Trip"
    }
];

const HeroSkeleton = () => (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900 animate-pulse">
        <div className="absolute inset-0 z-0 bg-slate-800/50" />
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-32 sm:pt-40 lg:pt-48 pb-32 flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 sm:gap-8 lg:gap-12">
                <div className="flex-1 lg:max-w-[55%] xl:max-w-[50%]">
                    <div className="h-4 w-32 bg-slate-700/50 rounded mb-4" />
                    <div className="h-12 sm:h-20 w-full bg-slate-700/50 rounded mb-6" />
                    <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-8" />
                    <div className="h-14 w-40 bg-slate-700/50 rounded-full" />
                </div>
                <div className="hidden lg:flex gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-28 lg:w-32 xl:w-44 h-36 lg:h-44 xl:h-56 bg-slate-800/50 rounded-xl border border-slate-700/50" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default function Hero({ slides: apiSlides, loading }) {
    const slides = apiSlides && apiSlides.length > 0 ? apiSlides : staticSlides;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Clamp currentSlide if API slides arrive with fewer items than static slides
    useEffect(() => {
        if (currentSlide >= slides.length) {
            setCurrentSlide(0);
        }
    }, [slides.length]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    const nextSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setIsAutoPlaying(false);
        setCurrentSlide(index);
    };

    // Calculate next slides for the mini cards
    const getNextSlides = () => {
        const nextIndices = [];
        for (let i = 1; i <= 3; i++) {
            nextIndices.push((currentSlide + i) % slides.length);
        }
        return nextIndices;
    };

    if (loading) return <HeroSkeleton />;

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
            {/* Background Slideshow */}
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${slides[currentSlide].image.src || slides[currentSlide].image}")` }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>

            {/* Right Side Fixed Content: Social & Slider Controls (lg+ only) */}
            <div className="absolute right-4 lg:right-6 xl:right-8 top-28 lg:top-32 bottom-40 lg:bottom-56 z-30 hidden lg:flex flex-col items-end justify-between pointer-events-none">
                {/* Social Media Icons */}
                <div className="flex flex-col gap-4 lg:gap-5 xl:gap-6 pointer-events-auto">
                    {[Facebook, Twitter, Instagram].map((Icon, i) => (
                        <button key={i} className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-110">
                            <Icon size={16} />
                        </button>
                    ))}
                </div>

                {/* Slider Controls */}
                <div className="flex flex-col items-end gap-4 lg:gap-6 xl:gap-10 w-full pointer-events-auto">
                    {/* Mini Cards Row */}
                    <div className="flex gap-2 lg:gap-3 xl:gap-4 overflow-visible">
                        {getNextSlides().map((slideIndex, i) => (
                            <motion.div
                                key={slideIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                onClick={() => goToSlide(slideIndex)}
                                className="w-28 lg:w-32 xl:w-44 h-36 lg:h-44 xl:h-56 rounded-xl lg:rounded-2xl overflow-hidden relative cursor-pointer group shrink-0 shadow-2xl border border-white/10"
                            >
                                <img
                                    src={slides[slideIndex].image.src || slides[slideIndex].image}
                                    alt={slides[slideIndex].title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 lg:p-3 xl:p-4 flex flex-col justify-end">
                                    <p className="text-white/60 text-[7px] lg:text-[8px] xl:text-[10px] font-bold uppercase tracking-wider mb-0.5">{slides[slideIndex].location?.split(' - ')[1] || slides[slideIndex].location}</p>
                                    <h4 className="text-white font-bold text-[9px] lg:text-[10px] xl:text-sm leading-tight font-display uppercase">{slides[slideIndex].title} {slides[slideIndex].subtitle || ''}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation Row */}
                    <div className="flex items-center gap-3 lg:gap-4 xl:gap-8 w-full max-w-xl">
                        <div className="flex gap-2 xl:gap-3">
                            <button
                                onClick={prevSlide}
                                className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#022C54] transition-all duration-300"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#022C54] transition-all duration-300"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="flex-1 relative h-[2px] bg-white/20 overflow-hidden">
                            <motion.div
                                initial={false}
                                animate={{ left: `${(currentSlide / (slides.length - 1)) * 80}%` }}
                                transition={{ duration: 0.8 }}
                                className="absolute top-0 h-full w-16 lg:w-20 bg-[#FDB338]"
                            />
                        </div>

                        <div className="flex items-end text-white">
                            <span className="text-3xl lg:text-4xl xl:text-7xl font-bold leading-none tracking-tighter">0{currentSlide + 1}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-44 sm:pt-40 lg:pt-48 pb-32 sm:pb-48 lg:pb-32 min-h-full flex flex-col justify-center">
                <div className="flex flex-col lg:flex-row lg:items-end gap-6 sm:gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 lg:max-w-[55%] xl:max-w-[50%] text-center lg:text-left">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-[#FDB338] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 block">
                                    {slides[currentSlide].location}
                                </span>
                                <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px] font-bold text-white leading-[1.1] mb-3 sm:mb-6 tracking-tight">
                                    {slides[currentSlide].title} <br />
                                    <span className="text-[#FDB338] font-medium">
                                        {slides[currentSlide].subtitle}
                                    </span>
                                </h1>

                                <p className="text-white/80 text-xs sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-8 md:mb-10 lg:mb-12 max-w-md sm:max-w-lg lg:max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                    {slides[currentSlide].description}
                                </p>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-5">
                                    <Link href={slides[currentSlide].url || slides[currentSlide].link || "/tours"} className="bg-white hover:bg-gray-100 text-[#022C54] font-heading font-bold h-11 sm:h-14 md:h-[60px] xl:h-[64px] px-7 sm:px-10 xl:px-12 rounded-full flex items-center justify-center gap-3 sm:gap-4 transition-all transform hover:translate-y-[-4px] shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] group moving-light-border">
                                        <span className="text-[12px] sm:text-[14px] xl:text-[16px] tracking-wide">
                                            {slides[currentSlide].button_text || "Plan My Trip"}
                                        </span>
                                        <div className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                                            <ArrowRight size={14} className="sm:size-[16px]" />
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Small screen Mini Slider & Navigation (below lg) */}
                    <div className="lg:hidden flex flex-col items-center gap-4 sm:gap-6 w-full z-20 mt-2 sm:mt-6">
                        {/* Mini Slider for Mobile/Tablet */}
                        <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto w-full px-2 sm:px-4 no-scrollbar pb-1 snap-x">
                            {getNextSlides().map((slideIndex, i) => (
                                <motion.div
                                    key={`mobile-mini-${slideIndex}`}
                                    onClick={() => goToSlide(slideIndex)}
                                    className="w-24 h-32 sm:w-28 sm:h-36 md:w-36 md:h-44 rounded-lg sm:rounded-xl overflow-hidden relative cursor-pointer group shrink-0 shadow-lg border border-white/10 snap-center"
                                >
                                    <img
                                        src={slides[slideIndex].image.src || slides[slideIndex].image}
                                        alt={slides[slideIndex].title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 sm:p-3 flex flex-col justify-end">
                                        <p className="text-white/60 text-[7px] sm:text-[8px] font-bold uppercase tracking-wider mb-0.5">{slides[slideIndex].location?.split(' - ')[1] || slides[slideIndex].location}</p>
                                        <h4 className="text-white font-bold text-[9px] sm:text-[10px] leading-tight font-display uppercase">{slides[slideIndex].title}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Navigation Row */}
                        <div className="flex items-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-xl px-2 sm:px-4">
                            <div className="flex gap-2 sm:gap-3">
                                <button onClick={prevSlide} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white active:bg-white active:text-[#022C54]"><ChevronLeft size={16} /></button>
                                <button onClick={nextSlide} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white active:bg-white active:text-[#022C54]"><ChevronRight size={16} /></button>
                            </div>
                            <div className="flex-1 relative h-[1px] bg-white/20">
                                <motion.div animate={{ left: `${(currentSlide / (slides.length - 1)) * 80}%` }} className="absolute top-0 h-full w-16 sm:w-20 bg-[#FDB338]" />
                            </div>
                            <div className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">0{currentSlide + 1}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Shape Overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                <img src={shapeImg.src || shapeImg} alt="" className="w-full h-auto block" />
            </div>
        </section>
    );
}

