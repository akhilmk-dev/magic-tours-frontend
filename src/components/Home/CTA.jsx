import React from 'react';
import { Send } from 'lucide-react';

export default function CTA() {
    return (
        <section className="relative py-24 mb-6">
            <div className="container mx-auto px-4 md:px-6">
                <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden relative shadow-2xl">
                    {/* Background Image Overlay */}
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2070&auto=format&fit=crop"
                            alt="Travel Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="relative z-10 px-8 py-16 text-center md:px-20">
                        <p className="text-[#FFA500] font-bold uppercase tracking-wider text-sm mb-4">Special Offer For You</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Let's Make Your Travel <br />
                            <span>Dreams Come True</span>
                        </h2>
                        <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
                            Discover the world's most breathtaking destinations with our expertly curated travel packages. From serene beaches to vibrant cityscapes, we provide unparalleled experiences that stay with you forever.
                        </p>

                        <button className="bg-white text-brand-heading px-8 py-4 rounded-full font-bold hover:bg-[#FFA500] hover:text-white transition-all shadow-lg inline-flex items-center gap-2">
                            Started Now
                            <Send size={18} />
                        </button>

                        {/* 60% Badge */}
                        <div className="hidden md:flex absolute top-10 right-20 w-32 h-32 bg-[#FFA500]/90 backdrop-blur-sm rounded-full flex-col items-center justify-center text-white border-4 border-white/20 shadow-xl rotate-12 animate-pulse">
                            <span className="text-4xl font-black">60%</span>
                            <span className="text-xs font-bold uppercase">Discount</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
