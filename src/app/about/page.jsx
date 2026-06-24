"use client";

export const runtime = 'edge';
import React, { useState, useEffect, useRef } from 'react';
import { Target, Eye, Heart } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';
import { api } from '../../api/client';

function AnimatedCounter({ target, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const end = Number(target) || 0;
                const duration = 1800;
                const step = Math.ceil(end / (duration / 16)) || 1;
                const timer = setInterval(() => {
                    setCount(prev => {
                        const next = Math.min(prev + step, end);
                        if (next >= end) clearInterval(timer);
                        return next;
                    });
                }, 16);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const FALLBACK_ICONS = { Target: <Target size={24} className="text-[#FFA500]" />, Eye: <Eye size={24} className="text-[#FFA500]" />, Heart: <Heart size={24} className="text-[#FFA500]" /> };
const valueIcons = [
    <Target key="t" size={24} className="text-[#FFA500]" />,
    <Eye key="e" size={24} className="text-[#FFA500]" />,
    <Heart key="h" size={24} className="text-[#FFA500]" />,
];

export default function AboutPage() {
    const [cms, setCms] = useState(null);

    useEffect(() => {
        api.get('/specialty-pages/about')
            .then(res => { if (res.data?.data) setCms(res.data.data); })
            .catch(() => {});
    }, []);

    const stats = cms?.highlights || [];
    const team = cms?.items || [];

    const values = [
        { icon: valueIcons[0], title: cms?.form_title_1 || 'Our Mission', desc: cms?.items_description || '' },
        { icon: valueIcons[1], title: cms?.form_title_2 || 'Our Vision', desc: cms?.form_description || '' },
        { icon: valueIcons[2], title: cms?.form_card_title_1 || 'Our Values', desc: cms?.form_card_description || '' },
    ];

    const heroTitle1 = cms?.hero_title_1 || 'About';
    const heroTitle2 = cms?.hero_title_2 || 'Magic Tours';
    const heroDesc = cms?.hero_description || '';
    const storyTitle1 = cms?.section_title_1 || 'Our';
    const storyTitle2 = cms?.section_title_2 || 'Story';
    const storyText = cms?.section_description || '';
    const storyImg = cms?.section_image || gutterImg.src;
    const valuesTitle1 = cms?.items_title_1 || 'Our';
    const valuesTitle2 = cms?.items_title_2 || 'Values';

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}
            <section
                className="relative min-h-[340px] md:min-h-[420px] flex items-center justify-center overflow-hidden"
                style={{ backgroundImage: `url(${cms?.hero_image || bannerImg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-[#113A74]/70" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-4">
                        {heroTitle1} <span className="text-[#FFA500]">{heroTitle2}</span>
                    </h1>
                    {heroDesc && <p className="text-white/80 text-lg max-w-2xl mx-auto">{heroDesc}</p>}
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/60">
                        <span>Home</span>
                        <span>›</span>
                        <span className="text-[#FFA500]">About</span>
                    </div>
                </div>
            </section>

            {/* Stats */}
            {stats.length > 0 && (
                <section className="bg-[#113A74] py-12">
                    <div className="container mx-auto px-4 md:px-12 lg:px-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {stats.map((s, i) => {
                                const numPart = parseInt(String(s.value).replace(/\D/g, '')) || 0;
                                const suffix = String(s.value).replace(/[0-9,]/g, '');
                                return (
                                    <div key={i}>
                                        <div className="text-4xl md:text-5xl font-heading font-black text-[#FFA500] mb-2">
                                            <AnimatedCounter target={numPart} suffix={suffix} />
                                        </div>
                                        <p className="text-white/70 text-sm font-medium">{s.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Story Section */}
            {(storyText || storyImg) && (
                <section className="py-20 container mx-auto px-4 md:px-12 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-heading font-black text-[#113A74] leading-tight mb-6">
                                {storyTitle1} <span className="text-[#FFA500]">{storyTitle2}</span>
                            </h2>
                            {storyText.split('\n').filter(Boolean).map((para, i) => (
                                <p key={i} className="text-gray-600 text-base leading-relaxed mb-4">{para}</p>
                            ))}
                        </div>
                        <div className="relative">
                            <img src={storyImg} alt="Our Story" className="rounded-3xl w-full object-cover shadow-2xl" />
                        </div>
                    </div>
                </section>
            )}

            {/* Values */}
            {(values[0].title || values[1].title || values[2].title) && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-12 lg:px-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-heading font-black text-[#113A74]">
                                {valuesTitle1} <span className="text-[#FFA500]">{valuesTitle2}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {values.filter(v => v.title || v.desc).map((v, i) => (
                                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">{v.icon}</div>
                                    <h3 className="text-xl font-heading font-black text-[#113A74] mb-3">{v.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Team */}
            {team.length > 0 && (
                <section className="py-20 container mx-auto px-4 md:px-12 lg:px-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-black text-[#113A74]">
                            Meet Our <span className="text-[#FFA500]">Team</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map((m, i) => (
                            <div key={m.id || i} className="text-center group">
                                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg group-hover:border-[#FFA500] transition-colors">
                                    {m.img
                                        ? <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full bg-[#113A74]/10 flex items-center justify-center text-[#113A74] font-black text-2xl">{(m.name || '?')[0]}</div>
                                    }
                                </div>
                                <h4 className="font-heading font-black text-[#113A74] text-sm">{m.name}</h4>
                                <p className="text-gray-500 text-xs mt-1">{m.role}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <AdventureSection />
            <GalleryLoop />
        </div>
    );
}
