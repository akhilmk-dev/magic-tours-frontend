"use client";

export const runtime = 'edge';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown, Minus, Plus, ChevronLeft, ChevronRight, Check, SlidersHorizontal, X, MapPin, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api/client';
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';
import bookingImg from '../../assets/booking-img.png';
import searchIcon from '../../assets/search.png';
import FavoriteButton from '../../components/common/FavoriteButton';
import { useCurrency } from '../../context/CurrencyContext';
import hotelsIcon from '../../assets/hotels_package_card.png';
import flightIcon from '../../assets/flight_icon_package_card.png';
import foodIcon from '../../assets/food_icon_package_card.png';

/* ─── Destination Filter Bar ──────────────────────────────── */
const DestinationBar = ({ filterData, filters, setFilters, onApply, search, setSearch, totalCount, viewMode, setViewMode, sort, setSort }) => {
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState('');
    const destinations  = filterData.destinations || [];

    // Extract unique continents from destinations
    const continents = [...new Set(destinations.map(d => d.continent).filter(Boolean))].sort();

    // Destinations for the selected continent
    const destinationsForContinent = selectedContinent
        ? destinations.filter(d => d.continent === selectedContinent)
        : [];

    const toggleContinent = (continent) => {
        if (selectedContinent === continent) {
            // Deselect continent — also clear destination
            setSelectedContinent('');
            const updated = { ...filters, destination: '', cities: [] };
            setFilters(updated);
            onApply(updated);
        } else {
            setSelectedContinent(continent);
            // Clear destination when switching continent
            const updated = { ...filters, destination: '', cities: [] };
            setFilters(updated);
            onApply(updated);
        }
    };

    const toggleDestination = (slug) => {
        const next    = filters.destination === slug ? '' : slug;
        const updated = { ...filters, destination: next, cities: [] };
        setFilters(updated);
        onApply(updated);
    };

    const CheckItem = ({ label, active, onToggle, color = '#113A74' }) => (
        <div
            className="flex items-center gap-2 cursor-pointer group select-none"
            onClick={onToggle}
        >
            <div className={`w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center transition-colors shrink-0`}
                style={{ backgroundColor: active ? color : 'white', borderColor: active ? color : '#cbd5e1' }}>
                {active && <Check size={9} strokeWidth={3} className="text-white" />}
            </div>
            <span className={`text-[13px] font-medium transition-colors whitespace-nowrap`}
                style={{ color: active ? color : '#64748b' }}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="mb-5">
            {/* White destination selector card */}
            <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2.5 border-b border-blue-100">
                    <span className="text-[#FFA500] font-bold text-[13px]">Destinations</span>
                </div>

                {/* Continent checkboxes */}
                <div className="px-4 py-3 flex flex-wrap gap-x-6 gap-y-2.5">
                    {continents.map(continent => (
                        <CheckItem
                            key={continent}
                            label={continent}
                            active={selectedContinent === continent}
                            onToggle={() => toggleContinent(continent)}
                            color="#113A74"
                        />
                    ))}
                </div>

                {/* Destinations sub-row — only when a continent is selected */}
                {selectedContinent && destinationsForContinent.length > 0 && (
                    <div className="px-4 py-3 border-t border-blue-50 bg-slate-50/50">
                        <p className="text-[#113A74] font-bold text-[12px] mb-2.5">{selectedContinent}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                            {destinationsForContinent.map(dest => (
                                <CheckItem
                                    key={dest.id}
                                    label={dest.name}
                                    active={filters.destination === dest.slug}
                                    onToggle={() => toggleDestination(dest.slug)}
                                    color="#113A74"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Search bar + sort + view toggle row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4">
                {/* packages count on the left */}
                <p className="text-[#113A74] font-bold text-[14px] shrink-0">
                    {totalCount} packages Found
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Search pill with inner Search button */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl pl-3 pr-1.5 py-1.5 shadow-sm flex-1 sm:w-[280px] md:w-[360px] lg:w-[420px]">
                    <img src={searchIcon.src || searchIcon} alt="search" className="w-4 h-4 shrink-0 opacity-50" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search Destinations, Packages ,Countries , Activities...."
                        className="flex-1 bg-transparent outline-none text-[12px] font-medium text-slate-500 placeholder:text-slate-400 min-w-0"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="text-slate-400 hover:text-[#113A74] mr-1">
                            <X size={13} />
                        </button>
                    )}
                    <button className="bg-[#113A74] text-white text-[12px] font-bold px-5 py-2 rounded-lg shrink-0 hover:bg-[#0d2a56] transition-colors">
                        Search
                    </button>
                </div>

                {/* Sort dropdown */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => setSortOpen(p => !p)}
                        className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
                    >
                        <span className="text-slate-500 text-[12px] font-bold whitespace-nowrap">
                            Sort ({SORT_OPTIONS.find(o => o.value === sort)?.label || 'Recently Added'})
                        </span>
                        <ChevronDown size={13} className={`text-slate-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortOpen && (
                        <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-colors ${sort === opt.value ? 'bg-[#113A74] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grid / List view toggle */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-[#113A74] border-[#113A74] text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-[#113A74] hover:text-[#113A74]'}`}
                    >
                        <LayoutGrid size={15} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${viewMode === 'list' ? 'bg-[#113A74] border-[#113A74] text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-[#113A74] hover:text-[#113A74]'}`}
                    >
                        <List size={15} />
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Sidebar (no destination dropdown) ──────────────────── */
const CATEGORY_INITIAL_COUNT = 4;

const Sidebar = ({ filters, setFilters, onApply, filterData, onClose, showPromo = true }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [showMoreCats, setShowMoreCats] = useState(false);
    useEffect(() => { setLocalFilters(filters); }, [filters]);

    const toggleCategory = (catId) => {
        setLocalFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(catId)
                ? prev.categories.filter(c => c !== catId)
                : [...prev.categories, catId]
        }));
    };

    const handleApply = () => { setFilters(localFilters); onApply(localFilters); };
    const handleClear = () => {
        const cleared = { destination: filters.destination, cities: filters.cities, categories: [], travelers: 1, minNights: '', maxNights: '', departure_date: '' };
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
                className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${checked ? 'bg-[#113A74] border-[#113A74]' : 'border-slate-200 group-hover:border-[#113A74] bg-white'} shadow-sm`}
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

            <div className="flex flex-col gap-4 px-1">
                {/* No of Days */}
                <FilterSection title="No of Days">
                    <div className="mt-1 px-1">
                        <div className="relative">
                            <input
                                type="range" min="0" max="30"
                                value={localFilters.maxNights || 0}
                                onChange={e => setLocalFilters(prev => ({ ...prev, maxNights: parseInt(e.target.value) }))}
                                className="w-full accent-[#FFA500] cursor-pointer"
                                style={{
                                    height: '3px',
                                    background: `linear-gradient(to right, #113A74 ${((localFilters.maxNights || 0) / 30) * 100}%, #e2e8f0 ${((localFilters.maxNights || 0) / 30) * 100}%)`
                                }}
                            />
                            <div className="flex justify-between items-center mt-1.5">
                                <span className="text-[9px] font-bold text-[#113A74]">0 Days</span>
                                <span className="text-[9px] font-bold text-[#113A74]">{localFilters.maxNights || 0} days</span>
                            </div>
                        </div>
                    </div>
                </FilterSection>

                <hr className="border-slate-100" />

                {/* Type of Trip */}
                <FilterSection title="Type of Trip">
                    <div className="flex flex-col gap-2 mt-1">
                        {filterData.categories.slice(0, CATEGORY_INITIAL_COUNT).map(cat => (
                            <CheckItem
                                key={cat.id}
                                label={cat.name}
                                checked={localFilters.categories.includes(cat.id)}
                                onChange={() => toggleCategory(cat.id)}
                            />
                        ))}
                        {/* Extra categories — only visible after "Show more" */}
                        {showMoreCats && filterData.categories.slice(CATEGORY_INITIAL_COUNT).map(cat => (
                            <CheckItem
                                key={cat.id}
                                label={cat.name}
                                checked={localFilters.categories.includes(cat.id)}
                                onChange={() => toggleCategory(cat.id)}
                            />
                        ))}
                        {filterData.categories.length > CATEGORY_INITIAL_COUNT && (
                            <button
                                onClick={() => setShowMoreCats(p => !p)}
                                className="text-[10px] font-bold text-[#FFA500] hover:text-[#113A74] transition-colors text-left mt-1 w-fit"
                            >
                                {showMoreCats ? 'Show less' : `Show more`}
                            </button>
                        )}
                    </div>
                </FilterSection>

                <div className="mt-2">
                    <button onClick={handleApply} className="w-full bg-[#113A74] text-white py-3 rounded-full font-heading font-bold text-sm hover:bg-[#0d2a56] transition-all shadow-md active:scale-95">Apply</button>
                </div>
            </div>
        </div>
    );
};

/* ─── Sort header ─────────────────────────────────────────── */
const SORT_OPTIONS = [
    { value: 'newest',     label: 'Recently Added' },
    { value: 'price_low',  label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
];

const SortHeader = ({ onOpenFilters }) => {
    return (
        <div className="flex items-center justify-between mb-6 gap-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#113A74] tracking-tight">
                Available <span className="text-[#FFA500]">Tour Packages</span>
            </h2>
            <button
                onClick={onOpenFilters}
                className="lg:hidden flex items-center gap-2 bg-[#113A74] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-heading font-bold shadow-lg shadow-[#113A74]/20 active:scale-95 transition-all"
            >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
            </button>
        </div>
    );
};

/* ─── Tour Card ───────────────────────────────────────────── */
const TourCard = ({ id, slug, image, title, package_name, description, price, days, nights, slots, cities, hotels_included, flights_included, has_food, airline_name, airline_logo, operated_by_name, operated_by_logo, viewMode = 'grid' }) => {
    // Normalise cities: production API returns [{id,name}], future backend returns strings
    const cityNames = (cities || []).map(c => (typeof c === 'string' ? c : c?.name)).filter(Boolean);
    const router = useRouter();
    const { formatPrice } = useCurrency();

    if (viewMode === 'list') {
        return (
            <div
                onClick={() => router.push(`/packages/${slug || id}`)}
                className="cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-row h-[140px] sm:h-[170px] md:h-[200px] hover:shadow-xl transition-all duration-300 group"
            >
                <div className="relative w-[110px] sm:w-[170px] md:w-[220px] lg:w-[260px] shrink-0 overflow-hidden">
                    <img src={image} alt={title || package_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-0 bg-[#113A74] text-white px-2 sm:px-3 py-1 rounded-r-lg flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold">
                        <Calendar size={10} />
                        <span>{nights}N / {days}d</span>
                    </div>
                </div>
                <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-between min-w-0">
                    <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#113A74] group-hover:text-[#FFA500] transition-colors line-clamp-1 mb-1">{title || package_name}</h3>
                        {cityNames.length > 0 && (
                            <p className="text-slate-400 text-[10px] sm:text-[11px] font-medium mb-1 line-clamp-1">{cityNames.join(' | ')}</p>
                        )}
                        {slots !== undefined && <span className="text-[10px] sm:text-[11px] font-bold text-[#FFA500] bg-orange-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md inline-block mb-1 sm:mb-2">{slots} Slots</span>}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/packages/${slug || id}?book=true`); }}
                            className="px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 border border-[#113A74] text-[#113A74] rounded-full text-xs sm:text-sm font-bold hover:bg-[#113A74] hover:text-white transition-all shrink-0"
                        >Book Now</button>
                        <div className="text-right">
                            <span className="text-[#FFA500] text-base sm:text-lg md:text-xl font-black">{formatPrice(price)}</span>
                            <p className="text-[#113A74] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-70">onwards</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => router.push(`/packages/${slug || id}`)}
            className="cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img src={image} alt={title || package_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <FavoriteButton packageId={id} className="absolute top-3 right-3 z-20" />
                <div className="absolute top-3 left-0 bg-[#113A74] text-white px-3 py-1.5 rounded-r-lg flex items-center gap-2 text-xs font-bold shadow-lg">
                    <Calendar size={13} className="opacity-90" />
                    <span>{nights} Nights, {days} Days</span>
                </div>
                <div className="absolute bottom-3 right-0 bg-[#FFA500] text-white px-4 py-1.5 rounded-l-full text-xs font-black shadow-lg">27% Off</div>
                {/* Airline + Operated by overlay — visible on hover */}
                {(airline_name || operated_by_name) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {airline_name && (
                            <div className="flex items-center gap-2 text-white text-[11px] font-philosopher mb-1">
                                {airline_logo
                                    ? <img src={airline_logo} alt={airline_name} className="w-4 h-4 object-contain rounded-sm shrink-0" />
                                    : <Plane size={12} className="shrink-0" />}
                                <span>Airline : {airline_name}</span>
                            </div>
                        )}
                        {operated_by_name && (
                            <p className="text-white/90 text-[11px] font-philosopher">
                                Operated by : {operated_by_name}
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="p-4 sm:p-5 flex flex-col flex-1 gap-1">
                <h3 title={title || package_name} className="text-lg md:text-xl font-bold text-[#113A74] font-display tracking-tight leading-tight group-hover:text-[#FFA500] transition-colors line-clamp-2">{title || package_name}</h3>
                {cityNames.length > 0 && (
                    <p className="text-slate-400 text-[12px] font-medium line-clamp-1 leading-snug">
                        {cityNames.join(' | ')}
                    </p>
                )}
                {(hotels_included || flights_included || has_food) && (
                    <div className="flex items-center gap-2 py-1">
                        {hotels_included  && <img src={hotelsIcon.src || hotelsIcon} alt="Hotel included"  className="w-5 h-5 object-contain" />}
                        {flights_included && <img src={flightIcon.src || flightIcon} alt="Flight included" className="w-5 h-5 object-contain" />}
                        {has_food         && <img src={foodIcon.src  || foodIcon}   alt="Food included"   className="w-5 h-5 object-contain" />}
                    </div>
                )}
                <div className="flex items-center justify-between gap-3 mt-auto pt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/packages/${slug || id}?book=true`); }}
                        className="px-6 py-2.5 border border-[#113A74] text-[#113A74] rounded-full text-sm font-heading font-bold hover:bg-[#113A74] hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                    >Book Now</button>
                    <div className="text-right">
                        <span className="text-[#FFA500] text-2xl font-black leading-none">{formatPrice(price)}</span>
                        <p className="text-[#113A74] text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-90">onwards</p>
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
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 bg-white shadow-sm"><ChevronLeft size={16} strokeWidth={3} /></button>
            {pages.map(i => (
                <button key={i} onClick={() => setPage(i)} className={`w-10 h-10 flex items-center justify-center rounded-2xl font-extrabold transition-colors ${page === i ? 'bg-[#113A74] text-white shadow-md' : 'bg-transparent text-[#113A74] hover:bg-white'}`}>{i}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 bg-white shadow-sm"><ChevronRight size={16} strokeWidth={3} /></button>
        </div>
    );
};

/* ─── Main page ───────────────────────────────────────────── */
const ToursContent = () => {
    const searchParams  = useSearchParams();
    const urlDestination = searchParams.get('destination') || '';
    const urlSearch      = searchParams.get('search') || '';

    const [packages,    setPackages]    = useState([]);
    const [images,      setImages]      = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [page,        setPage]        = useState(1);
    const [totalPages,  setTotalPages]  = useState(1);
    const [totalCount,  setTotalCount]  = useState(0);
    const [filters,     setFilters]     = useState({ destination: urlDestination, cities: [], categories: [], travelers: 1, maxNights: '', departure_date: '' });
    const [filterData,  setFilterData]  = useState({ destinations: [], cities: [], categories: [] });
    const [sort,        setSort]        = useState('newest');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [headerData,  setHeaderData]  = useState({ title: "Our Packages", description: "" });
    const [search,      setSearch]      = useState(urlSearch);
    const [viewMode,    setViewMode]    = useState('grid');

    useEffect(() => {
        api.get('/packages/frontend/filters')
            .then(data => setFilterData({ destinations: data.destinations || [], cities: data.cities || [], categories: data.categories || [] }))
            .catch(e => console.error('Filters failed', e));
    }, []);

    useEffect(() => {
        if (filters.destination && filterData.destinations.length > 0) {
            const d = filterData.destinations.find(x => x.slug === filters.destination);
            if (d) {
                setHeaderData({ title: d.meta_title || d.name || "Our Packages", description: d.meta_description || "" });
                document.title = `${d.meta_title || d.name} | Magic Tours`;
            }
        } else {
            setHeaderData({ title: "Our Packages", description: "" });
            document.title = "Our Packages | Magic Tours";
        }
    }, [filters.destination, filterData.destinations]);

    const fetchPackages = async (activeFilters = filters, activePage = page, activeSort = sort) => {
        setLoading(true);
        try {
            let url = `/packages/frontend/list?page=${activePage}&limit=6&sort=${activeSort}`;
            if (activeFilters.destination)          url += `&destination_slug=${activeFilters.destination}`;
            if (activeFilters.cities.length > 0)    url += `&city_id=${activeFilters.cities.join(',')}`;
            if (activeFilters.categories.length > 0) url += `&category=${activeFilters.categories.join(',')}`;
            if (activeFilters.maxNights)             url += `&nights=${activeFilters.maxNights}`;
            if (activeFilters.travelers > 1)         url += `&slots=${activeFilters.travelers}`;
            if (activeFilters.departure_date)        url += `&departure_date=${activeFilters.departure_date}`;
            const res = await api.get(url);
            if (res.data) {
                setPackages(res.data);
                setImages(res.images || []);
                setTotalPages(res.pagination?.totalPages || 1);
                setTotalCount(res.pagination?.total || res.data.length || 0);
            }
        } catch (e) { console.error('Packages failed', e); }
        finally { setLoading(false); }
    };

    const filteredPackages = packages.filter(pkg => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return pkg.title?.toLowerCase().includes(q) || pkg.package_name?.toLowerCase().includes(q) || pkg.description?.toLowerCase().includes(q);
    });

    useEffect(() => {
        const urlDest = searchParams.get('destination') || '';
        const urlSrch = searchParams.get('search') || '';
        if (urlDest !== filters.destination) { setFilters(prev => ({ ...prev, destination: urlDest })); setPage(1); }
        if (urlSrch !== search) setSearch(urlSrch);
    }, [searchParams]);

    useEffect(() => { fetchPackages(filters, page, sort); }, [page, sort, filters.destination]);

    const handleApplyFilters = (f) => { setFilters(f); setPage(1); fetchPackages(f, 1, sort); setIsSidebarOpen(false); };
    const handleSortChange   = (s) => { setSort(s); setPage(1); fetchPackages(filters, 1, s); };

    return (
        <main className="min-h-screen bg-white">
            {/* ── Hero banner (no search bar) ── */}
            <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src={bannerImg.src} alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center mt-20 flex flex-col items-center gap-5">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-0 tracking-tight drop-shadow-sm font-heading">
                        {headerData.title}
                    </h1>
                    {headerData.description && (
                        <p className="text-[#113A74]/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
                            {headerData.description}
                        </p>
                    )}
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

            {/* ── Content ── */}
            <section className="pt-24 pb-20 lg:pb-32 px-4 bg-[#E9F7FF] font-sans">
                <div className="max-w-7xl mx-auto">

                    <SortHeader onOpenFilters={() => setIsSidebarOpen(true)} />

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block shrink-0">
                            <Sidebar filters={filters} setFilters={setFilters} onApply={handleApplyFilters} filterData={filterData} />
                        </div>

                        {/* Mobile Sidebar Drawer */}
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden"
                                    />
                                    <motion.div
                                        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[1000] lg:hidden overflow-y-auto p-4"
                                    >
                                        <Sidebar
                                            filters={filters} setFilters={setFilters}
                                            onApply={handleApplyFilters} filterData={filterData}
                                            onClose={() => setIsSidebarOpen(false)} showPromo={false}
                                        />
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Cards column — destination bar sits here, aligned with packages */}
                        <div className="flex-1 min-w-0">

                            {/* Destination filter bar — same width as packages grid */}
                            <DestinationBar
                                filterData={filterData}
                                filters={filters}
                                setFilters={setFilters}
                                onApply={handleApplyFilters}
                                search={search}
                                setSearch={setSearch}
                                totalCount={totalCount}
                                viewMode={viewMode}
                                setViewMode={setViewMode}
                            />

                            <div className={viewMode === 'list'
                                ? 'flex flex-col gap-6'
                                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                            }>
                                {loading
                                    ? [...Array(6)].map((_, i) => <TourCardSkeleton key={i} />)
                                    : filteredPackages.length > 0
                                        ? filteredPackages.map(pkg => <TourCard key={pkg.id} {...pkg} viewMode={viewMode} />)
                                        : <div className="col-span-full py-20 text-center font-bold text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">No packages found.</div>
                                }
                            </div>
                            {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
                            <div className="lg:hidden mt-8 w-full rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                                <img src={bookingImg.src || bookingImg} alt="Promo" className="w-full h-auto object-cover" />
                            </div>

                        </div>{/* end cards column */}
                    </div>{/* end flex row */}
                </div>
            </section>

            <AdventureSection />
            <div className="bg-[#E9F7FF]"><GalleryLoop images={images} loading={loading} /></div>
        </main>
    );
};

/* ─── Skeleton ────────────────────────────────────────────── */
const ToursPageSkeleton = () => (
    <main className="min-h-screen bg-white">
        <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 animate-pulse">
            <div className="absolute inset-0 bg-slate-200" />
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-20 flex flex-col items-center">
                <div className="h-16 md:h-20 lg:h-24 w-2/3 max-w-[500px] bg-slate-300 rounded-[2rem] mb-6" />
                <div className="h-4 w-48 bg-slate-300 rounded-full" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                <img src={gutterImg.src} alt="" className="w-full h-auto block opacity-50" />
            </div>
        </section>
        <section className="pt-24 pb-20 lg:pb-32 px-4 bg-[#E9F7FF] font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl h-24 mb-6 animate-pulse" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
                </div>
                <div className="flex gap-8 items-start">
                    <div className="hidden lg:block w-[300px] h-[600px] bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse shrink-0" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => <TourCardSkeleton key={i} />)}
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
