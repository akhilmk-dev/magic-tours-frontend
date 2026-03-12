"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plane, MapPin, ArrowRight } from 'lucide-react';

// Assets
import jetImg from '../../assets/jet.png';
import interiorImg from '../../assets/Rectangle 642.png';
import jet1 from '../../assets/private-jet-1.png';
import jet2 from '../../assets/private-jet-2.png';
import formBg from '../../assets/form-background.png';
import wingBg from '../../assets/Background (1).png';

const PrivateJetsPage = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);

    const carouselJets = [
        { id: 1, name: "Bombardier Global 7500", img: jet1 },
        { id: 2, name: "Bombardier Global 7500", img: jet2 },
        { id: 3, name: "Gulfstream G650ER", img: jet1 },
        { id: 4, name: "Cessna Citation Longitude", img: jet2 }
    ];

    const handleNextSlide = () => {
        setCarouselIndex((prev) => (prev + 1) % carouselJets.length);
    };
    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-end overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={jetImg.src || jetImg}
                        alt="Private Jet Charter"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Subtle gradient overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-l from-[#e6eff4]/80 via-[#e6eff4]/40 to-transparent md:from-[#e6eff4]/70 md:via-[#e6eff4]/10"></div>
                </div>

                {/* Hero Content aligned to the right */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-[50%] lg:w-[45%] text-right pt-20"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold font-heading mb-6 drop-shadow-sm">
                            <span className="text-[#113A74]">Elite Private </span>
                            <span className="text-[#FFA500]">Jet Charters</span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-[13px] leading-loose max-w-sm ml-auto">
                            Lorem ipsum dolor sit amet consectetur. Diam tempor tortor neque id tempor mi egestas. There are many variations of passages of Lorem Ipsum avalab but.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Split Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-[55%] space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold font-heading leading-tight mb-8">
                            <span className="text-[#113A74]">Lorem ipsum dolor sit<br /></span>
                            <span className="text-[#FFA500]">amet consectetur</span>
                        </h2>

                        <div className="space-y-4 text-gray-500 text-sm md:text-[13px] leading-[1.8]">
                            <p>
                                Lorem ipsum dolor sit amet consectetur. Consequat vitae cras mattis mi tempus sit bibendum et. Consequat sit feugiat sollicitudin at quisque malesuada cursus diam adipiscing. Consequat vel sagittis at ipsum vestibulum est sit. Nunc et turpis augue magna consequat enim vulputate condimentum. Lorem ipsum dolor sit amet consectetur. Consequat vitae cras mattis mi tempus sit bibendum et. Consequat sit feugiat sollicitudin at quisque malesuada cursus diam adipiscing. Consequat vel sagittis at ipsum vestibulum est sit. Nunc et turpis augue magna consequat enim vulputate condimentum.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-[40%] lg:ml-auto"
                    >
                        <div className="rounded-[1.5rem] overflow-hidden shadow-xl aspect-[4/3] lg:aspect-[5/4] w-full">
                            <img
                                src={interiorImg.src || interiorImg}
                                alt="Luxurious Private Jet Interior"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Aircraft Carousel Section */}
            <section className="w-full bg-[#FFF6E9] py-20 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
                            <span className="text-[#113A74]">Lorem ipsum </span>
                            <span className="text-[#FFA500]">dolor</span>
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                            Lorem ipsum dolor sit amet consectetur. Diam tempor tortor neque id tempor mi egestas. There are many variations of passages of Lorem Ipsum avalab but.
                        </p>
                    </div>

                    {/* Carousel Layout */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch relative min-h-[450px]">

                        {/* Left Card (Active/Large) */}
                        <motion.div
                            key={`left-${carouselIndex}`}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full lg:w-[60%] relative rounded-[2rem] overflow-hidden group shadow-lg aspect-[4/3] lg:aspect-auto"
                        >
                            <img
                                src={carouselJets[carouselIndex].img.src || carouselJets[carouselIndex].img}
                                alt={carouselJets[carouselIndex].name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay Gradient for Text Readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                            {/* Card Content Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-8 z-10">
                                <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4 sm:px-6 sm:py-5">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                            <svg className="text-[#113A74]" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                                            </svg>
                                        </div>
                                        <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-heading mb-1">{carouselJets[carouselIndex].name}</h3>
                                    </div>
                                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-lg">
                                        Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column (Secondary Card + Next Button) */}
                        <div className="w-full lg:w-[40%] flex flex-col justify-between gap-8 h-full">

                            {/* Secondary Card */}
                            <motion.div
                                key={`right-${carouselIndex}`}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="w-full rounded-[2rem] overflow-hidden relative group shadow-md flex-1 min-h-[300px]"
                            >
                                <img
                                    src={carouselJets[(carouselIndex + 1) % carouselJets.length].img.src || carouselJets[(carouselIndex + 1) % carouselJets.length].img}
                                    alt={carouselJets[(carouselIndex + 1) % carouselJets.length].name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                {/* Card Content Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4">
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                <svg className="text-[#113A74]" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" transform="rotate(45 12 12)" />
                                                </svg>
                                            </div>
                                            <h3 className="text-white text-base sm:text-lg font-bold font-heading mb-1 truncate">{carouselJets[(carouselIndex + 1) % carouselJets.length].name}</h3>
                                        </div>
                                        <p className="text-white/70 text-xs leading-relaxed max-w-xs line-clamp-2">
                                            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Arrow Button */}
                            <div className="flex justify-start">
                                <button
                                    onClick={handleNextSlide}
                                    className="w-14 h-14 md:w-16 md:h-16 border border-[#113A74]/30 rounded-full flex items-center justify-center text-[#113A74] hover:bg-[#113A74] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 group shadow-sm bg-transparent"
                                >
                                    <ArrowUpRight className="w-6 h-6 transition-transform group-hover:rotate-45" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section
                className="w-full relative py-20 lg:py-28 overflow-hidden bg-[#1A2639]"
                style={{
                    backgroundImage: `url(${formBg.src || formBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 text-white">
                            <span>Lorem ipsum </span>
                            <span className="text-[#FFA500]">dolor</span>
                        </h2>
                        <p className="text-white/80 text-sm md:text-[13px] leading-relaxed max-w-xl">
                            Lorem ipsum dolor sit amet consectetur. Diam tempor tortor neque id tempor mi egestas.There are many variations of passages of Lorem Ipsum avalab but .
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-center lg:items-stretch">

                        {/* Left: Form Card */}
                        <div className="w-full lg:w-[769px] lg:h-[618px] bg-white rounded-xl p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col justify-center">
                            <form className="space-y-6">
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Number of Passengers</label>
                                        <input type="text" placeholder="e.g. 4" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Travel Class</label>
                                        <select className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] text-gray-500 appearance-none bg-transparent focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors">
                                            <option>Business Class</option>
                                            <option>First Class</option>
                                            <option>Economy</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Departing From</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input type="text" placeholder="Airport or City" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Destination To</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input type="text" placeholder="Airport or City" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700" />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Departure Date & Time</label>
                                        <input type="text" placeholder="mm /dd/yyyy, --:-- --" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Return Date & Time</label>
                                        <input type="text" placeholder="mm /dd/yyyy, --:-- --" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-500" />
                                    </div>
                                </div>

                                {/* Row 4 */}
                                <div className="space-y-2 pt-2">
                                    <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Additional Notes</label>
                                    <textarea rows={4} placeholder="Special requirements, pets, dietary preferences..." className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors resize-none text-gray-500"></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button type="button" className="bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold py-3 px-8 rounded-full text-[13px] inline-flex items-center gap-2 transition-colors">
                                        Submit Request
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right: Image Card */}
                        <div className="w-full lg:w-[488px] flex lg:justify-end items-center mt-10 lg:mt-0">
                            <div className="relative w-full aspect-square lg:h-[512px] lg:w-[488px] lg:aspect-auto rounded-[1.5rem] overflow-hidden shadow-2xl group">
                                <img
                                    src={wingBg.src || wingBg}
                                    alt="Private Jet View"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center mt-8">
                                    <h3 className="text-white text-3xl md:text-[2.5rem] font-bold font-heading mb-4 drop-shadow-md leading-tight">
                                        Suscipit<br />scelerisque
                                    </h3>
                                    <p className="text-white/90 text-[15px] max-w-[240px] drop-shadow-sm font-medium">
                                        and get discount next flights with our card
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivateJetsPage;
