"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, filterOptions }) => {
    const handleRegionChange = (region) => {
        onFilterChange({ ...filters, region });
    };

    const handleBudgetChange = (budget) => {
        onFilterChange({ ...filters, budget: Number(budget) });
    };

    const handleTravelTypeChange = (type) => {
        const newTravelTypes = filters.travelType.includes(type)
            ? filters.travelType.filter(t => t !== type)
            : [...filters.travelType, type];
        onFilterChange({ ...filters, travelType: newTravelTypes });
    };

    const clearAll = () => {
        onFilterChange({
            region: 'All Regions',
            budget: 50000,
            travelType: []
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-secondary">Filters</h3>
                <button
                    onClick={clearAll}
                    className="text-xs text-primary font-bold uppercase tracking-wider hover:underline"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-8">

                {/* Destinations */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Destinations</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="region"
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                checked={filters.region === 'All Regions'}
                                onChange={() => handleRegionChange('All Regions')}
                            />
                            <span className={`text-sm font-medium transition-colors ${filters.region === 'All Regions' ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}>
                                All Destinations
                            </span>
                        </label>
                        {filterOptions.destinations.map((dest) => (
                            <label key={dest.id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="region"
                                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                    checked={filters.region === dest.id}
                                    onChange={() => handleRegionChange(dest.id)}
                                />
                                <span className={`text-sm transition-colors ${filters.region === dest.id ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`}>
                                    {dest.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Budget */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Budget (AED)</h4>
                    <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={filters.budget}
                        onChange={(e) => handleBudgetChange(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-xs font-bold text-secondary">
                        <span>AED 1k</span>
                        <span>AED 50k+</span>
                    </div>
                    <div className="mt-2 text-center text-sm font-bold text-primary">
                        Up to AED {filters.budget.toLocaleString()}
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Categories</h4>
                    <div className="space-y-3">
                        {filterOptions.categories.length > 0 ? (
                            filterOptions.categories.map((type) => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={filters.travelType.includes(type)}
                                        onChange={() => handleTravelTypeChange(type)}
                                    />
                                    <span className={`text-sm transition-colors ${filters.travelType.includes(type) ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`}>
                                        {type}
                                    </span>
                                </label>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic">No categories available</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FilterSidebar;
