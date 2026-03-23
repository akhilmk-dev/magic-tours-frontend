import React, { useEffect, useState } from 'react';
import { Star, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../../api/client';
import { useRouter } from 'next/navigation';
import FavoriteButton from '../common/FavoriteButton';
import { useCurrency } from '../../context/CurrencyContext';

const FeaturedPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();
    const router = useRouter();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await api.get('/packages?is_featured=true&limit=3');
                if (response.data) {
                    setPackages(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch featured packages", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    if (loading) {
        return <div className="py-20 text-center">Loading featured experiences...</div>;
    }

    if (packages.length === 0) return null;

    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-secondary relative">
                        Featured Packages
                        <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-yellow-400 rounded-full"></span>
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white rounded-full border border-gray-200 hover:border-primary text-secondary hover:text-primary transition-all">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="p-3 bg-white rounded-full border border-gray-200 hover:border-primary text-secondary hover:text-primary transition-all">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg.id || index}
                            onClick={() => router.push(`/packages/${pkg.slug || pkg.id}`)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={pkg.image || "https://images.unsplash.com/photo-1540541338287-41700207dee6"}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <FavoriteButton
                                    packageId={pkg.id}
                                    className="absolute top-4 right-4 z-20"
                                />
                                <span className={`absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                                    {pkg.category || "Premium"}
                                </span>
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <span className="text-secondary font-bold text-sm">From {formatPrice(pkg.price)}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex gap-1 text-yellow-500 mb-3">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">{pkg.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                    {pkg.description || "Experience the best of travel with our curated packages designed for luxury and comfort."}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-gray-400 border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span>{pkg.duration || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>2 Adults</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedPackages;

