import React, { useState, useEffect } from 'react';
import { ArrowRight, Plane, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

export default function Destinations() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await api.get('/destinations?status=Active&limit=4');
                setDestinations(res.data || []);
            } catch (err) {
                console.error('Failed to fetch destinations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex justify-center items-center">
                <Loader2 className="animate-spin text-[#FFA500]" size={40} />
            </div>
        );
    }
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F1E32' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '100px 100px'
                }}>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left Content - Header */}
                    <div className="lg:w-1/3 flex flex-col justify-center items-start">
                        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
                            <Plane className="text-secondary" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Destination List</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-secondary leading-[1.1] mb-6">
                            Explore the Beautiful <br />
                            <span className="text-[#FFA500]">Places Around World</span>
                        </h2>

                        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm">
                            Flexible classes refers to the process of acquiring is knowledge free.
                        </p>

                        <button className="flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#1a3355] transition-all group shadow-xl shadow-secondary/20">
                            Discover More
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Content - Cards Grid */}
                    <div className="lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {destinations.map((dest) => (
                                <div key={dest.id} className="group cursor-pointer">
                                    <div className="overflow-hidden rounded-[2.5rem] bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                        <div className="aspect-[4/5] overflow-hidden">
                                            <img
                                                src={dest.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'}
                                                alt={dest.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="p-6 text-center transition-all duration-300 bg-white text-[#0F1E32] group-hover:bg-[#0F1E32]">
                                            <h3 className="text-lg font-bold mb-2 transition-colors group-hover:text-white">{dest.name}</h3>
                                            <span className="text-xs font-bold uppercase tracking-widest cursor-pointer hover:underline text-gray-400 transition-colors group-hover:text-white">
                                                See More
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
