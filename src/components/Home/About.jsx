import React from 'react';
import { Plane, Trophy, Check, ArrowRight, Luggage, MapPin } from 'lucide-react';
import image01 from '../../assets/Link → image-01.jpg.png';
import image03 from '../../assets/Link → image-03.png.png';
import collageElements from '../../assets/Image.png';

export default function About() {
    return (
        <section className="py-24 bg-white relative overflow-hidden font-sans">
            {/* Background Decorative Element (Eiffel Tower Silhouette) */}
            <div className="absolute right-[-10%] bottom-0 opacity-[0.04] pointer-events-none select-none z-0">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/121/121085.png"
                    alt="Eiffel Tower Decoration"
                    className="h-[800px] object-contain"
                />
            </div>

            <div className="px-4 md:px-6 relative z-10 w-full max-w-[1920px] mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Section: Immersive Collage */}
                    <div className="w-full lg:w-[48%] relative">
                        <div className="relative">
                            {/* Dotted Flight Path & Plane */}
                            <div className="absolute top-[10%] -left-16 z-0 w-64 h-64 opacity-60">
                                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" className="rotate-[-15deg]">
                                    <path d="M20 200 C 60 100, 160 80, 220 40" stroke="#FFA500" strokeWidth="2" strokeDasharray="8 8" />
                                </svg>
                                <div className="absolute top-[10%] left-[8%] text-[#FFA500] rotate-[-45deg]">
                                    <Plane size={36} fill="currentColor" />
                                </div>
                            </div>

                            {/* Main Large Image (Couple) */}
                            <div className="rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-2xl relative z-10 w-[88%] ml-auto border-[12px] border-white">
                                <img
                                    src={image01}
                                    alt="Traveling Couple"
                                    className="w-full aspect-[4/5] object-cover"
                                />
                            </div>

                            {/* 50% Discount Badge (Brush stroke style) */}
                            <div className="absolute top-[25%] left-[2%] z-30">
                                <div className="w-28 h-28 md:w-44 md:h-44 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
                                    {/* Swirly brush border decoration (simulated) */}
                                    <div className="absolute inset-0 border-[6px] border-dashed border-[#FFA500]/20 rounded-full animate-spin-slow" />
                                    <div className="text-center relative z-10">
                                        <div className="text-3xl md:text-5xl font-black text-[#FFA500] leading-none mb-1">50%</div>
                                        <div className="text-sm md:text-xl font-bold text-[#0F1E32] uppercase tracking-tighter">Discount</div>
                                    </div>
                                    {/* Small sparkle icons */}
                                    <div className="absolute top-4 right-4 text-[#FFA500] opacity-40"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.4 7.6H22l-6.1 4.4L18.2 22 12 17.5 5.8 22l2.3-7.9-6.1-4.4h7.6z" /></svg></div>
                                </div>
                            </div>

                            {/* Secondary Image (Beach View) */}
                            <div className="absolute bottom-[8%] right-0 w-[58%] z-20 rounded-[3rem] overflow-hidden border-[10px] border-white shadow-2xl">
                                <img
                                    src={image03}
                                    alt="Beach View"
                                    className="w-full aspect-video object-cover"
                                />
                            </div>

                            {/* Tropical Foreground Collage (Asset-based) */}
                            <div className="absolute -bottom-16 -left-12 z-40 w-[65%] pointer-events-none drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">
                                <img
                                    src={collageElements}
                                    alt="Travel Elements Collage"
                                    className="w-full h-auto animate-float"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Content */}
                    <div className="w-full lg:w-[52%] pl-0 lg:pl-10">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#EAF3FF] px-6 py-2.5 rounded-full mb-8 shadow-sm">
                            <Plane className="text-[#0F1E32] rotate-45" size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0F1E32]">Get to Know Us</span>
                        </div>

                        {/* Title Heading */}
                        <h2 className="text-[48px] md:text-[64px] font-['Playfair_Display'] font-extrabold text-[#0F1E32] leading-[1.05] mb-8">
                            Experience the World <br />
                            <span className="text-[#FFA500]">with Our Company</span>
                        </h2>

                        {/* Description Paragraph */}
                        <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-xl">
                            There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form, by injected humour,
                        </p>

                        {/* Features Row */}
                        <div className="flex flex-col sm:flex-row items-center gap-12 mb-14 pb-12 border-b border-gray-100">
                            {/* Feature Item 1 */}
                            <div className="flex items-center gap-6 flex-1 w-full">
                                <div className="w-16 h-16 rounded-full bg-[#0F1E32] flex items-center justify-center text-white shadow-xl shadow-[#0F1E32]/20 flex-shrink-0">
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v.01" /><path d="M13 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M17 12h-3l2 4 1 5" /><path d="M12 21v-4l-3-3 1-6h3" /><path d="M7 21l3-1v-4" /></svg>
                                </div>
                                <div className="border-r-0 sm:border-r border-gray-100 pr-0 sm:pr-8 h-full">
                                    <h4 className="text-[#0F1E32] font-black text-xl mb-1 whitespace-nowrap">Friendly Guide</h4>
                                    <p className="text-gray-400 text-[13px] leading-relaxed max-w-[140px]">
                                        There are many variations of passages of lorem Ipsum.
                                    </p>
                                </div>
                            </div>

                            {/* Feature Item 2 */}
                            <div className="flex items-center gap-6 flex-1 w-full pl-0 sm:pl-4">
                                <div className="w-16 h-16 rounded-full bg-[#0F1E32] flex items-center justify-center text-white shadow-xl shadow-[#0F1E32]/20 flex-shrink-0">
                                    <Luggage size={30} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="text-[#0F1E32] font-black text-xl mb-1 whitespace-nowrap">Safety Travel</h4>
                                    <p className="text-gray-400 text-[13px] leading-relaxed max-w-[140px]">
                                        There are many variations of passages of lorem Ipsum.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Summary Cluster */}
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            {/* Award Badge Box */}
                            <div className="bg-[#FAF7F3] p-10 rounded-[3.5rem] flex flex-col items-center justify-center border border-orange-100/50 group transition-all duration-500 hover:shadow-2xl hover:bg-white w-full md:w-44 text-center">
                                <Trophy size={56} className="text-[#0F1E32] mb-4 group-hover:scale-110 transition-transform" />
                                <h5 className="text-[#0F1E32] font-black uppercase text-xs tracking-tight leading-tight">
                                    Award Winning Agency
                                </h5>
                            </div>

                            {/* Bullet Checklist & Button */}
                            <div className="flex-1 space-y-8">
                                <ul className="space-y-4">
                                    {[
                                        "Many variations of passages of lorem.",
                                        "Many variations of passages of lorem.",
                                        "Expert many variations teacher."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-gray-700 font-bold text-sm">
                                            <div className="w-6 h-6 rounded-full bg-[#0F1E32] flex items-center justify-center text-white flex-shrink-0 text-[10px]">
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <button className="flex items-center gap-5 bg-[#0F1E32] text-white px-10 py-5 rounded-full font-bold text-sm hover:translate-y-[-2px] transition-all group shadow-2xl shadow-[#0F1E32]/30 active:scale-95">
                                    Explore More
                                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin 20s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
}
