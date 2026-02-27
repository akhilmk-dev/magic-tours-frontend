import React from 'react';
import { Plane, Trophy, Check, ArrowRight, Luggage, UserRound } from 'lucide-react';
import image01 from '../../assets/Link → image-01.jpg.png';
import image02 from '../../assets/Link → image-02.jpg.png';
import image03 from '../../assets/Link → image-03.png.png';
import discountImg from '../../assets/discount.png.png';
import towerImg from '../../assets/Image.png';

export default function About() {
    return (
        <section className="py-24 bg-white relative overflow-hidden font-sans">
            {/* Background Decorative Element (Eiffel Tower Silhouette from Image.png) */}
            <div className="absolute right-[-2%] bottom-0 opacity-[0.25] pointer-events-none select-none z-0">
                <img
                    src={towerImg}
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
                                    src={image01}
                                    alt="Traveling Couple"
                                    className="w-full aspect-[1/1.15] object-cover"
                                />
                            </div>

                            {/* 2. Discount Badge (Link → discount.png.png) - Overlaps face */}
                            <div className="absolute top-[20%] md:top-[22%] right-[-5%] md:right-[2%] lg:right-[5%] z-30 w-28 md:w-36 lg:w-48 pointer-events-none">
                                <img
                                    src={discountImg}
                                    alt="50% Discount"
                                    className="w-full h-auto drop-shadow-2xl"
                                />
                            </div>

                            {/* 3. Tropical Elements Cutout (Foreground - Link → image-03) */}
                            <div className="absolute bottom-[-15px] md:bottom-[-25px] lg:bottom-[-30px] left-[-15px] md:left-[-30px] lg:left-[-30px] z-40 w-[60%] md:w-[68%] pointer-events-none drop-shadow-2xl">
                                <img
                                    src={image03}
                                    alt="Tropical Elements"
                                    className="w-full h-auto animate-float"
                                />
                            </div>

                            {/* 4. Beach Image (Overlap Bottom Right - Link → image-02) */}
                            <div className="absolute bottom-[2%] md:bottom-[-5%] lg:bottom-[2%] right-[-8%] md:right-[-6%] lg:right-[-2%] w-[58%] z-20 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border-[6px] md:border-[10px] border-white shadow-2xl">
                                <img
                                    src={image02}
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
                            <div className="inline-flex items-center gap-2 bg-[#F2F6FF] px-5 py-2.5 rounded-full mb-6 shadow-sm">
                                <Plane className="text-[#0F1E32] rotate-45" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0F1E32]">Get to Know Us</span>
                            </div>

                            {/* Heading */}
                            <h2 className="text-[36px] md:text-[54px] font-['Playfair_Display'] font-extrabold text-[#0F1E32] leading-[1.1] mb-6">
                                Experience the World <br />
                                <span className="text-[#FFA500]">with Our Company</span>
                            </h2>

                            {/* Description */}
                            <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg lg:max-w-none">
                                There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form, by injected humour,
                            </p>

                            {/* Features Row */}
                            <div className="flex flex-col sm:flex-row items-center lg:items-center gap-8 md:gap-10 mb-10 pb-10 border-b border-gray-100 w-full lg:w-auto">
                                <div className="flex flex-col sm:flex-row items-center gap-5 flex-1 w-full sm:w-auto">
                                    <div className="w-16 h-16 rounded-full bg-[#0F1E32] flex items-center justify-center text-white shadow-xl shadow-[#0F1E32]/20 flex-shrink-0">
                                        <UserRound size={30} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col justify-center sm:text-left">
                                        <h4 className="text-[#0F1E32] font-black text-lg mb-1 whitespace-nowrap">Friendly Guide</h4>
                                        <p className="text-gray-400 text-[12px] leading-relaxed max-w-[200px] sm:max-w-[140px] mx-auto sm:mx-0">
                                            There are many variations of passages of lorem Ipsum.
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden sm:block w-px h-12 bg-gray-100" />

                                <div className="flex flex-col sm:flex-row items-center gap-5 flex-1 w-full sm:w-auto">
                                    <div className="w-16 h-16 rounded-full bg-[#0F1E32] flex items-center justify-center text-white shadow-xl shadow-[#0F1E32]/20 flex-shrink-0">
                                        <Luggage size={30} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col justify-center sm:text-left">
                                        <h4 className="text-[#0F1E32] font-black text-lg mb-1 whitespace-nowrap">Safety Travel</h4>
                                        <p className="text-gray-400 text-[12px] leading-relaxed max-w-[200px] sm:max-w-[140px] mx-auto sm:mx-0">
                                            There are many variations of passages of lorem Ipsum.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row */}
                            <div className="flex flex-col md:flex-row gap-10 items-center lg:items-start w-full lg:w-auto">
                                <div className="bg-[#FAF7F3] p-8 rounded-[3rem] flex flex-col items-center justify-center border border-orange-100/50 group transition-all duration-500 hover:shadow-2xl hover:bg-white w-full max-w-[200px] md:w-48 text-center aspect-square md:aspect-auto h-auto">
                                    <Trophy size={56} className="text-[#0F1E32] mb-4 group-hover:scale-110 transition-transform" />
                                    <h5 className="text-[#0F1E32] font-black uppercase text-xs tracking-tight leading-tight">
                                        Award Winning Agency
                                    </h5>
                                </div>

                                <div className="flex-1 space-y-6 flex flex-col items-center lg:items-start w-full">
                                    <ul className="space-y-3 w-full sm:w-auto">
                                        {[
                                            "Many variations of passages of lorem.",
                                            "Many variations of passages of lorem.",
                                            "Expert many variations teacher."
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-700 font-bold text-sm justify-start">
                                                <div className="w-6 h-6 rounded-full bg-[#0F1E32] flex items-center justify-center text-white flex-shrink-0 text-[10px]">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="flex items-center gap-4 bg-[#0F1E32] text-white px-8 py-4 rounded-full font-bold text-sm hover:translate-y-[-2px] transition-all group shadow-2xl shadow-[#0F1E32]/30 active:scale-95 w-full sm:w-fit justify-center">
                                        Explore More
                                        <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                    </button>
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
