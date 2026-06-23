"use client";
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const FALLBACK_MAPS_KEY = 'AIzaSyD8L237G-BLrf0hQtqaTdTiezwwqEzoq4A';
const containerStyle = { width: '100%', height: '100%' };

const normalize = (locations) => (locations || [])
    .filter(l => l && l.lat != null && l.lng != null)
    .map(l => ({ lat: Number(l.lat), lng: Number(l.lng), address: l.address || '' }));

// Inner map — only mounted once visible, so the Google SDK loads lazily.
function RouteMapInner({ points, apiKey }) {
    const { isLoaded } = useJsApiLoader({
        id: 'magic-tours-gmaps',
        googleMapsApiKey: apiKey,
        preventGoogleFontsLoading: true,
    });
    const mapRef = useRef(null);

    const onLoad = useCallback((map) => {
        mapRef.current = map;
        if (!window.google || points.length === 0) return;
        if (points.length === 1) {
            map.setCenter({ lat: points[0].lat, lng: points[0].lng });
            map.setZoom(13);
            return;
        }
        const bounds = new window.google.maps.LatLngBounds();
        points.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
        map.fitBounds(bounds, 60);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isLoaded) return <div className="w-full h-full bg-slate-100 animate-pulse" />;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: points[0].lat, lng: points[0].lng }}
            zoom={points.length === 1 ? 13 : 6}
            onLoad={onLoad}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                clickableIcons: false,
            }}
        >
            {points.map((p, i) => (
                <Marker
                    key={`${p.lat},${p.lng},${i}`}
                    position={{ lat: p.lat, lng: p.lng }}
                    label={{ text: String(i + 1), color: 'white', fontWeight: 'bold', fontSize: '12px' }}
                    title={p.address}
                />
            ))}
            {points.length > 1 && (
                <Polyline
                    path={points.map(p => ({ lat: p.lat, lng: p.lng }))}
                    options={{ strokeColor: '#113A74', strokeOpacity: 0.9, strokeWeight: 3, geodesic: true }}
                />
            )}
        </GoogleMap>
    );
}

/**
 * Route map wrapper. Defers loading the heavy Google Maps SDK until the map
 * scrolls (near) into view, so it never slows the initial page render.
 *
 * @param {{lat:number,lng:number,address?:string}[]} locations
 * @param {string} [apiKey]
 */
export default function PackageRouteMap({ locations = [], apiKey }) {
    const wrapRef = useRef(null);
    const [inView, setInView] = useState(false);
    const points = normalize(locations);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el || inView) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some(e => e.isIntersecting)) {
                    setInView(true);
                    io.disconnect();
                }
            },
            { rootMargin: '300px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [inView]);

    if (points.length === 0) return null;

    return (
        <div ref={wrapRef} className="w-full h-full">
            {inView
                ? <RouteMapInner points={points} apiKey={apiKey || FALLBACK_MAPS_KEY} />
                : <div className="w-full h-full bg-slate-100 animate-pulse" />}
        </div>
    );
}
