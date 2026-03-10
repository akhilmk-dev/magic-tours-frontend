"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, LayoutGrid, List, ChevronDown, Clock, Minus, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';
import img1 from '../../assets/1.png';
import img2 from '../../assets/2.png';
import boathouseImg from '../../assets/Boathouse Neighborhood.png';
import bookingImg from '../../assets/booking-img.png';

const Sidebar = () => {
    const [travelers, setTravelers] = useState(1);

    return (
        <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 lg:sticky lg:top-24 self-start bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
            {/* Booking Promotion Image */}
            <div className="w-full rounded-[1.5rem] overflow-hidden">
                <img
                    src={bookingImg.src || bookingImg}
                    alt="Let's Book Your Ticket Right Now"
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* Top Filters: Inputs & Search */}
            <div className="flex flex-col gap-4 px-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-[#113A74]">Filters</h3>
                    <button className="text-[11px] font-bold text-[#113A74] hover:text-[#FFA500] transition-colors">Clear All</button>
                </div>

                <div className="flex flex-col gap-2">
                    {/* Location */}
                    <div className="flex flex-col px-4 py-2 rounded-full border border-slate-200 bg-white">
                        <label className="text-[10px] font-bold text-[#113A74] mb-0.5">Location</label>
                        <input type="text" placeholder="New Zealand" className="w-full text-[11px] text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0" />
                    </div>

                    {/* Activity Type */}
                    <div className="flex flex-col px-4 py-2 rounded-full border border-slate-200 bg-white">
                        <label className="text-[10px] font-bold text-[#113A74] mb-0.5">Activity Type</label>
                        <input type="text" placeholder="Adventure" className="w-full text-[11px] text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0" />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col px-4 py-2 rounded-full border border-slate-200 bg-white relative">
                        <label className="text-[10px] font-bold text-[#113A74] mb-0.5">Date</label>
                        <input type="text" placeholder="Date" className="w-full text-[11px] text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0" />
                        <Calendar size={12} className="text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* Time */}
                    <div className="flex flex-col px-4 py-2 rounded-full border border-slate-200 bg-white relative">
                        <label className="text-[10px] font-bold text-[#113A74] mb-0.5">Time</label>
                        <input type="text" placeholder="13:45" className="w-full text-[11px] text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0" />
                        <Clock size={12} className="text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* Traveler */}
                    <div className="flex items-center justify-between px-4 py-2 rounded-full border border-slate-200 bg-white">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-[#113A74] mb-0.5">Traveler</label>
                            <span className="text-[11px] text-slate-500 block">{travelers}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="hover:text-[#113A74] disabled:opacity-50 transition-colors p-1"><Minus size={10} /></button>
                            <button onClick={() => setTravelers(travelers + 1)} className="hover:text-[#113A74] transition-colors p-1"><Plus size={10} /></button>
                        </div>
                    </div>

                    {/* Top Search Button */}
                    <button className="w-full bg-[#113A74] text-white py-3 rounded-full font-bold flex items-center justify-between px-5 hover:bg-[#0d2a56] transition-colors shadow-md mt-1">
                        <span className="text-xs">Search</span>
                        <Search size={14} />
                    </button>
                </div>
            </div>

            <hr className="border-slate-100 my-0" />

            {/* Bottom Filters: Categories */}
            <div className="flex flex-col gap-4 px-1">
                {/* Cities */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                        <div className="w-1 h-5 bg-[#FFA500]" />
                        <h3 className="text-[#113A74] font-bold text-[11px] bg-[#eff6ff] px-2.5 py-1 ml-2">Cities</h3>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search ..."
                            className="w-full border border-slate-200 rounded-full py-2 px-4 text-[10px] outline-none focus:border-[#113A74]"
                        />
                        <Search size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    <div className="flex flex-col gap-2 mt-1">
                        {['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'].map(city => (
                            <label key={city} className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="w-3.5 h-3.5 rounded-[3px] border border-slate-200 flex items-center justify-center group-hover:border-[#113A74] transition-colors bg-white shadow-sm" />
                                <span className="text-[10px] font-semibold text-[#113A74] group-hover:text-[#FFA500] transition-colors">{city}</span>
                            </label>
                        ))}
                    </div>
                    <button className="text-left text-[10px] font-bold text-[#113A74] hover:text-[#FFA500] transition-colors mt-0.5">Show More...</button>
                </div>

                <hr className="border-slate-100" />

                {/* Duration */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                        <div className="w-1 h-5 bg-[#FFA500]" />
                        <h3 className="text-[#113A74] font-bold text-[11px] bg-[#eff6ff] px-2.5 py-1 ml-2">Duration (In Nights)</h3>
                    </div>

                    <div className="mt-2 px-1">
                        <div className="h-1 w-full bg-[#113A74] rounded-full relative">
                            <div className="absolute left-[8%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#FFA500] rounded-full shadow-sm cursor-pointer border border-white" />
                        </div>
                        <div className="flex justify-between items-center mt-2.5 text-[9px] font-bold text-[#113A74]">
                            <span>1 Night</span>
                            <span>2.00</span>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Type of Trip */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center mb-0.5">
                        <div className="w-1 h-5 bg-[#FFA500]" />
                        <h3 className="text-[#113A74] font-bold text-[11px] bg-[#eff6ff] px-2.5 py-1 ml-2">Type of Trip</h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        {['Wild life', 'Adventure', 'Desert', 'Culture'].map(trip => (
                            <label key={trip} className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="w-3.5 h-3.5 rounded-[3px] border border-slate-200 flex items-center justify-center group-hover:border-[#113A74] transition-colors bg-white shadow-sm" />
                                <span className="text-[10px] font-semibold text-[#113A74] group-hover:text-[#FFA500] transition-colors">{trip}</span>
                            </label>
                        ))}
                    </div>
                    <button className="text-left text-[10px] font-bold text-[#113A74] hover:text-[#FFA500] transition-colors mt-1">Show More...</button>
                </div>

                <div className="mt-2">
                    <button className="w-full bg-[#113A74] text-white py-2.5 rounded-full font-bold text-xs hover:bg-[#0d2a56] transition-colors shadow-md shadow-[#113A74]/20">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

const SortHeader = () => (
    <div className="flex flex-col md:flex-row items-center justify-end gap-3 mb-8">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm min-w-[200px] cursor-pointer hover:border-slate-300 transition-colors group">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-tight">Sort (Recently Added)</span>
            <ChevronDown size={14} className="text-slate-400 ml-auto group-hover:text-[#113A74] transition-colors" />
        </div>
        <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button className="p-2.5 text-[#113A74] bg-slate-50 border-r border-slate-200">
                <LayoutGrid size={16} />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-[#113A74] transition-colors">
                <List size={16} />
            </button>
        </div>
    </div>
);

const TourCard = ({ id, image, title, description, price }) => (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative aspect-[4/3] overflow-hidden font-sans">
            <img
                src={image.src || image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute top-3 left-0 bg-[#113A74] text-white px-3 py-1.5 rounded-r-lg flex items-center gap-2 text-[10px] font-bold shadow-lg">
                <Calendar size={12} className="opacity-90" />
                <span>6 days, 3 Nights</span>
            </div>

            <div className="absolute bottom-3 right-0 bg-[#FFA500] text-white px-4 py-1.5 rounded-l-full text-[10px] font-black shadow-lg">
                27% Off
            </div>
        </div>

        <div className="p-6 flex flex-col flex-1 text-left">
            <h3 className="text-lg md:text-xl font-bold text-[#113A74] mb-2 font-display tracking-tight leading-tight">
                {title}
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-6 font-medium line-clamp-2">
                {description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <Link
                    href={`/packages/${id || 1}`}
                    className="px-4 py-2 border border-slate-200 text-[#113A74] rounded-full text-[10px] font-bold hover:border-[#113A74] hover:bg-[#113A74] hover:text-white transition-all duration-300"
                >
                    Book Now
                </Link>
                <div className="text-right">
                    <div className="flex items-baseline gap-0.5 justify-end -mb-1">
                        <span className="text-[#FFA500] text-[10px] font-black uppercase">AED</span>
                        <span className="text-[#FFA500] text-2xl font-black tracking-tighter">{price}</span>
                    </div>
                    <p className="text-[#113A74] text-[9px] font-bold uppercase text-right mt-1">Per day</p>
                </div>
            </div>
        </div>
    </div>
);

const Pagination = () => (
    <div className="flex items-center justify-center gap-2 mt-12 mb-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] hover:bg-slate-50 transition-colors bg-white shadow-sm">
            <ChevronLeft size={16} strokeWidth={3} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-transparent text-[#113A74] font-extrabold hover:bg-white shadow-sm transition-colors">
            1
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-transparent text-[#113A74] font-extrabold hover:bg-white hover:shadow-sm transition-colors">
            2
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-transparent text-[#113A74] font-extrabold hover:bg-white hover:shadow-sm transition-colors">
            3
        </button>
        <div className="text-[#113A74] font-extrabold px-1">...</div>
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] hover:bg-slate-50 transition-colors bg-white shadow-sm">
            <ChevronRight size={16} strokeWidth={3} />
        </button>
    </div>
);

const Tours = () => {
    const tourData = [
        {
            id: 1,
            image: boathouseImg,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 2,
            image: img1,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 3,
            image: img2,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 4,
            image: img1,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 5,
            image: boathouseImg,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 6,
            image: img2,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 7,
            image: boathouseImg,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 8,
            image: img1,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 9,
            image: img2,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 10,
            image: img1,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 11,
            image: boathouseImg,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        },
        {
            id: 12,
            image: img2,
            title: "South Korea",
            description: "Sed ut perspiciatis unde omnis iste natus error sit volup laudan tium.",
            price: "59",
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Banner Section - Acting like Home Hero */}
            <section className="relative min-h-[80vh] lg:min-h-[85vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 m-0 p-0 font-sans border-none">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImg.src}
                        alt="Tours Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content - Centered like Hero */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20">

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">
                        Packages
                    </h1>

                    {/* Breadcrumbs */}
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-[0.05em]">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">
                            Home
                        </Link>
                        <span className="opacity-50">—</span>
                        <span>Tours & Packages</span>
                    </nav>
                </div>


                {/* Bottom Shape Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* Tours Layout Section (Sidebar + Grid) */}
            <section className="pt-24 pb-20 lg:pb-32 px-4 bg-[#E9F7FF] font-sans">
                <div className="max-w-7xl mx-auto">
                    <SortHeader />
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Sidebar Component */}
                        <Sidebar />

                        {/* Main Content Component */}
                        <div className="flex-1 min-w-0 px-2 md:px-6 lg:px-10">
                            {/* 3-Column Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {tourData.map((tour, index) => (
                                    <TourCard key={index} {...tour} />
                                ))}
                            </div>

                            {/* Pagination Component */}
                            <Pagination />
                        </div>
                    </div>
                </div>
            </section>

            {/* Shared Home Page Sections */}
            <AdventureSection />
            <div className="bg-[#E9F7FF]">
                <GalleryLoop loading={false} />
            </div>

        </main>
    );
};

export default Tours;
