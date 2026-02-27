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
        <section className="py-10 md:py-14 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex items-center gap-3 bg-[#F8FAFC] px-6 py-2.5 rounded-full mb-4 border border-gray-100 shadow-sm">
                        <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                        </svg>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">Get to Know Us</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-secondary">
                        Recent <span className="text-[#FFA500]">Gallery</span>
                    </h2>
                </div>

                {/* Mobile Grid Layout */}
                <div className="grid grid-cols-2 gap-3 md:hidden">
                    {galleryItems.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="w-full h-40 sm:h-48 rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-1">
                                <img src={item.image} alt={item.alt} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Staggered Row Layout */}
                <div className="hidden md:flex flex-nowrap items-center justify-center gap-4 lg:gap-6 pb-4">

                    {/* Column 1: Far Left */}
                    <div className="flex-shrink-0 group cursor-pointer">
                        <div className="w-32 lg:w-40 h-40 lg:h-48 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-xl transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[0].image} alt={galleryItems[0].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 2: Stacked */}
                    <div className="flex flex-col gap-3 lg:gap-4 flex-shrink-0">
                        <div className="w-40 lg:w-44 h-44 lg:h-52 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[1].image} alt={galleryItems[1].alt} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-40 lg:w-44 h-40 lg:h-44 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[2].image} alt={galleryItems[2].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 3: Central Tall */}
                    <div className="flex-shrink-0 z-10 group cursor-pointer">
                        <div className="w-48 lg:w-52 h-[280px] lg:h-[350px] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2 border-4 border-white">
                            <img src={galleryItems[3].image} alt={galleryItems[3].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 4: Stacked */}
                    <div className="flex flex-col gap-3 lg:gap-4 flex-shrink-0">
                        <div className="w-40 lg:w-44 h-40 lg:h-44 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[4].image} alt={galleryItems[4].alt} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-40 lg:w-44 h-44 lg:h-52 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[5].image} alt={galleryItems[5].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Column 5: Far Right */}
                    <div className="flex-shrink-0 group cursor-pointer">
                        <div className="w-32 lg:w-40 h-40 lg:h-48 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-xl transition-transform duration-500 hover:-translate-y-2">
                            <img src={galleryItems[6].image} alt={galleryItems[6].alt} className="w-full h-full object-cover" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
