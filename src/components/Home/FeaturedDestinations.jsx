import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Star, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import manClimbing from '../../assets/manClimbing.png';

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
        <section className="py-8 sm:py-10 md:py-12 bg-[#11233A] relative overflow-hidden text-white rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] mx-2 sm:mx-4 md:mx-10 my-6 md:my-10">
            {/* Background Man Climbing Image (Right Side - hidden on mobile) */}
            <div className="absolute top-0 right-0 hidden md:block md:w-[40%] h-[65%] z-0 pointer-events-none md:opacity-90">
                <img
                    src={manClimbing}
                    alt="Man Climbing"
                    className="w-full h-full object-contain object-right-top"
                />
            </div>

            {/* Remove absolutely positioned text - moved into flow below */}

            <div className="container mx-auto px-4 md:px-10 lg:px-16 relative z-10">
                {/* Header Section - Left content + Right TOP DESTINATION */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8">
                    <div className="w-full md:w-1/2 pt-3 relative z-20">
                        <h4 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                            <span className="text-[#FFA500] font-['Playfair_Display'] italic">Most Favorite</span> <span className="text-white font-['Outfit']">Tour <br className="hidden md:block" />
                                Places!</span>
                        </h4>

                        <p className="text-slate-300 text-xs md:text-sm mb-6 max-w-sm leading-relaxed">
                            Choosing a destination can be exciting but also a bit overwhelming with so many amazing places out there! Let's narrow it down a little. Are you dreaming of peaceful nature, buzzing cities, historical wonders, or relaxing beaches?
                        </p>

                        <button className="inline-flex items-center gap-2 bg-[#4FB8D1] hover:bg-[#3ea5bd] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold transition-all shadow-lg group text-xs md:text-sm">
                            Explore More Destinations
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Side - TOP! DESTINATION text */}
                    <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end mt-5 md:mt-0">
                        <div className="font-black flex flex-col gap-2 md:gap-9 font-['Playfair_Display'] mt-5 text-start ">
                            <span className="text-[#FFA500] block text-3xl sm:text-4xl md:text-[3rem] lg:text-[4rem] xl:text-[5rem]">TOP!</span>
                            <span className="uppercase block text-3xl sm:text-4xl md:text-[3rem] lg:text-[4rem] xl:text-[5rem] text-white"
                                style={{
                                    letterSpacing: '-0.02em'
                                }}>DESTINATION</span>
                        </div>
                    </div>
                </div>

                {/* Slider Section */}
                <div className="w-full relative mt-6 md:mt-10 z-10">
                    {/* Slider Container */}
                    <div className="overflow-hidden py-4 md:py-6 -mx-4 px-4">
                        <div
                            className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : 'transition-none'} gap-3 md:gap-5`}
                            style={{ transform: `translateX(-${currentIndex * colWidth}%)` }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {displayItems.map((dest, index) => (
                                <div
                                    key={`${dest.id}-${index}`}
                                    className={`min-w-[calc(100%/1.2)] sm:min-w-[calc(100%/2.5)] lg:min-w-[calc(100%/4.2)] transition-all duration-300 ${index === currentIndex + 3 ? 'active-card' : ''}`}
                                    style={{ width: `${colWidth}%` }}
                                >
                                    <div className="bg-[#152944]/60 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 border border-white/10 group h-full hover:bg-white transition-all cursor-pointer shadow-2xl flex flex-col group-hover:scale-105">
                                        <div className="rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden mb-3 md:mb-4 aspect-[4/4.5] flex-shrink-0">
                                            <img
                                                src={dest.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'}
                                                alt={dest.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center pb-1 md:pb-2 mt-auto">
                                            <h3 className="text-base md:text-lg font-bold mb-0.5 text-white group-hover:text-[#0F1E32] transition-colors font-serif px-2">
                                                {dest.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                                                {Math.floor(Math.random() * 50) + 10} Listing
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute top-[50%] left-1 sm:-left-1 md:-left-6 -translate-y-1/2 z-30">
                        <button
                            onClick={handlePrev}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFA500] text-white flex items-center justify-center shadow-2xl hover:bg-white hover:text-[#FFA500] transition-all border-2 border-transparent hover:border-[#FFA500]"
                        >
                            <ArrowLeft size={16} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                    <div className="absolute top-[50%] right-1 sm:-right-1 md:-right-6 -translate-y-1/2 z-30">
                        <button
                            onClick={handleNext}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFA500] text-white flex items-center justify-center shadow-2xl hover:bg-white hover:text-[#FFA500] transition-all border-2 border-transparent hover:border-[#FFA500]"
                        >
                            <ArrowRight size={16} className="md:w-5 md:h-5" />
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
