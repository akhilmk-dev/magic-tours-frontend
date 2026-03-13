"use client";

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../api/client';
import PackageGrid from '../../../components/Outbound/PackageGrid';
import FilterSidebar from '../../../components/Outbound/FilterSidebar';
import { Loader2 } from 'lucide-react';

const VendorPackagesPage = () => {
    const params = useParams();
    const vendorId = params.vendorId;
    const [packages, setPackages] = useState([]);
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('newest');
    const [filters, setFilters] = useState({
        region: 'All Regions',
        budget: 5000,
        travelType: []
    });

    const [filterOptions, setFilterOptions] = useState({
        categories: [],
        destinations: []
    });

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const options = await api.get('/packages/meta/filters');
                setFilterOptions(options);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMeta();
    }, []);

    useEffect(() => {
        if (!vendorId) return;
        const fetchVendorPackages = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: '9',
                    max_price: filters.budget.toString(),
                    sort: sort,
                    vendor_id: vendorId
                });

                if (filters.region !== 'All Regions') {
                    queryParams.append('destination_id', filters.region);
                }

                if (filters.travelType.length > 0) {
                    queryParams.append('categories', filters.travelType.join(','));
                }

                const response = await api.get(`/packages?${queryParams.toString()}`);
                setPackages(response.data);
                setTotalPages(response.pagination.totalPages);

                // Set vendor name from the first package if available
                if (response.data.length > 0 && response.data[0].vendor) {
                    setVendor(response.data[0].vendor);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendorPackages();
    }, [vendorId, page, filters, sort]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-secondary py-16 px-4 pt-32">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {vendor ? `Packages by ${vendor.name}` : 'Vendor Packages'}
                    </h1>
                    <p className="text-gray-300 max-w-2xl">
                        Explore exclusive travel deals and experiences curated by our expert partner.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-1/4">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={setFilters}
                            filterOptions={filterOptions}
                        />
                    </aside>

                    <main className="lg:w-3/4">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="animate-spin text-primary" size={40} />
                            </div>
                        ) : (
                            <PackageGrid
                                packages={packages}
                                page={page}
                                setPage={setPage}
                                totalPages={totalPages}
                                sort={sort}
                                onSortChange={setSort}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default VendorPackagesPage;
