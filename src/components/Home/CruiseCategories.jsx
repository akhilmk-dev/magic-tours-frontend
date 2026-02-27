import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Plane, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Import assets
import cruiseBg from '../../assets/Cruise.png';
import luxuryCruiseImg from '../../assets/Image 2.png';
import adventureCruiseImg from '../../assets/Image 3.png';

const cruiseCategories = [
    {
        id: 1,
        title: "Luxury Cruise",
        image: luxuryCruiseImg
    },
    {
        id: 2,
        title: "Adventure Cruise",
        image: adventureCruiseImg
    }
];

// Duplicate data for infinite loop
const extendedData = [...cruiseCategories, ...cruiseCategories, ...cruiseCategories, ...cruiseCategories];

export default function CruiseCategories() {
    const [currentIndex, setCurrentIndex] = useState(cruiseCategories.length);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const isTransitioning = useRef(false);
    const controls = useAnimation();

    // Responsive settings
    const isMobile = windowWidth < 768;
    const cardGap = isMobile ? 16 : 30;

    // Calculate widths for exactly 2 cards on desktop
    const cardWidth = isMobile ? (windowWidth - 48) : 310;
    const totalCardWidth = cardWidth + cardGap;
    const containerWidth = isMobile ? (windowWidth - 32) : (totalCardWidth * 2 - cardGap);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Initial position
        controls.set({ x: -currentIndex * totalCardWidth });
    }, [currentIndex, totalCardWidth]);

    const slide = async (direction) => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        const nextIndex = currentIndex + direction;
        setCurrentIndex(nextIndex);

        await controls.start({
            x: -nextIndex * totalCardWidth,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
            }
        });

        // Snap logic for infinite loop
        let finalIndex = nextIndex;
        if (nextIndex >= cruiseCategories.length * 2) {
            finalIndex = nextIndex - cruiseCategories.length;
        } else if (nextIndex < cruiseCategories.length) {
            finalIndex = nextIndex + cruiseCategories.length;
        }

        if (finalIndex !== nextIndex) {
            controls.set({ x: -finalIndex * totalCardWidth });
            setCurrentIndex(finalIndex);
        }

        isTransitioning.current = false;
    };

    const handleNext = () => slide(1);
    const handlePrev = () => slide(-1);

    return (
        <section
            className="relative min-h-[500px] lg:min-h-[700px] flex items-center overflow-hidden py-10 lg:py-16 bg-cover bg-center"
            style={{ backgroundImage: `url(${cruiseBg})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-2/5 text-center lg:text-left mb-12"
                    >
                        <div className="inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full mb-6 lg:mb-8 shadow-sm">
                            <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[13px] font-bold uppercase tracking-widest text-brand-magic font-jakarta">Cruises</span>
                        </div>

                        <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-brand-heading leading-[1.1] mb-6">
                            Explore Our <span className="text-[#FFA500]">Cruise</span><br />
                            <span className="text-[#FFA500]">Experiences</span>
                        </h2>

                        <p className="text-brand-heading/80 text-sm md:text-base mb-6 lg:mb-8 max-w-md mx-auto lg:mx-0 font-medium">
                            Experience luxury on the open sea with our unforgettable cruise journeys.
                        </p>

                        <button className="bg-[#FFA500] hover:bg-[#E59400] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:translate-y-[-2px] shadow-[0_10px_20px_-5px_rgba(255,165,0,0.4)] mx-auto lg:mx-0 group">
                            <span className="text-[15px]">View Cruises</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Right Slider Container */}
                    <div className="w-full lg:flex-1 relative group">
                        <div className="relative">
                            <div
                                className="px-4 lg:px-0 overflow-hidden"
                                style={!isMobile ? { width: containerWidth } : {}}
                            >
                                <motion.div
                                    className="flex h-full items-center"
                                    animate={controls}
                                    style={{ gap: cardGap }}
                                >
                                    {extendedData.map((category, index) => {
                                        const isFirst = index === currentIndex;
                                        const isSecond = index === currentIndex + 1;

                                        return (
                                            <motion.div
                                                key={`${category.id}-${index}`}
                                                animate={!isMobile ? {
                                                    scale: isFirst ? 1 : 0.9,
                                                    rotate: isFirst ? 0 : 5,
                                                    y: isFirst ? 0 : 20,
                                                    opacity: (isFirst || isSecond) ? 1 : 0.5
                                                } : { scale: 1, rotate: 0, y: 0, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                style={{ width: cardWidth }}
                                                className="shrink-0"
                                            >
                                                <div className="bg-white p-4 rounded-[2.5rem] shadow-xl h-full flex flex-col items-center">
                                                    <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] w-full">
                                                        <img
                                                            src={category.image}
                                                            alt={category.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="py-5 text-center">
                                                        <h3 className="text-[#022C54] text-xl font-bold">
                                                            {category.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </div>

                            {/* Navigation Buttons - Overlapping cards */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none"
                                style={!isMobile ? { width: containerWidth + 48, left: -24 } : { width: '100%', left: 0 }}
                            >
                                <button
                                    onClick={handlePrev}
                                    className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white shadow-lg pointer-events-auto hover:bg-[#F29F05] transition-all hover:scale-110"
                                >
                                    <ChevronLeft size={24} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white shadow-lg pointer-events-auto hover:bg-[#F29F05] transition-all hover:scale-110"
                                >
                                    <ChevronRight size={24} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-12 lg:mt-8 pt-6 text-right z-0 pointer-events-none">
                            <p className="text-white text-base md:text-lg lg:text-xl font-bold mb-3 lg:mb-4 drop-shadow-md opacity-90 lg:opacity-100">
                                Experience the Joy of Cruising
                            </p>
                            <h2 className="text-[28px] md:text-[48px] lg:text-[64px] font-extrabold leading-none text-[#FFA500] opacity-90 lg:opacity-70 uppercase tracking-tight font-figtree">
                                CRUISE CATEGORIES
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Text - Right Aligned */}

            </div>
        </section>
    );
}
