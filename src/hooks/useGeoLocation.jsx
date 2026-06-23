"use client";
import { useState, useEffect } from 'react';

const FALLBACK_MAPS_KEY = 'AIzaSyD8L237G-BLrf0hQtqaTdTiezwwqEzoq4A';
const CACHE_KEY = 'geo_location';

export function useGeoLocation(apiKey) {
    const [location, setLocation] = useState(null);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator?.geolocation) {
            return;
        }

        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const t = setTimeout(() => { setLocation(cached); setStatus('granted'); }, 0);
            return () => clearTimeout(t);
        }

        const key = apiKey || FALLBACK_MAPS_KEY;
        let cancelled = false;

        const startTimer = setTimeout(() => setStatus('loading'), 0);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${key}&result_type=locality|country`;
                    const res = await fetch(url);
                    const data = await res.json();

                    let city = '';
                    let country = '';
                    (data?.results || []).forEach(result => {
                        (result.address_components || []).forEach(comp => {
                            if (!city && comp.types?.includes('locality')) city = comp.long_name;
                            if (!country && comp.types?.includes('country')) country = comp.long_name;
                        });
                    });

                    const label = [city, country].filter(Boolean).join(', ');
                    if (cancelled) return;

                    if (label) {
                        sessionStorage.setItem(CACHE_KEY, label);
                        setLocation(label);
                        setStatus('granted');
                    } else {
                        setStatus('error');
                    }
                } catch {
                    if (!cancelled) setStatus('error');
                }
            },
            (err) => {
                if (cancelled) return;
                setStatus(err?.code === err?.PERMISSION_DENIED ? 'denied' : 'error');
            },
            { timeout: 10000, maximumAge: 600000 }
        );

        return () => { cancelled = true; clearTimeout(startTimer); };
    }, [apiKey]);

    return { location, status };
}
