import React from 'react';
import Link from 'next/link';
import { Plane, Check, ArrowRight, Luggage, UserRound } from 'lucide-react';

import image01 from '../../assets/link_image_01.png';
import image02 from '../../assets/link_image_02.png';
import image03 from '../../assets/link_image_03.png';
import discountImg from '../../assets/discount.png.png';
import towerImg from '../../assets/Image.png';
import Trophy from '../../assets/Trophy.png';

import Skeleton from '../common/Skeleton';

export default function About({ content, loading }) {
    const subtitle = content?.subtitle || "Get to Know Us";
    const line1 = content?.line1 || "Experience the World";
    const highlight = content?.highlight || "Our Company";
    const description = content?.description || "Discover hidden gems and iconic landmarks with our expertly curated travel experiences. We specialize in crafting personalized itineraries that blend luxury with authentic local culture for every traveler.";
    const buttonText = content?.button_text || "Explore More";
    const buttonLink = content?.button_link || "/contact-us";
    const image1 = content?.image1 || image01.src || image01;
    const image2 = content?.image2 || image02.src || image02;

    if (loading) {
        return (
            <section className="pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left - Skeleton Images */}
                        <div className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
                            <Skeleton className="absolute top-0 right-[5%] w-[82%] aspect-[1/1.15] rounded-[3rem] md:rounded-[4.5rem] lg:rounded-[6rem]" />
                            <Skeleton className="absolute bottom-[2%] md:bottom-[-5%] lg:bottom-[2%] right-[-8%] md:right-[-6%] lg:right-[-2%] w-[58%] aspect-[1.4/1] rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] border-[6px] md:border-[10px] border-white shadow-xl" />
                        </div>
                        {/* Right - Skeleton Text */}
                        <div className="w-full lg:w-1/2">
                            <Skeleton className="w-32 h-10 rounded-full mb-8" />
                            <Skeleton className="w-full h-16 md:h-20 rounded-2xl mb-8" />
                            <Skeleton className="w-full h-24 rounded-2xl mb-10" />
                            <div className="space-y-6 mb-10">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="w-1/3 h-6 rounded-md" />
                                            <Skeleton className="w-full h-4 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Skeleton className="w-48 h-14 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-24 bg-white relative overflow-hidden">
            {/* Background Decorative Element (Eiffel Tower Silhouette from Image.png) */}
            <div className="absolute right-[-2%] bottom-0 opacity-[0.25] pointer-events-none select-none z-0">
                <img
                    src={towerImg.src || towerImg}
                    alt="Eiffel Tower Decoration"
                    className="h-[800px] w-auto object-contain"
                />
            </div>

            <div className="px-4 md:px-6 relative z-10 w-full max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Section: Immersive Collage */}
                    <div className="w-full lg:w-[46%] relative mb-12 lg:mb-0">
                        <div className="relative h-[450px] md:h-[550px] lg:h-[650px] w-full max-w-[600px] mx-auto lg:mx-0">

                            {/* 1. Main Couple Image (Background layer - Link → image-01) */}
                            <div className="absolute top-0 right-[5%] w-[82%] z-10 rounded-[3rem] md:rounded-[4.5rem] lg:rounded-[6rem] overflow-hidden shadow-2xl border-[6px] md:border-[10px] border-white">
                                <img
                                    src={image1}
                                    alt="Traveling Couple"
                                    className="w-full aspect-[1/1.15] object-cover"
                                />
                            </div>

                            {/* 2. Discount Badge (Link → discount.png.png) - Overlaps face */}
                            <div className="absolute top-[20%] md:top-[22%] right-[-5%] md:right-[2%] lg:right-[5%] z-30 w-28 md:w-36 lg:w-48 pointer-events-none">
                                <img
                                    src={discountImg.src || discountImg}
                                    alt="50% Discount"
                                    className="w-full h-auto drop-shadow-2xl"
                                />
                            </div>

                            {/* 3. Tropical Elements Cutout (Foreground - Link → image-03) */}
                            <div className="absolute bottom-[-15px] md:bottom-[-25px] lg:bottom-[-30px] left-[-15px] md:left-[-30px] lg:left-[-30px] z-40 w-[60%] md:w-[68%] pointer-events-none drop-shadow-2xl">
                                <img
                                    src={image03.src || image03}
                                    alt="Tropical Elements"
                                    className="w-full h-auto animate-float"
                                />
                            </div>

                            {/* 4. Beach Image (Overlap Bottom Right - Link → image-02) */}
                            <div className="absolute bottom-[2%] md:bottom-[-5%] lg:bottom-[2%] right-[-8%] md:right-[-6%] lg:right-[-2%] w-[58%] z-20 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border-[6px] md:border-[10px] border-white shadow-2xl">
                                <img
                                    src={image2}
                                    alt="Beach View"
                                    className="w-full aspect-[1.4/1] object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Content */}
                    <div className="w-full lg:w-[54%] pl-0 lg:pl-10 relative">
                        <div className="max-w-2xl relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-3 bg-[#F2F6FF] px-6 py-3 rounded-full mb-6 shadow-sm">
                                <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                                </svg>
                                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-magic font-jakarta">
                                    {subtitle}
                                </span>
                            </div>

                            <h2 className="text-[36px] md:text-[54px] font-extrabold text-brand-heading leading-[1.1] mb-6">
                                {line1} <br />
                                <span className="text-[#FFA500]">
                                    {highlight}
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg lg:max-w-none">
                                {description}
                            </p>

                            {/* Features Row */}
                            <div className="flex flex-col sm:flex-row items-center lg:items-center gap-8 md:gap-10 mb-10 pb-10 border-b border-gray-100 w-full lg:w-auto">
                                <div className="flex flex-col sm:flex-row items-center gap-5 flex-1 w-full sm:w-auto">
                                    <div className="w-16 h-16 rounded-full bg-brand-magic flex items-center justify-center text-white shadow-xl shadow-brand-magic/20 flex-shrink-0">
                                        <UserRound size={30} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col justify-center sm:text-left">
                                        <h4 className="text-brand-heading font-black text-lg mb-1 whitespace-nowrap">Friendly Guide</h4>
                                        <p className="text-gray-400 text-[12px] leading-relaxed max-w-[200px] sm:max-w-[140px] mx-auto sm:mx-0">
                                            Our certified local experts provide deep insights and stories that bring every destination to life.
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden sm:block w-px h-12 bg-gray-100" />

                                <div className="flex flex-col sm:flex-row items-center gap-5 flex-1 w-full sm:w-auto">
                                    <div className="w-16 h-16 rounded-full bg-brand-magic flex items-center justify-center text-white shadow-xl shadow-brand-magic/20 flex-shrink-0">
                                        <Luggage size={30} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col justify-center sm:text-left">
                                        <h4 className="text-brand-heading font-black text-lg mb-1 whitespace-nowrap">Safety Travel</h4>
                                        <p className="text-gray-400 text-[12px] leading-relaxed max-w-[200px] sm:max-w-[140px] mx-auto sm:mx-0">
                                            Your peace of mind is our priority, with 24/7 support and vetted transportation for every journey.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row */}
                            <div className="flex flex-col md:flex-row gap-10 items-center lg:items-start w-full lg:w-auto">
                                <div className="bg-[#FAF7F3] p-8 rounded-[3rem] flex flex-col items-center justify-center border border-orange-100/50 group transition-all duration-500 hover:shadow-2xl hover:bg-white w-full max-w-[200px] md:w-48 text-center aspect-square md:aspect-auto h-auto">
                                    {/* <Trophy size={56} className="text-brand-magic mb-4 group-hover:scale-110 transition-transform" /> */}
                                    <img
                                        src={Trophy.src || Trophy}
                                        alt="Award Trophy"
                                        width={56}
                                        height={56}
                                        className="mb-4 group-hover:scale-110 transition-transform object-contain"
                                    />
                                    <h5 className="text-brand-heading font-black uppercase text-xs tracking-tight leading-tight">
                                        Award Winning Agency
                                    </h5>
                                </div>

                                <div className="flex-1 space-y-6 flex flex-col items-center lg:items-start w-full">
                                    <ul className="space-y-3 w-full sm:w-auto">
                                        {[
                                            "Bespoke itineraries tailored to your unique preferences.",
                                            "Exclusive access to premium lounges and luxury stays.",
                                            "Sustainable travel practices that support local communities."
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-700 font-bold text-sm justify-start">
                                                <div className="w-6 h-6 rounded-full bg-brand-magic flex items-center justify-center text-white flex-shrink-0 text-[10px]">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href={buttonLink} className="flex items-center gap-4 bg-brand-magic text-white px-8 py-4 rounded-full font-heading font-bold text-sm hover:translate-y-[-2px] hover:opacity-90 transition-all group shadow-2xl shadow-brand-magic/30 active:scale-95 w-full sm:w-fit justify-center moving-light-border">
                                        {buttonText}
                                        <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(0.5deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
