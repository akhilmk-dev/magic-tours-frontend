"use client";
import React from 'react';
import Hero from '../components/Home/Hero';
import Destinations from '../components/Home/Destinations';
import About from '../components/Home/About';
import PopularPackages from '../components/Home/PopularPackages';
import CruiseCategories from '../components/Home/CruiseCategories';
import HotelPackages from '../components/Home/HotelPackages';
import WondersOfQatar from '../components/Home/WondersOfQatar';
import PrivateJet from '../components/Home/PrivateJet';
import VisaServices from '../components/Home/VisaServices';
import FeaturedDestinations from '../components/Home/FeaturedDestinations';
import Gallery from '../components/Home/Gallery';
import Testimonials from '../components/Home/Testimonials';
import SpecialOffer from '../components/Home/SpecialOffer';
import BlogNews from '../components/Home/BlogNews';
import AdventureSection from '../components/Home/AdventureSection';
import GalleryLoop from '../components/Home/GalleryLoop';

export default function Home() {
    return (
        <main className="overflow-x-hidden">
            <Hero />
            <Destinations />
            <About />
            <PopularPackages />
            <CruiseCategories />
            <HotelPackages />
            <WondersOfQatar />
            <PrivateJet />
            <VisaServices />
            <FeaturedDestinations />
            <Gallery />
            <Testimonials />
            <SpecialOffer />
            <BlogNews />
            <AdventureSection />
            <GalleryLoop />
        </main>
    );
}
