import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Import assets
import sectionBg from '../../assets/Section.png';
import gutter from '../../assets/gutter.png';

export default function AdventureSection() {
    const router = useRouter();
    return (
        <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden w-full">
            {/* Background Image - scaled up to crop out built-in white padding in Section.png */}
            <div
                className="absolute z-0"
                style={{
                    inset: '-5%',
                    width: '110%',
                    height: '110%',
                    backgroundImage: `url(${sectionBg.src || sectionBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Content Container */}
            <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
                <div className="max-w-4xl w-full">
                    <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#113A74] leading-tight mb-2 font-heading">
                        Adventure Awaits
                    </h2>
                    <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-8 font-heading">
                        Explore the World
                    </h3>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => router.push('/tours')}
                            className="bg-[#FDB338] hover:bg-[#e5a232] text-brand-heading px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold transition-all flex items-center gap-2 group shadow-lg text-sm sm:text-base"
                        >
                            Plan My Trip
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Gutter/Cutter */}
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
                <img
                    src={gutter.src || gutter}
                    alt="Section Gutter"
                    className="w-full h-auto object-cover min-h-[50px] sm:min-h-[80px]"
                />
            </div>
        </section>
    );
}
