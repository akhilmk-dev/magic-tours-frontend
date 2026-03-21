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
            <Destinations content={homeData?.sections_content?.destinations} loading={loading} />
            <About content={homeData?.sections_content?.about} loading={loading} />
            <PopularPackages packages={homeData?.packages} content={homeData?.sections_content?.popular_packages} loading={loading} />
            <CruiseCategories cruises={homeData?.custom_cruises} content={homeData?.sections_content?.cruises} loading={loading} />
            <HotelPackages hotels={homeData?.hotels} content={homeData?.sections_content?.hotels} loading={loading} />
            <WondersOfQatar spotlights={homeData?.destination_spotlight} content={homeData?.sections_content?.destination_spotlight} loading={loading} />
            <PrivateJet jets={homeData?.custom_private_jets} content={homeData?.sections_content?.private_jets} loading={loading} />
            <VisaServices content={homeData?.sections_content?.visa} loading={loading} />
            <FeaturedDestinations initialDestinations={homeData?.destinations} allPackages={homeData?.packages} content={homeData?.sections_content?.featured_destinations} loading={loading} />
            <Gallery images={homeData?.gallery_images} loading={loading} />
            <Testimonials testimonials={homeData?.testimonials} content={homeData?.sections_content?.testimonials} loading={loading} />
            <SpecialOffer content={homeData?.sections_content?.special_offer} loading={loading} />
            <BlogNews blogs={homeData?.blogs} content={homeData?.sections_content?.blogs} loading={loading} />
            <AdventureSection content={homeData?.sections_content?.adventure} loading={loading} />
            <GalleryLoop images={homeData?.bottom_slider_images} loading={loading} />
        </main>
    );
}
