"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries } from '../../utils/countryData';

const InternationalPhoneInput = ({ 
    value, 
    onChange, 
    error, 
    placeholder = "Enter phone number",
    className = "" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to Qatar
    const dropdownRef = useRef(null);

    // Initial value decomposition and sync with external prop
    useEffect(() => {
        if (!value) {
            setInputValue('');
            return;
        }

        if (value.startsWith('+')) {
            const match = countries.slice().sort((a, b) => b.dialCode.length - a.dialCode.length)
                .find(c => value.startsWith(c.dialCode));
            if (match) {
                setSelectedCountry(match);
                const localPart = value.replace(match.dialCode, '').trim();
                // Only set if different to avoid potential feedback loops
                if (localPart !== inputValue) setInputValue(localPart);
            }
        } else {
            if (value !== inputValue) setInputValue(value);
        }
    }, [value]);

    const [inputValue, setInputValue] = useState('');

    const filteredCountries = countries.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.dialCode.includes(searchQuery)
    );

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchQuery('');
        // Notify parent with full number
        onChange(`${country.dialCode} ${inputValue}`.trim());
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/[^\d\s-]/g, ''); // Basic cleanup
        setInputValue(val);
        onChange(`${selectedCountry.dialCode} ${val}`.trim());
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`}>
            <div className={`flex items-stretch bg-gray-50 border-2 ${error ? 'border-red-300' : 'border-transparent'} focus-within:border-[#FFA500]/30 focus-within:bg-white rounded-2xl transition-all h-[52px]`}>
                {/* Country Selector */}
                <div 
                    className="flex items-center gap-2 px-4 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-100"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <img 
                        src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`} 
                        alt={selectedCountry.name}
                        className="w-5 h-auto rounded-sm shadow-sm"
                    />
                    <span className="text-xs font-bold text-[#113A74]">{selectedCountry.dialCode}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Number Input */}
                <input
                    type="tel"
                    value={inputValue}
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-500 text-[10px] font-bold uppercase px-2 mt-1">{error}</div>
            )}

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full mt-2 left-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 z-[110] overflow-hidden"
                    >
                        {/* Search */}
                        <div className="p-3 border-b border-gray-50 flex items-center gap-2">
                            <Search size={14} className="text-gray-400" />
                            <input 
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search country..."
                                className="w-full text-xs font-medium outline-none bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* List */}
                        <div className="max-h-[250px] overflow-y-auto py-1 custom-scrollbar">
                            {filteredCountries.map((country) => (
                                <div
                                    key={country.code}
                                    className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCountry.code === country.code ? 'bg-orange-50/50' : ''}`}
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} 
                                            alt={country.name}
                                            className="w-4 h-auto rounded-sm"
                                        />
                                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">{country.name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#FFA500]">{country.dialCode}</span>
                                </div>
                            ))}
                            {filteredCountries.length === 0 && (
                                <div className="px-4 py-8 text-center text-gray-400 text-xs italic">
                                    No countries found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InternationalPhoneInput;
