"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Users, Globe, Award, Star, Target, Eye, Heart, MapPin } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';

const stats = [
    { value: 10, suffix: '+', label: 'Years of Excellence' },
    { value: 15000, suffix: '+', label: 'Happy Travellers' },
    { value: 120, suffix: '+', label: 'Tour Packages' },
    { value: 50, suffix: '+', label: 'Destinations' },
];

const values = [
    { icon: <Target size={24} className="text-[#FFA500]" />, title: 'Our Mission', desc: 'To make extraordinary travel accessible to everyone by delivering unforgettable experiences crafted with passion, expertise and genuine care.' },
    { icon: <Eye size={24} className="text-[#FFA500]" />, title: 'Our Vision', desc: 'To be the most trusted travel partner in the region — a name that promises not just a holiday, but a memory that lasts a lifetime.' },
    { icon: <Heart size={24} className="text-[#FFA500]" />, title: 'Our Values', desc: 'Integrity, excellence and a deep respect for every culture we encounter. We believe travel should broaden horizons and connect hearts.' },
];

const team = [
    { name: 'Ahmed Al-Rashid', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Fatima Al-Zahra', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces' },
    { name: 'James Morrison', role: 'Lead Travel Consultant', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces' },
    { name: 'Priya Sharma', role: 'Visa & Documentation Lead', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces' },
];

function AnimatedCounter({ target, suffix }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const end = target;
                const duration = 1800;
                const step = Math.ceil(end / (duration / 16));
                const timer = setInterval(() => {
                    start = Math.min(start + step, end);
                    setCount(start);
                    if (start >= end) clearInterval(timer);
                }, 16);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-sans overflow-hidden">
            {/* Hero */}
            <section className="relative min-h-[70vh] lg:min-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src={bannerImg.src || bannerImg} alt="About Us Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#E9F7FF]/20 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">About Us</h1>
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>About</span>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* Our Story */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <span className="inline-block px-4 py-1.5 bg-[#eff6ff] text-[#113A74] text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Our Story</span>
                        <h2 className="text-[28px] md:text-[42px] font-bold text-[#113A74] leading-tight font-heading">
                            A Decade of <span className="text-[#FFA500]">Crafting Dreams</span>
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Founded in 2015 in the heart of Doha, Magic Tours was born from a simple belief: that every journey should be extraordinary. What started as a boutique travel desk serving a handful of explorers has grown into one of the region's most trusted names in bespoke travel.
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Today, we curate personalised holiday packages, luxury cruises, private jet experiences, visa services, and more — all underpinned by the same warmth and attention to detail that guided us from day one.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex -space-x-2">
                                {team.slice(0, 3).map((m, i) => (
                                    <img key={i} src={m.img} alt={m.name} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow" />
                                ))}
                            </div>
                            <p className="text-xs font-bold text-[#113A74]">Meet our extraordinary team</p>
                        </div>
                        <Link href="/contact-us" className="inline-block bg-[#113A74] hover:bg-[#1c4d91] text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-[#113A74]/25 text-sm">
                            Get In Touch
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#113A74]/15 aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                                alt="Magic Tours Team"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-[#FFA500] text-white rounded-[1.5rem] px-8 py-5 shadow-xl">
                            <p className="text-3xl font-extrabold font-heading leading-none">10+</p>
                            <p className="text-xs font-bold uppercase tracking-wider mt-1">Years of Excellence</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-[#113A74] py-20">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s, i) => (
                        <div key={i}>
                            <p className="text-4xl md:text-5xl font-extrabold text-white font-heading">
                                <AnimatedCounter target={s.value} suffix={s.suffix} />
                            </p>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
                <div className="text-center mb-14">
                    <h2 className="text-[28px] md:text-[42px] font-bold text-[#113A74] leading-tight font-heading">
                        What <span className="text-[#FFA500]">Drives Us</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {values.map((v, i) => (
                        <div key={i} className="bg-[#F8FBFF] rounded-[2rem] p-8 border border-[#E9F7FF] hover:shadow-xl hover:shadow-[#113A74]/10 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm border border-[#E9F7FF] group-hover:scale-110 transition-transform duration-500">
                                {v.icon}
                            </div>
                            <h3 className="font-bold text-[#113A74] text-lg font-heading mb-3">{v.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="bg-[#E9F7FF] py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 bg-white text-[#113A74] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-sm">The People Behind the Magic</span>
                        <h2 className="text-[28px] md:text-[42px] font-bold text-[#113A74] leading-tight font-heading">
                            Meet Our <span className="text-[#FFA500]">Team</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#113A74]/10 hover:-translate-y-1 transition-all duration-300 group text-center">
                                <div className="aspect-square overflow-hidden">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-[#113A74] text-sm font-heading mb-1">{member.name}</h3>
                                    <p className="text-[#FFA500] text-xs font-bold uppercase tracking-wider">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <AdventureSection />
            <GalleryLoop />
        </main>
    );
}
