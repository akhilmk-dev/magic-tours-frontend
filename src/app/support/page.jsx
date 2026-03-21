"use client";
import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, ShieldCheck, Award, Headphones } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';

const channels = [
    {
        icon: <Phone size={28} className="text-white" />,
        bg: 'bg-[#FFA500]',
        title: '24/7 Phone Support',
        desc: 'Speak directly with a travel expert, day or night.',
        detail: '+974 444 8888',
        link: 'tel:+9744448888',
        linkLabel: 'Call Now',
    },
    {
        icon: <MessageCircle size={28} className="text-white" />,
        bg: 'bg-[#25D366]',
        title: 'WhatsApp',
        desc: 'Message us on WhatsApp for quick answers and booking help.',
        detail: '+974 444 8888',
        link: 'https://wa.me/9744448888',
        linkLabel: 'Chat on WhatsApp',
    },
    {
        icon: <Mail size={28} className="text-white" />,
        bg: 'bg-[#113A74]',
        title: 'Email Support',
        desc: 'Drop us an email and we\'ll respond within 24 hours.',
        detail: 'support@magictours.com',
        link: 'mailto:support@magictours.com',
        linkLabel: 'Send Email',
    },
];

const trust = [
    {
        icon: <ShieldCheck size={24} className="text-[#FFA500]" />,
        title: 'IATA Certified',
        desc: 'Magic Tours is an IATA-accredited travel agency, meeting the highest global standards.',
    },
    {
        icon: <Award size={24} className="text-[#FFA500]" />,
        title: '10+ Years Experience',
        desc: 'Over a decade of crafting exceptional travel experiences for thousands of satisfied travellers.',
    },
    {
        icon: <Headphones size={24} className="text-[#FFA500]" />,
        title: 'Dedicated Support Team',
        desc: 'Our multilingual team is available around the clock to assist you at every step of your journey.',
    },
    {
        icon: <Clock size={24} className="text-[#FFA500]" />,
        title: 'Support Hours',
        desc: 'Phone & WhatsApp: 24/7. Email: Responses within 24 business hours. Office: Mon–Sat, 9 AM–6 PM.',
    },
];

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-white font-sans overflow-hidden">
            {/* Hero */}
            <section className="relative min-h-[70vh] lg:min-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src={bannerImg.src || bannerImg} alt="Support Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#E9F7FF]/20 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">
                        Customer Support
                    </h1>
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>Support</span>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* Contact Channels */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-28">
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-1.5 bg-[#eff6ff] text-[#113A74] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">We're Here for You</span>
                    <h2 className="text-[28px] md:text-[42px] font-bold text-[#113A74] leading-tight font-heading">
                        Get in Touch, <span className="text-[#FFA500]">Anytime</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-xl mx-auto mt-3 leading-relaxed">
                        Our dedicated support team is ready to assist you through whichever channel you prefer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {channels.map((ch, i) => (
                        <div key={i} className="bg-white rounded-[2rem] border-2 border-slate-100 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-[#113A74]/10 hover:-translate-y-1 transition-all duration-300 group">
                            <div className={`w-16 h-16 rounded-2xl ${ch.bg} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                {ch.icon}
                            </div>
                            <h3 className="text-lg font-bold text-[#113A74] font-heading mb-2">{ch.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">{ch.desc}</p>
                            <p className="text-[#113A74] font-extrabold text-sm mb-5">{ch.detail}</p>
                            <a
                                href={ch.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#113A74] hover:bg-[#1c4d91] text-white font-bold py-3 rounded-full text-sm transition-all shadow-md hover:shadow-[#113A74]/25"
                            >
                                {ch.linkLabel}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Trust & Safety */}
                <div className="text-center mb-12">
                    <h2 className="text-[24px] md:text-[36px] font-bold text-[#113A74] font-heading mb-2">Why Trust <span className="text-[#FFA500]">Magic Tours?</span></h2>
                    <p className="text-gray-400 text-sm max-w-lg mx-auto">We've built our reputation on transparency, reliability and genuine care for every traveller.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {trust.map((item, i) => (
                        <div key={i} className="flex items-start gap-5 bg-[#F8FBFF] rounded-[1.75rem] p-7 border border-[#E9F7FF] hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[#E9F7FF] flex-shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-[#113A74] mb-1">{item.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Link */}
                <div className="mt-16 text-center bg-gradient-to-r from-[#113A74] to-[#1c4d91] rounded-[2rem] p-10 text-white shadow-xl">
                    <h3 className="text-2xl font-heading font-bold mb-3">Looking for quick answers?</h3>
                    <p className="text-white/70 text-sm mb-6">Browse our FAQ for instant answers to the most common travel questions.</p>
                    <Link href="/faq" className="inline-block bg-[#FFA500] hover:bg-[#e09000] text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-[#FFA500]/30 text-sm">
                        Visit FAQ
                    </Link>
                </div>
            </section>

            <AdventureSection />
            <GalleryLoop />
        </main>
    );
}
