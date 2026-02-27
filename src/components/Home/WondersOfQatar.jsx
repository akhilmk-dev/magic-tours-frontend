import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import bgImage from '../../assets/wandersofqadar.png';
import slide1Image from '../../assets/Image 4.png';

const slides = [
    {
        id: 1,
        image: slide1Image,
        title: 'Museum of Islamic',
        subtitle: 'See More',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=800&auto=format&fit=crop',
        title: 'Souq Waqif',
        subtitle: 'See More',
    },
];

export default function WondersOfQatar() {
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
        <section className="relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage}
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
                                </div>

                                {/* Card Text */}
                                <div className="text-center pb-2">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={slides[currentSlide].id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <h3 className="text-[#0F1E32] text-lg sm:text-xl font-['Playfair_Display'] font-bold mb-1">
                                                {slides[currentSlide].title}
                                            </h3>
                                            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                                                {slides[currentSlide].subtitle}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Dot Indicators */}
                                <div className="flex justify-center gap-2 pt-3 pb-1">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'w-7 h-2.5 bg-[#0F1E32]'
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
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 sm:mb-8 border border-white/15">
                            <Plane className="text-white/80" size={16} />
                            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-white/90">
                                Destination Spotlight
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-['Playfair_Display'] font-extrabold text-white leading-[1.1] mb-5 sm:mb-6 md:mb-8">
                            Explore the <br />
                            Wonders of Qatar
                        </h2>

                        <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg">
                            Lorem ipsum dolor sit amet consectetur. Diam tempor tortor neque id tempor mi egestas.
                            There are many variations of passages of Lorem Ipsum availab but .
                        </p>

                        <button className="inline-flex items-center gap-3 sm:gap-4 bg-[#FDB338] hover:bg-[#e9a42f] text-[#0F1E32] font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-[15px] transition-all hover:-translate-y-1 shadow-xl shadow-[#FDB338]/20 group">
                            Explore More
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
