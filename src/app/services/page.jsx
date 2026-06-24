"use client";

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Plane, Car, Ship, Hotel, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import { api } from '../../api/client';

const ICON_MAP = {
    Globe: <Globe size={32} />, Plane: <Plane size={32} />, Car: <Car size={32} />,
    Ship: <Ship size={32} />, Hotel: <Hotel size={32} />, FileText: <FileText size={32} />,
};

function getIcon(name) {
    return ICON_MAP[name] || <Globe size={32} />;
}

export default function ServicesPage() {
    const [cms, setCms] = useState(null);

    useEffect(() => {
        api.get('/specialty-pages/services')
            .then(res => { if (res.data?.data) setCms(res.data.data); })
            .catch(() => {});
    }, []);

    const services = cms?.items || [];
    const heroTitle1 = cms?.hero_title_1 || 'Our';
    const heroTitle2 = cms?.hero_title_2 || 'Services';
    const heroDesc = cms?.hero_description || '';
    const sectionTitle1 = cms?.items_title_1 || 'What We';
    const sectionTitle2 = cms?.items_title_2 || 'Offer';
    const sectionDesc = cms?.items_description || '';

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
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
                        <span>Home</span><span>›</span><span className="text-[#FFA500]">Services</span>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 container mx-auto px-4 md:px-12 lg:px-16">
                {(sectionTitle1 || sectionTitle2) && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-[#113A74]">
                            {sectionTitle1} <span className="text-[#FFA500]">{sectionTitle2}</span>
                        </h2>
                        {sectionDesc && <p className="text-gray-500 mt-3 max-w-xl mx-auto">{sectionDesc}</p>}
                    </div>
                )}

                {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((svc, i) => {
                            const featureList = svc.features
                                ? svc.features.split('\n').filter(Boolean)
                                : [];
                            return (
                                <div key={svc.id || i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#FFA500]/30 transition-all group flex flex-col">
                                    <div className="w-16 h-16 rounded-2xl bg-[#113A74]/5 flex items-center justify-center mb-5 text-[#113A74] group-hover:bg-[#FFA500]/10 group-hover:text-[#FFA500] transition-all overflow-hidden">
                                        {svc.img
                                            ? <img src={svc.img} alt={svc.name} className="w-full h-full object-cover rounded-2xl" />
                                            : getIcon(svc.icon)
                                        }
                                    </div>
                                    <h3 className="text-xl font-heading font-black text-[#113A74] mb-3">{svc.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{svc.desc}</p>
                                    {featureList.length > 0 && (
                                        <ul className="space-y-2 mb-6">
                                            {featureList.map((f, fi) => (
                                                <li key={fi} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle2 size={14} className="text-[#FFA500] shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {svc.cta_text && svc.cta_link && (
                                        <Link href={svc.cta_link} className="inline-flex items-center gap-2 text-[#113A74] font-black text-sm hover:text-[#FFA500] transition-colors mt-auto">
                                            {svc.cta_text} <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <Globe size={40} className="mx-auto mb-4 opacity-30" />
                        <p>Services coming soon.</p>
                    </div>
                )}
            </section>

            <AdventureSection />
            <GalleryLoop />
        </div>
    );
}
