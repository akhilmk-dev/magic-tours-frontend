import React from 'react';

const CorporateHero = () => {
    return (
        <div className="relative py-20 lg:py-32 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Content */}
                    <div className="lg:w-1/2 pt-10">
                        <span className="bg-blue-100 text-primary font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider mb-6 inline-block">
                            The UAE's Premier Corporate Agency
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-secondary mb-6 leading-tight">
                            Elevate Your Corporate Travel: <span className="text-primary">Seamless Management.</span>
                        </h1>
                        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl">
                            Optimize your company's travel program with the Middle East's leading experts. Dedicated account management, cutting-edge cost-saving tools, and 24/7 VIP global support.
                        </p>

                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
                                alt="Corporate Meeting"
                                className="w-full object-cover h-64 lg:h-80"
                            />
                            <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm px-6 py-4 rounded-xl text-white">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-3xl font-bold text-primary-light">15%</span>
                                    <span className="text-sm font-medium">Average Savings</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
                            <h2 className="text-2xl font-bold text-secondary mb-2">Request a Demo</h2>
                            <p className="text-gray-400 text-sm mb-8">Transform your corporate travel program today with a personalized consultation.</p>

                            <form className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2">Full Name</label>
                                    <input type="text" placeholder="e.g. Sultan Ahmed" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2">Company Email</label>
                                    <input type="email" placeholder="name@company.ae" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2">Company Name</label>
                                    <input type="text" placeholder="Your Enterprise" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2">Monthly Travel Spend</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-500">
                                        <option>AED 10,000 - 50,000</option>
                                        <option>AED 50,000 - 100,000</option>
                                        <option>AED 100,000+</option>
                                    </select>
                                </div>

                                <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] mt-4">
                                    Submit Request
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">Response within 24 business hours</p>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CorporateHero;
