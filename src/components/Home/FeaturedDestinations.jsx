import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Star, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import manClimbing from '../../assets/manClimbing.png';

const FeaturedDestinationsSkeleton = () => (
    <section className="py-8 sm:py-10 md:py-12 bg-slate-900 relative overflow-hidden text-white rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] mx-2 sm:mx-4 md:mx-10 my-6 md:my-10 animate-pulse">
        <div className="container mx-auto px-4 md:px-10 lg:px-16 relative z-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8">
                <div className="w-full md:w-1/2 pt-3">
                    <div className="h-10 w-48 bg-slate-800/50 rounded mb-4" />
                    <div className="h-4 w-full bg-slate-800/50 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-slate-800/50 rounded mb-6" />
                    <div className="h-12 w-48 bg-slate-800/50 rounded-full" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-end gap-4">
                    <div className="h-16 w-32 bg-slate-800/50 rounded" />
                    <div className="h-16 w-64 bg-slate-800/50 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-slate-700/50 rounded-[2rem] h-[350px]" />
                ))}
            </div>
        </div>
    </section>
);

const DEFAULT_DESTINATIONS = [
    {
        id: 'default-1',
        name: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800&auto=format&fit=crop',
        listings: 24
    },
    {
        id: 'default-2',
        name: 'Bali',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
        listings: 32
    },
    {
        id: 'default-3',
        name: 'Mauritius',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop',
        listings: 18
    },
    {
        id: 'default-4',
        name: 'Paris',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
        listings: 45
    }
];

export default function FeaturedDestinations({ initialDestinations, allPackages = [], content, loading: propLoading }) {
    const defaultContent = {
        line1: "Most Favorite",
        highlight: "Tour",
        line2: "Places!",
        description: "Explore our handpicked selection of stunning destinations that our travelers love the most. From tropical escapes to historic cities, find your next adventure here."
    };

    const sectionContent = { ...defaultContent, ...content };

    const router = useRouter();
    const [destinations, setDestinations] = useState(initialDestinations || []);
    const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : !initialDestinations);

    useEffect(() => {
        if (propLoading !== undefined) {
            setLoading(propLoading);
        }
    }, [propLoading]);

    useEffect(() => {
    }, [initialDestinations]);
    // ... rest of the state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(4);
    const sliderRef = useRef(null);

    // Helper to find a matching package for a destination
    const getMatchedPackage = (destName) => {
        if (!allPackages || allPackages.length === 0) return null;
        
        // Find a package where location or title matches the destination name
        return allPackages.find(pkg => 
            (pkg.location && pkg.location.toLowerCase().includes(destName.toLowerCase())) ||
            (pkg.title && pkg.title.toLowerCase().includes(destName.toLowerCase()))
        );
    };

    const handleDestinationClick = (dest) => {
        const matchedPkg = getMatchedPackage(dest.name);
        if (matchedPkg) {
            // Redirect to package detail page
            router.push(`/packages/${matchedPkg.slug || matchedPkg.id}`);
        } else {
            // Fallback to tours search page filtered by destination
            router.push(`/tours?destination=${dest.slug || dest.id}`);
        }
    };

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

    // Use default destinations if none are provided or fetched
    const activeDestinations = destinations.length > 0 ? destinations : DEFAULT_DESTINATIONS;

    // Dynamic clone offset based on available items (max 4)
    const cloneOffset = Math.min(4, activeDestinations.length);

    useEffect(() => {
        if (initialDestinations) return;

        const fetchDestinations = async () => {
            try {
                // Use the public frontend list endpoint which doesn't require authentication
                const res = await fetch('https://magic-apis.staff-b0c.workers.dev/destinations/frontend/list?limit=10');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const responseData = await res.json();
                setDestinations(responseData.data || []);
            } catch (err) {
                console.error('Failed to fetch destinations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, [initialDestinations]);

    const displayItems = activeDestinations.length > 0
        ? [...activeDestinations.slice(-cloneOffset), ...activeDestinations, ...activeDestinations.slice(0, cloneOffset)]
        : [];

    const colWidth = 100 / itemsToShow;

    useEffect(() => {
        if (activeDestinations.length > 0) {
            setCurrentIndex(cloneOffset);
        }
    }, [activeDestinations.length, cloneOffset]);

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
        if (currentIndex >= activeDestinations.length + cloneOffset) {
            setCurrentIndex(cloneOffset);
        }
        if (currentIndex < cloneOffset) {
            setCurrentIndex(activeDestinations.length + currentIndex);
        }
    };

    if (loading) return <FeaturedDestinationsSkeleton />;

    // Never return null, use fallback data instead if needed

    return (
        <section className="py-8 sm:py-10 md:py-12 bg-brand-magic relative overflow-hidden text-white rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] mx-2 sm:mx-4 md:mx-10 my-6 md:my-10">
            {/* Background Man Climbing Image (Right Side - hidden on mobile) */}
            <div className="absolute top-0 right-0 hidden md:block md:w-[40%] h-[65%] z-0 pointer-events-none md:opacity-90">
                <img
                    src={manClimbing.src}
                    alt="Man Climbing"
                    className="w-full h-full object-contain object-right-top"
                />
            </div>

            {/* Remove absolutely positioned text - moved into flow below */}

            <div className="container mx-auto px-4 md:px-10 lg:px-16 relative z-10">
                {/* Header Section - Left content + Right TOP DESTINATION */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8">
                    <div className="w-full md:w-1/2 pt-3 relative z-20">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-6 leading-tight">
                            {sectionContent.line1} <br />
                            <span className="text-white">{sectionContent.highlight}</span> {sectionContent.line2}
                        </h2>
                        <p className="text-white/70 text-sm sm:text-base md:text-lg mb-8 max-w-xl font-medium">
                            {sectionContent.description}
                        </p>

                        <button
                            onClick={() => router.push('/destinations')}
                            className="inline-flex items-center gap-2 bg-[#4FB8D1] hover:bg-[#3ea5bd] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-heading font-bold transition-all shadow-lg group text-xs md:text-sm"
                        >
                            Explore More Destinations
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Side - TOP! DESTINATION text */}
                    <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end mt-5 md:mt-0">
                        <div className="font-black flex flex-col gap-2 md:gap-9 mt-5 text-start ">
                            <span className="text-[#FFA500] block text-3xl sm:text-4xl md:text-[3rem] lg:text-[4rem] xl:text-[5rem] font-figtree">TOP!</span>
                            <span className="uppercase block text-3xl sm:text-4xl md:text-[3rem] lg:text-[4rem] xl:text-[5rem] text-white font-figtree"
                                style={{
                                    letterSpacing: '-0.02em'
                                }}>DESTINATION</span>
                        </div>
                    </div>
                </div>

                {/* Slider Section */}
                <div className="w-full relative mt-6 md:mt-10 z-10">
                    {/* Slider Container */}
                    <div className="overflow-hidden py-4 md:py-6">
                        <div
                            className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : 'transition-none'} gap-3 md:gap-5`}
                            style={{ transform: `translateX(-${currentIndex * colWidth}%)` }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {displayItems.map((dest, index) => (
                                <div
                                    key={`${dest.id}-${index}`}
                                    className="min-w-[calc(100%/1.2)] sm:min-w-[calc(100%/2.5)] lg:min-w-[calc(100%/4.25)] transition-all duration-500 overflow-visible"
                                    style={{ width: `${colWidth}%` }}
                                >
                                    <div 
                                        onClick={() => handleDestinationClick(dest)}
                                        className="bg-[#0F2444] border border-white/30 rounded-[2.2rem] p-3 md:p-4 group h-full hover:bg-white transition-all duration-500 cursor-pointer hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] flex flex-col hover:scale-x-[1.05] hover:scale-y-[1.02] hover:z-20 relative origin-center"
                                    >
                                        <div className="rounded-[1.8rem] overflow-hidden mb-3 md:mb-5 aspect-[4/4.5] flex-shrink-0">
                                            <img
                                                src={dest.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'}
                                                alt={dest.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="text-center pb-2 md:pb-4 mt-auto">
                                            <h3 className="text-lg md:text-xl font-heading font-bold mb-1 text-white group-hover:text-[#0F2444] transition-colors px-2">
                                                {dest.name}
                                            </h3>
                                            <p className="text-[11px] text-[#FFA500] group-hover:text-[#0F2444]/70 font-bold uppercase tracking-wider transition-colors pt-0.5">
                                                {dest.package_count || 0} Packages
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute top-[40%] -left-2 sm:-left-3 md:-left-5 -translate-y-1/2 z-50">
                        <button
                            onClick={handlePrev}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFA500] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:bg-white hover:text-[#FFA500] transition-all transform hover:scale-110"
                        >
                            <ArrowLeft size={20} className="md:w-6 md:h-6" strokeWidth={3} />
                        </button>
                    </div>
                    <div className="absolute top-[40%] -right-2 sm:-right-3 md:-right-5 -translate-y-1/2 z-50">
                        <button
                            onClick={handleNext}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFA500] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:bg-white hover:text-[#FFA500] transition-all transform hover:scale-110"
                        >
                            <ArrowRight size={20} className="md:w-6 md:h-6" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Removed active-card classes in favor of group-hover styles defined in JSX inline classes */
            `}</style>
        </section>
    );
}
