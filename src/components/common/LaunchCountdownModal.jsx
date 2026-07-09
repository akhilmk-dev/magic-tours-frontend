"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const LAUNCH_DATE = new Date('2026-07-19T00:00:00');
const SESSION_KEY = 'launch_modal_dismissed';

function getTimeLeft() {
    const now = new Date();
    const diff = LAUNCH_DATE - now;
    if (diff <= 0) return null;
    return {
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function pad(n) {
    return String(n).padStart(2, '0');
}

export default function LaunchCountdownModal() {
    const [open, setOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (sessionStorage.getItem(SESSION_KEY)) return;
        if (!getTimeLeft()) return; // already launched
        const timer = setTimeout(() => setOpen(true), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!open) return;
        const interval = setInterval(() => {
            const t = getTimeLeft();
            if (!t) { setOpen(false); return; }
            setTimeLeft(t);
        }, 1000);
        return () => clearInterval(interval);
    }, [open]);

    const dismiss = () => {
        setOpen(false);
        sessionStorage.setItem(SESSION_KEY, '1');
    };

    if (!open || !timeLeft) return null;

    const units = [
        { label: 'DAYS',    value: pad(timeLeft.days)    },
        { label: 'HOURS',   value: pad(timeLeft.hours)   },
        { label: 'MINUTES', value: pad(timeLeft.minutes) },
        { label: 'SECONDS', value: pad(timeLeft.seconds) },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}>
            <div className="relative w-full max-w-[500px] rounded-2xl overflow-hidden my-auto"
                style={{
                    background: 'rgba(30,30,40,0.65)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                }}>

                {/* Close button */}
                <button onClick={dismiss}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                    aria-label="Close">
                    <X size={16} className="text-white" />
                </button>

                <div className="px-5 sm:px-10 py-8 sm:py-12 text-center">
                    {/* Tag line */}
                    <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-3 sm:mb-4"
                        style={{ color: '#FFA500' }}>
                        WE&apos;RE LAUNCHING SOON ✨
                    </p>

                    {/* Heading */}
                    <h2 className="text-2xl sm:text-4xl font-heading font-bold text-white mb-1" style={{ lineHeight: 1.15 }}>
                        Something Magical
                    </h2>
                    <h2 className="text-2xl sm:text-4xl font-heading font-bold mb-6 sm:mb-10" style={{ lineHeight: 1.15 }}>
                        <span style={{ color: '#4fc3f7' }}>is </span>
                        <span style={{ color: '#4fc3f7' }}>on </span>
                        <span style={{ color: '#FFA500' }}>the </span>
                        <span style={{ color: '#a5d6a7' }}>way</span>
                    </h2>

                    {/* Countdown */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        {units.map((u, i) => (
                            <React.Fragment key={u.label}>
                                <div className="flex flex-col items-center">
                                    <div className="w-[62px] h-[56px] sm:w-[80px] sm:h-[70px] rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'rgba(255,255,255,0.07)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                        }}>
                                        <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">
                                            {u.value}
                                        </span>
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest mt-2"
                                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                                        {u.label}
                                    </span>
                                </div>
                                {i < units.length - 1 && (
                                    <span className="text-2xl sm:text-3xl font-black mb-5 select-none"
                                        style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        :
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
