import React from 'react';
import Link from 'next/link';
import { Plane, ArrowRight, FileCheck, Globe, Shield, Zap } from 'lucide-react';
import globalImg from '../../assets/global.png';

const features = [
    {
        icon: Zap,
        title: 'Quick Processing',
        description: 'There are many variations of passages of lorem Ipsum.',
    },
    {
        icon: FileCheck,
        title: 'Expert Guidance',
        description: 'There are many variations of passages of lorem Ipsum.',
    },
    {
        icon: Globe,
        title: 'Global Coverage',
        description: 'There are many variations of passages of lorem Ipsum.',
    },
    {
        icon: Shield,
        title: 'Secure Documentation',
        description: 'There are many variations of passages of lorem Ipsum.',
    },
];

const VisaServices = () => {
    return (
        <section className="relative bg-white py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-12 lg:px-16">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 xl:gap-16">

                {/* Left Side - Content */}
                <div className="flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full mb-4 shadow-sm border border-gray-100">
                        <svg className="text-brand-magic" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                        </svg>
                        <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-brand-magic font-jakarta">
                            Visa Services
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-brand-heading leading-[1.1] mb-3 sm:mb-4">
                        Simplified{' '}
                        <span className="text-[#FDB338] font-medium">Visa Solutions</span>
                    </h2>

                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-xl">
                        Navigating global travel requirements should be as seamless as your
                        destination experience. We handle the complexity, so you can focus
                        on the journey ahead.
                    </p>

                    {/* 2x2 Feature Grid with separation lines */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 max-w-xl mb-6 sm:mb-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            // Determine border classes for grid lines
                            const isTopRow = index < 2;
                            const isLeftCol = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    className={`py-4 sm:py-5 px-3 sm:px-4
                                        ${!isTopRow ? 'border-t border-gray-200' : ''}
                                        ${!isLeftCol ? 'sm:border-l border-gray-200' : ''}
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-brand-magic flex items-center justify-center shrink-0">
                                            <Icon size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-brand-heading font-bold text-base sm:text-[18px] mb-1">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-400 text-[13px] sm:text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    <Link href="/visa-application" className="inline-flex items-center gap-2 bg-[#FDB338] hover:bg-[#e9a42f] text-brand-heading font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all hover:-translate-y-1 shadow-lg shadow-[#FDB338]/20 group">
                        Explore More
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Right Side - Globe Image */}
                <div className="w-full lg:w-[42%] xl:w-[38%] shrink-0 flex items-center justify-center">
                    <img
                        src={globalImg.src || globalImg}
                        alt="Global Visa Services"
                        className="w-full max-w-[400px] lg:max-w-none h-auto object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default VisaServices;
