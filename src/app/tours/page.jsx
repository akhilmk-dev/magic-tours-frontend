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
import { toTitleCase } from '../../utils/textUtils';
import hotelsIcon from '../../assets/hotels_package_card.png';
import flightIcon from '../../assets/flight_icon_package_card.png';
import foodIcon from '../../assets/food_icon_package_card.png';
import airlineTailIcon from '../../assets/airline_tail_icon.png';

/* ─── Destination Filter Bar ──────────────────────────────── */
const DestinationBar = ({ filterData, filters, setFilters, onApply, search, setSearch, totalCount, viewMode, setViewMode, sort, setSort }) => {
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedContinents, setSelectedContinents] = useState([]);
    const destinations = filterData.destinations || [];

    // Extract unique continents from destinations
    const continents = [...new Set(destinations.map(d => d.continent).filter(Boolean))].sort();

    // Destinations belonging to any selected continent
    const visibleDestinations = selectedContinents.length > 0
        ? destinations.filter(d => selectedContinents.includes(d.continent))
        : [];

    const toggleContinent = (continent) => {
        const isSelected = selectedContinents.includes(continent);
        const newContinents = isSelected
            ? selectedContinents.filter(c => c !== continent)
            : [...selectedContinents, continent];
        setSelectedContinents(newContinents);

        if (isSelected) {
            // Remove destinations that belong to the deselected continent
            const removed = destinations.filter(d => d.continent === continent).map(d => d.slug);
            const newDest = (filters.destination || []).filter(s => !removed.includes(s));
            const updated = { ...filters, destination: newDest };
            setFilters(updated);
            onApply(updated);
        }
    };

    const toggleDestination = (slug) => {
        const current = filters.destination || [];
        const next = current.includes(slug)
            ? current.filter(s => s !== slug)
            : [...current, slug];
        const updated = { ...filters, destination: next, cities: [] };
        setFilters(updated);
        onApply(updated);
    };

    const CheckItem = ({ label, active, onToggle, color = '#113A74' }) => (
        <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={onToggle}
        >
            <div className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-colors shrink-0`}
                style={{ backgroundColor: active ? color : 'white', borderColor: active ? color : '#cbd5e1' }}>
                {active && <Check size={12} strokeWidth={3} className="text-white" />}
            </div>
            <span className="text-[14px] font-sans font-light whitespace-nowrap" style={{ color }}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="mb-5">
            {/* White destination selector card */}
            <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3 border-b border-blue-100">
                    <span className="text-[#FFA500] font-sans font-bold text-[17px]">Destinations</span>
                </div>

                {/* Continent checkboxes — multi-select */}
                <div className="px-4 sm:px-5 py-3 sm:py-4 flex flex-wrap gap-x-4 sm:gap-x-8 gap-y-2.5 sm:gap-y-3">
                    {continents.map(continent => (
                        <CheckItem
                            key={continent}
                            label={continent}
                            active={selectedContinents.includes(continent)}
                            onToggle={() => toggleContinent(continent)}
                            color="#113A74"
                        />
                    ))}
                </div>

                {/* Destinations sub-row — one group per selected continent */}
                {selectedContinents.length > 0 && visibleDestinations.length > 0 && (
                    <div>
                        {selectedContinents.map((continent) => {
                            const contDests = destinations.filter(d => d.continent === continent);
                            if (contDests.length === 0) return null;
                            return (
                                <div key={continent} className="px-4 sm:px-5 pb-3 sm:pb-4">
                                    {/* Inline label with a hairline on both sides */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="h-px w-4 bg-blue-100 shrink-0" />
                                        <span className="text-slate-700 font-sans font-medium text-[14px] shrink-0">{continent}</span>
                                        <span className="h-px flex-1 bg-blue-100" />
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 sm:gap-x-8 gap-y-2.5 sm:gap-y-3">
                                        {contDests.map(dest => (
                                            <CheckItem
                                                key={dest.id}
                                                label={dest.name}
                                                active={(filters.destination || []).includes(dest.slug)}
                                                onToggle={() => toggleDestination(dest.slug)}
                                                color="#113A74"
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Sort + count + search + view toggle */}
            <div className="flex flex-col gap-4 mt-4">

                {/* Row 1: Sort pill — right aligned */}
                <div className="flex justify-end">
                    <div className="relative">
                        <button
                            onClick={() => setSortOpen(p => !p)}
                            className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
                        >
                            <span className="text-black text-[14px] font-sans-force whitespace-nowrap">
                                Sort ({SORT_OPTIONS.find(o => o.value === sort)?.label || 'Recently Added'})
                            </span>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {sortOpen && (
                            <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                        className={`font-sans-force w-full text-left px-4 py-2.5 text-[14px] transition-colors ${sort === opt.value ? 'bg-[#113A74] text-white' : 'text-[#113A74] hover:bg-slate-50'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 2: count (left) + search + view toggle (right) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center justify-between gap-3">
                        {(filters.destination?.length > 0 || filters.cities.length > 0 || filters.categories.length > 0 || filters.maxNights || filters.travelers > 1 || filters.departure_date || search.trim()) && (
                            <p className="text-black font-sans font-bold text-[16px] sm:text-[18px] shrink-0">
                                {totalCount} packages Found
                            </p>
                        )}
                        {/* View toggle — inline with count on mobile */}
                        <div className="flex items-center gap-1 shrink-0 sm:hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-[#113A74] border-[#113A74] text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${viewMode === 'list' ? 'bg-[#113A74] border-[#113A74] text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Search + view toggle — grouped to the right with a gap from the count */}
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto sm:max-w-[560px] sm:flex-1">
                        {/* Search pill */}
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl pl-3 pr-1.5 py-1.5 shadow-sm flex-1 min-w-0">
                            <img src={searchIcon.src || searchIcon} alt="search" className="w-4 h-4 shrink-0 opacity-50" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search packages…"
                                className="flex-1 bg-transparent outline-none text-[13px] font-sans font-medium text-slate-500 placeholder:text-slate-400 min-w-0"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-[#113A74] mr-1 shrink-0">
                                    <X size={13} />
                                </button>
                            )}
                            <button className="bg-[#113A74] text-white text-[13px] font-sans font-bold px-3.5 sm:px-5 py-2 rounded-lg shrink-0 hover:bg-[#0d2a56] transition-colors">
                                Search
                            </button>
                        </div>

                        {/* Grid / List view toggle — desktop only (mobile shows it next to count) */}
                        <div className="hidden sm:flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-[#113A74] border-[#113A74] text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-[#113A74] hover:text-[#113A74]'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${viewMode === 'list' ? 'bg-[#113A74] border-[#113A74] text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-[#113A74] hover:text-[#113A74]'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>
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
            <div className="flex items-stretch">
                <div className="w-1.5 bg-[#FFA500] rounded-sm shrink-0" />
                <h3 className="text-[#113A74] font-sans font-normal text-[18px] bg-[#eff6ff] pl-3 pr-16 py-2.5">{title}</h3>
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
            <span className="text-[15px] font-sans font-semibold text-[#113A74]">{label}</span>
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
                <h3 className="text-[18px] font-sans font-bold text-black">Filters</h3>
                <div className="flex items-center gap-4">
                    <button onClick={handleClear} className="text-[13px] font-sans font-bold text-[#113A74] hover:text-[#FFA500] transition-colors">Clear All</button>
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
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[12px] font-sans text-slate-400">Any duration</span>
                            <span className="text-[13px] font-sans font-bold text-[#113A74]">
                                {(localFilters.maxNights || 0) === 0 ? 'All' : `${localFilters.maxNights} days`}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[13px] font-sans text-black shrink-0">1</span>
                            <input
                                type="range" min="0" max="21"
                                value={localFilters.maxNights || 0}
                                onChange={e => setLocalFilters(prev => ({ ...prev, maxNights: parseInt(e.target.value) }))}
                                className="flex-1 min-w-0 accent-[#FFA500] cursor-pointer h-1.5 rounded-full appearance-none"
                                style={{
                                    background: `linear-gradient(to right, #113A74 ${((localFilters.maxNights || 0) / 21) * 100}%, #e2e8f0 ${((localFilters.maxNights || 0) / 21) * 100}%)`
                                }}
                            />
                            <span className="text-[13px] font-sans text-black shrink-0">21</span>
                        </div>
                    </div>
                </FilterSection>

                <hr className="border-slate-100" />

                {/* Type of Trip */}
                <FilterSection title="Type of Trip">
                    <div className="flex flex-col gap-5 mt-1">
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
                                className="text-[14px] font-sans font-bold text-[#113A74] hover:text-[#0d2a56] transition-colors text-left mt-2 w-fit"
                            >
                                {showMoreCats ? 'Show less' : `Show more`}
                            </button>
                        )}
                    </div>
                </FilterSection>

                <div className="mt-2">
                    <button onClick={handleApply} className="w-full bg-[#113A74] text-white py-3.5 rounded-full font-sans-force font-bold text-[16px] hover:bg-[#0d2a56] transition-all shadow-md active:scale-95">Apply</button>
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
        <div className="flex items-center justify-end mb-6 gap-3 lg:hidden">
            <button
                onClick={onOpenFilters}
                className="shrink-0 flex items-center gap-2 bg-[#113A74] text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[13px] font-sans font-bold shadow-lg shadow-[#113A74]/20 active:scale-95 transition-all"
            >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
            </button>
        </div>
    );
};

/* ─── City list with 3-row cap + tooltip ──────────────────── */
const CityList = ({ cityNames }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);
    const CITIES_PER_ROW = 3;
    const MAX_ROWS = 3;
    const visibleCities = cityNames.slice(0, CITIES_PER_ROW * MAX_ROWS);
    const hiddenCities  = cityNames.slice(CITIES_PER_ROW * MAX_ROWS);

    const rows = Array.from({ length: Math.ceil(visibleCities.length / CITIES_PER_ROW) }, (_, row) =>
        visibleCities.slice(row * CITIES_PER_ROW, row * CITIES_PER_ROW + CITIES_PER_ROW)
    );

    return (
        <div className="flex flex-col gap-0.5 mb-0.5">
            {rows.map((chunk, row) => (
                <p key={row} className="text-slate-400 text-[13px] font-medium leading-snug">
                    {chunk.map((city, i) => (
                        <span key={i}>
                            {city}
                            {i < chunk.length - 1 && <span className="mx-1 text-slate-300">|</span>}
                        </span>
                    ))}
                </p>
            ))}
            {hiddenCities.length > 0 && (
                <div className="relative inline-block">
                    <button
                        type="button"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={e => { e.stopPropagation(); setShowTooltip(v => !v); }}
                        className="text-[12px] font-bold text-[#113A74] bg-blue-50 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
                    >
                        +{hiddenCities.length} more
                    </button>
                    {showTooltip && (
                        <div className="absolute left-0 bottom-full mb-1.5 z-50 bg-[#113A74] text-white text-[12px] rounded-xl shadow-xl px-3 py-2 w-max max-w-[220px] leading-relaxed pointer-events-none">
                            {hiddenCities.join(' | ')}
                            <div className="absolute left-3 top-full w-2 h-2 bg-[#113A74] rotate-45 -translate-y-1" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── Tour Card ───────────────────────────────────────────── */
const TourCard = ({ id, slug, image, title, package_name, description, price, days, nights, slots, cities, hotels_included, flights_included, has_food, airlines, airline_name, operated_by_name, booking_type, viewMode = 'grid' }) => {
    const airlineList = airlines?.length ? airlines : (airline_name ? [{ name: airline_name }] : []);
    // Normalise cities: production API returns [{id,name}], future backend returns strings
    const cityNames = (cities || []).map(c => (typeof c === 'string' ? c : c?.name)).filter(Boolean);
    const router = useRouter();
    const { formatPrice } = useCurrency();

    if (viewMode === 'list') {
        return (
            <div
                onClick={() => router.push(`/packages/${slug || id}`)}
                className="cursor-pointer bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row hover:shadow-xl transition-all duration-300 group"
            >
                <div className="relative w-full h-[180px] sm:w-[160px] sm:h-auto md:w-[220px] lg:w-[260px] shrink-0 overflow-hidden">
                    <img src={image} alt={title || package_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-0 bg-[#113A74] text-white px-3 sm:px-4 py-1.5 rounded-r-lg flex items-center gap-1.5 sm:gap-2 text-[14px] font-bold shadow-md">
                        <Calendar size={12} />
                        <span>{nights}N / {days}d</span>
                    </div>
                </div>
                <div className="flex-1 p-4 sm:p-4 md:p-5 flex flex-col justify-between min-w-0">
                    <div>
                        <h3 className="text-[17px] sm:text-[20px] font-bold text-black font-heading tracking-tight leading-tight line-clamp-1 mb-1">{toTitleCase(title || package_name)}</h3>
                        {cityNames.length > 0 && <CityList cityNames={cityNames} />}
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            {slots !== undefined && <span className="text-[13px] font-bold text-[#FFA500] bg-orange-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md inline-block">{slots} Slots</span>}
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-3 sm:mt-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/packages/${slug || id}?book=true`); }}
                            className="px-4 py-1.5 sm:px-5 sm:py-2 border border-[#113A74] text-[#113A74] rounded-full text-[13px] font-sans font-bold hover:bg-[#113A74] hover:text-white transition-all shrink-0"
                        >Book Now</button>
                        <div className="text-right">
                            <span className="text-[#FFA500] text-xl font-black">{formatPrice(price)}</span>
                            <p className="text-[#113A74] text-[13px] font-bold tracking-wider opacity-70">Onwards</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => router.push(`/packages/${slug || id}`)}
            className="cursor-pointer bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
        >
            <div className="relative aspect-[4/3.6] overflow-hidden">
                <img src={image} alt={title || package_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <FavoriteButton packageId={id} className="absolute top-4 right-4 z-20 !bg-white/20 hover:!bg-white/30 !shadow-none border border-white/60 !backdrop-blur-sm [&_svg]:text-white" />
                <div className="absolute top-4 left-0 bg-[#113A74] text-white pl-5 pr-4 py-2.5 rounded-r-lg flex items-center gap-2 text-[15px] font-bold shadow-lg">
                    <Calendar size={15} className="opacity-90" />
                    <span>{nights} Nights, {days} Days</span>
                </div>
                {/* Airline + Operated by overlay — visible on hover (bottom-left) */}
                {(airlineList.length > 0 || operated_by_name) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-10 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                        {airlineList.length > 0 && (
                            <div className="flex items-center gap-2 leading-tight" style={{textShadow:'0 1px 4px rgba(0,0,0,0.7)'}}>
                                <img src={airlineTailIcon.src || airlineTailIcon} alt="Airline" className="w-7 h-7 object-contain shrink-0 scale-150" />
                                <span className="text-white font-extrabold text-[15px] font-heading tracking-wide">Airline : {airlineList.map(a => a.name).join(', ')}</span>
                            </div>
                        )}
                        {operated_by_name && (
                            <p className="text-[#FFA500] font-bold text-[14px] font-heading leading-tight mt-1" style={{textShadow:'0 1px 4px rgba(0,0,0,0.7)'}}>
                                Operated by : <span className="text-white">{operated_by_name}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="p-3.5 sm:p-5 flex flex-col flex-1 gap-1">
                <h3 title={title || package_name} className="text-[17px] sm:text-[20px] font-bold text-black font-heading tracking-tight leading-tight line-clamp-2">{toTitleCase(title || package_name)}</h3>
                {cityNames.length > 0 && <CityList cityNames={cityNames} />}
                <div className="flex items-center gap-2 py-0.5 flex-wrap">
                    {hotels_included  && <img src={hotelsIcon.src || hotelsIcon} alt="Hotel included"  className="w-5 h-5 object-contain" />}
                    {flights_included && <img src={flightIcon.src || flightIcon} alt="Flight included" className="w-5 h-5 object-contain" />}
                    {has_food         && <img src={foodIcon.src  || foodIcon}   alt="Food included"   className="w-5 h-5 object-contain" />}
                </div>
                <div className="flex items-center justify-between gap-3 mt-auto pt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/packages/${slug || id}?book=true`); }}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 border border-[#113A74] text-[#113A74] rounded-full text-[13px] font-sans-force font-bold hover:bg-[#113A74] hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                    >Book Now</button>
                    <div className="text-right">
                        <span className="text-[#FFA500] text-xl font-black leading-none">{formatPrice(price)}</span>
                        <p className="text-[#113A74] text-[13px] font-bold tracking-wider mt-0.5 opacity-90">Onwards</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TourCardSkeleton = ({ viewMode = 'grid' }) => {
    if (viewMode === 'list') {
        // Mirrors the list TourCard exactly: side image (stacked on mobile) + content.
        return (
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row animate-pulse">
                <div className="relative w-full h-[180px] sm:w-[160px] sm:h-auto md:w-[220px] lg:w-[260px] shrink-0 bg-slate-200">
                    {/* date pill top-left */}
                    <div className="absolute top-3 left-0 h-6 w-20 bg-slate-300/70 rounded-r-lg" />
                </div>
                <div className="flex-1 p-4 sm:p-4 md:p-5 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="h-[18px] w-3/4 bg-slate-200 rounded mb-2" />
                        <div className="h-[14px] w-1/2 bg-slate-200 rounded mb-2" />
                        <div className="h-6 w-16 bg-slate-200 rounded-md" />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-3 sm:mt-0">
                        <div className="h-9 w-24 bg-slate-200 rounded-full" />
                        <div className="flex flex-col items-end gap-1">
                            <div className="h-6 w-20 bg-slate-200 rounded" />
                            <div className="h-3 w-12 bg-slate-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // Mirrors the grid TourCard exactly.
    return (
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full animate-pulse">
            <div className="relative aspect-[4/3.6] bg-slate-200">
                {/* date pill top-left + favorite circle top-right */}
                <div className="absolute top-4 left-0 h-8 w-32 bg-slate-300/70 rounded-r-lg" />
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-300/70" />
            </div>
            <div className="p-3.5 sm:p-5 flex flex-col flex-1 gap-1">
                {/* title (2 lines) */}
                <div className="h-[22px] w-5/6 bg-slate-200 rounded mb-0.5" />
                <div className="h-[22px] w-2/3 bg-slate-200 rounded mb-1.5" />
                {/* cities line */}
                <div className="h-[14px] w-1/2 bg-slate-200 rounded mb-1.5" />
                {/* amenity icons row */}
                <div className="flex items-center gap-2 py-0.5">
                    <div className="w-5 h-5 bg-slate-200 rounded" />
                    <div className="w-5 h-5 bg-slate-200 rounded" />
                    <div className="w-5 h-5 bg-slate-200 rounded" />
                </div>
                {/* footer: Book Now + price */}
                <div className="flex items-center justify-between gap-3 mt-auto pt-2">
                    <div className="h-9 w-24 bg-slate-200 rounded-full" />
                    <div className="flex flex-col items-end gap-1">
                        <div className="h-6 w-20 bg-slate-200 rounded" />
                        <div className="h-3 w-12 bg-slate-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ page, totalPages, setPage }) => {
    const getPageWindows = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        if (page > 2) pages.push(1);
        if (page > 3) pages.push('…');
        for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) pages.push(i);
        if (page < totalPages - 2) pages.push('…');
        if (page < totalPages - 1) pages.push(totalPages);
        return pages;
    };
    const pages = getPageWindows();
    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10 sm:mt-12 mb-4 flex-wrap">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 bg-white shadow-sm"><ChevronLeft size={15} strokeWidth={3} /></button>
            {pages.map((p, idx) =>
                p === '…'
                    ? <span key={`ellipsis-${idx}`} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 font-bold text-sm">…</span>
                    : <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl font-extrabold text-sm transition-colors ${page === p ? 'bg-[#113A74] text-white shadow-md' : 'bg-transparent text-[#113A74] hover:bg-white'}`}>{p}</button>
            )}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl border border-slate-100 text-[#113A74] disabled:opacity-50 bg-white shadow-sm"><ChevronRight size={15} strokeWidth={3} /></button>
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
    const [filters,     setFilters]     = useState({ destination: urlDestination ? [urlDestination] : [], cities: [], categories: [], travelers: 1, maxNights: '', departure_date: '' });
    const [filterData,  setFilterData]  = useState({ destinations: [], cities: [], categories: [] });
    const [sort,        setSort]        = useState('newest');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [headerData,  setHeaderData]  = useState({ title: "Our Packages", description: "" });
    const [search,      setSearch]      = useState(urlSearch);
    const [viewMode,    setViewMode]    = useState('grid');
    const [tourListingSettings, setTourListingSettings] = useState({ heading: '', description: '' });

    useEffect(() => {
        api.get('/settings/public')
            .then(res => {
                const d = res?.data || res;
                setTourListingSettings({
                    heading:     d?.tour_listing_heading            || '',
                    description: d?.tour_listing_short_description  || '',
                });
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        api.get('/packages/frontend/filters')
            .then(data => setFilterData({ destinations: data.destinations || [], cities: data.cities || [], categories: data.categories || [] }))
            .catch(e => console.error('Filters failed', e));
    }, []);

    useEffect(() => {
        if (filters.destination?.length === 1 && filterData.destinations.length > 0) {
            const d = filterData.destinations.find(x => x.slug === filters.destination[0]);
            if (d) {
                setHeaderData({ title: d.meta_title || d.name || "Our Packages", description: d.meta_description || "" });
                document.title = `${d.meta_title || d.name} | Magic Tours`;
                return;
            }
        }
        setHeaderData({ title: "Our Packages", description: "" });
        document.title = "Our Packages | Magic Tours";
    }, [filters.destination, filterData.destinations]);

    const fetchPackages = async (activeFilters = filters, activePage = page, activeSort = sort) => {
        setLoading(true);
        try {
            let url = `/packages/frontend/list?page=${activePage}&limit=6&sort=${activeSort}`;
            if (activeFilters.destination?.length > 0) url += `&destination_slug=${activeFilters.destination.join(',')}`;
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
        return pkg.title?.toLowerCase().includes(q) || pkg.package_name?.toLowerCase().includes(q) || pkg.journey_overview?.toLowerCase().includes(q);
    });

    useEffect(() => {
        const urlDest = searchParams.get('destination') || '';
        const urlSrch = searchParams.get('search') || '';
        const newDest = urlDest ? [urlDest] : [];
        if (newDest.join(',') !== (filters.destination || []).join(',')) {
            setFilters(prev => ({ ...prev, destination: newDest }));
            setPage(1);
        }
        if (urlSrch !== search) setSearch(urlSrch);
    }, [searchParams]);

    useEffect(() => { fetchPackages(filters, page, sort); }, [page, sort, (filters.destination || []).join(',')]);

    const handleApplyFilters = (f) => { setFilters(f); setPage(1); fetchPackages(f, 1, sort); setIsSidebarOpen(false); };
    const handleSortChange   = (s) => { setSort(s); setPage(1); fetchPackages(filters, 1, s); };

    return (
        <main className="min-h-screen bg-white">
            {/* ── Hero banner (no search bar) ── */}
            <section className="relative min-h-[60vh] sm:min-h-[80vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src={bannerImg.src} alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center mt-14 sm:mt-20 flex flex-col items-center gap-4 sm:gap-5">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-0 tracking-tight drop-shadow-sm font-heading">
                        {headerData.title}
                    </h1>
                    {headerData.description && (
                        <p className="text-[#113A74]/80 text-[13px] max-w-2xl mx-auto leading-relaxed font-sans font-medium">
                            {headerData.description}
                        </p>
                    )}
                    <nav className="flex items-center justify-center gap-1.5 text-[13px] font-sans font-bold text-[#113A74] uppercase tracking-wider">
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
            <section className="pt-16 sm:pt-24 pb-20 lg:pb-32 px-4 bg-[#E9F7FF] font-sans">
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

                            {(tourListingSettings.heading || tourListingSettings.description) && (
                                <div className="mb-6">
                                    {tourListingSettings.heading && (
                                        <h2 className="text-[24px] font-bold text-black font-heading mb-2">
                                            {tourListingSettings.heading}
                                        </h2>
                                    )}
                                    {tourListingSettings.description && (
                                        <p className="text-gray-600 text-[15px] font-sans leading-relaxed">
                                            {tourListingSettings.description}
                                        </p>
                                    )}
                                </div>
                            )}

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
                                sort={sort}
                                setSort={handleSortChange}
                            />

                            <div className={viewMode === 'list'
                                ? 'flex flex-col gap-4 sm:gap-6'
                                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8'
                            }>
                                {loading
                                    ? [...Array(6)].map((_, i) => <TourCardSkeleton key={i} viewMode={viewMode} />)
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
            <div className="bg-[#E9F7FF]"><GalleryLoop /></div>
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
        <section className="pt-16 sm:pt-24 pb-20 lg:pb-32 px-4 bg-[#E9F7FF] font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl h-24 mb-6 animate-pulse" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
                </div>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                    <div className="hidden lg:block w-[300px] h-[600px] bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse shrink-0" />
                    <div className="flex-1 min-w-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
