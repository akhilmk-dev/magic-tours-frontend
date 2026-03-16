import React from 'react';
import { ArrowRight, Tent, ThumbsUp, Headset, Luggage } from 'lucide-react';
import travelBoy from '../../assets/travelboy.png';
import travelBag from '../../assets/travelbag.png';
import offerBadge from '../../assets/offer.png';
import planeRoute from '../../assets/planeroute.png';

const stats = [
    {
        icon: Luggage,
        value: '30.3k',
        label: 'Happy Traveller',
    },
    {
        icon: Tent,
        value: '40.5k',
        label: 'Tent Sites',
    },
    {
        icon: ThumbsUp,
        value: '88.9%',
        label: 'Satisfaction Rate',
    },
    {
        icon: Headset,
        value: '6.30+',
        label: 'Year Of Service',
    },
];

const SpecialOffer = () => {
    return (
        <section className="relative mt-12 mb-[320px] sm:mb-[280px] lg:mb-56 xl:mb-64">
            {/* Top Blue Banner - Radial Gradient */}
            <div className="bg-brand-magic bg-[radial-gradient(circle_at_60%_50%,_#1e4b8a_0%,_#113A74_100%)] rounded-[2rem] sm:rounded-[3rem] mx-4 sm:mx-8 md:mx-12 lg:mx-16 pt-12 lg:pt-0 pb-36 sm:pb-44 lg:pb-36 xl:pb-44 overflow-hidden relative">


                <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                        {/* Left Side - Content */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left relative z-20 pt-4 lg:pt-20 xl:pt-24">
                            <span className="text-[#FDB338] font-bold text-sm lg:text-base uppercase tracking-wider mb-4 block">
                                Special Offer for You
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[52px] font-bold text-white leading-[1.1] mb-6">
                                Let's Make Your Travel <br className="hidden sm:block" />
                                Dreams <span className="text-white">Come True</span>
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0">
                                Unlock exclusive deals and hand-picked travel experiences just for you. From seasonal discounts to members-only perks, we ensure your next adventure is as rewarding as it is unforgettable.
                            </p>

                            <button className="inline-flex items-center gap-3 bg-white hover:bg-slate-100 text-brand-magic font-bold px-8 py-4 rounded-full text-sm lg:text-base transition-all hover:-translate-y-1 shadow-xl group">
                                Start Booking
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Right Side - Images (Relative/Absolute mix) */}
                        <div className="w-full lg:w-1/2 relative flex items-start justify-center pt-0 self-start min-h-[250px] sm:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px]">

                            <img
                                src={planeRoute.src || planeRoute}
                                alt=""
                                className="absolute -left-[20%] sm:-left-[30%] lg:-left-[40%] xl:-left-[50%] -bottom-[10%] lg:-bottom-[15%] xl:-bottom-[20%] w-[100%] sm:w-[90%] opacity-100 pointer-events-none z-0"
                                aria-hidden="true"
                            />

                            {/* Offer Badge - Positioned accurately on traveler's shoulder */}
                            <img
                                src={offerBadge.src || offerBadge}
                                alt="Great Deals"
                                className="absolute top-[5%] left-0 sm:left-[5%] w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 z-30 animate-pulse-subtle"
                            />

                            {/* Travel Bag (Background part) */}
                            <img
                                src={travelBag.src || travelBag}
                                alt="Travel Bag"
                                className="absolute right-0 top-0 w-[30%] sm:w-[35%] md:w-[40%] lg:w-[45%] xl:w-[50%] z-10"
                            />

                            {/* Travel Boy (Foreground, Overlapping) */}
                            <img
                                src={travelBoy.src || travelBoy}
                                alt="Happy Traveler"
                                className="relative z-20 w-[60%] sm:w-[65%] md:w-[70%] lg:w-[85%] xl:w-[90%] transform translate-y-0"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Stats Section */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-280px] sm:bottom-[-180px] lg:bottom-[-100px] xl:bottom-[-120px] w-[92%] sm:w-[85%] lg:w-[80%] xl:w-[75%] z-40">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(15,30,50,0.1)] p-8 md:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center justify-center text-center px-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-full border border-gray-100 bg-white flex items-center justify-center mb-5 shadow-sm group hover:border-[#FDB338] transition-all">
                                    <stat.icon className="text-[#FDB338] transition-transform group-hover:scale-110" size={24} />
                                </div>
                                <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-brand-magic mb-2 tracking-tight">
                                    {stat.value}
                                </h3>
                                <p className="text-[12px] sm:text-[13px] lg:text-sm text-gray-400 font-medium tracking-wide">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-subtle {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.05) rotate(2deg); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default SpecialOffer;
