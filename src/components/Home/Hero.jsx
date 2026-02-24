import React from 'react';
import { Plane, ArrowRight, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center bg-[#0F1E32] overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
                    alt="Travel hero background"
                    className="w-full h-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1E32] via-[#0F1E32]/80 to-transparent" />
            </div>

            {/* Decorative circles */}
            <div className="absolute top-24 right-12 w-80 h-80 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute top-16 right-4  w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#FFA500]/5 pointer-events-none" />

            {/* Floating plane icon */}
            <div className="absolute top-1/3 right-[12%] text-[#FFA500] animate-pulse hidden lg:block pointer-events-none">
                <Plane size={60} className="rotate-45 opacity-20" fill="currentColor" />
            </div>

            <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10 pt-24 pb-16">
                <div className="max-w-3xl">
                    {/* Label */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full mb-8">
                        <Plane size={14} className="text-[#FFA500]" />
                        <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Magic Tours & Travels</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
                        Discover the<br />
                        <span className="text-[#FFA500]">World's Most</span><br />
                        Beautiful Places
                    </h1>

                    <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                        Embark on unforgettable journeys to breathtaking destinations. Let us craft your perfect adventure with expert guides and curated experiences.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 mb-14">
                        <button
                            onClick={() => navigate('/packages')}
                            className="group inline-flex items-center gap-3 bg-[#FFA500] hover:bg-[#ff9000] text-white px-8 py-4 rounded-full font-bold text-sm transition-all shadow-2xl shadow-orange-500/30 hover:scale-105"
                        >
                            Explore Packages
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/corporate')}
                            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm transition-all"
                        >
                            Corporate Tours
                        </button>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-8">
                        {[
                            { value: '10K+', label: 'Happy Travellers' },
                            { value: '500+', label: 'Destinations' },
                            { value: '15+', label: 'Years Experience' },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="flex">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={10} fill="#FFA500" className="text-[#FFA500]" />
                                    ))}
                                </div>
                                <div>
                                    <div className="text-white font-black text-xl leading-none">{stat.value}</div>
                                    <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
                                </div>
                                {i < 2 && <div className="h-8 w-px bg-white/10 ml-2" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
                <div className="w-px h-10 bg-white" />
                <MapPin size={14} className="text-white" />
            </div>
        </section>
    );
}
