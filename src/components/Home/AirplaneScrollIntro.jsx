import React, { useEffect, useRef, useState } from 'react';

export default function AirplaneScrollIntro({ onComplete }) {
    const [progress, setProgress] = useState(0);   // 0 → 1
    const [done, setDone] = useState(false);
    const ticking = useRef(false);

    useEffect(() => {
        const threshold = window.innerHeight * 1.2; // scroll this many px to complete

        const onScroll = () => {
            if (!ticking.current) {
                ticking.current = true;
                requestAnimationFrame(() => {
                    const p = Math.min(window.scrollY / threshold, 1);
                    setProgress(p);
                    if (p >= 1 && !done) {
                        setDone(true);
                        onComplete && onComplete();
                    }
                    ticking.current = false;
                });
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [done, onComplete]);

    if (done) return null;

    // Derived values from progress
    const planeTop = 6 + progress * 72;           // 6% → 78%
    const fogOpacity = Math.min(progress * 2.5, 1); // fades in quickly
    const fogWidth = progress * 55;               // 0% → 55% each side
    const fogBlur = progress * 40;               // 0px → 40px blur
    const overlayOpacity = progress >= 0.85 ? 1 - (progress - 0.85) / 0.15 : 1;
    const planeScale = 1 + progress * 0.3;          // slight perspective grow
    const trailLength = progress * 100;              // fog trail behind plane

    return (
        /* Fixed overlay — sits on top of everything */
        <div
            className="airplane-intro-overlay"
            style={{
                opacity: overlayOpacity,
                pointerEvents: progress >= 0.9 ? 'none' : 'auto',
            }}
        >
            {/* Sky gradient */}
            <div className="airplane-intro-sky" />

            {/* ── Cloud rows (static decorative) ── */}
            <div className="airplane-intro-clouds-row" style={{ top: '12%', opacity: 0.4 }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="airplane-intro-cloud-puff" style={{ animationDelay: `${i * 0.7}s` }} />
                ))}
            </div>
            <div className="airplane-intro-clouds-row" style={{ top: '35%', opacity: 0.3 }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="airplane-intro-cloud-puff" style={{ animationDelay: `${i * 1.1}s`, width: '160px', height: '60px' }} />
                ))}
            </div>

            {/* ── Airplane ── */}
            <div
                className="airplane-intro-plane"
                style={{
                    top: `${planeTop}%`,
                    transform: `translateX(-50%) scale(${planeScale})`,
                }}
            >
                {/* Contrail / vapor trail above plane */}
                <div
                    className="airplane-intro-contrail"
                    style={{
                        height: `${trailLength}px`,
                        opacity: Math.min(progress * 2, 0.7),
                    }}
                />

                {/* Fog blast left + right around plane */}
                <div
                    className="airplane-intro-fog fog-left"
                    style={{
                        width: `${fogWidth}vw`,
                        opacity: fogOpacity,
                        filter: `blur(${fogBlur * 0.5}px)`,
                    }}
                />
                <div
                    className="airplane-intro-fog fog-right"
                    style={{
                        width: `${fogWidth}vw`,
                        opacity: fogOpacity,
                        filter: `blur(${fogBlur * 0.5}px)`,
                    }}
                />

                {/* Plane SVG */}
                <svg
                    viewBox="0 0 100 100"
                    className="airplane-intro-plane-svg"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Body */}
                    <ellipse cx="50" cy="50" rx="38" ry="14" fill="white" stroke="#d1d5db" strokeWidth="1.5" />
                    {/* Nose */}
                    <ellipse cx="83" cy="50" rx="8" ry="9" fill="white" stroke="#d1d5db" strokeWidth="1.5" />
                    {/* Tail fin */}
                    <path d="M16 50 Q8 30 20 28 L28 50 Z" fill="#0F1E32" />
                    {/* Wing one */}
                    <path d="M55 50 Q65 20 90 25 L82 50 Z" fill="#0F1E32" />
                    {/* Wing two */}
                    <path d="M55 50 Q65 80 90 75 L82 50 Z" fill="#0F1E32" />
                    {/* Small rear winglet */}
                    <path d="M22 50 Q18 38 26 36 L30 50 Z" fill="#1E3A5F" />
                    {/* Window row */}
                    {[38, 48, 58, 68].map((x, i) => (
                        <ellipse key={i} cx={x} cy="48" rx="4" ry="5" fill="#93C5FD" opacity="0.8" />
                    ))}
                    {/* Engine pod */}
                    <ellipse cx="65" cy="58" rx="9" ry="5" fill="#374151" stroke="#6b7280" strokeWidth="1" />
                    <ellipse cx="65" cy="42" rx="9" ry="5" fill="#374151" stroke="#6b7280" strokeWidth="1" />
                    {/* Engine intake ring */}
                    <ellipse cx="57" cy="58" rx="3" ry="5" fill="#1f2937" />
                    <ellipse cx="57" cy="42" rx="3" ry="5" fill="#1f2937" />
                </svg>

                {/* Orange glow pulse below plane */}
                <div
                    className="airplane-intro-glow"
                    style={{ opacity: Math.min(progress * 3, 0.6) }}
                />
            </div>

            {/* ── Wide fog curtain that sweeps across viewport ── */}
            <div
                className="airplane-intro-fog-curtain-left"
                style={{
                    top: `${planeTop}%`,
                    width: `${fogWidth}vw`,
                    opacity: fogOpacity,
                    filter: `blur(${fogBlur}px)`,
                }}
            />
            <div
                className="airplane-intro-fog-curtain-right"
                style={{
                    top: `${planeTop}%`,
                    width: `${fogWidth}vw`,
                    opacity: fogOpacity,
                    filter: `blur(${fogBlur}px)`,
                }}
            />

            {/* ── Full-width fog SURGE that fills the screen near the end ── */}
            {progress > 0.55 && (
                <div
                    className="airplane-intro-fog-surge"
                    style={{
                        top: `${planeTop - 15}%`,
                        opacity: Math.min((progress - 0.55) * 3, 1),
                    }}
                />
            )}

            {/* Scroll prompt */}
            {progress < 0.08 && (
                <div className="airplane-intro-scroll-hint">
                    <svg className="animate-bounce" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                    <span>Scroll to explore</span>
                </div>
            )}
        </div>
    );
}
