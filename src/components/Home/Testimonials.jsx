import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, Plane } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: 'Kabin Martin',
        role: 'Tourist',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        text: 'Duis rhoncus orci utedn metus rhoncus, non is dictum purus bibendum. Suspendisse id orci sit amet justo interdum hendrerit sagittis.',
    },
    {
        id: 2,
        name: 'Robert Fox',
        role: 'Tourist',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
        text: 'Duis rhoncus orci utedn metus rhoncus, non is dictum purus bibendum. Suspendisse id orci sit amet justo interdum hendrerit sagittis. Suspendisse id orci sit amet justo interdum hendrerit sagittis.',
    },
    {
        id: 3,
        name: 'Jhon Smith',
        role: 'Tourist',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        text: 'Duis rhoncus orci utedn metus rhoncus, non is dictum purus bibendum. Suspendisse id orci sit amet justo interdum hendrerit sagittis.',
    },
    {
        id: 4,
        name: 'Sara Wilson',
        role: 'Traveler',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
        text: 'Duis rhoncus orci utedn metus rhoncus, non is dictum purus bibendum. Suspendisse id orci sit amet justo interdum hendrerit sagittis.',
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(3); // Start at first real item (offset by clones)
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(3);
    const sliderRef = useRef(null);
    const autoPlayRef = useRef(null);

    // Clone items for infinite loop (3 at each end)
    const displayItems = [...reviews.slice(-3), ...reviews, ...reviews.slice(0, 3)];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsToShow(1);
            else setItemsToShow(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayRef.current = setInterval(() => {
            handleNext();
        }, 5000);
    };

    const stopAutoPlay = () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, [currentIndex]);

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    };

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (currentIndex >= reviews.length + 3) {
            setCurrentIndex(3);
        }
        if (currentIndex < 3) {
            setCurrentIndex(reviews.length + currentIndex);
        }
    };

    const colWidth = 100 / itemsToShow;

    // The "active" card is the one in the middle for desktop, or the current one for mobile
    const activeIndex = itemsToShow === 3 ? currentIndex + 1 : currentIndex;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-[#F0F7FF] px-5 py-2 rounded-full mb-6 border border-blue-50">
                        <Plane size={14} className="text-[#3B82F6] rotate-45" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Testimonial</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight">
                        See what they are <br />
                        <span className="text-[#FFA500] font-serif italic">talking about?</span>
                    </h2>
                </div>

                {/* Slider Container */}
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="overflow-hidden py-10">
                        <div
                            className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : 'transition-none'}`}
                            style={{ transform: `translateX(-${currentIndex * colWidth}%)` }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {displayItems.map((review, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <div
                                        key={`${review.id}-${index}`}
                                        className="flex-shrink-0 px-4"
                                        style={{ width: `${colWidth}%` }}
                                    >
                                        <div className={`bg-white rounded-[2rem] p-6 md:p-8 transition-all duration-700 relative flex flex-col items-center text-center h-full border ${isActive ? 'shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] scale-105 z-10 border-slate-100' : 'shadow-sm border-transparent opacity-40 scale-90'}`}>

                                            {/* Avatar Section */}
                                            <div className="relative mb-4">
                                                {/* Decorative Background Arc */}
                                                <div className="absolute -bottom-1 -left-2 -right-2 h-16 bg-slate-50 rounded-b-full -z-0 opacity-80"></div>
                                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
                                                    <img
                                                        src={review.image}
                                                        alt={review.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {/* Blue Accent in Reference */}
                                                <div className="absolute top-1/2 left-0 w-20 h-10 bg-[#0F1E32] -z-10 rounded-b-2xl opacity-20 transform translate-y-1"></div>
                                            </div>

                                            {/* Name & Stars */}
                                            <div className="flex flex-col items-center mb-3">
                                                <div className="flex gap-0.5 mb-1.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className="fill-[#FFA500] text-[#FFA500]" />
                                                    ))}
                                                </div>
                                                <h4 className="text-lg font-black text-secondary">{review.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{review.role}</p>
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 flex-grow">
                                                {review.text}
                                            </p>

                                            {/* Quote Icon */}
                                            <div className="mt-auto">
                                                <Quote size={32} className="text-[#FFA500] opacity-30 transform rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {reviews.map((_, i) => {
                            const normalizedIndex = (currentIndex - 3) % reviews.length;
                            const isActive = (normalizedIndex < 0 ? reviews.length + normalizedIndex : normalizedIndex) === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setCurrentIndex(3 + i);
                                    }}
                                    className={`h-1.5 transition-all duration-300 rounded-full ${isActive ? 'w-8 bg-[#FFA500]' : 'w-4 bg-slate-200'}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
