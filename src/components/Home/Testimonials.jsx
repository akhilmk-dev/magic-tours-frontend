import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSkeleton = () => (
    <section className="py-12 md:py-16 bg-slate-50 animate-pulse">
        <div className="container mx-auto px-4 text-center">
            <div className="h-10 w-40 bg-slate-100 rounded-full mx-auto mb-6" />
            <div className="h-12 w-96 bg-slate-100 rounded mx-auto mb-12" />
            <div className="flex justify-center gap-8 overflow-hidden">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-[350px] bg-slate-100/50 rounded-[2rem] p-8 border border-slate-100 shrink-0">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-slate-100" />
                            <div className="flex-1">
                                <div className="h-4 w-24 bg-slate-100 rounded mb-2" />
                                <div className="h-3 w-16 bg-slate-100 rounded" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-3 w-full bg-slate-100 rounded" />
                            <div className="h-3 w-full bg-slate-100 rounded" />
                            <div className="h-3 w-3/4 bg-slate-100 rounded mx-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default function Testimonials({ testimonials: apiTestimonials, content, loading }) {
    const defaultContent = {
        subtitle: "Testimonial",
        line1: "See what they are",
        highlight: "talking about?"
    };
    const sectionContent = { ...defaultContent, ...content };

    const reviews = apiTestimonials && apiTestimonials.length > 0
        ? apiTestimonials.map(t => ({
            id: t.id,
            name: t.customer_name,
            role: t.customer_role,
            image: t.customer_image,
            text: t.review_text,
            rating: t.rating,
            platform: t.platforms?.name,
            platformIcon: t.platforms?.icon,
            review_url: t.review_url
        }))
        : [];

    const [currentIndex, setCurrentIndex] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(3);

    // Refs so the interval always reads the latest values without stale closures
    const transitioningRef = useRef(false);
    const currentIndexRef = useRef(3);
    const reviewsLengthRef = useRef(reviews.length);

    useEffect(() => { reviewsLengthRef.current = reviews.length; }, [reviews.length]);

    const setTransitioning = (val) => {
        transitioningRef.current = val;
        setIsTransitioning(val);
    };

    const advance = () => {
        if (transitioningRef.current) return;
        setTransitioning(true);
        setCurrentIndex(prev => {
            const next = prev + 1;
            currentIndexRef.current = next;
            return next;
        });
    };

    // Reset slider when reviews length changes
    useEffect(() => {
        setCurrentIndex(3);
        currentIndexRef.current = 3;
        setTransitioning(false);
    }, [reviews.length]);

    // Single stable interval — no stale closures because we use refs
    useEffect(() => {
        const id = setInterval(advance, 4000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsToShow(1);
            else setItemsToShow(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Clone items for infinite loop (3 at each end)
    const displayItems = reviews.length > 0
        ? [...reviews.slice(-3), ...reviews, ...reviews.slice(0, 3)]
        : [];

    const handleTransitionEnd = () => {
        setTransitioning(false);
        if (currentIndex >= reviews.length + 3) {
            setCurrentIndex(3);
            currentIndexRef.current = 3;
        } else if (currentIndex < 3) {
            const next = reviews.length + currentIndex;
            setCurrentIndex(next);
            currentIndexRef.current = next;
        }
    };

    const colWidth = 100 / itemsToShow;
    const activeIndex = itemsToShow === 3 ? currentIndex + 1 : currentIndex;

    if (loading) return <TestimonialsSkeleton />;
    if (reviews.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10 relative">
                    <div className="inline-flex items-center gap-3 bg-brand-magic/10 px-6 py-2.5 rounded-full mb-6 border border-brand-magic/20">
                        <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                        </svg>
                        <span className="text-[13px] font-bold uppercase tracking-widest text-brand-magic font-jakarta">
                            {sectionContent.subtitle}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-brand-heading leading-tight text-center">
                        {sectionContent.line1} <br />
                        <span className="text-[#FFA500]">{sectionContent.highlight}</span>
                    </h2>
                </div>

                {/* Slider Container */}
                <div className="relative max-w-6xl mx-auto sm:px-4">
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
                                        className="flex-shrink-0 px-2 sm:px-3"
                                        style={{ width: `${colWidth}%` }}
                                    >
                                        <div
                                            className={`bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 transition-all duration-700 relative flex flex-col items-center h-full border ${isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.08)] scale-100 z-10 border-slate-100' : 'shadow-none border-transparent opacity-40 scale-90'} ${review.review_url ? 'cursor-pointer hover:border-brand-magic/40 group' : ''}`}
                                            onClick={() => review.review_url && window.open(review.review_url, '_blank', 'noopener,noreferrer')}
                                        >
                                            {/* Profile Header Capsule */}
                                            <div className="flex items-center bg-[#F2F6FF] rounded-[2rem] sm:rounded-[2.5rem] p-1.5 pr-4 sm:pr-8 mb-5 sm:mb-8 relative w-full sm:w-auto sm:min-w-[210px] sm:self-start sm:ml-2">
                                                <div className="relative mr-3 sm:mr-4 shrink-0">
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] bg-brand-magic rounded-full shadow-sm"></div>
                                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-[3px] border-white z-10">
                                                        <img
                                                            src={review.image}
                                                            alt={review.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start z-10 py-1 min-w-0">
                                                    <div className="flex gap-0.5 mb-1 items-center flex-wrap">
                                                        {[...Array(review.rating || 5)].map((_, i) => (
                                                            <Star key={i} size={11} className="fill-[#FFA500] text-[#FFA500]" />
                                                        ))}
                                                        {review.platformIcon && (
                                                            <div className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm border border-slate-100 p-0.5" title={review.platform}>
                                                                <img src={review.platformIcon} alt={review.platform || 'Platform'} className="w-full h-full object-contain" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h4 className="text-base sm:text-lg font-bold text-brand-heading truncate max-w-full">{review.name}</h4>
                                                    <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider">{review.role}</p>
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-[#4F5B6D] text-sm leading-[1.7] mb-5 sm:mb-8 text-center px-1 sm:px-4 font-medium italic">
                                                "{review.text}"
                                            </p>

                                            {/* Quote Icon at Bottom */}
                                            <div className="mt-auto pb-2 flex items-center justify-between w-full">
                                                <Quote size={30} className="text-[#FFA500] fill-[#FFA500] sm:w-9 sm:h-9" strokeWidth={0} />
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
                                        setTransitioning(true);
                                        const next = 3 + i;
                                        setCurrentIndex(next);
                                        currentIndexRef.current = next;
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
