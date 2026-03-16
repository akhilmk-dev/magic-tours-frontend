import React from 'react';
import { ArrowRight, Plane } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

// Assets
import privateJetImg from '../../assets/private-jet-2.png';
import destinationsImg from '../../assets/img (1).png';

const tripCategories = [
    {
        id: 1,
        name: 'Packages',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        link: '/tours'
    },
    {
        id: 2,
        name: 'Cruise Ship',
        image: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?q=80&w=800&auto=format&fit=crop',
        link: '/cruise'
    },
    {
        id: 3,
        name: 'Private Jets',
        image: privateJetImg.src || privateJetImg,
        link: '/private-jets'
    },
    {
        id: 4,
        name: 'Destinations',
        image: destinationsImg.src || destinationsImg,
        link: '/destinations'
    }
];

export default function Destinations() {
    return (
        <section className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden font-sans">

            <div className="px-6 sm:px-8 md:px-12 lg:px-16 relative z-10 w-full">
                <div className="flex flex-col xl:flex-row gap-12 xl:gap-16 items-center">

                    {/* Left Content - Header */}
                    <div className="xl:w-[30%] text-left">
                        <div className="inline-flex items-center gap-3 bg-[#F2F5FF] px-6 py-3 rounded-full mb-8 shadow-sm">
                            <svg className="text-brand-magic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">Trips List</span>
                        </div>

                        <h2 className="text-[44px] md:text-[60px] font-extrabold text-brand-heading leading-[1.05] mb-8">
                            Explore the <br />
                            Trips <br />
                            <span className="text-[#FFA500]">Places Around World</span>
                        </h2>

                        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-sm">
                            Discover curated travel experiences and breathtaking destinations across the globe. From luxury cruises to private jet charters, we make your dream journey a reality.
                        </p>

                        <Link href="/destinations">
                            <button className="flex items-center gap-4 bg-brand-magic text-white px-10 py-5 rounded-full font-heading font-bold text-base hover:opacity-90 transition-all group shadow-2xl shadow-brand-magic/20">
                                Discover More
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    {/* Right Content - Cards Grid */}
                    <div className="xl:w-[75%] w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {tripCategories.map((trip) => (
                                <Link href={trip.link} key={trip.id} className="group cursor-pointer">
                                    <div className="flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_60px_rgba(15,30,50,0.18)] hover:-translate-y-2">
                                        {/* Image — rounded top corners */}
                                        <div className="aspect-square overflow-hidden relative rounded-t-[2.2rem]">
                                            <img
                                                src={trip.image}
                                                alt={trip.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Footer: white normally, dark navy on hover */}
                                        {/* Bottom-left rounded, bottom-right square (as per design) */}
                                        <div className="pb-8 pt-5 px-4 text-center bg-white group-hover:bg-brand-magic transition-colors duration-500 rounded-bl-[2.2rem] rounded-br-none">
                                            <h3 className="text-[22px] font-heading font-bold mb-1 text-brand-heading group-hover:text-white transition-colors duration-500">
                                                {trip.name}
                                            </h3>
                                            <span className="text-[13px] font-heading font-medium text-gray-400 group-hover:text-white/70 transition-colors duration-500">
                                                See More
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
