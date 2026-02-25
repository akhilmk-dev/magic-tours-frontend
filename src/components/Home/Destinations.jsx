import React from 'react';
import { ArrowRight, Plane } from 'lucide-react';
import { clsx } from 'clsx';

const tripCategories = [
    {
        id: 1,
        name: 'Packages',
        image: 'https://images.unsplash.com/photo-1544735749-2adda67b2772?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 2,
        name: 'Cruise Ship',
        image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Educational Trip',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 4,
        name: 'Airbnb',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop',
    }
];

export default function Destinations() {
    return (
        <section className="py-24 bg-[#FAFBFF] relative overflow-hidden font-sans">
            {/* Enhanced Travel-themed Background Pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 20 L20 10 M15 15 L25 5 M100 20 L110 30 M105 25 L115 35 M40 80 Q 40 70, 50 70 T 60 80 T 50 90 T 40 80 M90 90 L100 80 L110 90 M30 30 A 10 10 0 1 0 50 30 A 10 10 0 1 0 30 30' stroke='%230F1E32' stroke-width='1' fill='none'/%3E%3Ccircle cx='60' cy='30' r='1.5' fill='%230F1E32'/%3E%3Ccircle cx='20' cy='90' r='1.5' fill='%230F1E32'/%3E%3C/svg%3E")`,
                    backgroundSize: '240px 240px'
                }}>
            </div>

            <div className="px-4 md:px-6 relative z-10 w-full">
                <div className="flex flex-col xl:flex-row gap-12 xl:gap-16 items-center">

                    {/* Left Content - Header */}
                    <div className="xl:w-[25%] text-left">
                        <div className="inline-flex items-center gap-2 bg-[#F2F5FF] px-5 py-2.5 rounded-full mb-8 shadow-sm">
                            <Plane className="text-[#0F1E32]" size={16} />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0F1E32]">Trips List</span>
                        </div>

                        <h2 className="text-[44px] md:text-[60px] font-['Playfair_Display'] font-extrabold text-[#0F1E32] leading-[1.05] mb-8">
                            Explore the <br />
                            Trips <br />
                            <span className="text-[#FFA500]">Places Around World</span>
                        </h2>

                        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-sm">
                            Flexible classes refers to the process of acquiring is knowledge free.
                        </p>

                        <button className="flex items-center gap-4 bg-[#0F1E32] text-white px-10 py-5 rounded-full font-bold text-sm hover:bg-[#1a3355] transition-all group shadow-2xl shadow-[#0F1E32]/20">
                            Discover More
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Content - Cards Grid */}
                    <div className="xl:w-[75%] w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {tripCategories.map((trip) => (
                                <div key={trip.id} className="group cursor-pointer">
                                    <div className="flex flex-col h-full">
                                        <div className="aspect-square overflow-hidden rounded-[2.2rem] transition-all duration-500 shadow-sm group-hover:shadow-md group-hover:rounded-b-none relative z-20">
                                            <img
                                                src={trip.image}
                                                alt={trip.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="pb-10 pt-6 px-4 text-center transition-all duration-500 group-hover:bg-[#0F1E32] rounded-[2.2rem] group-hover:rounded-t-none group-hover:shadow-[0_20px_40px_rgba(15,30,50,0.15)] relative z-10 -mt-2 group-hover:mt-0">
                                            <h3 className="text-[22px] font-['Playfair_Display'] font-bold mb-1 transition-colors group-hover:text-white text-[#0F1E32]">
                                                {trip.name}
                                            </h3>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] transition-colors group-hover:text-white/60 text-gray-400">
                                                See More
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
