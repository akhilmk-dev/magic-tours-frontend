"use client";

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import { api } from '../../api/client';

function Accordion({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border rounded-2xl overflow-hidden transition-all ${open ? 'border-[#FFA500]/40 shadow-sm' : 'border-gray-100'}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
                <span className="font-heading font-black text-[#113A74] text-sm leading-snug">{q}</span>
                <ChevronDown size={18} className={`text-[#FFA500] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function FaqPage() {
    const [cms, setCms] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        api.get('/specialty-pages/faq')
            .then(res => { if (res.data?.data) setCms(res.data.data); })
            .catch(() => {});
    }, []);

    const categories = cms?.items || [];
    const heroTitle1 = cms?.hero_title_1 || 'Frequently';
    const heroTitle2 = cms?.hero_title_2 || 'Asked Questions';
    const heroDesc = cms?.hero_description || '';

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
                        <span>Home</span><span>›</span><span className="text-[#FFA500]">FAQ</span>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20 container mx-auto px-4 md:px-12 lg:px-16">
                {categories.length > 0 ? (
                    <>
                        {/* Category Tabs */}
                        {categories.length > 1 && (
                            <div className="flex flex-wrap gap-3 justify-center mb-10">
                                {categories.map((cat, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTab(i)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-black transition-all ${
                                            activeTab === i
                                                ? 'bg-[#113A74] text-white shadow-lg shadow-[#113A74]/20'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Q&A Accordions */}
                        <div className="max-w-3xl mx-auto space-y-3">
                            {(categories[activeTab]?.faqs || []).length > 0 ? (
                                (categories[activeTab]?.faqs || []).map((faq, i) => (
                                    <Accordion key={i} q={faq.q} a={faq.a} />
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <HelpCircle size={32} className="mx-auto mb-3 opacity-30" />
                                    <p>No questions in this category yet.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <HelpCircle size={40} className="mx-auto mb-4 opacity-30" />
                        <p>FAQs coming soon.</p>
                    </div>
                )}
            </section>

            <AdventureSection />
            <GalleryLoop />
        </div>
    );
}
