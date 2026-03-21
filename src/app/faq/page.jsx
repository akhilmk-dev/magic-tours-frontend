"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, BookOpen, CreditCard, Globe, MessageCircle } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';

const faqCategories = [
    {
        icon: <BookOpen size={20} className="text-[#FFA500]" />,
        label: 'Bookings',
        color: 'bg-orange-50',
        faqs: [
            { q: 'How do I book a tour package?', a: 'You can browse our tour listings and click "Book Now" on any package. You\'ll be guided through our easy checkout process. Alternatively, contact our team via phone or WhatsApp for personalized assistance.' },
            { q: 'Can I cancel or modify my booking?', a: 'Yes. Cancellations and modifications are subject to our cancellation policy outlined on each package page. We recommend reviewing the policy before booking. To request a change, contact our support team at least 48 hours in advance.' },
            { q: 'How far in advance should I book?', a: 'We recommend booking at least 2–4 weeks in advance, especially for peak travel seasons (Nov–Feb). However, last-minute bookings are sometimes possible — speak to our team for availability.' },
            { q: 'Are group bookings available?', a: 'Absolutely! We offer special pricing and custom packages for groups of 10 or more. Contact our team for a tailored group travel quote.' },
        ]
    },
    {
        icon: <CreditCard size={20} className="text-[#113A74]" />,
        label: 'Payments',
        color: 'bg-blue-50',
        faqs: [
            { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards, bank transfers, and selected digital wallets. All transactions are secured with industry-standard encryption.' },
            { q: 'Is a deposit required to confirm a booking?', a: 'A non-refundable deposit of 20–30% is typically required to confirm your booking, with the remainder due 14 days before departure. Exact terms are shown at checkout.' },
            { q: 'Do you offer installment plans?', a: 'Yes, for high-value packages we can arrange a payment plan. Please reach out to our team before completing your booking.' },
            { q: 'In what currency are prices displayed?', a: 'Prices are displayed in QAR by default. Our team can quote other currencies if needed. Final charges reflect the currency used at checkout.' },
        ]
    },
    {
        icon: <Globe size={20} className="text-[#FFA500]" />,
        label: 'Visa Services',
        color: 'bg-orange-50',
        faqs: [
            { q: 'Can Magic Tours handle my visa application?', a: 'Yes! We offer full visa support for many destinations. Our experts guide you through all required documentation and submit applications on your behalf.' },
            { q: 'How long does visa processing take?', a: 'Processing times vary per country and visa type — typically 3–15 working days. We advise starting the process well in advance to avoid travel disruption.' },
            { q: 'What documents are usually required for a visa?', a: 'Commonly required documents include a valid passport (6+ months validity), passport-sized photos, flight itinerary, hotel bookings, bank statements, and an application form. Our team will provide a tailored checklist.' },
            { q: 'What is an International Driving License (IDL)?', a: 'An IDL is an official document that allows you to drive in foreign countries where your national license may not be recognized. We process IDL applications quickly and affordably.' },
        ]
    },
    {
        icon: <MessageCircle size={20} className="text-[#113A74]" />,
        label: 'General',
        color: 'bg-blue-50',
        faqs: [
            { q: 'Does Magic Tours offer travel insurance?', a: 'We strongly recommend travel insurance for every trip. While we don\'t sell insurance directly, we can recommend trusted providers and advise on suitable coverage for your trip.' },
            { q: 'Are children welcome on tour packages?', a: 'Most of our packages are family-friendly. Package pages specify age restrictions where applicable. Contact us to check suitability and to ask about child discounts.' },
            { q: 'How do I contact customer support?', a: 'You can reach us by phone, email, WhatsApp, or by visiting our office in Doha. Our support page contains all contact channels and operating hours.' },
            { q: 'Can I request a custom itinerary?', a: 'Yes! Our Itinerary Builder lets you pick dates, preferences, and activities to create a personalised plan. We\'ll match you with the best packages and put together a bespoke proposal.' },
        ]
    }
];

const AccordionItem = ({ faq, isOpen, onToggle }) => (
    <div className={`border-b border-slate-100 last:border-none transition-all duration-300`}>
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center gap-4 py-5 text-left group"
        >
            <span className={`font-bold text-sm transition-colors ${isOpen ? 'text-[#FFA500]' : 'text-[#113A74] group-hover:text-[#FFA500]'}`}>
                {faq.q}
            </span>
            <ChevronDown
                size={18}
                className={`flex-shrink-0 text-[#113A74] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FFA500]' : ''}`}
            />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-5' : 'max-h-0'}`}>
            <p className="text-gray-500 text-sm leading-relaxed pr-6">{faq.a}</p>
        </div>
    </div>
);

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState(0);
    const [openIndex, setOpenIndex] = useState(null);
    const [search, setSearch] = useState('');

    const filtered = faqCategories[activeCategory].faqs.filter(f =>
        f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-white font-sans overflow-hidden">
            {/* Hero Banner */}
            <section className="relative min-h-[70vh] lg:min-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src={bannerImg.src || bannerImg} alt="FAQ Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#E9F7FF]/20 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">
                        Frequently Asked Questions
                    </h1>
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>FAQ</span>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* FAQ Content */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-28">
                {/* Search */}
                <div className="mb-12 max-w-xl mx-auto relative">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#113A74]/40" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setOpenIndex(null); }}
                        placeholder="Search questions..."
                        className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#113A74] outline-none text-sm font-bold text-[#113A74] bg-[#f8fafc] shadow-sm transition-all"
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {faqCategories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => { setActiveCategory(i); setOpenIndex(null); setSearch(''); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${activeCategory === i
                                ? 'bg-[#113A74] text-white border-[#113A74] shadow-lg'
                                : 'bg-white text-[#113A74] border-slate-100 hover:border-[#113A74]/30'}`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Accordion */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#113A74]/5 border border-slate-100 p-8 md:p-12">
                    {filtered.length > 0 ? filtered.map((faq, i) => (
                        <AccordionItem
                            key={i}
                            faq={faq}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    )) : (
                        <p className="text-center text-gray-400 py-10 font-bold">No questions found matching your search.</p>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center bg-gradient-to-r from-[#113A74] to-[#1c4d91] rounded-[2rem] p-10 text-white shadow-xl">
                    <h3 className="text-2xl font-heading font-bold mb-3">Still have questions?</h3>
                    <p className="text-white/70 text-sm mb-6">Our travel experts are happy to help you plan your perfect trip.</p>
                    <Link href="/support" className="inline-block bg-[#FFA500] hover:bg-[#e09000] text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-[#FFA500]/30 text-sm">
                        Contact Support
                    </Link>
                </div>
            </section>

            <AdventureSection />
            <GalleryLoop />
        </main>
    );
}
