import React from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from '../common/Skeleton';
import { ArrowRight } from 'lucide-react';


// Import assets
import sectionBg from '../../assets/Section.png';
import gutter from '../../assets/gutter.png';

export default function AdventureSection({ content, loading }) {
    // Determine title parts (Line 1)
    let title_line1 = content?.title_line1 || "Adventure";
    let title_highlight = content?.title_highlight || "Awaits";

    if (content?.adventure_title) {
        const titleParts = content.adventure_title.trim().split(' ');
        if (titleParts.length > 1) {
            title_highlight = titleParts.pop();
            title_line1 = titleParts.join(' ');
        } else {
            title_line1 = content.adventure_title;
            title_highlight = "";
        }
    }

    // Determine subtitle parts (Line 2)
    // Note: The UI uses white for both parts of the subtitle, so we don't strictly need to split it 
    // but we'll handle it for consistency if we want to keep the highlight structure.
    let subtitle_line1 = content?.subtitle_line1 || "Explore the";
    let subtitle_highlight = content?.subtitle_highlight || "World";

    if (content?.adventure_subtitle) {
        const subtitleParts = content.adventure_subtitle.trim().split(' ');
        if (subtitleParts.length > 1) {
            subtitle_highlight = subtitleParts.pop();
            subtitle_line1 = subtitleParts.join(' ');
        } else {
            subtitle_line1 = content.adventure_subtitle;
            subtitle_highlight = "";
        }
    }

    const button1Text = content?.adventure_button1_text || content?.button1_text || "Explore Packages";
    const button1Link = content?.adventure_button1_link || content?.button1_link || "/tours";
    const button2Text = content?.adventure_button2_text || content?.button2_text || "Explore Destinations";
    const button2Link = content?.adventure_button2_link || content?.button2_link || "/destinations";

    const router = useRouter();
    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 text-center">
                    <Skeleton className="w-48 h-8 mx-auto rounded-full mb-6" />
                    <Skeleton className="w-full max-w-2xl h-16 mx-auto rounded-xl mb-12" />
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Skeleton className="w-48 h-14 rounded-full" />
                        <Skeleton className="w-48 h-14 rounded-full" />
                    </div>
                </div>
            </section>
        );
    }

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
                        {title_line1} <span className="text-brand-magic">{title_highlight}</span>
                    </h2>
                    <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-8 font-heading">
                        {subtitle_line1} <span className="text-white">{subtitle_highlight}</span>
                    </h3>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full max-w-xl mx-auto px-4 sm:px-0">
                        <button 
                            onClick={() => router.push(button1Link)}
                            className="bg-[#FDB338] hover:bg-[#e5a232] text-[#113A74] px-4 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 group shadow-lg text-sm sm:text-base whitespace-nowrap w-[230px]"
                        >
                            {button1Text}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                        </button>
                        
                        <button 
                            onClick={() => router.push(button2Link)}
                            className="bg-transparent hover:bg-white text-white hover:text-[#113A74] border-2 border-white px-4 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 group text-sm sm:text-base whitespace-nowrap shadow-sm w-[230px]"
                        >
                            {button2Text}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
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
