import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                            onClick={() => setSelectedImage(img)}
                            className="flex-shrink-0 w-[150px] sm:w-[200px] md:w-[240px] lg:w-[280px] h-[100px] sm:h-[140px] md:h-[160px] lg:h-[180px] rounded-xl overflow-hidden shadow-sm cursor-pointer group"
                        >
                            <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white bg-white/20 hover:bg-white/40 rounded-full p-2.5 transition-colors z-[60]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            src={selectedImage}
                            alt="Gallery preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl z-50 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
