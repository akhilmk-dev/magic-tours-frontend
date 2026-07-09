import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import sectionBg from '../../assets/Section.png';
import gutter from '../../assets/gutter.png';

export default function AdventureSection({ content, loading }) {
    const [settings, setSettings] = useState(null);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('https://api.magictours.qa/settings/public')
            .then(res => res.json())
            .then(data => { if (data?.data) setSettings(data.data); })
            .catch(() => {})
            .finally(() => setSettingsLoading(false));
    }, []);

    if (loading || settingsLoading) return null;

    // Homepage passes content from /homepage API (adventure_title etc.)
    // Other pages fall back to settings API which uses footer_slider object
    const slider = settings?.footer_slider || {};

    const adventureTitle    = content?.adventure_title    || slider.title_1      || '';
    const adventureSubtitle = content?.adventure_subtitle || slider.title_2      || '';
    const button1Text       = content?.adventure_button1_text || slider.button_1_text || '';
    const rawButton1Link    = content?.adventure_button1_link || slider.button_1_link || '';
    const button1Link       = rawButton1Link === '/packages' ? '/tours' : rawButton1Link;
    const button2Text       = content?.adventure_button2_text || slider.button_2_text || '';
    const rawButton2Link    = content?.adventure_button2_link || slider.button_2_link || '';
    const button2Link       = rawButton2Link === '/packages' ? '/tours' : rawButton2Link;

    // Nothing to show if no content from API
    if (!adventureTitle && !adventureSubtitle && !button1Text && !button2Text) return null;

    // Split title into main + highlight (last word)
    let titleLine = adventureTitle;
    let titleHighlight = '';
    if (adventureTitle) {
        const parts = adventureTitle.trim().split(' ');
        if (parts.length > 1) {
            titleHighlight = parts.pop();
            titleLine = parts.join(' ');
        }
    }

    let subtitleLine = adventureSubtitle;
    let subtitleHighlight = '';
    if (adventureSubtitle) {
        const parts = adventureSubtitle.trim().split(' ');
        if (parts.length > 1) {
            subtitleHighlight = parts.pop();
            subtitleLine = parts.join(' ');
        }
    }

    return (
        <section className="relative min-h-[320px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden w-full">
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

            <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
                <div className="max-w-4xl w-full">
                    {adventureTitle && (
                        <h2 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#113A74] leading-tight mb-2 font-heading">
                            {titleLine} {titleHighlight && <span className="text-brand-magic">{titleHighlight}</span>}
                        </h2>
                    )}
                    {adventureSubtitle && (
                        <h3 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-6 sm:mb-8 font-heading">
                            {subtitleLine} {subtitleHighlight && <span className="text-white">{subtitleHighlight}</span>}
                        </h3>
                    )}

                    {(button1Text || button2Text) && (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-8 w-full max-w-xl mx-auto px-4 sm:px-0">
                            {button1Text && button1Link && (
                                <button
                                    onClick={() => router.push(button1Link)}
                                    className="bg-[#FDB338] hover:bg-[#e5a232] text-[#113A74] px-4 py-3 sm:py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 group shadow-lg text-sm sm:text-base w-full sm:w-[230px] max-w-[260px]"
                                >
                                    {button1Text}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                                </button>
                            )}
                            {button2Text && button2Link && (
                                <button
                                    onClick={() => router.push(button2Link)}
                                    className="bg-transparent hover:bg-white text-white hover:text-[#113A74] border-2 border-white px-4 py-3 sm:py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 group text-sm sm:text-base shadow-sm w-full sm:w-[230px] max-w-[260px]"
                                >
                                    {button2Text}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Bottom gutter wave */}
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
                <img
                    src={gutter.src || gutter}
                    alt=""
                    className="w-full h-auto object-cover min-h-[50px] sm:min-h-[80px]"
                />
            </div>
        </section>
    );
}
