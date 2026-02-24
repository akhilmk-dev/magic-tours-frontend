import React from 'react';
import { Plane } from 'lucide-react';

const galleryItems = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        alt: 'Relaxing beach'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop',
        alt: 'Traveler in boat'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop',
        alt: 'Tropical beach'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        alt: 'Mountains'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
        alt: 'European Street'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=800&auto=format&fit=crop',
        alt: 'Tropical Bay'
    },
    {
        id: 7,
        image: 'https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Grand Cruise ship'
    }
];

export default function Gallery() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-[#F8FAFC] px-5 py-2.5 rounded-full mb-6 border border-gray-100 shadow-sm">
                        <Plane className="text-[#3B82F6] rotate-45" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Get to Know Us</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-secondary">
                        Recent <span className="text-[#FFA500] font-serif italic">Gallery</span>
                    </h2>
                </div>

                {/* Staggered Row Layout */}
                <div className="flex flex-nowrap md:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible pb-10 scrollbar-hide px-4">

                    {/* Column 1: Far Left */}
                    <div className="flex-shrink-0 group cursor-pointer">
                        <div className="w-40 sm:w-44 lg:w-48 h-52 sm:h-56 lg:h-64 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[0].image} alt={galleryItems[0].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 2: Stacked */}
                    <div className="flex flex-col gap-4 sm:gap-6 flex-shrink-0">
                        <div className="w-48 sm:w-52 lg:w-56 h-60 sm:h-64 lg:h-72 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[1].image} alt={galleryItems[1].alt} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-48 sm:w-52 lg:w-56 h-52 sm:h-56 lg:h-60 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[2].image} alt={galleryItems[2].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 3: Central Tall */}
                    <div className="flex-shrink-0 z-10 group cursor-pointer">
                        <div className="w-56 sm:w-60 lg:w-64 h-[350px] sm:h-[400px] lg:h-[480px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2 border-4 border-white">
                            <img src={galleryItems[3].image} alt={galleryItems[3].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 4: Stacked */}
                    <div className="flex flex-col gap-4 sm:gap-6 flex-shrink-0">
                        <div className="w-48 sm:w-52 lg:w-56 h-52 sm:h-56 lg:h-60 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[4].image} alt={galleryItems[4].alt} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-48 sm:w-52 lg:w-56 h-60 sm:h-64 lg:h-72 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[5].image} alt={galleryItems[5].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 5: Far Right */}
                    <div className="flex-shrink-0 group cursor-pointer">
                        <div className="w-40 sm:w-44 lg:w-48 h-52 sm:h-56 lg:h-64 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[6].image} alt={galleryItems[6].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
