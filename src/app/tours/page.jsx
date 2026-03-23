"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, LayoutGrid, List, ChevronDown, Minus, Plus, ChevronLeft, ChevronRight, Check, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api/client';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';
import bookingImg from '../../assets/booking-img.png';
import FavoriteButton from '../../components/common/FavoriteButton';
import { useCurrency } from '../../context/CurrencyContext';

const Sidebar = ({ filters, setFilters, onApply, filterData, filterLoading, onClose, showPromo = true }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => { setLocalFilters(filters); }, [filters]);

    const toggleCity = (cityId) => {
        setLocalFilters(prev => ({
            ...prev,
            cities: prev.cities.includes(cityId)
                ? prev.cities.filter(c => c !== cityId)
                : [...prev.cities, cityId]
        }));
    };

    const toggleCategory = (catId) => {
        setLocalFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(catId)
                ? prev.categories.filter(c => c !== catId)
                : [...prev.categories, catId]
        }));
    };

    const handleApply = () => {
        setFilters(localFilters);
        onApply(localFilters);
    };

    const handleClear = () => {
        const cleared = { destination: '', cities: [], categories: [], travelers: 1, minNights: '', maxNights: '', departure_date: '' };
        setLocalFilters(cleared);
        setFilters(cleared);
        onApply(cleared);
    };

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

    return (
        <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 lg:sticky lg:top-24 self-start bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
            {showPromo && (
                <div className="w-full rounded-[1.5rem] overflow-hidden">
                    <img src={bookingImg.src || bookingImg} alt="Promo" className="w-full h-auto object-cover" />
                </div>
            )}

            <div className="flex items-center justify-between px-1">
                <h3 className="text-[15px] font-bold text-[#113A74]">Filters</h3>
                <div className="flex items-center gap-4">
                    <button onClick={handleClear} className="text-[11px] font-bold text-[#113A74] hover:text-[#FFA500] transition-colors">Clear All</button>
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden p-1.5 bg-slate-100 rounded-full text-[#113A74]">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="px-1">
                <div className="flex flex-col px-4 py-2 rounded-full border border-slate-200 bg-white relative">
                    <label className="text-[10px] font-bold text-[#113A74] mb-0.5">Destination</label>
                    <div className="relative">
                        <select
                            value={localFilters.destination}
                            onChange={e => setLocalFilters(prev => ({ ...prev, destination: e.target.value }))}
                            className="w-full text-[11px] text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0 appearance-none pr-5 cursor-pointer font-bold"
                        >
                            <option value="">All Destinations</option>
                            {filterData.destinations.map(d => (
                                <option key={d.id} value={d.slug || d.id}>{d.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={11} className="text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="px-1">
                <div className="flex flex-col px-4 py-2 rounded-full border border-slate-200 bg-white relative">
                    <label className="text-[10px] font-bold text-[#113A74] mb-0.5">Date</label>
                    <input
                        type="date"
                        value={localFilters.departure_date}
                        onChange={e => setLocalFilters(prev => ({ ...prev, departure_date: e.target.value }))}
                        onClick={(e) => e.target.showPicker ? e.target.showPicker() : null}
                        onFocus={(e) => e.target.showPicker ? e.target.showPicker() : null}
                        className="w-full text-[11px] text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer font-bold"
                    />
                </div>
            </div>

            <div className="px-1">
                <div className="flex items-center justify-between px-4 py-2 rounded-full border border-slate-200 bg-white">
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-[#113A74] mb-0.5">Traveler</label>
                        <span className="text-[11px] text-slate-500 block font-bold">{localFilters.travelers} Slots</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button onClick={() => setLocalFilters(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))} className="hover:text-[#113A74] p-1"><Minus size={10} /></button>
                        <button onClick={() => setLocalFilters(prev => ({ ...prev, travelers: prev.travelers + 1 }))} className="hover:text-[#113A74] p-1"><Plus size={10} /></button>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100 my-0" />

            <div className="flex flex-col gap-4 px-1">
                <FilterSection title="Cities">
                    <div className="flex flex-col gap-2 mt-1">
                        {filterData.cities.filter(c => !localFilters.destination || c.destination_id === localFilters.destination).map(city => (
                            <CheckItem
                                key={city.id}
                                label={city.name}
                                checked={localFilters.cities.includes(city.id)}
                                onChange={() => toggleCity(city.id)}
                            />
                        ))}
                    </div>
                </FilterSection>

                <hr className="border-slate-100" />

                <FilterSection title="Duration (Nights)">
                    <div className="mt-1 px-1">
                        <input
                            type="range"
                            min="0"
                            max="30"
                            value={localFilters.maxNights || 0}
                            onChange={e => setLocalFilters(prev => ({ ...prev, maxNights: parseInt(e.target.value) }))}
                            className="w-full accent-[#FFA500] cursor-pointer h-1"
                        />
                        <div className="flex justify-between items-center mt-2 text-[9px] font-bold text-[#113A74]">
                            <span>{localFilters.maxNights > 0 ? `Up to ${localFilters.maxNights} Nights` : 'Any Duration'}</span>
                            <span>{localFilters.maxNights || 0}</span>
                        </div>
                    </div>
                </FilterSection>

                <hr className="border-slate-100" />

                <FilterSection title="Type of Trip">
                    <div className="flex flex-col gap-2 mt-1">
                        {filterData.categories.map(cat => (
                            <CheckItem
                                key={cat.id}
                                label={cat.name}
                                checked={localFilters.categories.includes(cat.id)}
                                onChange={() => toggleCategory(cat.id)}
                            />
                        ))}
                    </div>
                </FilterSection>

                <div className="mt-2 text-center lg:text-left">
                    <button onClick={handleApply} className="w-full bg-[#113A74] text-white py-3 rounded-full font-heading font-bold text-sm hover:bg-[#0d2a56] transition-all shadow-md active:scale-95">Apply Filters</button>
                </div>
            </div>
        </div>
    );
};

const SORT_OPTIONS = [
    { value: 'newest', label: 'Recently Added' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
];

const SortHeader = ({ sort, setSort, onOpenFilters }) => {
    const [open, setOpen] = useState(false);
    const currentLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort';
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl md:text-2xl font-bold text-[#113A74] tracking-tight">Available <span className="text-[#FFA500]">Tour Packages</span></h2>
                <button
                    onClick={onOpenFilters}
                    className="lg:hidden flex items-center gap-2 bg-[#113A74] text-white px-5 py-2.5 rounded-xl text-sm font-heading font-bold shadow-lg shadow-[#113A74]/20 active:scale-95 transition-all"
                >
                    <SlidersHorizontal size={14} />
                    <span>Filters</span>
                </button>
            </div>
            <div className="relative shrink-0">
                <button
                    onClick={() => setOpen(prev => !prev)}
                    className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm min-w-[200px] cursor-pointer hover:border-slate-300 transition-colors group"
                >
                    <span className="text-slate-500 text-[12px] font-heading font-bold">Sort ({currentLabel})</span>
                    <ChevronDown size={14} className={`text-slate-400 ml-auto transition-all ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                    <div className="absolute top-full right-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        {SORT_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => { setSort(opt.value); setOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-colors ${sort === opt.value ? 'bg-[#113A74] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const TourCard = ({ id, slug, image, title, package_name, description, price, days, nights, slots, currency = 'AED' }) => {
    const router = useRouter();
    const { formatPrice } = useCurrency();
    return (
        <div 
            onClick={() => router.push(`/packages/${slug || id}`)}
            className="cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img src={image} alt={title || package_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <FavoriteButton 
                    packageId={id} 
                    className="absolute top-3 right-3 z-20"
                />
                <div className="absolute top-3 left-0 bg-[#113A74] text-white px-3 py-1.5 rounded-r-lg flex items-center gap-2 text-xs font-bold shadow-lg">
                    <Calendar size={13} className="opacity-90" />
                    <span>{days} days, {nights} Nights</span>
                </div>
                <div className="absolute bottom-3 right-0 bg-[#FFA500] text-white px-4 py-1.5 rounded-l-full text-xs font-black shadow-lg">27% Off</div>

            </div>
            <div className="p-6 flex flex-col flex-1">
                <h3 title={title || package_name} className="text-xl md:text-2xl font-bold text-[#113A74] mb-2 font-display tracking-tight leading-tight group-hover:text-[#FFA500] transition-colors line-clamp-2 min-h-[50px]">{title || package_name}</h3>
                {slots !== undefined && <div className="text-xs font-bold text-[#FFA500] bg-orange-50 px-3 py-1.5 rounded-md mb-2 w-fit">{slots} Slots Available</div>}
                <p title={description} className="text-slate-400 text-[13px] leading-relaxed mb-6 font-medium line-clamp-2">{description || "Experience the best of travel with curated packages."}</p>
                <div className="flex flex-col gap-4 mt-auto">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/packages/${slug || id}?book=true`);
                        }}
                        className="w-fit px-8 py-2.5 border border-[#113A74] text-[#113A74] rounded-full text-sm font-heading font-bold hover:bg-[#113A74] hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        Book Now
                    </button>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-0.5"><span className="text-[#FFA500] text-2xl font-black leading-none">{formatPrice(price)}</span></div>
                        <p className="text-[#113A74] text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">onwards</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TourCardSkeleton = () => (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-[400px] animate-pulse">
        <div className="relative aspect-[4/3] bg-slate-200"></div>
        <div className="p-6 flex flex-col flex-1">
            <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 w-1/3 bg-slate-200 rounded mb-4"></div>
            <div className="h-10 w-full bg-slate-200 rounded-full mt-auto"></div>
        </div>
    </div>
);

const Pagination = ({ page, totalPages, setPage }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 transition-colors bg-white shadow-sm"><ChevronLeft size={16} strokeWidth={3} /></button>
            {pages.map(i => (
                <button key={i} onClick={() => setPage(i)} className={`w-10 h-10 flex items-center justify-center rounded-2xl font-extrabold transition-colors ${page === i ? 'bg-[#113A74] text-white shadow-md' : 'bg-transparent text-[#113A74] hover:bg-white'}`}>{i}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 transition-colors bg-white shadow-sm"><ChevronRight size={16} strokeWidth={3} /></button>
        </div>
    );
};

const ToursContent = () => {
    const searchParams = useSearchParams();
    const urlDestination = searchParams.get('destination') || '';

    const [packages, setPackages] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ destination: urlDestination, cities: [], categories: [], travelers: 1, maxNights: '', departure_date: '' });
    const [filterData, setFilterData] = useState({ destinations: [], cities: [], categories: [] });
    const [sort, setSort] = useState('newest');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const data = await api.get('/packages/frontend/filters');
                setFilterData({ destinations: data.destinations || [], cities: data.cities || [], categories: data.categories || [] });
            } catch (e) { console.error('Filters failed', e); }
        };
        fetchFilters();
    }, []);

    const fetchPackages = async (activeFilters = filters, activePage = page, activeSort = sort) => {
        setLoading(true);
        try {
            let url = `/packages/frontend/list?page=${activePage}&limit=6&sort=${activeSort}`;
            if (activeFilters.destination) url += `&destination_slug=${activeFilters.destination}`;
            if (activeFilters.cities.length > 0) url += `&city_id=${activeFilters.cities.join(',')}`;
            if (activeFilters.categories.length > 0) url += `&category=${activeFilters.categories.join(',')}`;
            if (activeFilters.maxNights) url += `&nights=${activeFilters.maxNights}`;
            if (activeFilters.travelers > 1) url += `&slots=${activeFilters.travelers}`;
            if (activeFilters.departure_date) url += `&departure_date=${activeFilters.departure_date}`;

            const res = await api.get(url);
            if (res.data) {
                setPackages(res.data);
                setImages(res.images || []);
                setTotalPages(res.pagination?.totalPages || 1);
            }
        } catch (e) { console.error('Packages failed', e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchPackages(filters, page, sort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort, filters.destination]);

    const handleApplyFilters = (f) => {
        setFilters(f);
        setPage(1);
        fetchPackages(f, 1, sort);
        setIsSidebarOpen(false);
    };
    const handleSortChange = (s) => { setSort(s); setPage(1); fetchPackages(filters, 1, s); };

    return (
        <main className="min-h-screen bg-white">
            <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src={bannerImg.src} alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-20 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">Our Packages</h1>
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-wider">
                        <Link href="/" className="hover:text-[#FFA500]">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>Tour Packages</span>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src} alt="" className="w-full h-auto block" />
                </div>
            </section>

            <section className="pt-24 pb-20 lg:pb-32 px-4 bg-[#E9F7FF] font-sans">
                <div className="max-w-7xl mx-auto">
                    <SortHeader sort={sort} setSort={handleSortChange} onOpenFilters={() => setIsSidebarOpen(true)} />
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block shrink-0">
                            <Sidebar filters={filters} setFilters={setFilters} onApply={handleApplyFilters} filterData={filterData} filterLoading={false} />
                        </div>

                        {/* Mobile Sidebar / Drawer */}
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden"
                                    />
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: 0 }}
                                        exit={{ x: '-100%' }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[1000] lg:hidden overflow-y-auto p-4"
                                    >
                                        <Sidebar
                                            filters={filters}
                                            setFilters={setFilters}
                                            onApply={handleApplyFilters}
                                            filterData={filterData}
                                            filterLoading={false}
                                            onClose={() => setIsSidebarOpen(false)}
                                            showPromo={false}
                                        />
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 min-w-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {loading ? [...Array(6)].map((_, i) => <TourCardSkeleton key={i} />) :
                                    packages.length > 0 ? packages.map(pkg => <TourCard key={pkg.id} {...pkg} />) :
                                        <div className="col-span-full py-20 text-center font-bold text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">No packages found.</div>}
                            </div>
                            {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}

                            {/* Mobile Promo Banner - Restored to original behavior */}
                            <div className="lg:hidden mt-8 w-full rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                                <img src={bookingImg.src || bookingImg} alt="Promo" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <AdventureSection />
            <div className="bg-[#E9F7FF]"><GalleryLoop images={images} loading={loading} /></div>
        </main>
    );
};

const ToursPageSkeleton = () => (
    <main className="min-h-screen bg-white">
        {/* Banner Skeleton */}
        <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 animate-pulse">
            <div className="absolute inset-0 bg-slate-200"></div>
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-20 flex flex-col items-center">
                <div className="h-16 md:h-20 lg:h-24 w-2/3 max-w-[500px] bg-slate-300 rounded-[2rem] mb-6"></div>
                <div className="h-4 w-48 bg-slate-300 rounded-full"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                <img src={gutterImg.src} alt="" className="w-full h-auto block opacity-50" />
            </div>
        </section>

        {/* Content Skeleton */}
        <section className="pt-24 pb-20 lg:pb-32 px-4 bg-[#E9F7FF] font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="h-8 md:h-10 w-1/2 max-w-[300px] bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="h-10 w-[200px] bg-slate-200 rounded-xl animate-pulse shrink-0"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Skeleton */}
                    <div className="hidden lg:block shrink-0 w-[300px] xl:w-[320px] h-[700px] bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse" />

                    {/* Cards Grid Skeleton */}
                    <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <TourCardSkeleton key={'page-skel-'+i} />)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
);

export default function Tours() {
    return (
        <Suspense fallback={<ToursPageSkeleton />}>
            <ToursContent />
        </Suspense>
    );
}
