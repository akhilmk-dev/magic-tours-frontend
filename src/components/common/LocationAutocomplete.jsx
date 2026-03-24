import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function LocationAutocomplete({ 
    name, 
    value,
    onChange,
    onBlur,
    placeholder, 
    className,
    hasError
}) {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    // Sync external value changes
    useEffect(() => {
        if (value !== undefined) {
            setQuery(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchLocations = async (search) => {
        if (!search || search.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        try {
            // Using Open-Meteo Geocoding API (Free, no key required)
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=5&language=en&format=json`);
            const data = await res.json();
            
            if (data.results) {
                // Deduplicate and format gracefully
                const formatted = data.results.map(item => {
                    const parts = [item.name, item.admin1, item.country].filter(Boolean);
                    return parts.join(', ');
                });
                setResults([...new Set(formatted)]);
                setShowDropdown(true);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Location search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (onChange) onChange(name, val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchLocations(val);
        }, 400);
    };

    const handleSelect = (location) => {
        setQuery(location);
        if (onChange) onChange(name, location);
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
                type="text"
                name={name}
                value={query}
                onChange={handleInputChange}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                onBlur={(e) => { if (onBlur) onBlur(e); }}
                placeholder={placeholder}
                autoComplete="off"
                className={className || `w-full border ${hasError ? 'border-red-400' : 'border-gray-200'} rounded-lg pl-10 pr-10 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700 bg-white`}
            />
            {loading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400 z-10" />
            )}

            {showDropdown && results.length > 0 && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
                    {results.map((loc, i) => (
                        <div
                            key={i}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                            onClick={() => handleSelect(loc)}
                        >
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-[13px] text-gray-700 font-medium truncate">{loc}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
