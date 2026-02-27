import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowLeft, ArrowRight, Plane, Star, Calendar, MapPin } from 'lucide-react';

const packageData = [
    {
        id: 1,
        title: "South Korea",
        location: "Tokyo City Japan",
        duration: "6 days , 3 Nights",
        type: "Lorem ipsum",
        price: 79,
        description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "South Korea",
        location: "Tokyo City Japan",
        duration: "4 Days - 3 Nights",
        type: "Lorem ipsum",
        price: 189,
        oldPrice: 259,
        discount: "27% Off",
        category: "Honey Moon Package",
        description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "South Korea",
        location: "Tokyo City Japan",
        duration: "6 days , 3 Nights",
        type: "Lorem ipsum",
        price: 79,
        description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Switzerland",
        location: "Zurich",
        duration: "7 Days - 3 Nights",
        type: "Lorem ipsum",
        price: 299,
        description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop"
    }
];

// 5 sets for a massive buffer to ensure perfectly seamless looping
const extendedData = [...packageData, ...packageData, ...packageData, ...packageData, ...packageData];

export default function PopularPackages() {
    // Start at the beginning of the 3rd (middle) set
    const [currentIndex, setCurrentIndex] = useState(packageData.length * 2);
    const isTransitioning = useRef(false);
    const controls = useAnimation();
    const cardWidth = 344; // 320px width + 24px gap

    useEffect(() => {
        // Initial positioning
        controls.set({ x: -(packageData.length * 2) * cardWidth });
    }, []);
    const slide = async (direction) => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        const nextIndex = currentIndex + direction;

        // 1. Immediate state update for focus feedback
        setCurrentIndex(nextIndex);

        // 2. High-performance spring animation
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

        // 3. Robust Snap Logic: Stay within the middle set range [len*2, len*3-1]
        let finalIndex = nextIndex;
        const middleStart = packageData.length * 2;
        const middleEnd = packageData.length * 3 - 1;

        if (nextIndex > middleEnd) {
            finalIndex = middleStart + (nextIndex % packageData.length);
        } else if (nextIndex < middleStart) {
            finalIndex = middleEnd - (Math.abs(nextIndex - middleEnd) % packageData.length);
        }

        if (finalIndex !== nextIndex) {
            // Invisible physical jump
            controls.set({ x: -finalIndex * cardWidth });
            setCurrentIndex(finalIndex);
        }

        // Delay resetting isTransitioning slightly to prevent rapid click index corruption
        setTimeout(() => {
            isTransitioning.current = false;
        }, 30);
    };

    const handleNext = () => slide(1);
    const handlePrev = () => slide(-1);

    return (
        <section className="py-16 bg-white relative overflow-hidden font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 150 Q 300 50, 600 200 T 1200 150" stroke="#113A74" strokeWidth="2" strokeDasharray="12 12" />
                    <path d="M100 650 Q 400 550, 750 700 T 1350 650" stroke="#113A74" strokeWidth="2" strokeDasharray="12 12" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-[#F2F6FF] px-6 py-2.5 rounded-full mb-4">
                        <svg className="text-brand-magic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                        </svg>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">Packages</span>
                    </div>
                    <h2 className="text-[28px] md:text-[42px] font-bold text-brand-heading leading-tight mb-4">
                        Popular Travel <span className="text-[#FFA500]">Packages</span>
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.
                    </p>
                </div>

                <div className="relative max-w-[1050px] mx-auto px-4 md:px-12 flex items-center justify-center min-h-[750px] overflow-hidden">
                    {/* Carousel Track */}
                    <motion.div
                        className="flex gap-6 absolute left-1/2 items-center"
                        animate={controls}
                        style={{ marginLeft: -160 }}
                        initial={{ x: -(packageData.length * 2) * cardWidth }}
                    >
                        {extendedData.map((pkg, idx) => {
                            const isFocused = idx === currentIndex;
                            const distance = Math.abs(idx - currentIndex);
                            const opacityLevel = distance > 1.5 ? 0 : 1;

                            return (
                                <motion.div
                                    key={`${pkg.id}-${idx}`}
                                    animate={{
                                        scale: isFocused ? 1.02 : 0.98,
                                        zIndex: isFocused ? 20 : 10,
                                        opacity: opacityLevel,
                                        height: isFocused ? 640 : 560,
                                        backgroundColor: isFocused ? "#FFFFFF" : "#113A74"
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }}
                                    className="relative w-[320px] shrink-0 rounded-[2rem] overflow-hidden cursor-default flex flex-col shadow-none"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-[40%] w-full">
                                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />

                                        {/* Duration Banner */}
                                        <div className="absolute top-4 left-0 bg-brand-magic text-white py-2 px-4 rounded-r-2xl flex items-center gap-2">
                                            <Calendar size={14} className="text-white" />
                                            <span className="text-[10px] font-bold">{pkg.duration}</span>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white z-10">
                                            <MapPin size={18} fill="white" className="text-white" />
                                            <span className="text-[14px] font-medium">{pkg.location}</span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className={`flex-1 p-6 flex flex-col relative z-10
                                        ${isFocused ? 'bg-white rounded-t-[2.5rem] -mt-10 pt-8' : 'bg-brand-magic'}
                                    `}>
                                        <h3 className={`text-[24px] font-bold mb-3 ${isFocused ? 'text-brand-heading' : 'text-white'}`}>{pkg.title}</h3>
                                        <p className={`text-[12px] leading-relaxed mb-6 line-clamp-2 ${isFocused ? 'text-gray-500' : 'text-white/80'}`}>{pkg.description}</p>

                                        {isFocused ? (
                                            <div className="bg-[#FAF8F5] p-4 rounded-[1.5rem] space-y-3 mb-6">
                                                <div className="flex items-center gap-3 text-brand-heading font-semibold text-[13px]">
                                                    <Calendar size={16} className="text-blue-500" /> {pkg.duration}
                                                </div>
                                                <div className="flex items-center gap-3 text-brand-heading font-semibold text-[13px]">
                                                    <Star size={16} fill="#FACC15" className="text-[#FACC15]" /> Tour Type :{pkg.type}
                                                </div>
                                                <div className="flex items-center gap-3 text-brand-heading font-semibold text-[13px]">
                                                    <MapPin size={16} className="text-blue-500" /> Brooklyn,NY
                                                </div>
                                                <div className="inline-block bg-[#FFA500] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                                                    Honey Moon Package
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-[#FFA500] font-bold text-[13px] mb-auto">
                                                <Star size={14} fill="currentColor" /> Tour Type :{pkg.type}
                                            </div>
                                        )}

                                        <div className="mt-auto flex items-end justify-between transition-colors">
                                            <div className="flex flex-col">
                                                <div className="mb-0">
                                                    <span className="text-[#FFA500] text-[20px] font-black leading-none whitespace-nowrap">AED {pkg.price}</span>
                                                    <span className={`block text-[10px] font-bold uppercase ${isFocused ? 'text-gray-400' : 'text-white/50'}`}>Per Day</span>
                                                </div>
                                                {!isFocused && (
                                                    <button className="text-[12px] font-bold text-[#8E99AF] hover:text-white transition-colors mt-1 text-left">
                                                        See More
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <button className={`px-7 py-3 rounded-full font-bold text-[12px] transition-all whitespace-nowrap
                                                    ${isFocused ? 'bg-brand-magic text-white shadow-xl hover:scale-105' : 'bg-[#FFA500] text-brand-heading shadow-md hover:scale-105'}
                                                `}>
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Navigation buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white shadow-xl z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white shadow-xl z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <ArrowRight size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </section>
    );
}
