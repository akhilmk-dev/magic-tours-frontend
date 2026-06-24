"use client";

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, Clock, ShieldCheck, Award, Headphones, Star } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import { api } from '../../api/client';

const LUCIDE_MAP = {
    ShieldCheck, Award, Headphones, Clock, Star, Phone, Mail, MessageCircle,
};

function getBadgeIcon(name) {
    const Icon = LUCIDE_MAP[name] || ShieldCheck;
    return <Icon size={24} className="text-[#FFA500]" />;
}

export default function SupportPage() {
    const [cms, setCms] = useState(null);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/specialty-pages/support').then(r => r.data?.data).catch(() => null),
            api.get('/settings/public').then(r => r.data).catch(() => null),
        ]).then(([cmsData, settingsData]) => {
            if (cmsData) setCms(cmsData);
            if (settingsData) setSettings(settingsData);
        });
    }, []);

    const heroTitle1 = cms?.hero_title_1 || 'Get In';
    const heroTitle2 = cms?.hero_title_2 || 'Touch';
    const heroDesc = cms?.hero_description || '';
    const introText = cms?.section_description || '';
    const badges = cms?.items || [];

    const phone = settings?.footer_emergency_contact || settings?.contact_phone || '';
    const email = settings?.footer_email || settings?.contact_email || '';
    const whatsapp = settings?.whatsapp_number || phone;

    const contactChannels = [
        phone && {
            icon: <Phone size={28} className="text-[#FFA500]" />,
            label: 'Call Us',
            value: phone,
            href: `tel:${phone}`,
            cta: 'Call Now',
        },
        whatsapp && {
            icon: <MessageCircle size={28} className="text-[#FFA500]" />,
            label: 'WhatsApp',
            value: whatsapp,
            href: `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
            cta: 'Chat Now',
        },
        email && {
            icon: <Mail size={28} className="text-[#FFA500]" />,
            label: 'Email Us',
            value: email,
            href: `mailto:${email}`,
            cta: 'Send Email',
        },
    ].filter(Boolean);

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
                        <span>Home</span><span>›</span><span className="text-[#FFA500]">Support</span>
                    </div>
                </div>
            </section>

            {/* Contact Channels */}
            {contactChannels.length > 0 && (
                <section className="py-20 container mx-auto px-4 md:px-12 lg:px-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-black text-[#113A74]">
                            How Can We <span className="text-[#FFA500]">Help?</span>
                        </h2>
                        {introText && <p className="text-gray-500 mt-3 max-w-xl mx-auto">{introText}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {contactChannels.map((ch, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:border-[#FFA500]/30 transition-all group">
                                <div className="w-16 h-16 bg-[#113A74]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FFA500]/10 transition-all">
                                    {ch.icon}
                                </div>
                                <h3 className="font-heading font-black text-[#113A74] text-lg mb-2">{ch.label}</h3>
                                <p className="text-gray-500 text-sm mb-5 break-all">{ch.value}</p>
                                <a
                                    href={ch.href}
                                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#113A74] hover:bg-[#1a51a1] text-white rounded-xl px-6 py-2.5 font-black text-sm transition-all"
                                >
                                    {ch.cta}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Trust Badges */}
            {badges.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-12 lg:px-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {badges.map((b, i) => (
                                <div key={b.id || i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#FFA500]/10 rounded-xl flex items-center justify-center shrink-0">
                                        {getBadgeIcon(b.icon)}
                                    </div>
                                    <div>
                                        <h4 className="font-heading font-black text-[#113A74] text-sm mb-1">{b.name}</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <AdventureSection />
            <GalleryLoop />
        </div>
    );
}
