"use client";
import React, { useState, useEffect } from 'react';
import FilterSidebar from '../../components/Outbound/FilterSidebar';
import PackageGrid from '../../components/Outbound/PackageGrid';
import PackageCardSkeleton from '../../components/skeletons/PackageCardSkeleton';
import { Filter, X } from 'lucide-react';
import { api } from '../../api/client';

const Outbound = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        categories: [],
        destinations: []
    });
    const [filters, setFilters] = useState({
        region: 'All Regions', // This will store Destination ID or 'All Regions'
        budget: 50000,
        travelType: []
    });
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [packages, setPackages] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await api.get('/packages/meta/filters');
                setFilterOptions(response);
            } catch (err) {
                console.error('Failed to fetch filter options:', err);
            }
        };
        fetchFilterOptions();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '9',
                max_price: filters.budget.toString(),
                sort: sort
            });

            if (filters.region !== 'All Regions') {
                params.append('destination_id', filters.region);
            }

            if (filters.travelType.length > 0) {
                params.append('categories', filters.travelType.join(','));
            }

            const response = await api.get(`/packages?${params.toString()}`);
            setPackages(Array.isArray(response.data) ? response.data : []);
            setPagination(response.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, [filters, page, sort]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 relative">
            {/* Floating Filter Button (Mobile) */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
                <Filter size={20} />
                <span className="font-bold">Filters</span>
            </button>

            {/* Header */}
            <div className="bg-white border-b border-gray-100 pt-12 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                <span>Home</span>
                                <span>/</span>
                                <span className="text-primary">Packages</span>
                            </div>
                            <h1 className="text-4xl font-bold text-secondary mb-2">Exclusive Travel Packages</h1>
                            <p className="text-gray-500 max-w-xl">Exquisite global journeys curated for the modern explorer. From Alpine retreats to tropical sanctuaries, discover the world with Al Tayer.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className={`
                    fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 overflow-y-auto
                    lg:relative lg:transform-none lg:bg-transparent lg:p-0 lg:z-0 lg:overflow-visible lg:w-1/4
                    ${isFilterOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                        <div className="flex justify-between items-center mb-6 lg:hidden">
                            <h2 className="text-xl font-bold text-secondary">Filters</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-secondary"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            filterOptions={filterOptions}
                        />
                    </div>

                    {/* Overlay for mobile */}
                    {isFilterOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setIsFilterOpen(false)}
                        ></div>
                    )}

                    {/* Main Grid */}
                    <div className="lg:w-3/4">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <PackageCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 p-8 rounded-2xl text-center border border-red-100">
                                <p className="text-red-600 font-bold">{error}</p>
                            </div>
                        ) : (
                            <PackageGrid
                                packages={packages}
                                page={page}
                                setPage={handlePageChange}
                                totalPages={pagination?.totalPages || 1}
                                sort={sort}
                                onSortChange={setSort}
                            />
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Outbound;
