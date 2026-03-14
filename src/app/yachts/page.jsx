"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Anchor, MapPin, ArrowRight, Ship, Compass, Wind, Camera } from 'lucide-react';

// Assets
import yachtHero from '../../assets/yacht-hero.png';
import yachtInterior from '../../assets/yacht-interior.png';
import yachtGrid from '../../assets/yacht-types-grid.png';
import motorboatImg from '../../assets/yacht-motorboat.png';
import dhowImg from '../../assets/yacht-dhow.png';
import catamaranImg from '../../assets/yacht-catamaran.png';
import formBg from '../../assets/form-background.png';

// Components
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';

const YachtsPage = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);

    const yachtTypes = [
        { id: 1, name: "Motorboat", img: motorboatImg, desc: "Fast and powerful, perfect for coastal exploration." },
        { id: 2, name: "Speedboats", img: motorboatImg, desc: "Ultimate thrill on the water with premium comfort." },
        { id: 3, name: "Dhows", img: dhowImg, desc: "Traditional wooden vessels for a cultural sailing experience." },
        { id: 4, name: "Catamarans", img: catamaranImg, desc: "Stable and spacious, ideal for luxury group charters." },
        { id: 5, name: "Gullet", img: dhowImg, desc: "Classic wooden yachts blending tradition with modern luxury." },
        { id: 6, name: "Houseboat", img: yachtInterior, desc: "Floating luxury homes for serene water retreats." },
        { id: 7, name: "Sail yacht", img: catamaranImg, desc: "Elegant wind-powered vessels for true maritime enthusiasts." }
    ];

    const currentType = yachtTypes[carouselIndex];
    const nextType = yachtTypes[(carouselIndex + 1) % yachtTypes.length];

    const handleNextSlide = () => {
        setCarouselIndex((prev) => (prev + 1) % yachtTypes.length);
    };

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-end overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={yachtHero.src || yachtHero}
                        alt="Luxury Yacht Charters"
                        className="w-full h-full object-cover object-center brightness-[1.1] grayscale-[10%] contrast-[1.05]"
                    />
                    {/* Stronger gradient overlay to ensure text readability, matching Private Jet styling */}
                    <div className="absolute inset-0 bg-gradient-to-l from-[#e6eff4]/95 via-[#e6eff4]/60 to-transparent md:from-[#e6eff4]/90 md:via-[#e6eff4]/20"></div>
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
                            <span className="text-[#113A74]">Exquisite Yacht </span>
                            <span className="text-[#FFA500]">Charters</span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-[13px] leading-loose max-w-sm ml-auto">
                            Discover the ultimate maritime luxury with our curated fleet of world-class yachts. From serene sunsets to high-speed adventures, we define oceanic excellence.
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
                            <span className="text-[#113A74]">Unmatched Comfort on<br /></span>
                            <span className="text-[#FFA500]">The Open Seas</span>
                        </h2>

                        <div className="space-y-4 text-gray-500 text-sm md:text-[13px] leading-[1.8]">
                            <p>
                                Experience the pinnacle of nautical luxury with our bespoke charter services. Our yachts are designed to provide unparalleled comfort, featuring state-of-the-art amenities and world-class crew services. Whether you are planning a romantic getaway, a corporate retreat, or a family adventure, our fleet offers the perfect vessel for every occasion.
                            </p>
                            <p>
                                Immerse yourself in the tranquility of the ocean while enjoying the finest hospitality. From gourmet dining on deck to exploring hidden turquoise bays, every moment aboard is crafted to be an unforgettable memory.
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
                                src={yachtInterior.src || yachtInterior}
                                alt="Luxurious Yacht Interior"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Yacht Types Carousel Section */}
            <section className="w-full bg-[#FFF6E9] py-20 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
                            <span className="text-[#113A74]">Explore Our </span>
                            <span className="text-[#FFA500]">Fleet Types</span>
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                            A diverse collection of vessels tailored to your specific maritime desires. Select from our range of modern boats and traditional dhows.
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
                                src={currentType.img.src || currentType.img}
                                alt={currentType.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay Gradient for Text Readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                            {/* Card Content Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-8 z-10">
                                <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4 sm:px-6 sm:py-5">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                            <Ship className="text-[#113A74] w-5 h-5" />
                                        </div>
                                        <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-heading mb-1">{currentType.name}</h3>
                                    </div>
                                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-lg">
                                        {currentType.desc}
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
                                    src={nextType.img.src || nextType.img}
                                    alt={nextType.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                {/* Card Content Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4">
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                <Compass className="text-[#113A74] w-4 h-4" />
                                            </div>
                                            <h3 className="text-white text-base sm:text-lg font-bold font-heading mb-1 truncate">{nextType.name}</h3>
                                        </div>
                                        <p className="text-white/70 text-xs leading-relaxed max-w-xs line-clamp-2">
                                            {nextType.desc}
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
                            <span>Request a </span>
                            <span className="text-[#FFA500]">Charter</span>
                        </h2>
                        <p className="text-white/80 text-sm md:text-[13px] leading-relaxed max-w-xl">
                            Tell us your requirements and our maritime experts will find the perfect yacht for your journey. Private events, luxury cruises, or adventure trips - we handle it all.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-center lg:items-stretch">

                        {/* Left: Form Card */}
                        <div className="w-full lg:w-[769px] lg:h-[618px] bg-white rounded-xl p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col justify-center">
                            <form className="space-y-6">
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Number of Guests</label>
                                        <input type="text" placeholder="e.g. 12" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Yacht Type</label>
                                        <select className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] text-gray-500 appearance-none bg-transparent focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors">
                                            {yachtTypes.map(type => (
                                                <option key={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Departure Point</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input type="text" placeholder="Port or City" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Destination To</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input type="text" placeholder="Port or City" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700" />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Charter Start Date</label>
                                        <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Duration (Days)</label>
                                        <input type="number" placeholder="e.g. 3" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-500" />
                                    </div>
                                </div>

                                {/* Row 4 */}
                                <div className="space-y-2 pt-2">
                                    <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Special Requests</label>
                                    <textarea rows={4} placeholder="Catering, water sports equipment, specific route..." className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors resize-none text-gray-500"></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button type="button" className="bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold py-3 px-8 rounded-full text-[13px] inline-flex items-center gap-2 transition-colors">
                                        Check Availability
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right: Image Card */}
                        <div className="w-full lg:w-[488px] flex lg:justify-end items-center mt-10 lg:mt-0">
                            <div className="relative w-full aspect-square lg:h-[512px] lg:w-[488px] lg:aspect-auto rounded-[1.5rem] overflow-hidden shadow-2xl group border border-white/10">
                                <img
                                    src={yachtGrid.src || yachtGrid}
                                    alt="Marine Fleet"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center mt-8">
                                    <h3 className="text-white text-3xl md:text-[2.5rem] font-bold font-heading mb-4 drop-shadow-md leading-tight">
                                        Discover All<br />Fleet Options
                                    </h3>
                                    <p className="text-white/90 text-[15px] max-w-[240px] drop-shadow-sm font-medium">
                                        Wide range of traditional and modern vessels
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Adventure Section */}
            <AdventureSection />

            {/* Gallery Loop Section */}
            <GalleryLoop />
        </div>
    );
};

export default YachtsPage;
