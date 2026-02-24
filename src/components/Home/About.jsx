import React from 'react';
import { Plane, Briefcase, Trophy, Check, ArrowRight } from 'lucide-react';

export default function About() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorative Element (Eiffel Tower - subtle) */}
            <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none select-none translate-x-1/4">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/121/121085.png"
                    alt="Eiffel Tower"
                    className="h-[600px] object-contain"
                />
            </div>

            <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Image Section (Left) */}
                    <div className="w-full lg:w-1/2 relative">
                        {/* Orange Plane Icon */}
                        <div className="absolute -left-8 top-1/4 text-[#FFA500] rotate-12 animate-pulse hidden md:block">
                            <Plane size={50} fill="currentColor" className="opacity-80" />
                        </div>

                        {/* Main Image Wrapper */}
                        <div className="relative">
                            <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop"
                                    alt="Traveling Couple"
                                    className="w-full aspect-[4/5] object-cover"
                                />
                            </div>

                            {/* 50% Discount Badge */}
                            <div className="absolute top-[20%] -right-4 sm:-right-6 md:-right-10 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-slate-50 z-20">
                                {/* Brush Stroke Effect Backdrop */}
                                <div className="absolute inset-0 border-[3px] border-dashed border-[#FFA500]/30 rounded-full scale-90"></div>
                                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FFA500]">50%</span>
                                <span className="text-[10px] sm:text-sm md:text-base font-bold text-slate-700 uppercase tracking-tighter">Discount</span>
                            </div>

                            {/* Small Beach Image */}
                            <div className="absolute -bottom-6 sm:-bottom-10 -right-2 sm:-right-4 md:-right-12 w-1/2 rounded-2xl sm:rounded-[30px] overflow-hidden border-4 sm:border-8 border-white shadow-2xl z-20">
                                <img
                                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
                                    alt="Beach Scene"
                                    className="w-full aspect-video object-cover"
                                />
                            </div>

                            {/* Decorative Bottom Left Icons (The collage assets) */}
                            <div className="absolute -bottom-12 -left-8 md:-left-12 z-30 hidden sm:block pointer-events-none">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600&auto=format&fit=crop"
                                        alt="Deco"
                                        className="h-40 w-40 object-contain drop-shadow-2xl rounded-2xl"
                                    />
                                    {/* These would ideally be cutout PNGs, using Unsplash cropped images as substitutes */}
                                    {/* Representing the sign, snorkel, pineapple group from the design */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section (Right) */}
                    <div className="w-full lg:w-1/2">
                        {/* Top Label */}
                        <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 mb-6 group cursor-default">
                            <Plane size={16} className="text-[#0F1E32] rotate-90" />
                            <span className="text-[#0F1E32] text-xs font-bold uppercase tracking-widest">Get to know us</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            <span className="text-[#0F1E32]">Experience the World</span> <br />
                            <span className="text-[#FFA500] font-sans">with Our Company</span>
                        </h2>

                        <p className="text-slate-500 mb-10 text-sm md:text-base leading-relaxed max-w-lg">
                            There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form, by injected humour,
                        </p>

                        {/* Features Grid */}
                        <div className="flex flex-col sm:flex-row gap-8 mb-10 pb-8 border-b border-slate-100">
                            {/* Feature 1 */}
                            <div className="flex items-start gap-4 flex-1">
                                <div className="min-w-[56px] h-[56px] rounded-full bg-[#0F1E32] flex items-center justify-center text-white shadow-lg">
                                    {/* Custom Hiker/Explorer Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                        <path d="M13 4v.01" /><path d="M13 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M17 12h-3l2 4 1 5" /><path d="M12 21v-4l-3-3 1-6h3" /><path d="M7 21l3-1v-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-[#0F1E32] font-bold text-lg mb-2">Friendly Guide</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                                        There are many variations of passages of lorem ipsum.
                                    </p>
                                </div>
                            </div>

                            {/* Vertical Line Divider (Desktop) */}
                            <div className="hidden sm:block w-px bg-slate-100 h-16 self-center"></div>

                            {/* Feature 2 */}
                            <div className="flex items-start gap-4 flex-1">
                                <div className="min-w-[56px] h-[56px] rounded-full bg-[#0F1E32] flex items-center justify-center text-white shadow-lg">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[#0F1E32] font-bold text-lg mb-2">Safety Travel</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                                        There are many variations of passages of lorem ipsum.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            {/* Agency Card */}
                            <div className="w-full md:w-36 flex flex-col items-center justify-center p-6 bg-[#FAF7F3] rounded-[30px] border border-orange-100 text-center flex-shrink-0 group hover:scale-105 transition-transform duration-300">
                                <Trophy size={40} className="text-[#0F1E32] mb-3 group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-tight">
                                    Award Winning Agency
                                </span>
                            </div>

                            {/* Checkbox List & CTA */}
                            <div className="flex-1 space-y-6">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                                    {[
                                        "Many variations of passages of lorem.",
                                        "Many variations of passages of lorem.",
                                        "Expert many variations teacher."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                                            <div className="w-5 h-5 rounded-full bg-[#0F1E32] text-white flex items-center justify-center flex-shrink-0 p-0.5">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <button className="inline-flex items-center gap-3 bg-[#0F1E32] hover:bg-[#1a3355] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-xl group">
                                    Explore More
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
