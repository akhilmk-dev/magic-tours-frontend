"use client";
import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const FavoriteButton = ({ packageId, className = "" }) => {
    const { favorites, toggleFavorite } = useCustomerAuth();
    const isFavorited = favorites.includes(String(packageId));

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(packageId);
            }}
            className={`flex items-center justify-center p-2 rounded-full transition-all shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white ${className}`}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isFavorited ? 'filled' : 'outline'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Heart 
                        size={18} 
                        fill={isFavorited ? "#EF4444" : "none"} 
                        stroke={isFavorited ? "#EF4444" : "currentColor"}
                        className={isFavorited ? "" : "text-gray-400"}
                    />
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
};

export default FavoriteButton;
