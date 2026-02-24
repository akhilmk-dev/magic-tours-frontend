import React, { useState, useCallback } from 'react';
import AirplaneScrollIntro from '../components/Home/AirplaneScrollIntro';
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
    const [introComplete, setIntroComplete] = useState(false);

    const handleIntroComplete = useCallback(() => {
        setIntroComplete(true);
    }, []);

    return (
        <>
            {/* Scroll-driven airplane + fog intro overlay */}
            {!introComplete && (
                <AirplaneScrollIntro onComplete={handleIntroComplete} />
            )}

            {/* Main page content — reveals as fog clears */}
            <main
                className="overflow-x-hidden"
                style={{
                    opacity: introComplete ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                    // Reserve space so the overlay can be scrolled through
                    marginTop: introComplete ? 0 : '120vh',
                }}
            >
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
        </>
    );
}
