"use client";
import React, { useState, useEffect } from 'react';
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

import { api } from '../api/client';

export default function Home() {
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/homepage')
            .then(result => {
                if (result.data) setHomeData(result.data);
            })
            .catch(err => console.error("Error fetching home data:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="overflow-x-hidden">
            <Hero slides={homeData?.hero_slides} loading={loading} />
            <Destinations />
            <About />
            <PopularPackages packages={homeData?.packages} loading={loading} />
            <CruiseCategories cruises={homeData?.custom_cruises} loading={loading} />
            <HotelPackages hotels={homeData?.hotels} loading={loading} />
            <WondersOfQatar spotlights={homeData?.destination_spotlight} loading={loading} />
            <PrivateJet jets={homeData?.custom_private_jets} loading={loading} />
            <VisaServices />
            <FeaturedDestinations />
            <Gallery images={homeData?.gallery_images} loading={loading} />
            <Testimonials testimonials={homeData?.testimonials} loading={loading} />
            <SpecialOffer />
            <BlogNews blogs={homeData?.blogs} loading={loading} />
            <AdventureSection />
            <GalleryLoop images={homeData?.bottom_slider_images} loading={loading} />
        </main>
    );
}
