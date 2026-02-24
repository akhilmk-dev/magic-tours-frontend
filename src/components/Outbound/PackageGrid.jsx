import React from 'react';
import { MapPin, Clock, User, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PackageGrid = ({ packages, page, setPage, totalPages, sort, onSortChange }) => {

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${i === page
                        ? 'bg-primary text-white font-bold'
                        : 'border border-gray-200 text-secondary hover:border-primary hover:text-primary'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="space-y-8">
            {/* Header with Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-secondary">Available Packages</h2>
                    <p className="text-gray-400 text-sm">
                        {packages.length > 0
                            ? `Showing ${(page - 1) * 9 + 1} - ${Math.min(page * 9, packages.length)} results`
                            : 'No packages found matching your criteria'
                        }
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Sort by:</span>
                    <select
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-secondary outline-none cursor-pointer focus:border-primary"
                    >
                        <option value="newest">Most Recent</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden">
                            <Link to={`/packages/${pkg.id}`}>
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </Link>
                            {/* Tag */}
                            <span className={`absolute top-4 left-4 ${pkg.is_featured ? 'bg-primary' : 'bg-secondary'} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                                {pkg.is_featured ? 'Elite' : pkg.category}
                            </span>
                            {/* Price Badge on Image */}
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <span className="text-secondary font-bold text-sm">From AED {pkg.price?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex gap-1 text-yellow-500 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>

                            <Link to={`/packages/${pkg.id}`}>
                                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {pkg.title}
                                </h3>
                            </Link>

                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                {pkg.description || "Experience the best of travel with our curated packages designed for luxury and comfort."}
                            </p>

                            {/* Info Box */}
                            <div className="mt-auto flex items-center justify-between text-sm text-gray-400 border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{pkg.duration || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary group-hover:underline">
                                    <Link to={`/packages/${pkg.id}`} className="font-bold text-xs uppercase tracking-wider">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-full border border-gray-200 text-secondary disabled:opacity-30 hover:border-primary hover:text-primary transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    {renderPagination()}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-full border border-gray-200 text-secondary disabled:opacity-30 hover:border-primary hover:text-primary transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PackageGrid;
