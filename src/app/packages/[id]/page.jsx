"use client";

export const runtime = 'edge';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { api } from '../../../api/client';
import {
    Calendar, Users, MapPin, Check, X, Clock,
    ChevronRight, ChevronLeft, Loader2, Star, Shield, Info,
    Plane, Utensils, Hotel, Camera, ChevronDown, ChevronUp, Car,
    ArrowRight, Globe, Map, CalendarCheck, QrCode, Train, BedDouble, LogIn, LogOut, Phone
} from 'lucide-react';
import bannerImg from '../../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../../assets/gutter.png';
import img1 from '../../../assets/img (1).png';
import img2 from '../../../assets/img (2).png';
import img3 from '../../../assets/img (3).png';
import img4 from '../../../assets/img (4).png';
import img5 from '../../../assets/img (5).png';
import img6 from '../../../assets/img.png';
import bgImg from '../../../assets/Background.png';
import bookingImg from '../../../assets/booking-img.png';
import hotel1 from '../../../assets/hotel1.png';
import flightImg from '../../../assets/flight.png';
import trainImg from '../../../assets/img (2).png'; // Placeholder for Train
import headIcon from '../../../assets/headIcon.png';
import callIcon from '../../../assets/call_icon.png';
import linkIcon from '../../../assets/link_icon.png';
import offerIcon from '../../../assets/offer_icon.png';
import bookingPolicyIcon from '../../../assets/booking_policy.png';
import cancellationPolicyIcon from '../../../assets/cancellation_policy.png';
import flightRouteIcon from '../../../assets/flight_route.png';
import collabFrame from '../../../assets/collab_frame.png';
import airlineBg from '../../../assets/airline_background.png';
import facebookIcon from '../../../assets/facebook_icon.png';
import instagramIcon from '../../../assets/instagram_icon.png';
import twitterIcon from '../../../assets/twitter_icon.png';
import googlePlusIcon from '../../../assets/google_plus_icon.png';
import flagDetailIcon from '../../../assets/flag_detail.png';
import locationIcon from '../../../assets/location_icon.png';
import dateIcon from '../../../assets/date_icon.png';
import trainIcon from '../../../assets/train_icon.png';
import plainIcon from '../../../assets/plain_icon.png';
import GalleryLoop from '../../../components/Home/GalleryLoop';
import AdventureSection from '../../../components/Home/AdventureSection';
import BookingModal from '../../../components/Booking/BookingModal';

const PackageDetailsPage = () => {
    const params = useParams();
    const id = params.id;
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [mounted, setMounted] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [relatedPackages, setRelatedPackages] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [promos, setPromos] = useState([]);
    const relatedScrollRef = useRef(null);

    const formatPackageDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };
    
    const scrollRelated = (direction) => {
        if (relatedScrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            relatedScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetch('https://magic-apis.staff-b0c.workers.dev/promotions/frontend/package_details')
            .then(res => res.json())
            .then(data => setPromos(data?.data?.promotions || []))
            .catch(() => { });
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Booking Form State
    const [bookingDate, setBookingDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [sidebarName, setSidebarName] = useState('');
    const [sidebarEmail, setSidebarEmail] = useState('');
    const [sidebarPhone, setSidebarPhone] = useState('');

    // Itinerary Accordion State
    const [expandedDays, setExpandedDays] = useState([1]);
    const [activeRelatedIndex, setActiveRelatedIndex] = useState(0);
    const [expandedFaqs, setExpandedFaqs] = useState([]);
    const [faqExpandAll, setFaqExpandAll] = useState(false);
    const toggleFaq = (idx) => setExpandedFaqs(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    const toggleAllFaqs = (faqs) => {
        if (faqExpandAll) { setExpandedFaqs([]); setFaqExpandAll(false); }
        else { setExpandedFaqs(faqs.map((_, i) => i)); setFaqExpandAll(true); }
    };

    const mockItinerary = []; // Keep as fallback template if needed

    const toggleDay = (day) => {
        setExpandedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };
    const toggleAllDays = () => {
        const itineraryLength = pkg?.itinerary ? pkg.itinerary.length : 0;
        if (expandedDays.length === itineraryLength) {
            setExpandedDays([]);
        } else {
            setExpandedDays(pkg?.itinerary?.map(item => item.day) || []);
        }
    };

    // Auto-loop state for Related Images — prioritise attraction images from the API
    const relatedImages = useMemo(() => {
        const attractionImages = pkg?.attractions?.flatMap(a => a.images || []).filter(Boolean) || [];
        if (attractionImages.length > 0) return attractionImages;
        if (pkg?.images?.length) return pkg.images;
        if (pkg?.gallery?.length) {
            return typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : pkg.gallery;
        }
        return [img4, img5, img1, img2, img3, img6];
    }, [pkg]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const galleryImgs = useMemo(() => {
        const g = pkg?.gallery ? (typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : pkg.gallery) : [];
        return [pkg?.image, ...g].filter(Boolean);
    }, [pkg]);

    useEffect(() => {
        if (galleryImgs.length <= 1) return;
        const timer = setInterval(() => {
            setGalleryIndex(prev => (prev + 1) % galleryImgs.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [galleryImgs.length]);

    useEffect(() => {
        if (relatedImages.length <= 2) return;
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 2) % relatedImages.length);
        }, 5000); // 5 seconds is better for reading
        return () => clearInterval(timer);
    }, [relatedImages.length]);

    // Advanced Pricing State
    const [counts, setCounts] = useState({
        adultDouble: 2,
        adultSingle: 0,
        adultTriple: 0,
        childBed: 0,
        childNoBed: 0,
        infant: 0
    });
    const { user, openAuthModal } = useCustomerAuth();
    const { selectedCurrency, convertPrice, formatPrice } = useCurrency();
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        const fetchPackageDetail = async () => {
            try {
                const response = await fetch(`https://magic-apis.staff-b0c.workers.dev/packages/frontend/detail/${id}`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setPkg(data.package_details || data);
                if (data.related_packages) {
                    setRelatedPackages(data.related_packages.slice(0, 6));
                    setRelatedLoading(false);
                }
            } catch (err) {
                setError("Failed to load package details.");
                console.error(err);
            } finally {
                setLoading(false);
                setRelatedLoading(false);
            }
        };

        fetchPackageDetail();
    }, [id]);

    // Redundant fetchRelated removed

    const totalPrice = useMemo(() => {
        if (!pkg) return 0;
        const p = pkg.pricing && pkg.pricing.length > 0 ? pkg.pricing[0] : null;
        if (!p) return (pkg.price || 0) * (counts.adultDouble + counts.adultSingle + counts.adultTriple + counts.childBed + counts.childNoBed);

        return (
            (counts.adultDouble * (p.price_adult_double || pkg.price)) +
            (counts.adultSingle * (p.price_adult_single || pkg.price)) +
            (counts.adultTriple * (p.price_adult_triple || pkg.price)) +
            (counts.childBed * (p.price_child_with_bed || 0)) +
            (counts.childNoBed * (p.price_child_no_bed || 0)) +
            (counts.infant * (p.price_infant || 0))
        );
    }, [pkg, counts]);

    const handleCountChange = (field, delta) => {
        setCounts(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + delta)
        }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!user) {
            openAuthModal('login');
            return;
        }

        setBookingLoading(true);

        const bookingPayload = {
            customer_id: user.id,
            package_id: pkg.id,
            travel_date: bookingDate,
            total_amount: convertPrice(totalPrice),
            currency: selectedCurrency.code,
            details: counts // Send detailed breakdown
        };

        try {
            await api.post('/bookings', bookingPayload);
            setBookingSuccess(true);
        } catch (err) {
            console.error(err);
            if (typeof window !== 'undefined') {
                alert('Failed to book. Please try again.');
            }
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="bg-gray-50 min-h-screen pb-20 animate-pulse">
            {/* Banner skeleton */}
            <div className="relative min-h-[80vh] lg:min-h-[85vh] w-full bg-gray-200" />
            {/* Info section skeleton */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        <div className="lg:w-1/2 space-y-4">
                            <div className="h-10 bg-gray-200 rounded-lg w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                            <div className="h-11 bg-gray-200 rounded-full w-36 mt-4" />
                        </div>
                        <div className="lg:w-1/2 w-full space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Gallery skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-2 md:gap-3">
                    <div className="col-span-3 h-[260px] bg-gray-200 rounded" />
                    <div className="col-span-5 h-[260px] bg-gray-200 rounded" />
                    <div className="col-span-4 h-[260px] bg-gray-200 rounded" />
                    <div className="col-span-8 h-[260px] bg-gray-200 rounded" />
                    <div className="col-span-2 h-[260px] bg-gray-200 rounded" />
                    <div className="col-span-2 h-[260px] bg-gray-200 rounded" />
                </div>
            </div>
            {/* Content skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-[69%] space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                        <div className="h-[300px] bg-gray-200 rounded-xl" />
                        <div className="h-[200px] bg-gray-200 rounded-xl" />
                    </div>
                    <div className="lg:w-[30%] space-y-6">
                        <div className="h-16 bg-gray-200 rounded-xl" />
                        <div className="h-[200px] bg-gray-200 rounded-xl" />
                        <div className="h-[220px] bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return <div className="p-20 text-center text-red-500">{error}</div>;
    if (!pkg) return <div className="p-20 text-center">Package not found</div>;

    const inclusions = pkg.inclusions ? (typeof pkg.inclusions === 'string' ? JSON.parse(pkg.inclusions) : pkg.inclusions) : [];
    const exclusions = pkg.exclusions ? (typeof pkg.exclusions === 'string' ? JSON.parse(pkg.exclusions) : pkg.exclusions) : [];
    const gallery = pkg.gallery ? (typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : pkg.gallery) : [];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Banner Section - Acting like Home Hero */}
            <section className="relative min-h-[80vh] lg:min-h-[85vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 m-0 p-0 font-sans border-none">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImg.src || bannerImg}
                        alt="Packages Detail Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content - Centered like Hero */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20">

                    {/* Title with flight route icon + collab frame */}
                    <div className="relative inline-block">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] tracking-tight drop-shadow-sm font-heading">
                            {pkg.title}
                        </h1>
                        {/* Flight route icon — top right of title */}
                        <img
                            src={flightRouteIcon.src || flightRouteIcon}
                            alt=""
                            className="absolute -top-14 -right-14 md:-top-16 md:-right-20 w-16 md:w-24 lg:w-32 opacity-90 pointer-events-none"
                        />
                        {/* Collab frame with airline logo */}
                        <div className="absolute -top-6 md:-top-8 left-[calc(100%+2rem)] md:left-[calc(100%+3rem)] w-20 md:w-24 lg:w-28 pointer-events-none">
                            <img
                                src={collabFrame.src || collabFrame}
                                alt="In Collaboration"
                                className="w-full h-auto"
                            />
                            {pkg.airline_logo && (
                                <img
                                    src={pkg.airline_logo}
                                    alt={pkg.airline_name || 'Airline'}
                                    className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 object-contain"
                                />
                            )}
                        </div>
                    </div>

                    {/* Breadcrumbs — below title */}
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-[0.05em] mt-4">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">
                            Home
                        </Link>
                        <span className="opacity-50">—</span>
                        <span>Packages Detail</span>
                    </nav>

                </div>


                {/* Bottom Shape Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>


            {/* Main Content & Sidebar */}
            <div className="px-6 sm:px-10 py-8 sm:py-10 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                    {/* ── LEFT SIDEBAR ── */}
                    <div className="lg:w-[270px] xl:w-[300px] shrink-0 space-y-5 lg:sticky lg:top-24 self-start border border-gray-200 rounded-2xl p-4">
                        {/* Promo image */}
                        <div className="rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100">
                            <img src={bookingImg.src || bookingImg} alt="Special Offer" className="w-full h-auto object-cover" />
                        </div>

                        {/* Related Images */}
                        {relatedImages.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-[#113A74] font-bold font-heading text-sm text-center">Related Images</h4>
                                <div className="relative overflow-hidden h-[160px]">
                                    {mounted && (
                                        <div className="flex gap-2 h-full">
                                            {[0, 1].map((offset) => {
                                                const idx = (currentImageIndex + offset) % relatedImages.length;
                                                const image = relatedImages[idx];
                                                return (
                                                    <motion.div
                                                        key={`${currentImageIndex}-${offset}`}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="w-1/2 rounded-2xl overflow-hidden shadow-sm h-full"
                                                    >
                                                        <img
                                                            src={image?.src || image}
                                                            className="w-full h-full object-cover"
                                                            alt={`Related Image ${idx}`}
                                                        />
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-center gap-1.5 pt-1">
                                    {Array.from({ length: Math.ceil(relatedImages.length / 2) }).map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setCurrentImageIndex(i * 2)}
                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${Math.floor(currentImageIndex / 2) === i ? 'bg-[#113A74] w-4' : 'bg-gray-300 w-1.5'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Airline & Operated By card */}
                        {(pkg.airline_name || pkg.operated_by_name) && (
                            <div
                                className="rounded-2xl overflow-hidden relative"
                                style={{
                                    backgroundImage: `url(${airlineBg.src || airlineBg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#0d2d5e',
                                    minHeight: '130px'
                                }}
                            >
                                {/* Overlay dynamic content on top of background image */}
                                <div className="absolute inset-0 flex items-start pt-[18px] px-4 gap-3">
                                    {/* Logo — sits over the white circle in the bg image */}
                                    <div className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center shrink-0 shadow overflow-hidden">
                                        {pkg.airline_logo ? (
                                            <img
                                                src={pkg.airline_logo}
                                                alt={pkg.airline_name || 'Airline'}
                                                className="w-[36px] h-[36px] object-contain"
                                            />
                                        ) : (
                                            <Plane size={20} className="text-[#0d2d5e]" />
                                        )}
                                    </div>
                                    {/* Text — overlaid on top of the baked-in label area */}
                                    <div className="pt-1 min-w-0">
                                        <p className="text-white font-bold text-[15px] leading-tight truncate">
                                            Airline : <span>{pkg.airline_name || '—'}</span>
                                        </p>
                                        <p className="text-white/80 text-[13px] mt-[3px] truncate">
                                            Operated by : <span>{pkg.operated_by_name || '—'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── CENTER MAIN CONTENT ── */}
                    <div className="flex-1 min-w-0 space-y-10 border border-gray-200 rounded-2xl p-4 sm:p-6">

                        {/* Gallery carousel + Title grouped with tight spacing */}
                        <div className="space-y-3">
                        {/* Gallery carousel — top of content */}
                        {(() => {
                            const imgs = [pkg.image, ...gallery].filter(Boolean);
                            if (!imgs.length) return null;
                            return (
                                <div className="space-y-3">
                                    <div className="rounded-2xl overflow-hidden h-[260px] sm:h-[340px]">
                                        <img src={imgs[galleryIndex]} alt={`Gallery ${galleryIndex + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                    {imgs.length > 1 && (
                                        <div className="flex justify-center gap-2">
                                            {imgs.map((_, i) => (
                                                <button key={i} onClick={() => setGalleryIndex(i)}
                                                    className={`h-2 rounded-full transition-all duration-300 ${i === galleryIndex ? 'bg-[#FFA500] w-5' : 'bg-gray-300 w-2'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Title row + Tour Code */}
                        <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black font-heading leading-tight">
                                    {pkg.title}
                                </h2>
                                <div className="shrink-0 space-y-1 text-right">
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <QrCode size={13} className="text-[#113A74]" />
                                        <span className="text-[#113A74] font-bold text-xs">Tour Code : <span className="font-black">{pkg.display_id || 'N/A'}</span></span>
                                    </div>
                                    {(pkg.valid_from || pkg.valid_to) && (
                                        <div className="flex items-center gap-1.5 justify-end text-xs text-gray-500">
                                            <img src={dateIcon.src || dateIcon} alt="" className="w-3 h-3 shrink-0" />
                                            <span className="font-montserrat">
                                                {pkg.valid_from ? new Date(pkg.valid_from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                                {pkg.valid_from && pkg.valid_to ? ' - ' : ''}
                                                {pkg.valid_to ? new Date(pkg.valid_to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">{pkg.nights} Nights &amp; {pkg.days} Days</p>
                        </div>
                        </div>{/* end gallery+title group */}

                        {/* Info rows grouped tightly */}
                        <div className="space-y-1 -mt-10">
                        <div className="flex flex-wrap gap-y-2">
                            {(pkg.continent || pkg.country) && (
                                <div className="flex items-start gap-2 pr-4 py-1 text-sm text-gray-600 border-r border-gray-200">
                                    <img src={flagDetailIcon.src || flagDetailIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium font-montserrat leading-snug">
                                        {[pkg.continent, pkg.country].filter(Boolean).join('. ')}
                                    </span>
                                </div>
                            )}
                            {pkg.cities?.length > 0 && (
                                <div className="flex items-start gap-2 px-4 py-1 text-sm text-gray-600 border-r border-gray-200">
                                    <img src={locationIcon.src || locationIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium font-montserrat leading-snug">
                                        {pkg.cities.map(c => c.name).join(', ')}
                                    </span>
                                </div>
                            )}
                            {pkg.operated_by_name && (
                                <div className="flex items-start gap-2 px-4 py-1 text-sm text-gray-600">
                                    <img src={headIcon.src || headIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium font-montserrat leading-snug">{pkg.operated_by_name}</span>
                                </div>
                            )}
                        </div>

                        {/* Departure row — only shown when departure dates exist */}
                        {pkg.departure_dates?.length > 0 && (
                            <div className="flex flex-wrap gap-y-1">
                                <div className="flex items-center gap-2 pr-4 py-1.5 text-sm text-gray-600 border-r border-gray-200">
                                    <img src={trainIcon.src || trainIcon} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="font-montserrat">Fixed Departure</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-600 min-w-0 max-w-full overflow-hidden">
                                    <img src={plainIcon.src || plainIcon} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="truncate font-montserrat">
                                        {Object.entries(
                                            pkg.departure_dates.reduce((acc, d) => {
                                                const yr = new Date(d.departure_date).getFullYear();
                                                if (!acc[yr]) acc[yr] = [];
                                                acc[yr].push(new Date(d.departure_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
                                                return acc;
                                            }, {})
                                        ).map(([yr, dates]) => `${yr}: ${dates.join(', ')}`).join('   ')}
                                    </span>
                                </div>
                            </div>
                        )}
                        </div>{/* end info rows group */}


                        {/* Journey Overview title + description */}
                        <div className="space-y-3">
                            <div className="border-t border-gray-200 pt-4">
                                <h2 className="text-lg font-bold text-black font-heading">Journey Overview :</h2>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">{pkg.description}</p>
                        </div>

                        {/* Journey Highlights — grouped attractions by city */}
                        {pkg.attractions?.length > 0 && (() => {
                            // Group attractions by city name
                            const grouped = pkg.attractions.reduce((acc, attr) => {
                                const cityName = attr.cities?.name || attr.city_name || 'Other';
                                if (!acc[cityName]) acc[cityName] = [];
                                acc[cityName].push(attr);
                                return acc;
                            }, {});
                            const groups = Object.entries(grouped);
                            return (
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-black font-heading">
                                            Journey Highlights :
                                        </h2>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Explore the must-see attractions and unforgettable experiences included in your journey.
                                        </p>
                                    </div>
                                    <div className="bg-[#f7f5f2] rounded-2xl p-4 sm:p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {groups.map(([cityName, attrs], idx) => (
                                                <div key={cityName} className={`space-y-3 ${idx > 0 ? 'sm:border-l sm:border-gray-200 sm:pl-6' : ''} ${idx >= (groups.length % 3 === 0 ? groups.length - 3 : groups.length - (groups.length % 3)) ? '' : 'pb-4 sm:pb-0 border-b sm:border-b-0 border-gray-200'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={15} className="text-[#113A74] shrink-0" />
                                                        <h4 className="text-[#113A74] font-bold text-base">{cityName}</h4>
                                                    </div>
                                                    <ul className="space-y-1.5 pl-1">
                                                        {attrs.map((attr, i) => (
                                                            <li key={attr.id || i} className="flex items-start gap-2 text-gray-500 text-sm">
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                                                {attr.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Hotels Used */}
                        {pkg.hotels?.length > 0 && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-black font-heading">
                                        Hotels Used :
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Comfortable stays handpicked to make your journey relaxing and memorable.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {pkg.hotels.map((hotel, idx) => (
                                        <div key={hotel.id || idx} className="flex items-center gap-3 rounded-2xl border border-gray-100 shadow-sm p-3 bg-gray-100 w-full">
                                            {/* Image */}
                                            <div className="w-20 h-20 sm:w-[160px] sm:h-[100px] md:w-[200px] md:h-[115px] shrink-0 rounded-xl overflow-hidden">
                                                <img
                                                    src={hotel.images?.[0] || hotel1.src}
                                                    alt={hotel.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                                                <h3 className="text-[#FFA500] font-bold text-sm leading-tight line-clamp-1">
                                                    {hotel.name}
                                                </h3>
                                                {(hotel.continent || hotel.country || hotel.cities?.name) && (
                                                    <div className="flex items-start gap-1.5 text-gray-500 text-[11px]">
                                                        <MapPin size={11} className="shrink-0 mt-0.5 text-[#113A74]" />
                                                        <span className="line-clamp-1">
                                                            {[hotel.continent, hotel.country, hotel.cities?.name].filter(Boolean).join(', ')}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Tel + Website in one row */}
                                                {(hotel.telephone || hotel.website_url) && (
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        {hotel.website_url && (
                                                            <div className="flex items-center gap-1.5 text-[11px]">
                                                                <Globe size={11} className="shrink-0 text-[#113A74]" />
                                                                <a
                                                                    href={hotel.website_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#113A74] hover:text-[#FFA500] transition-colors truncate"
                                                                    onClick={e => e.stopPropagation()}
                                                                >
                                                                    {hotel.website_url.replace(/^https?:\/\//, '')}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {hotel.telephone && (
                                                            <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                                                                <Phone size={11} className="shrink-0 text-[#113A74]" />
                                                                <span>Tel: {hotel.telephone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Flight Details */}
                        {pkg.flights?.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl md:text-2xl font-bold text-black font-heading flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Plane size={15} className="text-[#113A74]" />
                                    </div>
                                    Flight Details
                                </h2>
                                <div className="rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
                                    <div className="min-w-[560px]">
                                    {/* Table header */}
                                    <div className="grid grid-cols-6 px-5 py-3 bg-blue-50 border-b border-blue-100">
                                        {['DATE', 'FLIGHT NO', 'ROUTE', 'DEPARTURE', 'ARRIVAL', 'STATUS'].map(h => (
                                            <span key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</span>
                                        ))}
                                    </div>
                                    {/* Rows */}
                                    {pkg.flights.map((flight, idx) => {
                                        const d = flight.date ? new Date(flight.date) : null;
                                        const formattedDate = d
                                            ? `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${d.toLocaleDateString('en-GB', { weekday: 'short' })}`
                                            : '—';
                                        const isDelayed = flight.status?.toLowerCase() === 'delayed';
                                        const isCancelled = flight.status?.toLowerCase() === 'cancelled';
                                        return (
                                            <div key={flight.id || idx} className={`grid grid-cols-6 px-5 py-4 items-center text-sm ${idx < pkg.flights.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                                <span className="text-gray-600 font-medium">{formattedDate}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Plane size={12} className="text-[#113A74] shrink-0" />
                                                    <span className="font-bold text-gray-700">{flight.flight_number || '—'}</span>
                                                </div>
                                                <span className="font-medium text-gray-700">
                                                    {flight.departure_airport_code && flight.arrival_airport_code
                                                        ? `${flight.departure_airport_code} → ${flight.arrival_airport_code}`
                                                        : '—'}
                                                </span>
                                                <span className="text-gray-600">{flight.departure_time || '—'}</span>
                                                <span className="text-gray-600">{flight.arrival_time || '—'}</span>
                                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full w-fit ${
                                                    isCancelled ? 'bg-gray-200 text-gray-500' :
                                                    isDelayed   ? 'bg-red-100 text-red-600'   :
                                                                  'bg-[#FFA500] text-white'
                                                }`}>
                                                    {flight.status || 'On Time'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>{/* end min-w flight */}
                                </div>
                            </div>
                        )}

                        {/* Train Details */}
                        {pkg.trains?.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl md:text-2xl font-bold text-black font-heading flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Train size={15} className="text-[#113A74]" />
                                    </div>
                                    Train Details
                                </h2>
                                <div className="rounded-2xl border border-gray-100 overflow-hidden overflow-x-auto">
                                    <div className="min-w-[560px]">
                                    {/* Table header */}
                                    <div className="grid grid-cols-6 px-5 py-3 bg-blue-50 border-b border-blue-100">
                                        {['DATE', 'TRAIN', 'FROM', 'TO', 'DEPARTURE', 'ARRIVAL'].map(h => (
                                            <span key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</span>
                                        ))}
                                    </div>
                                    {/* Rows */}
                                    {pkg.trains.map((train, idx) => {
                                        const d = train.date ? new Date(train.date) : null;
                                        const formattedDate = d
                                            ? `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${d.toLocaleDateString('en-GB', { weekday: 'short' })}`
                                            : '—';
                                        const trainLabel = [train.operator, train.train_number].filter(Boolean).join(' ') || '—';
                                        return (
                                            <div key={train.id || idx} className={`grid grid-cols-6 px-5 py-4 items-center text-sm ${idx < pkg.trains.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                                <span className="text-gray-600 font-medium">{formattedDate}</span>
                                                <span className="font-bold text-gray-700">{trainLabel}</span>
                                                <span className="text-gray-600">{train.from_station || '—'}</span>
                                                <span className="text-gray-600">{train.to_station || '—'}</span>
                                                <span className="text-gray-600">{train.departure_time || '—'}</span>
                                                <span className="text-gray-600">{train.arrival_time || '—'}</span>
                                            </div>
                                        );
                                    })}
                                    </div>{/* end min-w train */}
                                </div>
                            </div>
                        )}

                        {/* Itinerary Accordion */}
                        <div className="space-y-6 pt-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#113A74] font-heading">Itinerary</h3>
                                <div className="flex items-center gap-3 cursor-pointer" onClick={toggleAllDays}>
                                    <span className="text-sm font-medium text-gray-500">Expand all</span>
                                    <button
                                        className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${(pkg.itinerary && expandedDays.length === pkg.itinerary.length && pkg.itinerary.length > 0) ? 'bg-[#FFA500]' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm ${(pkg.itinerary && expandedDays.length === pkg.itinerary.length && pkg.itinerary.length > 0) ? 'left-[22px]' : 'left-[2px]'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-0 relative py-2">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[19px] top-6 bottom-6 w-[1.5px] bg-gray-100 -z-10"></div>

                                {pkg.itinerary && pkg.itinerary.map((item) => {
                                    const isExpanded = expandedDays.includes(item.day);
                                    return (
                                        <div key={item.day} className="relative pl-14 pt-2">
                                            {/* Timeline Node */}
                                            <div className="absolute left-0 top-[18px] w-10 h-10 flex items-center justify-center">
                                                {isExpanded ? (
                                                    <div className="w-10 h-10 rounded-full bg-[#FFA500] flex items-center justify-center shadow-lg shadow-[#FFA500]/30 z-10 transition-transform scale-100 object-contain p-1">
                                                        <MapPin className="text-white w-5 h-5" fill="white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-[14px] h-[14px] rounded-full border-[2.5px] border-[#FFA500] bg-white z-10 transition-transform hover:scale-110"></div>
                                                )}
                                            </div>

                                            {/* Header */}
                                            <button
                                                onClick={() => toggleDay(item.day)}
                                                className="w-full flex justify-between items-center py-4 text-left group"
                                            >
                                                <h4 className="font-bold font-heading text-lg">
                                                    <span className="text-[#113A74]">Day {item.day < 10 ? `0${item.day}` : item.day} : </span>
                                                    <span className="text-gray-800">{item.title}</span>
                                                </h4>
                                                {isExpanded ? (
                                                    <ChevronUp className="text-[#FFA500] w-5 h-5 transition-transform" />
                                                ) : (
                                                    <ChevronDown className="text-gray-400 w-5 h-5 transition-transform group-hover:text-[#FFA500]" />
                                                )}
                                            </button>

                                            {/* Expanded Content */}
                                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1500px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-sm text-gray-500 leading-relaxed mb-6 pr-4 whitespace-pre-line">
                                                    {item.description}
                                                </p>

                                                {/* Transport & Meal Icons */}
                                                {(item.has_flight || item.has_train || item.has_bus || item.has_breakfast || item.has_lunch || item.has_dinner) && (
                                                    <div className="flex flex-wrap gap-3 mb-6">
                                                        {item.has_flight && <div className="flex items-center gap-1.5 bg-[#f0f4f8] px-3 py-1.5 rounded-full text-[#113A74] text-xs font-bold font-heading"><Plane size={14} /> Flight</div>}
                                                        {item.has_train && <div className="flex items-center gap-1.5 bg-[#f0f4f8] px-3 py-1.5 rounded-full text-[#113A74] text-xs font-bold font-heading"><Train size={14} /> Train</div>}
                                                        {item.has_bus && <div className="flex items-center gap-1.5 bg-[#f0f4f8] px-3 py-1.5 rounded-full text-[#113A74] text-xs font-bold font-heading"><Car size={14} /> Bus</div>}
                                                        {item.has_breakfast && <div className="flex items-center gap-1.5 bg-[#fff8ef] px-3 py-1.5 rounded-full text-[#FFA500] text-xs font-bold font-heading"><Utensils size={14} /> Breakfast</div>}
                                                        {item.has_lunch && <div className="flex items-center gap-1.5 bg-[#fff8ef] px-3 py-1.5 rounded-full text-[#FFA500] text-xs font-bold font-heading"><Utensils size={14} /> Lunch</div>}
                                                        {item.has_dinner && <div className="flex items-center gap-1.5 bg-[#fff8ef] px-3 py-1.5 rounded-full text-[#FFA500] text-xs font-bold font-heading"><Utensils size={14} /> Dinner</div>}
                                                    </div>
                                                )}

                                                {/* Activities Box */}
                                                {item.attractions && item.attractions.length > 0 && (
                                                    <div className="bg-[#d5e0f9]/50 p-6 rounded-sm border border-[#d5e0f9] text-gray-500 text-xs leading-relaxed max-w-[90%] space-y-3">
                                                        {item.attractions.map((attr, idx) => (
                                                            <div key={idx} className="flex gap-4 items-start">
                                                                {attr.images && attr.images.length > 0 && (
                                                                    <img src={attr.images[0]} alt={attr.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                                                                )}
                                                                <div>
                                                                    <strong className="text-[#113A74] text-sm block mb-1">{attr.name}</strong>
                                                                    <p className="line-clamp-2">{attr.overview}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {!isExpanded && <div className="border-b border-gray-100 mr-4"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Inclusion / Exclusion */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-black font-heading">Inclusion/Exclusion</h3>
                            <div className="bg-[#fdf8f2] rounded-2xl p-6">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Inclusions */}
                                    <ul className="flex-1 space-y-3 pr-0 sm:pr-6">
                                        {inclusions.length > 0 ? inclusions.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-600 text-sm">
                                                <div className="w-7 h-7 rounded-full bg-[#FFA500] flex items-center justify-center shrink-0 shadow-sm">
                                                    <Check size={13} strokeWidth={3} className="text-white" />
                                                </div>
                                                <span>{typeof item === 'string' ? item : item.name || item.title || ''}</span>
                                            </li>
                                        )) : (
                                            <li className="text-gray-400 text-sm italic">No inclusions listed</li>
                                        )}
                                    </ul>
                                    {/* Divider */}
                                    <div className="hidden sm:block w-px bg-gray-200 mx-2 self-stretch" />
                                    <div className="block sm:hidden h-px bg-gray-200 my-4" />
                                    {/* Exclusions */}
                                    <ul className="flex-1 space-y-3 pl-0 sm:pl-6">
                                        {exclusions.length > 0 ? exclusions.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-600 text-sm">
                                                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                                    <X size={13} strokeWidth={3} className="text-gray-400" />
                                                </div>
                                                <span>{typeof item === 'string' ? item : item.name || item.title || ''}</span>
                                            </li>
                                        )) : (
                                            <li className="text-gray-400 text-sm italic">No exclusions listed</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Blackout Days */}
                        {pkg.blackout_dates?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#EEF5FF] flex items-center justify-center shrink-0">
                                        <Calendar size={19} className="text-[#113A74]" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-[#1d2a44] font-heading">
                                        Black Out Days
                                    </h3>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-white px-8 py-7 shadow-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-4">
                                        {pkg.blackout_dates.map((range, index) => (
                                            <div key={range.id || index} className="flex items-center gap-3 text-sm sm:text-base text-[#4B5872] font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFA500] shrink-0" />
                                                <span>
                                                    {formatPackageDate(range.start_date)} - {formatPackageDate(range.end_date)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Offer Validity / Booking Policy / Cancellation Policy */}
                        {(pkg.offer_validity || pkg.booking_policy || pkg.cancellation_policy) && (
                            <div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-2xl bg-white overflow-hidden">
                                {pkg.offer_validity && (
                                    <div className="px-6 py-5 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <img src={offerIcon.src || offerIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base font-bold text-[#113A74] font-heading">Offer Validity</h4>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed">{pkg.offer_validity}</p>
                                    </div>
                                )}
                                {pkg.booking_policy && (
                                    <div className="px-6 py-5 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <img src={bookingPolicyIcon.src || bookingPolicyIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base font-bold text-black font-heading">Booking Policy</h4>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed">{pkg.booking_policy}</p>
                                    </div>
                                )}
                                {pkg.cancellation_policy && (
                                    <div className="px-6 py-5 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <img src={cancellationPolicyIcon.src || cancellationPolicyIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base font-bold text-black font-heading">Cancellation Policy</h4>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed">{pkg.cancellation_policy}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FAQ */}
                        {pkg.faqs?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl md:text-2xl font-bold text-black font-heading">Frequently Asked Questions</h3>
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleAllFaqs(pkg.faqs)}>
                                        <span className="text-sm text-gray-500">Expand all</span>
                                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${faqExpandAll ? 'bg-[#FFA500]' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm ${faqExpandAll ? 'left-[22px]' : 'left-[2px]'}`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {pkg.faqs.map((faq, idx) => {
                                        const isOpen = expandedFaqs.includes(idx);
                                        return (
                                            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                                <button
                                                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                                                    onClick={() => toggleFaq(idx)}
                                                >
                                                    <span className="text-sm font-medium text-[#1d2a44]">{idx + 1}) {faq.question}</span>
                                                    <ChevronDown size={16} className={`text-[#113A74] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        {pkg.links?.length > 0 && (
                            <div className="border border-gray-100 rounded-2xl bg-white px-6 py-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <img src={linkIcon.src || linkIcon} alt="" className="w-5 h-5 shrink-0" />
                                    <h4 className="text-base font-bold text-black font-heading">Links</h4>
                                </div>
                                <div className="space-y-1.5 pl-8">
                                    {pkg.links.map((link, idx) => (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-sm text-[#113A74] hover:underline"
                                        >
                                            {link.url}
                                        </a>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 mt-2" />
                            </div>
                        )}

                        {/* Important Contact */}
                        {pkg.contacts?.length > 0 && (
                            <div className="border border-gray-100 rounded-2xl bg-white px-6 py-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <img src={callIcon.src || callIcon} alt="" className="w-5 h-5 shrink-0" />
                                    <h4 className="text-base font-bold text-black font-heading">Important Contact</h4>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {pkg.contacts.map((contact, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2.5 px-2 text-sm text-gray-600">
                                            <span>{contact.name}</span>
                                            <span className="font-medium text-[#1d2a44]">{contact.mobile}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>{/* end center main content */}

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="lg:w-[270px] xl:w-[300px] shrink-0 lg:sticky lg:top-24 self-start border border-gray-200 rounded-2xl p-4">
                        <div className="bg-[#113A74] rounded-[1.5rem] p-5 space-y-5 shadow-xl">
                            <h4 className="text-white font-bold text-base font-heading tracking-wide">Package Cost</h4>
                            <div className="space-y-3 border-t border-white/10 pt-4">
                                {(() => {
                                    const p = pkg.pricing && pkg.pricing.length > 0 ? pkg.pricing[0] : null;
                                    if (!p) return <p className="text-white/50 text-xs italic">No pricing available</p>;
                                    const rows = [
                                        { label: 'Single Traveler', value: p.price_adult_single },
                                        { label: 'Twin Sharing',    value: p.price_adult_double },
                                        { label: 'Triple Sharing',  value: p.price_adult_triple },
                                    ].filter(r => r.value);
                                    return rows.map(row => (
                                        <div key={row.label} className="flex items-center justify-between gap-2">
                                            <span className="text-white/70 text-xs font-medium">{row.label}</span>
                                            <span className="text-[#FFA500] font-black text-xs">{formatPrice(row.value)}</span>
                                        </div>
                                    ));
                                })()}
                            </div>
                            <button
                                onClick={() => setIsBookingModalOpen(true)}
                                className="w-full bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold rounded-full py-2.5 flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg text-xs"
                            >
                                Enquiry <ArrowRight size={13} />
                            </button>
                        </div>

                        {/* Booking Form */}
                        <div className="bg-[#113A74] rounded-[1.5rem] p-5 space-y-4 shadow-xl mt-4">
                            <div className="text-center space-y-2">
                                <h4 className="text-white font-black text-base font-heading tracking-widest uppercase">Booking Form</h4>
                                <p className="text-white/60 text-xs leading-relaxed">
                                    Fill in your details and we'll get back to you with the best options for your trip.
                                </p>
                            </div>
                            <input
                                type="text"
                                placeholder="Your Name..."
                                value={sidebarName}
                                onChange={e => setSidebarName(e.target.value)}
                                className="w-full bg-white text-gray-800 placeholder-black/60 text-sm rounded-full px-4 py-3 outline-none border border-white/20 focus:border-[#FFA500] transition-colors"
                            />
                            <input
                                type="email"
                                placeholder="Your Email..."
                                value={sidebarEmail}
                                onChange={e => setSidebarEmail(e.target.value)}
                                className="w-full bg-white text-gray-800 placeholder-black/60 text-sm rounded-full px-4 py-3 outline-none border border-white/20 focus:border-[#FFA500] transition-colors"
                            />
                            <input
                                type="tel"
                                placeholder="Your Phone..."
                                value={sidebarPhone}
                                onChange={e => setSidebarPhone(e.target.value)}
                                className="w-full bg-white text-gray-800 placeholder-black/60 text-sm rounded-full px-4 py-3 outline-none border border-white/20 focus:border-[#FFA500] transition-colors"
                            />
                            <button
                                onClick={() => setIsBookingModalOpen(true)}
                                className="w-full bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold rounded-full py-3 flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg text-sm"
                            >
                                Book Now <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Share + Download PDF */}
                        <div className="mt-4">
                            <div className="space-y-3">
                                <p className="text-sm font-bold" style={{ color: '#595555' }}>Share this tour</p>
                                <div className="flex items-center gap-3 mt-3">
                                    {[
                                        { icon: facebookIcon,   href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, size: 'w-5 h-5' },
                                        { icon: instagramIcon,  href: 'https://www.instagram.com', size: 'w-5 h-5' },
                                        { icon: twitterIcon,    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(pkg.title)}`, size: 'w-5 h-5' },
                                        { icon: googlePlusIcon, href: `https://plus.google.com/share?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, size: 'w-7 h-7' },
                                    ].map(({ icon, href, size }, i) => (
                                        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
                                            <img src={icon.src || icon} alt="" className={`${size} object-contain`} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <a
                                href={`/packages/${pkg.slug || pkg.id}?pdf=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-[#113A74] hover:text-[#113A74] transition-colors bg-white"
                            >
                                <span>Download PDF</span>
                                <span className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 5v14M5 12l7 7 7-7"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>{/* end flex row */}


                {/* Location Map Section */}
                {(pkg.location_map || pkg.destination?.name || pkg.location) ? (
                    <div className="mt-8 sm:mt-12 lg:mt-20">
                        <div className="rounded-[2rem] overflow-hidden shadow-md border border-gray-100 h-[300px] sm:h-[380px] lg:h-[450px] relative">
                            {(() => {
                                let mapUrl = "";
                                if (pkg.location_map) {
                                    if (pkg.location_map.includes('<iframe')) {
                                        return (
                                            <div
                                                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full border-0"
                                                dangerouslySetInnerHTML={{ __html: pkg.location_map }}
                                            />
                                        );
                                    }
                                    try {
                                        const mapData = typeof pkg.location_map === 'string' ? JSON.parse(pkg.location_map) : pkg.location_map;
                                        if (mapData.lat && mapData.lng) {
                                            mapUrl = `https://maps.google.com/maps?q=${mapData.lat},${mapData.lng}&output=embed`;
                                        } else if (mapData.address) {
                                            mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapData.address)}&output=embed`;
                                        } else if (mapData.url) {
                                            // Extract coordinates from url if possible or use as is if it's an embed url
                                            mapUrl = mapData.url.includes('output=embed') ? mapData.url : `https://maps.google.com/maps?q=${encodeURIComponent(pkg.destination?.name || pkg.location || '')}&output=embed`;
                                        }
                                    } catch (e) {
                                        // Not JSON, treat as URL if it looks like one
                                        if (pkg.location_map.startsWith('http')) {
                                            mapUrl = pkg.location_map;
                                        }
                                    }
                                }

                                if (!mapUrl) {
                                    mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent((pkg.destination?.name || pkg.location || '') + ' ' + (pkg.destination?.country || ''))}&output=embed`;
                                }

                                return (
                                    <iframe
                                        src={mapUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Location Map"
                                    ></iframe>
                                );
                            })()}
                        </div>
                    </div>
                ) : null}
            </div>


            {/* Related Packages */}
            {relatedPackages.length > 0 && (
                <section className="py-14 bg-[#EAF4FB]">
                    <div className="max-w-[1100px] mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 border border-[#113A74]/20 bg-white px-5 py-2 rounded-full mb-5">
                                <Plane size={14} className="text-[#113A74]" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#113A74]">Related</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#113A74] font-heading">
                                Related Trips You{' '}
                                <span className="text-[#FFA500]">Might Also Like</span>
                            </h2>
                        </div>

                        {/* Cards — same design as tours listing page */}
                        <div className="flex flex-wrap justify-center gap-6">
                            {relatedPackages.map((rp) => (
                                <div
                                    key={rp.id}
                                    onClick={() => router.push(`/packages/${rp.slug || rp.id}`)}
                                    className="cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col w-full sm:w-[300px] lg:w-[320px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-3 left-0 bg-[#113A74] text-white px-3 py-1.5 rounded-r-lg flex items-center gap-2 text-xs font-bold shadow-lg">
                                            <Calendar size={13} className="opacity-90" />
                                            <span>{rp.nights} Nights, {rp.days} Days</span>
                                        </div>
                                        <div className="absolute bottom-3 right-0 bg-[#FFA500] text-white px-4 py-1.5 rounded-l-full text-xs font-black shadow-lg">27% Off</div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-[#113A74] mb-1 font-heading tracking-tight leading-tight group-hover:text-[#FFA500] transition-colors line-clamp-2 min-h-[50px]">
                                            {rp.title}
                                        </h3>
                                        {rp.location && (
                                            <p className="text-slate-400 text-[12px] font-medium mb-2 line-clamp-1">{rp.location}</p>
                                        )}
                                        <div className="flex flex-col gap-4 mt-auto">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); router.push(`/packages/${rp.slug || rp.id}`); }}
                                                className="w-fit px-8 py-2.5 border border-[#113A74] text-[#113A74] rounded-full text-sm font-heading font-bold hover:bg-[#113A74] hover:text-white transition-all shadow-sm active:scale-95"
                                            >Book Now</button>
                                            <div className="text-right">
                                                <span className="text-[#FFA500] text-2xl font-black leading-none">{formatPrice(convertPrice(rp.price))}</span>
                                                <p className="text-[#113A74] text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">onwards</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Adventure Section (Image with Text) */}
            <AdventureSection />

            {/* Moving Images Section */}
            <div className="bg-[#E9F7FF]">
                <GalleryLoop />
            </div>
            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                pkg={pkg}
                user={user}
            />
        </div>
    );
};

export default PackageDetailsPage;
