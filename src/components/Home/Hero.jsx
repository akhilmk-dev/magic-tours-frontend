import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import HeroContactForm from '../common/HeroContactForm';

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
        button_text: "Explore Packages"
    },
    {
        id: 2,
        image: image2,
        location: "MALDIVES - SOUTH ASIA",
        title: "Tropical",
        subtitle: "Escapes",
        description: "Discover hidden paradises and pristine beaches. Your dream vacation awaits.",
        url: "/tours",
        button_text: "Explore Packages"
    },
    {
        id: 3,
        image: image3,
        location: "MOUNT BROMO - INDONESIA",
        title: "Global",
        subtitle: "Adventures",
        description: "Explore the majestic beauty of volcanic landscapes and misty valleys.",
        url: "/tours",
        button_text: "Explore Packages"
    },
    {
        id: 4,
        image: backgroundNew,
        location: "SANTORINI - GREECE",
        title: "Serene",
        subtitle: "Getaways",
        description: "Unwind in the most exclusive resorts surrounded by crystal-clear waters.",
        url: "/tours",
        button_text: "Explore Packages"
    }
];

const HeroSkeleton = () => (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900 animate-pulse">
        <div className="absolute inset-0 z-0 bg-slate-800/50" />
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-32 sm:pt-40 lg:pt-48 pb-32 flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-24">
                <div className="flex-1 lg:max-w-2xl">
                    <div className="h-4 w-32 bg-slate-700/50 rounded mb-4" />
                    <div className="h-12 sm:h-20 w-full bg-slate-700/50 rounded mb-6" />
                    <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-8" />
                    <div className="h-14 w-64 bg-slate-700/50 rounded-full" />
                </div>
                <div className="hidden lg:block w-[400px] h-[480px] bg-slate-800/50 rounded-[35px]" />
            </div>
        </div>
    </section>
);

export default function Hero({ slides: apiSlides, loading }) {
    const router = useRouter();
    const slides = apiSlides && apiSlides.length > 0 ? apiSlides : staticSlides;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const path = searchTerm.trim()
                ? `/tours?search=${encodeURIComponent(searchTerm)}`
                : "/tours";
            router.push(path);
        }
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

            {/* Dot Pagination (Desktop) */}
            <div className="absolute bottom-28 left-0 right-0 z-30 hidden lg:flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="group relative flex items-center justify-center p-2 focus:outline-none"
                    >
                        <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === index
                                ? 'w-10 bg-[#FDB338]'
                                : 'w-2 bg-white/40 group-hover:bg-white/60'
                            }`}
                        />
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-[110px] sm:pt-[120px] lg:pt-[130px] pb-36 sm:pb-40 lg:pb-24 min-h-full flex flex-col justify-start max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 lg:gap-16">
                    {/* Left Content */}
                    <div className="flex-1 lg:max-w-lg xl:max-w-xl text-center lg:text-left">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-[#FDB338] font-bold tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-4 block">
                                    {slides[currentSlide].location}
                                </span>
                                <h1 className="text-[26px] sm:text-4xl md:text-[44px] xl:text-[52px] font-bold text-white leading-[1.05] mb-5 tracking-tight">
                                    {slides[currentSlide].title}
                                    <span className="text-[#FDB338] font-medium block mt-3">
                                        {slides[currentSlide].subtitle}
                                    </span>
                                </h1>

                                <p className="text-white/80 text-sm sm:text-base md:text-base mb-7 max-w-sm mx-auto lg:mx-0 leading-relaxed font-medium">
                                    {slides[currentSlide].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Search + Explore Packages */}
                        <div className="flex justify-center lg:justify-start mt-4 sm:mt-5">
                            <div
                                onMouseEnter={() => setIsAutoPlaying(false)}
                                onMouseLeave={() => setIsAutoPlaying(true)}
                                className="flex items-center bg-white/95 backdrop-blur-3xl border border-white/40 rounded-full p-1.5 md:p-2 shadow-2xl transition-all w-full max-w-xl lg:w-fit"
                            >
                                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 flex-1 min-w-0">
                                    <Search size={18} className="text-[#022C54] shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search tour packages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className="bg-transparent border-none outline-none text-[#022C54] text-xs md:text-base placeholder:text-[#022C54]/40 w-full font-bold"
                                    />
                                </div>
                                <Link
                                    href={searchTerm.trim() ? `/tours?search=${encodeURIComponent(searchTerm)}` : "/tours"}
                                    className="bg-[#022C54] text-white font-heading font-bold h-10 md:h-11 px-4 md:px-7 rounded-full flex items-center justify-center gap-2 md:gap-3 transition-all group shadow-lg active:scale-95 whitespace-nowrap shrink-0"
                                >
                                    <span className="text-[10px] md:text-[14px] tracking-wider uppercase font-extrabold">
                                        {slides[currentSlide].button_text || "Explore Packages"}
                                    </span>
                                    <div className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                                        <ArrowRight size={14} className="md:size-[16px]" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Dot Pagination (Mobile) */}
                    <div className="lg:hidden flex justify-center gap-3 w-full z-20 mt-8">
                        {slides.map((_, index) => (
                            <button
                                key={`mobile-dot-${index}`}
                                onClick={() => goToSlide(index)}
                                className="group p-2 focus:outline-none"
                            >
                                <div
                                    className={`h-1 rounded-full transition-all duration-500 ${currentSlide === index
                                        ? 'w-8 bg-[#FDB338]'
                                        : 'w-1.5 bg-white/40'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Right Content - Contact Form */}
                    <div className="w-full lg:w-auto shrink-0 mt-8 mb-16 lg:my-0 z-20">
                        <HeroContactForm />
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
