import React from 'react';
import Hero from '../components/Home/Hero';
import Destinations from '../components/Home/Destinations';
import About from '../components/Home/About';
import PopularPackages from '../components/Home/PopularPackages';
import CruiseCategories from '../components/Home/CruiseCategories';
import WondersOfQatar from '../components/Home/WondersOfQatar';
import PrivateJet from '../components/Home/PrivateJet';
import VisaServices from '../components/Home/VisaServices';
import FeaturedDestinations from '../components/Home/FeaturedDestinations';
import Gallery from '../components/Home/Gallery';
import TourTypes from '../components/Home/TourTypes';
import Testimonials from '../components/Home/Testimonials';
import SpecialOffer from '../components/Home/SpecialOffer';
import CTA from '../components/Home/CTA';

export default function Home() {
    return (
        <main className="overflow-x-hidden">
            <Hero />
            <Destinations />
            <About />
            <PopularPackages />
            <CruiseCategories />
            <WondersOfQatar />
            <PrivateJet />
            <VisaServices />
            <FeaturedDestinations />
            <Gallery />
            <TourTypes />
            <Testimonials />
            <SpecialOffer />
            <CTA />
        </main>
    );
}
