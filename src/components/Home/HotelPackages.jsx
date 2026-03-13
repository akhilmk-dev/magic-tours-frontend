import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ArrowRight, MapPin, Crown } from 'lucide-react';

// Import assets
import hotel1 from '../../assets/hotel1.png';
import hotel2 from '../../assets/hotel2.png';
import hotel3 from '../../assets/hotel3.png';
import hotel4 from '../../assets/hotel4.png';
import hotel5 from '../../assets/hotel5.png';
import hotel6 from '../../assets/hotel6.png';
import hotel7 from '../../assets/hotel7.png';
import hotel8 from '../../assets/hotel8.png';

const staticHotels = [
    {
        id: 1,
        image: hotel1.src || hotel1,
        location: 'Tokyo City Japan',
        title: 'Oceanview Villa Premier Deluxe Room',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s',
        discount: '20% OFF',
        isLarge: true
    },
    {
        id: 2,
        image: hotel2.src || hotel2,
        location: 'Swiss Alps',
        title: 'Premier Deluxe Room',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    },
    {
        id: 3,
        image: hotel3.src || hotel3,
        location: 'Paris, France',
        title: 'Mountain View Room',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    },
    {
        id: 4,
        image: hotel4.src || hotel4,
        location: 'Maldives',
        title: 'Premier Oceanview Villa',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    },
    {
        id: 5,
        image: hotel5.src || hotel5,
        location: 'New York, USA',
        title: 'Waldorf Astoria Hotels',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    },
    {
        id: 6,
        image: hotel6.src || hotel6,
        location: 'London, UK',
        title: 'Royal Heritage Suite',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s',
        discount: '15% OFF',
        isLarge: true
    },
    {
        id: 7,
        image: hotel7.src || hotel7,
        location: 'Dubai, UAE',
        title: 'Skyline Penthouse',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    },
    {
        id: 8,
        image: hotel8.src || hotel8,
        location: 'Santorini, Greece',
        title: 'Infinite Blue Villa',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    },
    {
        id: 9,
        image: hotel1.src || hotel1, // Reuse for demo
        location: 'Kyoto, Japan',
        title: 'Zen Garden Heritage',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    },
    {
        id: 10,
        image: hotel2.src || hotel2, // Reuse for demo
        location: 'Aspen, USA',
        title: 'Snow Peak Lodge',
        desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
        isLarge: false
    }
];

const HotelPackagesSkeleton = () => (
    <section className="py-20 bg-slate-50 animate-pulse">
        <div className="container mx-auto px-4 md:px-12 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="h-10 w-40 bg-slate-100 rounded-full mb-6" />
                    <div className="h-12 w-96 bg-slate-100 rounded mb-3" />
                    <div className="h-10 w-80 bg-slate-100 rounded" />
                </div>
                <div className="h-14 w-44 bg-slate-100 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                <div className="bg-slate-100 rounded-3xl h-full" />
                <div className="grid grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-slate-100 rounded-3xl h-full" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const HotelCard = ({ hotel, className = "" }) => (
    <div className={`relative rounded-3xl overflow-hidden group cursor-pointer ${className}`}>
        <img
            src={hotel.image}
            alt={hotel.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Discount Badge */}
        {hotel.discount && (
            <div className="absolute top-6 left-0 bg-[#FDB338] text-brand-heading px-4 py-1.5 rounded-r-lg font-bold text-xs">
                {hotel.discount}
            </div>
        )}

        {/* Hotel Icon Badge */}
        <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <div className="bg-white rounded-lg p-1.5">
                <Crown size={20} className="text-[#FDB338]" />
            </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-white/70 text-xs mb-2">
                <MapPin size={14} className="text-[#FDB338]" />
                {hotel.location}
            </div>
            <h4 className={`${hotel.isLarge ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'} font-bold text-white mb-2 font-heading leading-tight line-clamp-2`}>
                {hotel.title}
            </h4>
            <p className="text-white/60 text-xs line-clamp-2 font-medium leading-relaxed">
                {hotel.desc}
            </p>
        </div>
    </div>
);

export default function HotelPackages({ hotels: apiHotels, loading }) {
    if (loading) return <HotelPackagesSkeleton />;
    const hotels = apiHotels && apiHotels.length > 0
        ? apiHotels.map((h, idx) => {
            let hotelImages = [];
            try {
                hotelImages = typeof h.images === 'string' ? JSON.parse(h.images) : h.images;
                if (!Array.isArray(hotelImages)) hotelImages = [h.images];
            } catch (e) {
                hotelImages = [h.images];
            }
            return {
                id: h.id,
                image: (hotelImages && hotelImages.length > 0) ? hotelImages[0] : (h.image || hotel1),
                location: h.country || h.address,
                title: h.name,
                desc: h.overview || h.description,
                isLarge: idx % 5 === 0 // Make every 5th item large to maintain layout
            };
        })
        : staticHotels;

    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [];
    for (let i = 0; i < hotels.length; i += 5) {
        slides.push(hotels.slice(i, i + 5));
    }

    // Clamp currentIndex if slides array shrinks when API data arrives
    useEffect(() => {
        if (slides.length > 0 && currentIndex >= slides.length) {
            setCurrentIndex(0);
        }
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-12 lg:px-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full mb-6 border border-blue-100">
                            <svg className="text-brand-magic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">
                                Premium Hotels
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-heading mb-3 font-heading leading-tight">
                            Discover Exclusive Hotel Packages
                        </h2>
                        <h3 className="text-3xl sm:text-4xl font-bold text-[#FDB338] font-heading">
                            For Every Taste & Occasion
                        </h3>
                    </div>

                    <button className="bg-brand-magic hover:opacity-90 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 group shadow-lg w-fit h-fit">
                        Explore More
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Slider */}
                <div className="relative min-h-[600px] sm:min-h-[500px] lg:min-h-[600px]">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
                        >
                            {/* Left Column: Large Card */}
                            <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
                                <HotelCard hotel={slides[currentIndex][0]} className="h-full" />
                            </div>

                            {/* Right Column: 2x2 Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {slides[currentIndex].slice(1).map((hotel) => (
                                    <div key={hotel.id} className="h-[250px] sm:h-auto lg:h-[288px]">
                                        <HotelCard hotel={hotel} className="h-full" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-center gap-3 mt-12">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-brand-magic w-8'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
