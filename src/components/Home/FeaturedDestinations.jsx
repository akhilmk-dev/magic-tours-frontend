import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Star, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

export default function FeaturedDestinations() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(4);
    const sliderRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsToShow(1.2);
            else if (window.innerWidth < 1024) setItemsToShow(2.5);
            else setItemsToShow(4);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch destinations from backend
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await api.get('/destinations?status=Active&limit=10');
                setDestinations(res.data || []);
            } catch (err) {
                console.error('Failed to fetch destinations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    // Dynamic clone offset based on available items (max 4)
    const cloneOffset = Math.min(4, destinations.length);

    const displayItems = destinations.length > 0
        ? [...destinations.slice(-cloneOffset), ...destinations, ...destinations.slice(0, cloneOffset)]
        : [];

    const colWidth = 100 / itemsToShow;

    useEffect(() => {
        if (destinations.length > 0) {
            setCurrentIndex(cloneOffset);
        }
    }, [destinations.length, cloneOffset]);

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    };

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (currentIndex >= destinations.length + cloneOffset) {
            setCurrentIndex(cloneOffset);
        }
        if (currentIndex < cloneOffset) {
            setCurrentIndex(destinations.length + currentIndex);
        }
    };

    if (loading) {
        return (
            <div className="py-24 bg-[#0F1E32] flex justify-center items-center">
                <Loader2 className="animate-spin text-[#FFA500]" size={40} />
            </div>
        );
    }

    if (destinations.length === 0) return null;

    return (
        <section className="py-20 md:py-24 bg-[#11233A] relative overflow-hidden text-white rounded-[2rem] md:rounded-[4rem] mx-2 md:mx-10 my-10 min-h-[700px] md:min-h-[900px]">
            {/* Background Professional Climber Image (Right Side) */}
            <div className="absolute top-0 right-0 w-full md:w-[45%] h-full z-0 pointer-events-none opacity-20 md:opacity-90">
                <img
                    src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop"
                    alt="Climber"
                    className="w-full h-full object-cover"
                    style={{ clipPath: window.innerWidth > 768 ? 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' : 'none' }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-10 lg:px-16 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="w-full md:w-1/2 pt-5 relative z-20">
                        <h4 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            <span className="text-[#FFA500]">Most Favorite</span> <span className="text-white font-serif italic md:not-italic">Tour <br className="hidden md:block" />
                                Places!</span>
                        </h4>

                        <p className="text-slate-300 text-sm md:text-base mb-10 max-w-sm leading-relaxed">
                            Choosing a destination can be exciting but also a bit overwhelming with so many amazing places out there! Let's narrow it down a little. Are you dreaming of peaceful nature, buzzing cities, historical wonders, or relaxing beaches?
                        </p>

                        <button className="inline-flex items-center gap-3 bg-[#4FB8D1] hover:bg-[#3ea5bd] text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-semibold transition-all shadow-lg group text-sm md:text-base">
                            View More Destinations
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="w-full md:w-1/2 relative mt-8 md:mt-16 flex justify-center md:justify-end">
                        {/* Large Background Text (TOP! DESTINATIONS) */}
                        <div className="pointer-events-none select-none relative h-40 md:h-64 w-full text-center md:text-right">
                            <h2 className="text-5xl md:text-[6rem] font-black leading-none flex flex-col items-center md:items-end">
                                <span className="text-[#FFA500] z-20">TOP!</span>
                                <span className="text-white uppercase tracking-tighter"
                                    style={{
                                        WebkitTextStroke: '1.5px rgba(255,255,255,0.4)',
                                        color: 'transparent',
                                        transform: 'translateY(-1rem)',
                                        letterSpacing: '-0.02em'
                                    }}>DESTINATIONS</span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Slider Section */}
                <div className="w-full relative mt-12 md:mt-20 z-10">
                    {/* Slider Container */}
                    <div className="overflow-hidden py-10 md:py-16 -mx-4 px-4">
                        <div
                            className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : 'transition-none'} gap-4 md:gap-8`}
                            style={{ transform: `translateX(-${currentIndex * colWidth}%)` }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {displayItems.map((dest, index) => (
                                <div
                                    key={`${dest.id}-${index}`}
                                    className={`min-w-[calc(100%/1.2)] sm:min-w-[calc(100%/2.5)] lg:min-w-[calc(100%/4.2)] transition-all duration-300 ${index === currentIndex + 3 ? 'active-card' : ''}`}
                                    style={{ width: `${colWidth}%` }}
                                >
                                    <div className="bg-[#152944]/60 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-5 border border-white/10 group h-full hover:bg-white transition-all cursor-pointer shadow-2xl flex flex-col group-hover:scale-105">
                                        <div className="rounded-[1.5rem] md:rounded-[1.8rem] overflow-hidden mb-4 md:mb-6 aspect-[4/5] flex-shrink-0">
                                            <img
                                                src={dest.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'}
                                                alt={dest.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center pb-2 md:pb-4 mt-auto">
                                            <h3 className="text-xl md:text-2xl font-bold mb-1 text-white group-hover:text-[#0F1E32] transition-colors font-serif px-2">
                                                {dest.name}
                                            </h3>
                                            <p className="text-sm text-slate-400 group-hover:text-slate-600 transition-colors">
                                                {Math.floor(Math.random() * 50) + 10} Listing
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute top-[50%] -left-3 md:-left-6 -translate-y-1/2 z-30">
                        <button
                            onClick={handlePrev}
                            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#FFA500] text-white flex items-center justify-center shadow-2xl hover:bg-white hover:text-[#FFA500] transition-all border-2 border-transparent hover:border-[#FFA500]"
                        >
                            <ArrowLeft size={20} className="md:w-7 md:h-7" />
                        </button>
                    </div>
                    <div className="absolute top-[50%] -right-3 md:-right-6 -translate-y-1/2 z-30">
                        <button
                            onClick={handleNext}
                            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#FFA500] text-white flex items-center justify-center shadow-2xl hover:bg-white hover:text-[#FFA500] transition-all border-2 border-transparent hover:border-[#FFA500]"
                        >
                            <ArrowRight size={20} className="md:w-7 md:h-7" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .active-card > div {
                    background-color: white;
                    transform: scale(1.02);
                }
                .active-card h3 {
                    color: #0F1E32;
                }
                .active-card p {
                    color: #475569;
                }
            `}</style>
        </section>
    );
}
