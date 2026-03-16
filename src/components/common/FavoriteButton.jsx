"use client";
import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const FavoriteButton = ({ packageId, className = "" }) => {
    const { favorites, toggleFavorite } = useCustomerAuth();
    const isFavorited = favorites.includes(packageId);

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(packageId);
            }}
            className={`flex items-center justify-center p-2 rounded-full transition-all shadow-lg backdrop-blur-sm ${
                isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
            } ${className}`}
        >
            <Heart 
                size={18} 
                fill={isFavorited ? "currentColor" : "none"} 
                className={isFavorited ? "scale-110" : ""}
            />
        </motion.button>
    );
};

export default FavoriteButton;
