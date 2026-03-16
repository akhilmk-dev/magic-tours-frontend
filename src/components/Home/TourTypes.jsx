import React from 'react';
import { Mountain, Palmtree, Tent, Binoculars, Map, Bike } from 'lucide-react';

const types = [
    { icon: <Mountain size={32} />, name: 'Paragliding', desc: 'Experience the thrill of soaring high above breathtaking landscapes.' },
    { icon: <Palmtree size={32} />, name: 'Wildlife', desc: 'Discover exotic animals and diverse ecosystems in their natural habitat.' },
    { icon: <Tent size={32} />, name: 'Hang Gliding', desc: 'Feel the rush of wind as you glide gracefully through the sky.' },
    { icon: <Binoculars size={32} />, name: 'Adventure', desc: 'Embark on exhilarating journeys that push your boundaries.' },
    { icon: <Map size={32} />, name: 'Hunting', desc: 'Explore tradition with expert-led sustainable tracking expeditions.' },
    { icon: <Bike size={32} />, name: 'Nature', desc: 'Immerse yourself in the tranquility of untouched wilderness.' },
];

export default function TourTypes() {
    return (
        <section className="py-20 bg-slate-50 relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L100 100 L0 100 Z" className="text-[#FFA500]" />
                </svg>
            </div>

            <div className="container mx-auto px-4 md:px-6 text-center">
                <p className="text-[#FFA500] font-bold uppercase tracking-wider text-sm mb-2">Activities</p>
                <h2 className="text-4xl font-bold text-brand-heading mb-12">
                    Choose Our Tour Types <br />Popular Travel <span className="text-[#FFA500]">Packages</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {types.map((type, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-100 flex flex-col items-center group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-slate-50 text-brand-heading flex items-center justify-center mb-4 group-hover:bg-[#FFA500] group-hover:text-white transition-colors">
                                {type.icon}
                            </div>
                            <h3 className="font-bold text-brand-heading mb-1">{type.name}</h3>
                            <p className="text-xs text-slate-400">{type.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
