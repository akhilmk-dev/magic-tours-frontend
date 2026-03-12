"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Compass, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../api/client';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';


const parseCategories = (cat) => {
    if (!cat) return [];
    if (Array.isArray(cat)) return cat;
    if (typeof cat === 'string') {
        try {
            const parsed = JSON.parse(cat);
            if (Array.isArray(parsed)) return parsed;
            return [cat];
        } catch (e) {
            return [cat];
        }
    }
    return [String(cat)];
};

const DestinationCardSkeleton = () => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col border border-slate-100 h-full animate-pulse">
        <div className="relative h-64 bg-slate-200 shrink-0"></div>
        <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 w-full">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
            </div>
            <div className="space-y-2 mb-6 flex-1">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-3 bg-slate-200 rounded w-4/5"></div>
            </div>
            <div className="bg-[#F8FBFF] rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                    <div className="space-y-1">
                        <div className="h-2 bg-slate-200 rounded w-12"></div>
                        <div className="h-3 bg-slate-200 rounded w-20"></div>
                    </div>
                </div>
            </div>
            <div className="h-10 bg-slate-200 rounded-full mt-5"></div>
        </div>
    </div>
);

const Pagination = ({ page, totalPages, setPage }) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <button key={i} onClick={() => setPage(i)} className={`w-10 h-10 flex items-center justify-center rounded-2xl font-extrabold transition-colors ${page === i ? 'bg-[#113A74] text-white shadow-md' : 'bg-transparent text-[#113A74] hover:bg-white hover:shadow-sm'}`}>
                {i}
            </button>
        );
    }
    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] hover:bg-slate-50 transition-colors bg-white shadow-sm disabled:opacity-50">
                <ChevronLeft size={16} strokeWidth={3} />
            </button>
            {pages}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] hover:bg-slate-50 transition-colors bg-white shadow-sm disabled:opacity-50">
                <ChevronRight size={16} strokeWidth={3} />
            </button>
        </div>
    );
};

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDestinations = async (activePage = page) => {
        setLoading(true);
        try {
            const response = await api.get(`/destinations/frontend/list?page=${activePage}&limit=12`);
            if (response.data) {
                setDestinations(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                }
            }
        } catch (error) {
            console.error("Failed to fetch destinations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations(page);
    }, [page]);

    return (
        <main className="min-h-screen bg-[#E9F7FF] font-sans">
            {/* Hero Banner Section */}
            <section className="relative min-h-[80vh] lg:min-h-[85vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 m-0 p-0 font-sans border-none">
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImg.src || bannerImg}
                        alt="Destinations Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">
                        Destinations
                    </h1>
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-[0.05em]">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">
                            Home
                        </Link>
                        <span className="opacity-50">—</span>
                        <span>Destinations</span>
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="pt-24 pb-20 lg:pb-32 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-[28px] md:text-[42px] font-bold text-brand-heading leading-tight mb-4">
                        Explore Our <span className="text-[#FFA500]">Top Destinations</span>
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Discover the world's most breathtaking locations carefully vetted for your next unforgettable journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => <DestinationCardSkeleton key={i} />)
                    ) : destinations.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 font-bold tracking-wider">No destinations found matching your criteria.</p>
                        </div>
                    ) : (
                        destinations.map((dest) => {
                            const categories = parseCategories(dest.categories);
                            return (
                                <div
                                    key={dest.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col border border-slate-100 h-full text-[13px]"
                                >
                                    {/* Image Header with Status and Categories */}
                                    <div className="relative h-48 overflow-hidden shrink-0">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        <div className="absolute top-3 left-3 flex gap-2 flex-wrap max-w-[70%]">
                                            {categories && categories.slice(0, 2).map((cat, i) => (
                                                <span key={i} className="bg-[#113A74]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#113A74]/90 to-transparent pointer-events-none" />

                                        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white z-10">
                                            <Compass size={15} className="text-[#FFA500]" />
                                            <span className="text-[13px] font-bold uppercase tracking-wider">{dest.continent}</span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 flex flex-col flex-1 text-left">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 title={dest.name} className="text-2xl font-bold text-[#113A74] font-display tracking-tight leading-none mb-1 group-hover:text-[#FFA500] transition-colors">
                                                    {dest.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                                    <MapPin size={12} className="text-[#FFA500]" />
                                                    {dest.country}
                                                </div>
                                            </div>
                                        </div>

                                        {dest.overview && (
                                            <p title={dest.overview} className="text-gray-500 text-[13px] leading-relaxed mb-4 line-clamp-2">
                                                {dest.overview}
                                            </p>
                                        )}

                                        {/* Bottom Info Fields */}
                                        <div className="bg-[#F8FBFF] rounded-xl p-3 flex flex-col gap-2.5 mt-auto">
                                            <div className="flex items-center gap-2.5">
                                                <div className="bg-white p-1 rounded-md shadow-sm border border-[#E9F7FF]">
                                                    <Calendar size={14} className="text-[#113A74]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0">Best Season</p>
                                                    <p className="text-xs text-[#113A74] font-bold">{dest.best_season || "Year Round"}</p>
                                                </div>
                                            </div>
                                            {dest.cities && dest.cities.length > 0 && (
                                                <div className="flex items-start gap-2.5">
                                                    <div className="bg-white p-1 rounded-md shadow-sm border border-[#E9F7FF] mt-0.5">
                                                        <Navigation size={14} className="text-[#113A74]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0">Key Cities</p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {dest.cities.slice(0, 2).map((city, idx) => (
                                                                <span key={idx} className="bg-white border border-[#E9F7FF] text-[#113A74] text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                                                                    {city.name}
                                                                </span>
                                                            ))}
                                                            {dest.cities.length > 2 && <span className="text-[11px] text-gray-400 font-bold">+{dest.cities.length - 2}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Link href={`/tours?destination_id=${dest.id}`} className="w-full mt-4 bg-white border border-[#113A74] text-[#113A74] py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#113A74] hover:text-white transition-all shadow-sm text-center">
                                            View Packages
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {!loading && (
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                )}
            </section>
        </main>
    );
}
