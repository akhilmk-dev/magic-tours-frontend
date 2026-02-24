import React, { useState, useEffect } from 'react';
import { Star, Loader2, Plane, Calendar, ArrowRight } from 'lucide-react';
import { api } from '../../api/client';
import { useNavigate } from 'react-router-dom';

export default function Packages() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await api.get('/packages?limit=4');
                if (response.data) {
                    setPackages(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch packages", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex justify-center items-center bg-white">
                <Loader2 className="animate-spin text-[#FFA500]" size={40} />
            </div>
        );
    }

    if (packages.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Light Wavy Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='1440' height='320' viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%230F1E32' fill-opacity='1' d='M0,192L80,186.7C160,181,320,171,480,181.3C640,192,800,224,960,218.7C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom'
                }}>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full mb-6 border border-gray-100 shadow-sm">
                        <Plane className="text-secondary rotate-45" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Packages</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary">
                        Popular Travel <span className="text-[#FFA500] font-serif italic">Packages</span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            onClick={() => navigate(`/packages/${pkg.id}`)}
                            className="bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden group hover:-translate-y-3 transition-all duration-500 cursor-pointer border border-white"
                        >
                            {/* Card Image */}
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={pkg.image || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop"}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-black text-secondary mb-2">{pkg.title}</h3>

                                {/* Row 1: Rating (Left) and Duration (Right) -> Now Stacked */}
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-[#FFA500] text-[#FFA500]" />
                                            ))}
                                        </div>
                                        <span className="text-xs font-black text-gray-400">(4.8)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <div className="p-1 bg-blue-50/50 rounded-lg">
                                            <Calendar size={14} className="text-[#3B82F6]" />
                                        </div>
                                        <span className="text-sm font-bold text-secondary/60">{pkg.duration || '4'} days</span>
                                    </div>
                                </div>

                                {/* Row 2: Book Now (Left) and Price (Right) -> Now Stacked */}
                                <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-[#FFA500]">${pkg.price || '59'}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter self-end mb-1">Per day</span>
                                    </div>
                                    <button className="w-full px-5 py-2.5 rounded-full bg-secondary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#1a3355] transition-all shadow-lg">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suitcase Decoration */}
            <div className="absolute -bottom-10 -right-20 lg:right-0 z-0 opacity-20 lg:opacity-40 pointer-events-none transform scale-75 lg:scale-100 origin-bottom-right">
                <img
                    src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop"
                    alt="Suitcase"
                    className="w-[350px] lg:w-[450px] h-auto object-contain rounded-tl-[100px]"
                />
            </div>
        </section>
    );
}
