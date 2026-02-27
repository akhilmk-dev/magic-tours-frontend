import React from 'react';
import { ArrowRight, Plane } from 'lucide-react';
import { clsx } from 'clsx';

const tripCategories = [
    {
        id: 1,
        name: 'Packages',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 2,
        name: 'Cruise Ship',
        image: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Educational Trip',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 4,
        name: 'Airbnb',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    }
];

export default function Destinations() {
    return (
        <section className="py-24 bg-white relative overflow-hidden font-sans">

            <div className="px-6 sm:px-8 md:px-12 lg:px-16 relative z-10 w-full">
                <div className="flex flex-col xl:flex-row gap-12 xl:gap-16 items-center">

                    {/* Left Content - Header */}
                    <div className="xl:w-[30%] text-left">
                        <div className="inline-flex items-center gap-2 bg-[#F2F5FF] px-5 py-2.5 rounded-full mb-8 shadow-sm">
                            <Plane className="text-[#0F1E32]" size={16} />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0F1E32]">Trips List</span>
                        </div>

                        <h2 className="text-[44px] md:text-[60px] font-extrabold text-[#0F1E32] leading-[1.05] mb-8">
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
                                    <div className="flex flex-col h-full rounded-[2.2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(15,30,50,0.15)] hover:-translate-y-2">
                                        <div className="aspect-square overflow-hidden relative">
                                            <img
                                                src={trip.image}
                                                alt={trip.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        <div className="pb-8 pt-5 px-4 text-center bg-white group-hover:bg-[#0F1E32] transition-all duration-500">
                                            <h3 className="text-[22px] font-bold mb-1 text-[#0F1E32] transition-colors group-hover:text-white">
                                                {trip.name}
                                            </h3>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 group-hover:text-white/60 transition-colors duration-500">
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
