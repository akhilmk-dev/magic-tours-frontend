import React from 'react';
import Link from 'next/link';
import Skeleton from '../common/Skeleton';

import { Plane, ArrowRight, Globe, Shield, Zap, FileCheck, Clock } from 'lucide-react';
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

const VisaServices = ({ content, loading }) => {
    const subtitle = content?.subtitle || "Visa Services";
    const heading = content?.heading || "Simplified";
    const highlight = content?.highlight || "Visa";
    const heading2 = content?.heading2 || "Solutions";
    const description = content?.description || "Navigating global travel requirements should be as seamless as your destination experience. We handle the complexity, so you can focus on the journey ahead.";
    const buttonText = content?.button_text || "Explore More";
    const buttonLink = content?.button_link || "/visa";

    if (loading) {
        return (
            <section className="relative bg-white py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-12 lg:px-16">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 xl:gap-16">
                    {/* Left Side Skeleton */}
                    <div className="flex-1">
                        <Skeleton className="w-32 h-10 rounded-full mb-4" />
                        <Skeleton className="w-full h-20 md:h-24 rounded-2xl mb-6" />
                        <Skeleton className="w-full h-24 rounded-2xl mb-12" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mb-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="w-1/3 h-5 rounded-md" />
                                        <Skeleton className="w-full h-8 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Skeleton className="w-48 h-14 rounded-full" />
                    </div>
                    {/* Right Side Skeleton */}
                    <div className="w-full lg:w-[42%] xl:w-[38%] shrink-0 flex items-center justify-center">
                        <Skeleton className="w-full aspect-square max-w-[400px] lg:max-w-none rounded-[2rem]" />
                    </div>
                </div>
            </section>
        );
    }

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
                            {subtitle}
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-brand-heading leading-[1.1] mb-6">
                        {heading} <span className="text-[#FFA500]">{highlight}</span>
                    </h2>

                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-xl">
                        {description}
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
                    <Link href={buttonLink} className="inline-flex items-center gap-2 bg-[#FDB338] hover:bg-[#e9a42f] text-brand-heading font-heading font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all hover:-translate-y-1 shadow-lg shadow-[#FDB338]/20 group">
                        {buttonText}
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
