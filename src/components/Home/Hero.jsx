import React from 'react';
import { ChevronDown } from 'lucide-react';
import backgroundImage from '../../assets/Background new.png';

export default function Hero() {
    const scrollToNextSection = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden pt-24">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundImage}
                    alt="Bespoke Journeys"
                    className="w-full h-full object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-black/[0.05]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 text-center px-4 md:px-6 w-full">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-8xl lg:text-[110px] font-bold text-white mb-2 tracking-tight drop-shadow-2xl">
                        Bespoke Journeys
                    </h1>
                    <p className="text-lg md:text-4xl text-white font-light tracking-wide lg:text-[42px] drop-shadow-xl opacity-95">
                        Beautifully Crafted and Fairly Priced
                    </p>
                </div>
            </div>

            {/* Let's Go Button */}
            <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
                <button
                    onClick={scrollToNextSection}
                    className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                >
                    <span className="text-[10px] font-bold text-gray-500 leading-none uppercase tracking-widest mb-0.5">Let's</span>
                    <span className="text-[14px] font-black text-gray-900 leading-none uppercase">Go</span>
                </button>
                <div className="text-white opacity-60">
                    <ChevronDown size={28} className="animate-bounce" />
                </div>
            </div>

            {/* Wavy Divider */}
            <div className="absolute bottom-[-1px] left-0 w-full z-10">
                <svg
                    className="w-full h-[40px] md:h-[80px] lg:h-[120px]"
                    viewBox="0 0 1440 120"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 120V60C240 100 480 100 720 60C960 20 1200 20 1440 60V120H0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </section>
    );
}
