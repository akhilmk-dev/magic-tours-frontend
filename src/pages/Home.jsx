import React from 'react';
import Hero from '../components/Home/Hero';
import Destinations from '../components/Home/Destinations';
import About from '../components/Home/About';
import Packages from '../components/Home/Packages';
import FeaturedDestinations from '../components/Home/FeaturedDestinations';
import Gallery from '../components/Home/Gallery';
import TourTypes from '../components/Home/TourTypes';
import Testimonials from '../components/Home/Testimonials';
import CTA from '../components/Home/CTA';

export default function Home() {
    return (
        <main className="overflow-x-hidden">
            <Hero />
            <Destinations />
            <About />
            <Packages />
            <FeaturedDestinations />
            <Gallery />
            <TourTypes />
            <Testimonials />
            <CTA />
        </main>
    );
}
