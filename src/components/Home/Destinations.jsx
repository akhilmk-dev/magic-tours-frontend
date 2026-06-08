import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '../common/Skeleton';

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
        name: 'Cruise Ships',
        image: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?q=80&w=800&auto=format&fit=crop',
        link: '/cruises'
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

export default function Destinations({ content, loading }) {
    const subtitle    = content?.subtitle    || "Trips List";
    const line1       = content?.line1       || "Explore the Trips";
    const highlight   = content?.highlight   || "Places";
    const line2       = content?.line2;
    const description = content?.description || "Discover curated travel experiences and breathtaking destinations across the globe. From luxury cruises to private jet charters, we make your dream journey a reality.";
    const buttonText  = content?.button_text || "Discover More Destinations";
    const buttonLink  = content?.button_link || "/destinations";

    /* ── skeleton ── */
    if (loading) {
        return (
            <section className="pt-4 sm:pt-5 lg:pt-6 pb-2 sm:pb-3 lg:pb-4 bg-white relative overflow-hidden font-sans">
                <div className="px-6 sm:px-8 md:px-12 lg:px-16 relative z-10 w-full">
                    <div className="flex flex-col xl:flex-row gap-12 xl:gap-16 items-center">
                        <div className="xl:w-[30%] text-left">
                            <Skeleton className="w-32 h-10 rounded-full mb-8" />
                            <Skeleton className="w-full h-32 rounded-2xl mb-8" />
                            <Skeleton className="w-64 h-20 rounded-2xl mb-10" />
                            <Skeleton className="w-48 h-14 rounded-full" />
                        </div>
                        <div className="xl:w-[75%] w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex flex-col h-full bg-white rounded-t-[2.2rem] rounded-bl-[2.2rem] overflow-hidden">
                                        <Skeleton className="aspect-[4/3] w-full" />
                                        <div className="pb-5 pt-3 px-4 space-y-2">
                                            <Skeleton className="w-2/3 h-6 mx-auto rounded-md" />
                                            <Skeleton className="w-1/3 h-4 mx-auto rounded-md" />
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

    return (
        <section className="pt-4 sm:pt-5 lg:pt-6 pb-2 sm:pb-3 lg:pb-4 bg-white relative overflow-hidden font-sans">
            {/* pl-only — no right padding so cards reach the viewport right edge */}
            <div className="pl-6 sm:pl-8 md:pl-12 lg:pl-16 relative z-10 w-full">
                <div className="flex flex-col xl:flex-row gap-10 xl:gap-12 items-center">

                    {/* ── Left: text ── */}
                    <div className="xl:w-[420px] xl:shrink-0 text-left pr-4 xl:pr-0">
                        <div className="inline-flex items-center gap-3 bg-[#F2F5FF] px-6 py-3 rounded-full mb-5 shadow-sm">
                            <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                            </svg>
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">
                                {subtitle}
                            </span>
                        </div>

                        <h2 className="text-[44px] md:text-[60px] font-extrabold text-brand-heading leading-[1.05] mb-4">
                            {line1} <br />
                            <span className="text-[#FFA500]">{highlight}</span>
                            {line2 && <><br />{line2}</>}
                        </h2>

                        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                            {description}
                        </p>

                        <Link href={buttonLink}>
                            <button className="flex items-center gap-4 bg-brand-magic text-white px-8 py-4 rounded-[2rem] font-heading font-bold text-base hover:opacity-90 transition-all group shadow-2xl shadow-brand-magic/20 max-w-[220px] leading-tight text-left">
                                <span className="flex-1">{buttonText}</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                            </button>
                        </Link>
                    </div>

                    {/* ── Right: cards scroll to viewport right edge ── */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <style>{`
                            @keyframes destinations-scroll {
                                0%   { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .destinations-track {
                                animation: destinations-scroll 14s linear infinite;
                                will-change: transform;
                            }
                            .destinations-track:hover {
                                animation-play-state: paused;
                            }
                        `}</style>

                        <div className="destinations-track flex items-stretch" style={{ width: 'max-content' }}>
                            {[...tripCategories, ...tripCategories].map((trip, idx) => (
                                <Link
                                    href={trip.link}
                                    key={idx}
                                    className="group cursor-pointer shrink-0"
                                    style={{ marginRight: '20px' }}
                                >
                                    {/*
                                      bg-white/group-hover:bg-brand-magic is on the CARD CONTAINER,
                                      not on the text section. This fills the rounded-b gap of the
                                      image AND the text section with the same colour on hover.
                                    */}
                                    <div
                                        className="bg-white group-hover:bg-brand-magic flex flex-col transition-colors duration-500 rounded-t-[2.2rem] rounded-bl-[2.2rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.09)]"
                                        style={{ width: '248.37px', height: '348.82px' }}
                                    >
                                        {/* Image — fully rounded (top 2.2rem, bottom 1.8rem) */}
                                        <div
                                            className="overflow-hidden relative rounded-t-[2.2rem] rounded-b-[1.8rem]"
                                            style={{ flex: '1 1 0', minHeight: 0 }}
                                        >
                                            <img
                                                src={trip.image}
                                                alt={trip.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Text section — no own bg, inherits card container colour */}
                                        <div className="pb-5 pt-[10px] px-4 text-center shrink-0">
                                            <h3 className="text-[17px] xl:text-[19px] font-heading font-bold mb-[2px] text-brand-heading group-hover:text-white transition-colors duration-500 leading-snug">
                                                {trip.name}
                                            </h3>
                                            <span className="text-[11px] xl:text-[12px] font-heading font-medium text-gray-400 group-hover:text-white/70 transition-colors duration-500">
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
