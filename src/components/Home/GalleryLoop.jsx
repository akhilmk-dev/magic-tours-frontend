import React from 'react';
import { motion } from 'framer-motion';

// Import assets
import gallery1 from '../../assets/gallery1.jpg';
import gallery2 from '../../assets/gallery2.jpg';
import gallery3 from '../../assets/gallery3.jpg';
import gallery4 from '../../assets/gallery4.jpg';
import gallery5 from '../../assets/gallery5.jpg';
import gallery6 from '../../assets/gallery6.jpg';

const galleryImages = [
    gallery1, gallery2, gallery3, gallery4, gallery5, gallery6,
    gallery1, gallery2, gallery3, gallery4, gallery5, gallery6,
    gallery1, gallery2, gallery3, gallery4, gallery5, gallery6
];

export default function GalleryLoop() {
    return (
        <section className="py-8 sm:py-12 overflow-hidden bg-white">
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
