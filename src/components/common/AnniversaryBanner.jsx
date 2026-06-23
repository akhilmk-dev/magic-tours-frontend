"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

// Module-level flag: once dismissed (closed or auto-hidden) it stays dismissed while
// navigating between Home/About. A full page refresh re-evaluates this module, so the
// flag resets and the banner shows again — exactly the requested behavior.
let dismissed = false;

// Pages where the banner is allowed.
const ALLOWED_PATHS = ['/', '/about'];
const AUTO_HIDE_MS = 12000;

export default function AnniversaryBanner({ imageUrl }) {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);

    const onAllowedPage = ALLOWED_PATHS.includes(pathname);

    useEffect(() => {
        // Show only on allowed pages, only if there's an image, and only if not yet
        // dismissed. State updates are deferred (timeout 0) so they don't run
        // synchronously inside the effect body.
        const shouldShow = !!imageUrl && onAllowedPage && !dismissed;
        const showTimer = setTimeout(() => setVisible(shouldShow), 0);

        let hideTimer;
        if (shouldShow) {
            hideTimer = setTimeout(() => {
                dismissed = true;
                setVisible(false);
            }, AUTO_HIDE_MS);
        }
        return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }, [imageUrl, onAllowedPage]);

    const handleClose = () => {
        dismissed = true;
        setVisible(false);
    };

    if (!imageUrl) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed right-4 sm:right-6 bottom-24 sm:bottom-28 z-[2147483647]"
                    style={{ perspective: '1000px' }}
                >
                    <div className="relative w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px]">
                        {/* Logo — 3D horizontal sway (always shows "15" upright, never mirrored) */}
                        <motion.img
                            src={imageUrl}
                            alt="Anniversary"
                            className="w-full h-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.4)]"
                            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                            animate={{ rotateY: [-32, 32, -32] }}
                            transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
                        />
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Close anniversary badge"
                            className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-colors shadow-md z-10"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
