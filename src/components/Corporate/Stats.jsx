import React from 'react';

const Stats = () => {
    return (
        <section className="bg-primary py-16 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">

                    <div className="flex flex-col gap-2">
                        <h3 className="text-3xl font-bold">Ready to transform your travel experience?</h3>
                        <p className="text-blue-100 text-sm max-w-xs">
                            Join 500+ enterprises who trust Al Tayer Travel with their most important yourneys.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <button className="bg-white text-primary font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                Talk to an Expert
                            </button>
                            <button className="border border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm">
                                Download Brochure
                            </button>
                        </div>
                    </div>

                    <div>
                        <span className="text-4xl font-bold block mb-1">40+</span>
                        <span className="text-blue-200 text-xs font-bold tracking-wider uppercase">Years Experience</span>
                    </div>

                    <div>
                        <span className="text-4xl font-bold block mb-1">15min</span>
                        <span className="text-blue-200 text-xs font-bold tracking-wider uppercase">Response Time</span>
                    </div>

                    <div>
                        <span className="text-4xl font-bold block mb-1">99%</span>
                        <span className="text-blue-200 text-xs font-bold tracking-wider uppercase">Client Retention</span>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Stats;
