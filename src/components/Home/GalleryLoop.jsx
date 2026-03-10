import React from 'react';
import { motion } from 'framer-motion';

// Import assets
import gallery1 from '../../assets/gallery1.jpg';
import gallery2 from '../../assets/gallery2.jpg';
import gallery3 from '../../assets/gallery3.jpg';
import gallery4 from '../../assets/gallery4.jpg';
import gallery5 from '../../assets/gallery5.jpg';
import gallery6 from '../../assets/gallery6.jpg';

const staticGalleryImages = [
    gallery1.src || gallery1, gallery2.src || gallery2, gallery3.src || gallery3,
    gallery4.src || gallery4, gallery5.src || gallery5, gallery6.src || gallery6
];

const GalleryLoopSkeleton = () => (
    <section className="py-8 sm:py-12 overflow-hidden bg-slate-50 animate-pulse">
        <div className="flex gap-4 px-4 overflow-hidden justify-center">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex-shrink-0 w-[240px] h-[160px] bg-slate-100 rounded-xl" />
            ))}
        </div>
    </section>
);

export default function GalleryLoop({ images: apiImages, loading }) {
    if (loading) return <GalleryLoopSkeleton />;
    const baseImages = apiImages && apiImages.length > 0 ? apiImages : staticGalleryImages;
    // Repeat images to ensure enough content for the loop animation
    const galleryImages = [...baseImages, ...baseImages, ...baseImages];
    return (
        <section className="py-8 sm:py-12 overflow-hidden bg-transparent">
            <div className="relative">
                <motion.div
                    className="flex gap-3 sm:gap-4 px-4"
                    animate={{
                        x: [0, -1200],
                    }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {galleryImages.map((img, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[150px] sm:w-[200px] md:w-[240px] lg:w-[280px] h-[100px] sm:h-[140px] md:h-[160px] lg:h-[180px] rounded-xl overflow-hidden shadow-sm"
                        >
                            <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
