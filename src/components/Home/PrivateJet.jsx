import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ArrowRight, MapPin, Shield, ArrowUpRight } from 'lucide-react';

import airplaneBg from '../../assets/airoplane.png';
import flightImg from '../../assets/flight.png';

const slides = [
    {
        id: 1,
        image: flightImg.src || flightImg,
        title: 'Bombardier Global 7500',
        description: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop',
        title: 'Gulfstream G700',
        description: 'Experience unmatched luxury and range with the latest Gulfstream.',
    },
];

const PrivateJet = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    // Autoplay
    useEffect(() => {
        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="relative overflow-hidden bg-[#f5f6fa]">
            {/* Top Content Area */}
            <div className="relative z-10 px-6 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-2 sm:pb-4">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">

                    {/* Left Side - Content */}
                    <div className="flex-1">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full mb-6 sm:mb-8 shadow-sm border border-gray-100">
                            <svg className="text-brand-magic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">
                                Premium Jet
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-brand-heading leading-[1.1] mb-5 sm:mb-6">
                            Elite Private{' '}
                            <span className="text-[#FDB338] font-medium">Jet Charters</span>
                        </h2>

                        <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl">
                            Lorem ipsum dolor sit amet consectetur. Diam tempor tortor neque id tempor mi
                            egestas.There are many variations of passages of Lorem Ipsum availab but .
                        </p>

                        {/* Features */}
                        <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-magic flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-[#FDB338] font-bold text-sm sm:text-[15px] mb-1">Safe Traveling</h4>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                                        Lorem is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-magic flex items-center justify-center shrink-0">
                                    <Shield size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-[#FDB338] font-bold text-sm sm:text-[15px] mb-1">Comfort Accommodation</h4>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                                        Lorem is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="inline-flex items-center gap-3 bg-[#FDB338] hover:bg-[#e9a42f] text-brand-magic font-bold px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-1 shadow-lg shadow-[#FDB338]/20 group">
                            Explore More
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Side - Mini Slider */}
                    <div className="w-full sm:w-[340px] md:w-[380px] lg:w-[360px] xl:w-[400px] shrink-0 self-start">
                        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl relative">
                            {/* Slider Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={slides[currentSlide].id}
                                        src={slides[currentSlide].image}
                                        alt={slides[currentSlide].title}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-full h-full object-cover absolute inset-0"
                                    />
                                </AnimatePresence>

                                {/* Arrow icon top-right */}
                                <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer">
                                    <ArrowUpRight size={22} />
                                </div>

                                {/* Bottom overlay with title */}
                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4 sm:px-6 sm:py-5">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={slides[currentSlide].id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <div className="flex items-center gap-2.5 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                        <svg className="text-brand-magic" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-white text-lg sm:text-xl font-bold mb-1">
                                                        {slides[currentSlide].title}
                                                    </h3>
                                                </div>
                                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                                    {slides[currentSlide].description}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dot Indicators */}
                        <div className="flex justify-center gap-2 mt-5">
                            {slides.map((_, index) => (
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

            {/* Bottom Background Image */}
            <div className="relative w-full -mt-4 sm:-mt-6">
                <img
                    src={airplaneBg.src || airplaneBg}
                    alt="Private Jet"
                    className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[750px] object-cover object-bottom"
                />
                {/* Gradient overlay on top to blend with content */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#f5f6fa] via-transparent to-transparent h-[40%]" />

                {/* Bottom left text overlay */}
                <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-8 md:left-12 lg:left-16 z-10">
                    <span className="text-white/80 text-sm sm:text-base md:text-lg font-medium block mb-1 sm:mb-2">
                        Experience Our
                    </span>
                    <h3 className="text-[#FDB338] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-extrabold uppercase tracking-wide leading-[1.1] font-figtree">
                        Private Jet Categories
                    </h3>
                </div>

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            </div>
        </section>
    );
};

export default PrivateJet;
