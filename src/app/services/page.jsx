"use client";

export const runtime = 'edge';
import React from 'react';
import Link from 'next/link';
import { Package, FileText, Car, Plane, Ship, Hotel, ArrowRight } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';

const services = [
    {
        icon: <Package size={30} className="text-[#FFA500]" />,
        title: 'Holiday Packages',
        desc: 'Discover our handpicked selection of holiday packages spanning the globe. From cultural city breaks to adventurous safaris, we have a perfect trip for every type of traveller.',
        features: ['All-inclusive options', 'Family-friendly itineraries', 'Budget to luxury tiers', 'Custom packages available'],
        link: '/tours',
        linkLabel: 'Browse Packages',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=70',
    },
    {
        icon: <FileText size={30} className="text-[#113A74]" />,
        title: 'Visa Services',
        desc: 'Expert visa assistance for over 100 countries. Our dedicated visa team handles every detail — from document preparation to application submission — so you can travel with peace of mind.',
        features: ['Tourist & business visas', 'Fast-track processing', 'Document preparation', 'Application tracking'],
        link: '/visa',
        linkLabel: 'Explore Visa Services',
        img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=70',
    },
    {
        icon: <Car size={30} className="text-[#FFA500]" />,
        title: 'International Driving License (IDL)',
        desc: 'Planning to drive abroad? We process International Driving Licenses quickly and affordably, accepted in over 150 countries worldwide.',
        features: ['Valid in 150+ countries', 'Quick processing', 'Online application', 'Multi-year validity'],
        link: '/idl',
        linkLabel: 'Apply for IDL',
        img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=70',
    },
    {
        icon: <Plane size={30} className="text-[#113A74]" />,
        title: 'Private Jets & Yachts',
        desc: 'Experience travel at the pinnacle of luxury. Charter a private jet for seamless point-to-point travel or a superyacht for an unforgettable voyage on the open seas.',
        features: ['Global jet charter', 'Luxury yacht hire', 'Bespoke itineraries', 'Dedicated concierge'],
        link: '/private-jets',
        linkLabel: 'Explore Luxury Travel',
        img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=70',
    },
    {
        icon: <Ship size={30} className="text-[#FFA500]" />,
        title: 'Luxury Cruises',
        desc: 'Set sail on the world\'s finest cruise lines. From Mediterranean escapes to Caribbean adventures, our cruise experts will guide you to the perfect voyage.',
        features: ['All major cruise lines', 'Cabin selection assistance', 'Shore excursion planning', 'Group & private bookings'],
        link: '/cruises',
        linkLabel: 'Browse Cruises',
        img: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=600&q=70',
    },
    {
        icon: <Hotel size={30} className="text-[#113A74]" />,
        title: 'Hotel Bookings',
        desc: 'From boutique hideaways to iconic five-star resorts, our hotel specialists negotiate exclusive rates and perks to make your stay truly special.',
        features: ['Exclusive member rates', '5-star & boutique hotels', 'Early check-in options', 'Loyalty point management'],
        link: '/hotels',
        linkLabel: 'Explore Hotels',
        img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70',
    },
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-white font-sans overflow-hidden">
            {/* Hero */}
            <section className="relative min-h-[70vh] lg:min-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src={bannerImg.src || bannerImg} alt="Services Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#E9F7FF]/20 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">Our Services</h1>
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>Services</span>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-28">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[#eff6ff] text-[#113A74] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">Everything You Need to Travel</span>
                    <h2 className="text-[28px] md:text-[42px] font-bold text-[#113A74] leading-tight font-heading">
                        Comprehensive <span className="text-[#FFA500]">Travel Solutions</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-2xl mx-auto mt-3 leading-relaxed">
                        From booking your dream holiday to sorting your visa and driving license — we offer everything under one roof.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {services.map((svc, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] border-2 border-slate-100 hover:border-[#FFA500]/30 overflow-hidden group hover:shadow-2xl hover:shadow-[#113A74]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            {/* Image */}
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={svc.img}
                                    alt={svc.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            {/* Body */}
                            <div className="p-7 flex flex-col flex-1">
                                <div className="w-14 h-14 bg-[#F8FBFF] rounded-2xl flex items-center justify-center mb-4 border border-[#E9F7FF] -mt-12 shadow-md group-hover:scale-110 transition-transform duration-500 bg-white">
                                    {svc.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#113A74] font-heading mb-3">{svc.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-5">{svc.desc}</p>
                                <ul className="space-y-1.5 mb-6 flex-1">
                                    {svc.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFA500] flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={svc.link}
                                    className="flex items-center justify-center gap-2 w-full bg-[#113A74] hover:bg-[#1c4d91] text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-md hover:shadow-[#113A74]/25 group/btn"
                                >
                                    {svc.linkLabel}
                                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <AdventureSection />
            <GalleryLoop />
        </main>
    );
}
