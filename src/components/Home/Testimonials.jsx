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
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 bg-[#F0F7FF] px-6 py-2 rounded-full mb-4 border border-blue-50">
                        <svg className="text-brand-magic" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">Testimonial</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-brand-heading leading-tight">
                        See what they are <span className="text-[#FFA500]">talking about?</span>
                    </h2>
                </div>

                {/* Slider Container */}
                <div className="relative max-w-6xl mx-auto px-4">
                    <div className="overflow-hidden py-4">
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
                                        className="flex-shrink-0 px-2 sm:px-4"
                                        style={{ width: `${colWidth}%` }}
                                    >
                                        <div className={`bg-white rounded-[2rem] p-6 md:p-8 transition-all duration-700 relative flex flex-col items-center h-full border ${isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.08)] scale-100 z-10 border-slate-100' : 'shadow-none border-transparent opacity-40 scale-90'}`}>

                                            {/* Profile Header Capsule */}
                                            <div className="flex items-center bg-[#F2F6FF] rounded-[2.5rem] p-1.5 pr-8 mb-8 relative min-w-[210px] self-start ml-2">
                                                {/* Avatar Container */}
                                                <div className="relative mr-4 shrink-0">
                                                    {/* Navy Background Piece (Half-circle bottom-right) */}
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-[58px] h-[58px] bg-brand-magic rounded-full shadow-sm"></div>
                                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-[3px] border-white z-10">
                                                        <img
                                                            src={review.image}
                                                            alt={review.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start z-10 py-1">
                                                    <div className="flex gap-0.5 mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} className="fill-[#FFA500] text-[#FFA500]" />
                                                        ))}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-brand-heading">{review.name}</h4>
                                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{review.role}</p>
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-[#4F5B6D] text-sm leading-[1.7] mb-8 text-center px-4 font-medium italic">
                                                "{review.text}"
                                            </p>

                                            {/* Quote Icon at Bottom */}
                                            <div className="mt-auto pb-2">
                                                <Quote size={36} className="text-[#FFA500] fill-[#FFA500]" strokeWidth={0} />
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
                                    className={`h-1.5 transition-all duration-300 rounded-full ${isActive ? 'w-6 bg-[#FFA500]' : 'w-2 bg-slate-200'}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
