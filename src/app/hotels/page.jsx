"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Globe, Wifi, Coffee, Wind, Tv, ChevronLeft, ChevronRight, Search as SearchIcon, Check } from 'lucide-react';
import { api } from '../../api/client';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';
import bookingImg from '../../assets/booking-img.png';
import backgroundImg from '../../assets/Background.png';

// Components
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';

const FilterSection = ({ title, children }) => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center">
            <div className="w-1 h-5 bg-[#FFA500]" />
            <h3 className="text-[#113A74] font-bold text-[11px] bg-[#eff6ff] px-2.5 py-1 ml-2 uppercase tracking-wider">{title}</h3>
        </div>
        {children}
    </div>
);

const CheckItem = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group">
        <div
            onClick={onChange}
            className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${checked ? 'bg-[#113A74] border-[#113A74]' : 'border-slate-200 group-hover:border-[#113A74] bg-white'
                } shadow-sm`}
        >
            {checked && <Check size={9} strokeWidth={3} className="text-white" />}
        </div>
        <span className="text-[10px] font-semibold text-[#113A74] group-hover:text-[#FFA500] transition-colors">{label}</span>
    </label>
);

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

const HotelCardSkeleton = () => (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full animate-pulse">
        <div className="relative h-48 bg-slate-200 shrink-0"></div>
        <div className="p-5 flex flex-col flex-1">
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-1.5 mb-4">
                <div className="h-2.5 bg-slate-200 rounded w-full"></div>
                <div className="h-2.5 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="flex gap-2 mb-4">
                <div className="h-5 w-14 bg-slate-200 rounded-full"></div>
                <div className="h-5 w-14 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    </div>
);

const HotelCard = ({ name, country, city_name, overview, facilities, categories: rawCategories, images, hotel_logo_image }) => {
    const categories = parseCategories(rawCategories);
    // Map facilities text to icons if possible
    const iconMap = {
        "Free Wifi": <Wifi size={14} />,
        "Breakfast": <Coffee size={14} />,
        "AC": <Wind size={14} />,
        "TV": <Tv size={14} />
    };

    return (
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col border border-slate-100 h-full">
            {/* Image Header */}
            <div className="relative h-48 overflow-hidden shrink-0">
                <img
                    src={images?.[0] || images}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Logo Overlay - Only on Hover */}
                {hotel_logo_image && (
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md p-1 shadow-lg border border-white/50 z-10 flex items-center justify-center overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <img src={hotel_logo_image} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                )}

                <div className="absolute top-3 right-3 flex gap-2">
                    {categories?.map((cat, i) => (
                        <span key={i} className="bg-[#FFA500] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-lg">
                            {cat}
                        </span>
                    ))}
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#113A74]/80 to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-5 flex items-center gap-2 text-white z-10">
                    <Globe size={13} className="text-[#FFA500]" />
                    <span className="text-xs font-bold uppercase tracking-wider">{country}</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1 text-left">
                <div className="mb-3">
                    <h3 title={name} className="text-xl md:text-2xl font-bold text-[#113A74] font-display tracking-tight leading-tight mb-1 group-hover:text-[#FFA500] transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <MapPin size={12} className="text-[#FFA500]" />
                        {city_name}, {country}
                    </div>
                </div>

                <p title={overview} className="text-gray-500 text-[13px] leading-relaxed mb-4 line-clamp-2">
                    {overview}
                </p>

                {/* Facilities */}
                {facilities && Array.isArray(facilities) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {facilities.slice(0, 3).map((fac, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-[#f8fafc] text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold border border-slate-50 hover:bg-[#113A74] hover:text-white transition-all cursor-default group/fac">
                                <span className="text-[#FFA500] group-hover/fac:text-white transition-colors">{iconMap[fac] || <Globe size={10} />}</span>
                                <span>{fac}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Pagination = ({ page, totalPages, setPage }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex items-center justify-center gap-2 mt-10 mb-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 transition-colors bg-white shadow-sm hover:shadow-md">
                <ChevronLeft size={14} strokeWidth={3} />
            </button>
            {pages.map(i => (
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-9 h-9 flex items-center justify-center rounded-2xl font-extrabold transition-all duration-300 text-xs ${page === i ? 'bg-[#113A74] text-white shadow-lg scale-110' : 'bg-transparent text-[#113A74] hover:bg-white hover:shadow-sm'}`}
                >
                    {i}
                </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 transition-colors bg-white shadow-sm hover:shadow-md">
                <ChevronRight size={14} strokeWidth={3} />
            </button>
        </div>
    );
};

function HotelsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [hotels, setHotels] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || "");
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || "");
    const [cityId, setCityId] = useState(searchParams.get('city_id') || "");
    const [cityInput, setCityInput] = useState(searchParams.get('city_id') ? searchParams.get('city_id').split(',') : []);

    const fetchHotels = async (activePage = page, searchQuery = search, activeCity = cityId) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: activePage,
                limit: 12,
                search: searchQuery,
            });
            if (activeCity) queryParams.append('city_id', activeCity);

            const response = await api.get(`/hotels/frontend/list?${queryParams.toString()}`);
            if (response.data) {
                setHotels(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                }
            }
        } catch (error) {
            console.error("Failed to fetch hotels", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get('/cities');
                if (Array.isArray(response)) {
                    setCities(response);
                } else if (response.data && Array.isArray(response.data)) {
                    setCities(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch cities", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const querySearch = searchParams.get('search') || "";
        const queryCity = searchParams.get('city_id') || "";

        if (querySearch !== search) {
            setSearch(querySearch);
            setSearchInput(querySearch);
        }
        if (queryCity !== cityId) {
            setCityId(queryCity);
            setCityInput(queryCity ? queryCity.split(',') : []);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchHotels(page, search, cityId);
    }, [page, search, cityId]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const cityIdString = cityInput.join(',');
        setSearch(searchInput);
        setCityId(cityIdString);
        setPage(1);

        const params = new URLSearchParams();
        if (searchInput) params.set('search', searchInput);
        if (cityIdString) params.set('city_id', cityIdString);

        router.push(`/hotels?${params.toString()}`, { scroll: false });
    };

    const handleClear = () => {
        setSearchInput("");
        setSearch("");
        setCityInput([]);
        setCityId("");
        setPage(1);
        router.push('/hotels', { scroll: false });
    };

    // Search Debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                setSearch(searchInput);
                setPage(1);
                const params = new URLSearchParams(window.location.search);
                if (searchInput) params.set('search', searchInput);
                else params.delete('search');
                // Keep city_id if it exists
                if (cityId) params.set('city_id', cityId);
                router.push(`/hotels?${params.toString()}`, { scroll: false });
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchInput, search, cityId, router]);

    const toggleCity = (id) => {
        setCityInput(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    return (
        <main className="min-h-screen bg-[#E9F7FF] font-sans pb-20">
            {/* Hero Banner Section */}
            <section className="relative min-h-[80vh] lg:min-h-[85vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 m-0 p-0 font-sans border-none">
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImg.src || bannerImg}
                        alt="Hotels Banner"
                        className="w-full h-full object-cover scale-105"
                    />
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">
                        Hotels
                    </h1>
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>Hotels</span>
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="pt-24 px-4 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sidebar Area */}
                    <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-24 space-y-6">
                        {/* Search Sidebar Box */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[#113A74] font-bold font-heading text-lg flex items-center gap-2">
                                    <div className="w-1 h-5 bg-[#FFA500]" />
                                    Find a Hotel
                                </h4>
                                <button
                                    onClick={handleClear}
                                    className="text-[11px] font-bold text-[#113A74] hover:text-[#FFA500] transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search hotel name..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="w-full bg-[#f4f7f9] rounded-full py-3.5 px-6 text-[11px] font-bold outline-none placeholder:text-gray-400 border border-transparent focus:border-[#113A74]/10 transition-colors"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#113A74] text-white p-2 rounded-full hover:bg-[#FFA500] transition-colors">
                                        <SearchIcon size={16} />
                                    </button>
                                </div>

                                <FilterSection title="Cities">
                                    <div className="flex flex-col gap-2.5 mt-2 bg-[#f8fafc]/50 p-4 rounded-3xl border border-slate-50">
                                        {cities.length > 0 ? cities.map(city => (
                                            <CheckItem
                                                key={city.id}
                                                label={city.name}
                                                checked={cityInput.includes(city.id)}
                                                onChange={() => toggleCity(city.id)}
                                            />
                                        )) : (
                                            <div className="text-[10px] text-slate-400 font-bold italic">Loading cities...</div>
                                        )}
                                    </div>
                                </FilterSection>

                                <button type="submit" className="w-full bg-[#113A74] text-white py-3.5 rounded-full font-bold text-[11px] uppercase tracking-wider hover:bg-[#0d2a56] shadow-lg shadow-[#113A74]/10 mt-2 active:scale-95 transition-transform">
                                    Apply
                                </button>
                            </form>
                        </div>

                        {/* Promotion Banners */}
                        <div className="rounded-[2rem] overflow-hidden shadow-xl group border border-slate-100">
                            <img
                                src={bookingImg.src || bookingImg}
                                alt="Promo 1"
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-xl group border border-slate-100 tracking-tight">
                            <img
                                src={backgroundImg.src || backgroundImg}
                                alt="Promo 2"
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 aspect-[4/5]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#113A74]/80 to-transparent flex flex-col justify-end p-8 text-white">
                                <span className="bg-[#FFA500] text-black text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 text-center">LIMITED OFFER</span>
                                <h5 className="text-2xl font-bold leading-tight mb-2">Summer Luxury Retreats</h5>
                                <p className="text-xs text-white/80 font-medium text-left">Book now and get 30% off on premium suites worldwide.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Hotels Grid Area */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => <HotelCardSkeleton key={i} />)}
                            </div>
                        ) : hotels.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {hotels.map((hotel, idx) => (
                                        <HotelCard key={hotel.id || idx} {...hotel} />
                                    ))}
                                </div>
                                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <SearchIcon size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-[#113A74] mb-2">No Hotels Found</h3>
                                <p className="text-slate-400">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Adventure Section */}
            <AdventureSection />

            {/* Gallery Loop Section */}
            <GalleryLoop />
        </main>
    );
}

export default function HotelsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#E9F7FF] flex items-center justify-center font-bold text-[#113A74]">Loading Filters...</div>}>
            <HotelsContent />
        </Suspense>
    );
}
