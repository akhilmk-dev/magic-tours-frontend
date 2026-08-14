"use client";

export const runtime = 'edge';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { api } from '../../../api/client';
import { toTitleCase } from '../../../utils/textUtils';
import {
    Calendar, Users, MapPin, Check, X, Clock,
    ChevronRight, ChevronLeft, Loader2, Star, Shield, Info,
    Plane, Utensils, Hotel, Camera, ChevronDown, ChevronUp, Car,
    ArrowRight, Globe, Map, CalendarCheck, QrCode, Train, BedDouble, LogIn, LogOut, Phone, Tag
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
import airlineBg from '../../../assets/airline_background.png';
import handshakeIcon from '../../../assets/handshake.jpg';
import facebookIcon from '../../../assets/facebook_icon.png';
import instagramIcon from '../../../assets/instagram_icon.png';
import twitterIcon from '../../../assets/twitter_icon.png';
import googlePlusIcon from '../../../assets/google_plus_icon.png';
import flagDetailIcon from '../../../assets/flag_detail.png';
import locationIcon from '../../../assets/location_icon.png';
import dateIcon from '../../../assets/date_icon.png';
import trainIcon from '../../../assets/train_icon.png';
import plainIcon from '../../../assets/plain_icon.png';
import hotelsIcon from '../../../assets/hotels_package_card.png';
import flightIcon from '../../../assets/flight_icon_package_card.png';
import foodIcon from '../../../assets/food_icon_package_card.png';
import airlineTailIcon from '../../../assets/airline_tail_icon.png';
import FavoriteButton from '../../../components/common/FavoriteButton';
import PackageRouteMap from '../../../components/common/PackageRouteMap';
import GalleryLoop from '../../../components/Home/GalleryLoop';
import AdventureSection from '../../../components/Home/AdventureSection';
import BookingModal from '../../../components/Booking/BookingModal';
import PackageEnquiryModal from '../../../components/common/PackageEnquiryModal';

const PackageDetailsPage = () => {
    const params = useParams();
    const id = params.id;
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [mounted, setMounted] = useState(false);
    const [showFullOverview, setShowFullOverview] = useState(false);
    const [overviewOverflows, setOverviewOverflows] = useState(false);
    const overviewRef = useRef(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [relatedPackages, setRelatedPackages] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const [promos, setPromos] = useState([]);
    const [showOperator, setShowOperator] = useState(true);
    const [iconMasters, setIconMasters] = useState([]);
    const relatedScrollRef = useRef(null);

    const formatPackageDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const cleanItineraryTitle = (title) => {
        if (!title) return '';
        return title.replace(/^day\s*\d+\s*[:\-]?\s*/i, '').trim();
    };

    
    const downloadPDF = () => {
        if (!pkg) return;
        const _cp = pkg.pricing_info?.current_pricing; const _dp = pkg.pricing_info?.default_pricing;
        const p = (_cp || _dp) ? { adult_single: (_cp?.adult_single||0)||(_dp?.adult_single||0), adult_double: (_cp?.adult_double||0)||(_dp?.adult_double||0), adult_triple: (_cp?.adult_triple||0)||(_dp?.adult_triple||0), adult_quad: (_cp?.adult_quad||0)||(_dp?.adult_quad||0), child_with_bed: (_cp?.child_with_bed||0)||(_dp?.child_with_bed||0), child_no_bed: (_cp?.child_no_bed||0)||(_dp?.child_no_bed||0), infant: (_cp?.infant||0)||(_dp?.infant||0) } : null;
        const pricingRows = p ? [
            { label: 'Single Traveler', value: p.adult_single },
            { label: 'Twin Sharing',    value: p.adult_double },
            { label: 'Triple Sharing',  value: p.adult_triple },
            { label: 'Quad Sharing',    value: p.adult_quad },
            { label: 'Child With Bed',  value: p.child_with_bed },
            { label: 'Child No Bed',    value: p.child_no_bed },
            { label: 'Infant',          value: p.infant },
        ].filter(r => r.value != null && r.value !== 0) : [];

        const currency = pkg.pricing_info?.currency || pkg.currency || '';
        const formatVal = (v) => v ? `${currency} ${Number(v).toLocaleString()}` : '—';

        // Parse inclusions/exclusions — may arrive as JSON strings
        const parseList = (raw) => {
            if (!raw) return [];
            if (Array.isArray(raw)) return raw;
            try { return JSON.parse(raw); } catch { return []; }
        };
        const inclusions = parseList(pkg.inclusions);
        const exclusions = parseList(pkg.exclusions);

        const listHtml = (arr) => arr.length
            ? arr.map(item => `<li>${typeof item === 'string' ? item : item.name || item.title || ''}</li>`).join('')
            : '<li style="color:#999">Not specified</li>';

        // Transport/meal badges per day (supports both new arrays and legacy booleans)
        const ICON_EMOJI = {
            'Flight':'✈️','Helicopter':'🚁','Train':'🚆','Bus':'🚌','Car':'🚗',
            'Private Transfer':'🚘','SIC Transfer':'🚐','Cruise':'🚢','Boat':'⛵',
            'Ferry':'⛴️','Yacht':'🛥️','Private Jet':'✈️',
            'Breakfast':'🍳','Lunch':'🥗','Dinner':'🍽️','Tea':'🍵',
            'Coffee':'☕','Snacks':'🍿','Drinks':'🥤','Gala Dinner':'🥂',
        };
        const dayBadges = (day) => {
            const badges = [];
            // New arrays
            (day.transport_icons || []).forEach(n => badges.push(`${ICON_EMOJI[n] || '🚗'} ${n}`));
            (day.meal_icons || []).forEach(n => badges.push(`${ICON_EMOJI[n] || '🍽️'} ${n}`));
            // Legacy booleans (fallback)
            if (!badges.length) {
                if (day.has_flight)    badges.push('✈ Flight');
                if (day.has_train)     badges.push('🚂 Train');
                if (day.has_bus)       badges.push('🚌 Bus');
                if (day.has_breakfast) badges.push('🍳 Breakfast');
                if (day.has_lunch)     badges.push('🥗 Lunch');
                if (day.has_dinner)    badges.push('🍽 Dinner');
            }
            return badges.length
                ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">${badges.map(b => `<span style="background:#eef3fb;color:#113A74;font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;">${b}</span>`).join('')}</div>`
                : '';
        };

        const itineraryHtml = pkg.itinerary?.length
            ? pkg.itinerary.map((day) => `
                <div style="margin-bottom:14px;padding:14px;background:#f8faff;border-radius:10px;border-left:4px solid #113A74;">
                    <p style="margin:0 0 6px;font-weight:700;color:#113A74;font-size:13px;">Day ${day.day < 10 ? '0' + day.day : day.day}${day.title ? ` : ${cleanItineraryTitle(day.title)}` : ''}</p>
                    ${day.description ? `<p style="margin:0;color:#555;font-size:12px;line-height:1.6;white-space:pre-line;">${day.description}</p>` : ''}
                    ${dayBadges(day)}
                </div>`).join('')
            : '<p style="color:#999;font-size:12px;">No itinerary available.</p>';

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${pkg.title || 'Package Details'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; background: #fff; padding: 0; }
  @media print {
    body { padding: 0; }
    .no-print { display: none !important; }
    @page { margin: 15mm 12mm; size: A4; }
  }

  /* Header */
  .header { background: #113A74; color: white; padding: 28px 32px 22px; }
  .header h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.3px; margin-bottom: 6px; }
  .header .meta { display: flex; gap: 20px; flex-wrap: wrap; font-size: 12px; opacity: 0.85; margin-top: 8px; }
  .header .meta span { display: flex; align-items: center; gap: 5px; }

  /* Hero image */
  .hero-img { width: 100%; max-height: 260px; object-fit: cover; display: block; }

  /* Content area */
  .body { padding: 24px 32px; }

  /* Section */
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 800; color: #113A74; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid #e8eef8; padding-bottom: 6px; margin-bottom: 12px; }
  .section p { font-size: 12px; line-height: 1.75; color: #444; }

  /* Two columns */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  /* List */
  ul { padding-left: 18px; }
  ul li { font-size: 12px; color: #444; margin-bottom: 5px; line-height: 1.5; }

  /* Pricing table */
  .pricing-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .pricing-table th { background: #113A74; color: white; padding: 9px 14px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; }
  .pricing-table td { padding: 8px 14px; border-bottom: 1px solid #eef0f5; }
  .pricing-table tr:last-child td { border-bottom: none; }
  .pricing-table tr:nth-child(even) td { background: #f8faff; }
  .price-val { font-weight: 700; color: #113A74; text-align: right; }

  /* Info chips */
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .chip { background: #eef3fb; color: #113A74; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }

  /* Footer */
  .footer { background: #f4f6fb; border-top: 1px solid #dde4f0; padding: 14px 32px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #888; margin-top: 8px; }

  /* Print button */
  .print-btn { position: fixed; bottom: 24px; right: 24px; background: #113A74; color: white; border: none; padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 16px rgba(17,58,116,0.3); }
</style>
</head>
<body>

<button class="print-btn no-print" onclick="window.print()">⬇ Save as PDF</button>

<!-- Header -->
<div class="header">
  <h1>${pkg.title || 'Package Details'}</h1>
  <div class="meta">
    ${pkg.days ? `<span>📅 ${pkg.days} Days / ${pkg.nights} Nights</span>` : ''}
    ${pkg.continent || pkg.country ? `<span>📍 ${[pkg.continent, pkg.country].filter(Boolean).join(', ')}</span>` : ''}
    ${pkg.cities?.length ? `<span>🏙 ${pkg.cities.map(c => c.name).join(', ')}</span>` : ''}
    ${(pkg.airlines?.length ? pkg.airlines : (pkg.airline_name ? [{ name: pkg.airline_name }] : [])).map(a => `<span>✈ ${a.name}</span>`).join('')}
    ${pkg.operated_by_name ? `<span>👤 ${pkg.operated_by_name}</span>` : ''}
    ${pkg.display_id ? `<span>ID: ${pkg.display_id}</span>` : ''}
  </div>
</div>

<!-- Hero Image -->
${pkg.image ? `<img class="hero-img" src="${pkg.image}" alt="${pkg.title}" />` : ''}

<div class="body">

  <!-- Journey Overview -->
  ${(pkg.journey_overview || pkg.description) ? `
  <div class="section">
    <div class="section-title">Journey Overview</div>
    <p>${pkg.journey_overview || pkg.description}</p>
  </div>` : ''}

  <!-- Pricing -->
  ${pricingRows.length ? `
  <div class="section">
    <div class="section-title">Package Cost</div>
    <table class="pricing-table">
      <thead><tr><th>Type</th><th style="text-align:right">Price</th></tr></thead>
      <tbody>
        ${pricingRows.map(r => `<tr><td>${r.label}</td><td class="price-val">${formatVal(r.value)}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  <!-- Inclusions & Exclusions -->
  <div class="two-col">
    ${inclusions.length ? `
    <div class="section">
      <div class="section-title">✅ Inclusions</div>
      <ul>${listHtml(inclusions)}</ul>
    </div>` : ''}
    ${exclusions.length ? `
    <div class="section">
      <div class="section-title">❌ Exclusions</div>
      <ul>${listHtml(exclusions)}</ul>
    </div>` : ''}
  </div>

  <!-- Itinerary -->
  ${pkg.itinerary?.length ? `
  <div class="section">
    <div class="section-title">Itinerary</div>
    ${itineraryHtml}
  </div>` : ''}

  <!-- Blackout Dates -->
  ${pkg.blackout_dates?.length ? `
  <div class="section">
    <div class="section-title">Blackout Dates</div>
    <div class="chips">
      ${pkg.blackout_dates.map(b => `<span class="chip">${formatPackageDate(b.from || b.start_date)} — ${formatPackageDate(b.to || b.end_date)}</span>`).join('')}
    </div>
  </div>` : ''}

  <!-- Policies -->
  ${pkg.terms_conditions ? `
  <div class="section">
    <div class="section-title">Terms & Conditions</div>
    <p>${pkg.terms_conditions}</p>
  </div>` : ''}

  ${pkg.cancellation_policy ? `
  <div class="section">
    <div class="section-title">Cancellation Policy</div>
    <p>${pkg.cancellation_policy}</p>
  </div>` : ''}

</div>

<!-- Footer -->
<div class="footer">
  <span>Magic Tours &nbsp;|&nbsp; magictours.qa</span>
  <span>Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
</div>

<script>
  window.onload = function() { setTimeout(function(){ window.print(); }, 600); };
</script>
</body>
</html>`;

        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) return;
        win.document.write(html);
        win.document.close();
    };

    const scrollRelated = (direction) => {
        if (relatedScrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            relatedScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetch('https://api.magictours.qa/promotions/frontend/package_details')
            .then(res => res.json())
            .then(data => setPromos(data?.data?.promotions || []))
            .catch(() => { });
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCards(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(3);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const maxSlide = Math.max(0, relatedPackages.length - visibleCards);
        if (currentSlide > maxSlide) {
            setCurrentSlide(maxSlide);
        }
    }, [visibleCards, relatedPackages.length, currentSlide]);

    // Detect whether the Journey Overview exceeds 4 lines (to show "Show more").
    useEffect(() => {
        const el = overviewRef.current;
        if (!el) return;
        // Measure only in the collapsed state.
        if (!showFullOverview) {
            setOverviewOverflows(el.scrollHeight > el.clientHeight + 1);
        }
    }, [pkg, showFullOverview, mounted]);

    // Booking Form State
    const [bookingDate, setBookingDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [sidebarName, setSidebarName] = useState('');
    const [sidebarEmail, setSidebarEmail] = useState('');
    const [sidebarPhone, setSidebarPhone] = useState('');

    // Itinerary Accordion State
    const [expandedDays, setExpandedDays] = useState([]);
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

    // Auto-loop state for Related Images — each item carries { src, description }
    const relatedImages = useMemo(() => {
        const attractionImages = pkg?.attractions?.flatMap(a =>
            (a.images || []).map(img => ({
                src: img?.url || img?.src || img,
                description: a.overview || a.short_description || ''
            }))
        ).filter(item => item.src) || [];
        if (attractionImages.length > 0) return attractionImages;
        if (pkg?.images?.length) return pkg.images.map(i => ({ src: i?.src || i, description: '' }));
        if (pkg?.gallery?.length) {
            const g = typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : pkg.gallery;
            return g.map(i => ({ src: i?.src || i, description: '' }));
        }
        return [img4, img5, img1, img2, img3, img6].map(i => ({ src: i, description: '' }));
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
        adultDouble: 1,  // rooms
        adultSingle: 0,  // rooms
        adultTriple: 0,  // rooms
        adultQuad: 0,    // rooms
        childBed: 0,     // persons
        childNoBed: 0,   // persons
        infant: 0        // persons
    });
    const { user, openAuthModal } = useCustomerAuth();
    const { selectedCurrency, convertPrice, formatPrice } = useCurrency();
    const router = useRouter();
    const searchParams = useSearchParams();

    const formatEntryFee = (fee) => {
        if (Number(fee) === 0) return 'Free';
        const converted = convertPrice(fee);
        const symbol = selectedCurrency?.symbol || selectedCurrency?.code || 'QAR';
        const rounded = Math.round(Number(converted));
        return `${symbol} ${rounded.toLocaleString()}`;
    };

    // If the user lands here after login with ?book=true, open the modal automatically
    useEffect(() => {
        if (user && searchParams.get('book') === 'true') {
            setIsBookingModalOpen(true);
            // Clean the query param from the URL without re-navigating
            const clean = window.location.pathname;
            window.history.replaceState(null, '', clean);
        }
    }, [user, searchParams]);

    // Guard: redirect to login if not authenticated, then come back with modal open
    const handleOpenBooking = () => {
        if (!user) {
            const callback = encodeURIComponent(`/packages/${id}?book=true`);
            router.push(`/login?callback=${callback}`);
            return;
        }
        setIsBookingModalOpen(true);
    };

    useEffect(() => {
        if (!id) return;
        const fetchPackageDetail = async () => {
            try {
                const response = await fetch(`https://api.magictours.qa/packages/frontend/detail/${id}`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setPkg(data.package_details || data);
                if (data.related_packages && data.related_packages.length > 0) {
                    setRelatedPackages(data.related_packages.slice(0, 6));
                    setRelatedLoading(false);
                } else {
                    // Fallback: fetch other packages from /packages/frontend/list
                    const listResponse = await fetch('https://api.magictours.qa/packages/frontend/list');
                    if (listResponse.ok) {
                        const listData = await listResponse.json();
                        const allPkgs = listData.data || listData;
                        if (Array.isArray(allPkgs)) {
                            // Filter out current package and limit to 6
                            const currentPkgId = data.package_details?.id || data.id;
                            const filtered = allPkgs
                                .filter(p => p.id !== currentPkgId)
                                .slice(0, 6);
                            setRelatedPackages(filtered);
                        }
                    }
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

    useEffect(() => {
        if (pkg) setShowOperator(pkg.show_operator_on_frontend !== false);
    }, [pkg]);

    useEffect(() => {
        fetch('https://api.magictours.qa/icon-masters/public')
            .then(r => r.json())
            .then(d => setIconMasters(Array.isArray(d) ? d : (d.data || [])))
            .catch(() => {});
    }, []);

    // Redundant fetchRelated removed

    const totalPrice = useMemo(() => {
        if (!pkg) return 0;
        const _cp2 = pkg.pricing_info?.current_pricing; const _dp2 = pkg.pricing_info?.default_pricing;
        const p = (_cp2 || _dp2) ? { adult_single: (_cp2?.adult_single||0)||(_dp2?.adult_single||0), adult_double: (_cp2?.adult_double||0)||(_dp2?.adult_double||0), adult_triple: (_cp2?.adult_triple||0)||(_dp2?.adult_triple||0), adult_quad: (_cp2?.adult_quad||0)||(_dp2?.adult_quad||0), child_with_bed: (_cp2?.child_with_bed||0)||(_dp2?.child_with_bed||0), child_no_bed: (_cp2?.child_no_bed||0)||(_dp2?.child_no_bed||0), infant: (_cp2?.infant||0)||(_dp2?.infant||0) } : null;
        if (!p) return (pkg.price || 0) * (counts.adultDouble + counts.adultSingle + counts.adultTriple + counts.adultQuad + counts.childBed + counts.childNoBed);

        return (
            (counts.adultDouble * (p.adult_double    ?? pkg.price ?? 0)) +
            (counts.adultSingle * (p.adult_single    ?? pkg.price ?? 0)) +
            (counts.adultTriple * (p.adult_triple    ?? pkg.price ?? 0)) +
            (counts.adultQuad   * (p.adult_quad      ?? pkg.price ?? 0)) +
            (counts.childBed    * (p.child_with_bed  ?? 0)) +
            (counts.childNoBed  * (p.child_no_bed    ?? 0)) +
            (counts.infant      * (p.infant           ?? 0))
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

    const blackoutDates = pkg.blackout_dates ? (typeof pkg.blackout_dates === 'string' ? JSON.parse(pkg.blackout_dates) : pkg.blackout_dates) : [];
    const termsConditions = pkg.terms_conditions ? (typeof pkg.terms_conditions === 'string' ? JSON.parse(pkg.terms_conditions) : pkg.terms_conditions) : null;
    const servicePolicy = pkg.service_policy ? (typeof pkg.service_policy === 'string' ? JSON.parse(pkg.service_policy) : pkg.service_policy) : null;


    return (
        <div className="bg-white min-h-screen pb-20" style={{overflowX: 'clip'}}>
            {/* Banner Section - Acting like Home Hero */}
            <section className="relative min-h-[45vh] sm:min-h-[60vh] lg:min-h-[85vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 m-0 p-0 font-sans border-none">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImg.src || bannerImg}
                        alt="Packages Detail Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content - Centered like Hero */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-8 md:mt-20">

                    {/* Title with flight route icon + collab frame */}
                    <div className="relative flex flex-col items-center md:inline-block">
                        <h1 className="order-2 md:order-none text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] tracking-tight drop-shadow-sm font-heading">
                            {toTitleCase(pkg.title)}
                        </h1>
                        {/* Flight route icon — decorative, top-right of title (desktop only) */}
                        <img
                            src={flightRouteIcon.src || flightRouteIcon}
                            alt=""
                            className="hidden md:block absolute md:-top-16 md:-right-20 w-24 lg:w-32 opacity-90 pointer-events-none"
                        />
                        {/* Collab pill — handshake icon on the left, "In Collaboration With"
                            text above the airline logo. Crisp HTML/CSS so text stays sharp.
                            On mobile it sits in flow below the title (no overlap); on md+ it
                            floats beside the title. */}
                        {(() => {
                            const firstAirline = pkg.show_airline_on_frontend !== false ? (pkg.airlines?.length ? pkg.airlines[0] : (pkg.airline_name ? { name: pkg.airline_name, logo: pkg.airline_logo } : null)) : null;
                            return firstAirline && (
                                <div className="order-1 md:order-none flex justify-center mb-4 md:mb-0 md:block md:absolute md:-top-14 md:left-[calc(100%+2rem)] pointer-events-none">
                                    <div className="inline-flex items-center gap-2.5 bg-white rounded-full shadow-lg border border-slate-100 pl-2 pr-5 py-2">
                                        <span className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden shrink-0 border border-slate-100">
                                            <img src={handshakeIcon.src || handshakeIcon} alt="In collaboration" className="w-full h-full object-cover" />
                                        </span>
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                            <span className="text-[10px] md:text-[11px] font-semibold tracking-wide text-slate-400 leading-none whitespace-nowrap">
                                                In Collaboration With
                                            </span>
                                            {firstAirline.logo ? (
                                                <img src={firstAirline.logo} alt={firstAirline.name || 'Airline'} className="h-5 md:h-6 w-auto max-w-[90px] object-contain" />
                                            ) : (
                                                <span className="text-[12px] md:text-[13px] font-bold text-[#113A74] leading-tight whitespace-nowrap">{firstAirline.name}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Breadcrumbs — below title */}
                    <nav className="flex items-center justify-center gap-1.5 text-[12px] md:text-xs font-bold text-[#113A74] uppercase tracking-[0.05em] mt-4">
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
            <div className="px-3 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

                    {/* ── LEFT SIDEBAR ── */}
                    <div className="order-3 lg:order-1 lg:w-[270px] xl:w-[300px] shrink-0 space-y-5 lg:sticky lg:top-24 self-start border border-gray-200 rounded-2xl p-1.5">
                        {/* Promo image — desktop only */}
                        <div className="hidden lg:block rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100">
                            <img src={bookingImg.src || bookingImg} alt="Special Offer" className="w-full h-auto object-cover" />
                        </div>

                        {/* Related Images */}
                        {relatedImages.length > 0 && (
                            <div className="hidden lg:block space-y-3 p-2 overflow-hidden w-full">
                                <h4 className="text-[#113A74] font-bold font-heading text-lg text-center">Related Images</h4>

                                {/* Description — animates with the active slide */}
                                {relatedImages[currentImageIndex]?.description && (
                                    <motion.p
                                        key={currentImageIndex}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-gray-500 text-xs text-center leading-relaxed px-2 line-clamp-3"
                                    >
                                        {relatedImages[currentImageIndex].description}
                                    </motion.p>
                                )}

                                {/* Mobile: 1 image at a time */}
                                <div className="block lg:hidden px-2">
                                    {mounted && (() => {
                                        const image = relatedImages[currentImageIndex];
                                        return (
                                            <motion.div
                                                key={currentImageIndex}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="w-full rounded-2xl overflow-hidden shadow-sm h-[200px] sm:h-[240px]"
                                            >
                                                <img
                                                    src={image?.src || image}
                                                    className="w-full h-full object-cover"
                                                    alt={`Related Image ${currentImageIndex}`}
                                                />
                                            </motion.div>
                                        );
                                    })()}
                                </div>
                                {/* Desktop: 2 images side by side */}
                                <div className="hidden lg:block relative overflow-hidden h-[160px]">
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
                                {/* Dots — mobile: per image, desktop: per pair */}
                                <div className="flex justify-center gap-1.5 pt-1">
                                    {Array.from({ length: relatedImages.length }).map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer lg:hidden ${currentImageIndex === i ? 'bg-[#113A74] w-4' : 'bg-gray-300 w-1.5'}`}
                                        />
                                    ))}
                                    {Array.from({ length: Math.ceil(relatedImages.length / 2) }).map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setCurrentImageIndex(i * 2)}
                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer hidden lg:block ${Math.floor(currentImageIndex / 2) === i ? 'bg-[#113A74] w-4' : 'bg-gray-300 w-1.5'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ── CENTER MAIN CONTENT ── */}
                    <div className="order-1 lg:order-2 flex-1 min-w-0 space-y-6 border border-gray-200 rounded-2xl p-2.5 sm:p-3">

                        {/* Gallery carousel + Title grouped with tight spacing */}
                        <div className="space-y-3">
                        {/* Gallery carousel — top of content */}
                        {(() => {
                            const imgs = [pkg.image, ...gallery].filter(Boolean);
                            if (!imgs.length) return null;
                            return (
                                <div className="space-y-3">
                                    <div className="rounded-2xl overflow-hidden h-[200px] sm:h-[280px] md:h-[340px]">
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
                                <h2 className="text-xl md:text-2xl font-bold text-black font-heading leading-tight">
                                    {toTitleCase(pkg.title)}
                                </h2>
                                <div className="shrink-0 text-right">
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <QrCode size={15} className="text-[#113A74]" />
                                        <span className="text-[#113A74] font-bold text-sm">Tour Code : <span className="text-gray-500 font-semibold">{pkg.display_id || 'N/A'}</span></span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">{pkg.nights} Nights &amp; {pkg.days} Days</p>
                        </div>
                        </div>{/* end gallery+title group */}

                        {/* Info rows grouped tightly */}
                        <div className="space-y-1">
                        <div className="flex flex-col gap-y-0.5">
                            {(pkg.continent || pkg.country) && (
                                <div className="flex items-start gap-2 py-1.5 text-sm text-gray-600 border-b border-gray-100">
                                    <img src={flagDetailIcon.src || flagDetailIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium font-montserrat leading-snug">
                                        {[pkg.continent, pkg.country].filter(Boolean).join('. ')}
                                    </span>
                                </div>
                            )}
                            {pkg.countries?.length > 0 && (
                                <div className="flex items-start gap-2 py-1 text-sm text-gray-600 border-b border-gray-100">
                                    <Globe size={16} className="shrink-0 mt-0.5 text-gray-500" />
                                    <span className="font-medium font-montserrat leading-snug">
                                        {pkg.countries.map(c => c.name).join(', ')}
                                    </span>
                                </div>
                            )}
                            {pkg.cities?.length > 0 && (
                                <div className="flex items-start gap-2 py-1 text-sm text-gray-600 border-b border-gray-100">
                                    <img src={locationIcon.src || locationIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium font-montserrat leading-snug">
                                        {pkg.cities.map(c => c.name).join(', ')}
                                    </span>
                                </div>
                            )}
                            {(() => {
                                const cats = pkg.categories?.length > 0
                                    ? pkg.categories.map(c => c.name || c)
                                    : (() => { try { const p = JSON.parse(pkg.category || '[]'); return Array.isArray(p) ? p : []; } catch { return []; } })();
                                return cats.length > 0 ? (
                                    <div className="flex items-start gap-2 py-1 text-sm text-gray-600 border-b border-gray-100">
                                        <Tag size={16} className="shrink-0 mt-0.5 text-gray-500" />
                                        <span className="font-medium font-montserrat leading-snug">{cats.join(', ')}</span>
                                    </div>
                                ) : null;
                            })()}
                            {(pkg.valid_from || pkg.valid_to) && (
                                <div className="flex items-start gap-2 py-1 text-sm text-gray-600 border-b border-gray-100">
                                    <img src={dateIcon.src || dateIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium font-montserrat leading-snug">
                                        {pkg.valid_from ? new Date(pkg.valid_from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                        {pkg.valid_from && pkg.valid_to ? ' - ' : ''}
                                        {pkg.valid_to ? new Date(pkg.valid_to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                    </span>
                                </div>
                            )}
                            {showOperator && pkg.operated_by_name && (
                                <div className="flex items-start gap-2 py-1 text-sm text-gray-600 border-b border-gray-100">
                                    <img src={headIcon.src || headIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium font-montserrat leading-snug">{pkg.operated_by_name}</span>
                                </div>
                            )}
                        </div>

                        {/* Departure row — only shown when departure dates exist */}
                        {pkg.departure_dates?.length > 0 && (
                            <div className="flex flex-col gap-y-1.5">
                                <div className="flex items-center gap-2 py-1 text-sm text-gray-600 border-b border-gray-100">
                                    <img src={trainIcon.src || trainIcon} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="font-montserrat">Customized Holidays, Fixed Departure</span>
                                </div>
                                <div className="flex items-start gap-2 py-1 text-sm text-gray-600 border-b border-gray-100">
                                    <img src={plainIcon.src || plainIcon} alt="" className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-montserrat leading-snug">
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


                        {/* Journey Overview title + text (4 lines, then Show more) */}
                        {(() => {
                            const overviewText = pkg.journey_overview || '';
                            if (!overviewText) return null;
                            return (
                                <div className="space-y-3">
                                    <div className="border-t border-gray-200 pt-4">
                                        <h2 className="text-xl md:text-2xl font-bold text-black font-heading">Journey Overview :</h2>
                                    </div>
                                    <div ref={overviewRef} className={`text-gray-400 text-base leading-relaxed space-y-3 ${showFullOverview ? '' : 'line-clamp-4'}`}>
                                        {overviewText.split(/\n\n+/).map((para, i) => (
                                            <p key={i} className="whitespace-pre-line">{para.trim()}</p>
                                        ))}
                                    </div>
                                    {(overviewOverflows || showFullOverview || overviewText.length > 300) && (
                                        <button
                                            type="button"
                                            onClick={() => setShowFullOverview(v => !v)}
                                            className="text-[#113A74] text-sm font-bold hover:text-[#FFA500] transition-colors"
                                        >
                                            {showFullOverview ? 'Show less' : 'Show more'}
                                        </button>
                                    )}
                                </div>
                            );
                        })()}

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
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-black font-heading">
                                            Journey Highlights :
                                        </h2>
                                        <p className="text-gray-400 text-base leading-relaxed mt-1">
                                            Explore the must-see attractions and unforgettable experiences included in your journey.
                                        </p>
                                    </div>
                                    <div className="bg-[#EBF3FF] rounded-2xl p-3 sm:p-5 overflow-visible">
                                        {(() => {
                                            const renderCity = ([cityName, attrs]) => (
                                                <div key={cityName} className="mb-4 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={15} className="text-[#113A74] shrink-0" />
                                                        <h4 className="text-[#113A74] font-bold text-base">{cityName}</h4>
                                                    </div>
                                                    <ul className="space-y-1.5 pl-1">
                                                        {attrs.map((attr, i) => (
                                                            <li key={attr.id || i} className="flex items-start gap-2 text-gray-500 text-sm">
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                                                <span className="flex-1 min-w-0 relative group">
                                                                    {attr.url ? (
                                                                        <a href={attr.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 hover:underline transition-colors cursor-pointer text-slate-700 font-medium">
                                                                            {attr.name}
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-slate-700 font-medium cursor-default">{attr.name}</span>
                                                                    )}
                                                                    {attr.entry_fee !== null && attr.entry_fee !== undefined && attr.entry_fee !== '' && (
                                                                        <span className="text-[#113A74] font-semibold text-xs ml-1.5">(Entry: {formatEntryFee(attr.entry_fee)})</span>
                                                                    )}
                                                                    {attr.overview && (
                                                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[9999] hidden group-hover:block w-48 sm:w-64 pointer-events-none">
                                                                            <div className="bg-[#113A74] text-white text-xs rounded-xl p-3 shadow-2xl leading-relaxed">
                                                                                <p className="font-semibold text-white/90 mb-1">{attr.name}</p>
                                                                                <p className="text-white/75 line-clamp-3">{attr.overview}</p>
                                                                            </div>
                                                                            <div className="w-3 h-3 bg-[#113A74] rotate-45 mx-auto -mt-1.5" />
                                                                        </div>
                                                                    )}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                            if (groups.length <= 1) {
                                                return <div>{groups.map(renderCity)}</div>;
                                            }
                                            const mid = Math.ceil(groups.length / 2);
                                            const leftCol = groups.slice(0, mid);
                                            const rightCol = groups.slice(mid);
                                            return (
                                                <div className="flex flex-col lg:flex-row gap-x-6">
                                                    <div className="flex-1">{leftCol.map(renderCity)}</div>
                                                    <div className="flex-1">{rightCol.map(renderCity)}</div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Itinerary Accordion */}
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <h3 className="text-[22px] md:text-[26px] font-bold text-black font-heading">Itinerary</h3>
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
                                {/* Vertical Timeline Line — dotted */}
                                <div className="absolute left-[19px] top-6 bottom-6 -z-10" style={{ borderLeft: '2px dashed #e5e7eb' }}></div>

                                {pkg.itinerary && pkg.itinerary.map((item) => {
                                    const isExpanded = expandedDays.includes(item.day);
                                    return (
                                        <div key={item.day} className="relative pl-12 sm:pl-14 pt-2">
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
                                                <h4 className="font-bold font-heading text-base sm:text-lg text-black pr-2">
                                                    <span>Day {item.day < 10 ? `0${item.day}` : item.day} : </span>
                                                    <span>{cleanItineraryTitle(item.title)}</span>
                                                </h4>
                                                {isExpanded ? (
                                                    <ChevronUp className="text-[#FFA500] w-5 h-5 transition-transform" />
                                                ) : (
                                                    <ChevronDown className="text-gray-400 w-5 h-5 transition-transform group-hover:text-[#FFA500]" />
                                                )}
                                            </button>

                                            {/* Expanded Content */}
                                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1500px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                                                {/* Descriptions — one paragraph per item */}
                                                {(item.descriptions?.length > 0 ? item.descriptions : item.description ? [item.description] : []).map((desc, di) => (
                                                    <p key={di} className="text-sm text-black leading-relaxed mb-3 pr-4 whitespace-pre-line">{desc}</p>
                                                ))}

                                                {/* Transport & Meal Icons */}
                                                {(() => {
                                                    const EMOJI = {
                                                        'Flight':'✈️','Helicopter':'🚁','Train':'🚆','Bus':'🚌','Car':'🚗',
                                                        'Private Transfer':'🚘','SIC Transfer':'🚐','Cruise':'🚢','Boat':'⛵',
                                                        'Ferry':'⛴️','Yacht':'🛥️','Private Jet':'✈️',
                                                        'Breakfast':'🍳','Lunch':'🥗','Dinner':'🍽️','Tea':'🍵',
                                                        'Coffee':'☕','Snacks':'🍿','Drinks':'🥤','Gala Dinner':'🥂',
                                                    };
                                                    const transport = item.transport_icons?.length ? item.transport_icons
                                                        : [item.has_flight && 'Flight', item.has_train && 'Train', item.has_bus && 'Bus'].filter(Boolean);
                                                    const meals = item.meal_icons?.length ? item.meal_icons
                                                        : [item.has_breakfast && 'Breakfast', item.has_lunch && 'Lunch', item.has_dinner && 'Dinner'].filter(Boolean);
                                                    if (!transport.length && !meals.length) return null;
                                                    return (
                                                        <div className="flex flex-col gap-1.5 mt-3 items-end">
                                                            {transport.length > 0 && (
                                                                <div className="flex flex-wrap justify-end gap-3">
                                                                    {transport.map(n => (
                                                                        <div key={n} className="flex items-center gap-1 text-gray-500 text-sm">
                                                                            <span>{EMOJI[n] || '🚗'}</span> {n}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {meals.length > 0 && (
                                                                <div className="flex flex-wrap justify-end gap-3">
                                                                    {meals.map(n => (
                                                                        <div key={n} className="flex items-center gap-1 text-gray-500 text-sm">
                                                                            <span>{EMOJI[n] || '🍽️'}</span> {n}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {!isExpanded && <div className="border-b border-gray-100 mr-4"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Hotels Used */}
                        {pkg.hotels?.length > 0 && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-black font-heading">
                                        Hotels Used :
                                    </h2>
                                    <p className="text-gray-400 text-base mt-1">
                                        Comfortable stays handpicked to make your journey relaxing and memorable.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {pkg.hotels.map((hotel, idx) => {
                                        let address = '';
                                        try { address = JSON.parse(hotel.location_map || '{}').address || ''; } catch {}
                                        const displayAddress = address || [hotel.continent, hotel.country, hotel.cities?.name].filter(Boolean).join(', ');
                                        return (
                                        <div key={hotel.id || idx} className="flex items-center gap-3 rounded-2xl border border-gray-100 shadow-sm p-3 bg-[#F4F4F4] w-full">
                                            {/* Image */}
                                            <div className="w-16 h-16 sm:w-[130px] sm:h-[85px] md:w-[180px] md:h-[110px] shrink-0 rounded-xl overflow-hidden">
                                                <img
                                                    src={hotel.images?.[0] || hotel1.src}
                                                    alt={hotel.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                                                <h3 className="text-[#113A74] font-bold text-base sm:text-[20px] leading-tight line-clamp-1">
                                                    {toTitleCase(hotel.name)}
                                                </h3>
                                                {displayAddress && (
                                                    <div className="flex items-start gap-1.5 text-gray-500 text-[12px]">
                                                        <MapPin size={11} className="shrink-0 mt-0.5 text-[#113A74]" />
                                                        <span className="line-clamp-1">{displayAddress}</span>
                                                    </div>
                                                )}
                                                {/* Tel + Website in one row */}
                                                {(hotel.phone || hotel.url) && (
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        {hotel.url && (
                                                            <div className="flex items-center gap-1.5 text-[12px]">
                                                                <Globe size={12} className="shrink-0 text-[#113A74]" />
                                                                <a
                                                                    href={hotel.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#113A74] hover:text-[#FFA500] transition-colors truncate"
                                                                    onClick={e => e.stopPropagation()}
                                                                >
                                                                    View Website
                                                                </a>
                                                            </div>
                                                        )}
                                                        {hotel.phone && (
                                                            <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                                                                <Phone size={12} className="shrink-0 text-[#113A74]" />
                                                                <span>Tel: {hotel.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        );
                                    })}
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
                                    <div className="grid grid-cols-5 px-5 py-3 bg-blue-50 border-b border-blue-100">
                                        {['DATE', 'FLIGHT NO', 'ROUTE', 'DEPARTURE', 'ARRIVAL'].map(h => (
                                            <span key={h} className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{h}</span>
                                        ))}
                                    </div>
                                    {/* Rows */}
                                    {pkg.flights.map((flight, idx) => {
                                        const d = flight.date ? new Date(flight.date) : null;
                                        const formattedDate = d
                                            ? `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${d.toLocaleDateString('en-GB', { weekday: 'short' })}`
                                            : '—';
                                        return (
                                            <div key={flight.id || idx} className={`grid grid-cols-5 px-5 py-4 items-center text-sm ${idx < pkg.flights.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                                <span className="text-gray-600 font-medium">{formattedDate}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Plane size={11} className="text-[#113A74] shrink-0" />
                                                    <span>{flight.flight_number || '—'}</span>
                                                </div>
                                                <span>
                                                    {flight.departure_airport_code && flight.arrival_airport_code
                                                        ? `${flight.departure_airport_code} → ${flight.arrival_airport_code}`
                                                        : '—'}
                                                </span>
                                                <span className="text-gray-600">{flight.departure_time || '—'}</span>
                                                <span className="text-gray-600">{flight.arrival_time || '—'}</span>
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
                                    <div className="grid px-5 py-3 bg-blue-50 border-b border-blue-100" style={{gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr'}}>
                                        {['DATE', 'TRAIN', 'FROM', 'TO', 'DEPARTURE', 'ARRIVAL'].map(h => (
                                            <span key={h} className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{h}</span>
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
                                            <div key={train.id || idx} className={`grid grid-cols-6 px-5 py-4 items-start text-sm ${idx < pkg.trains.length - 1 ? 'border-b border-gray-50' : ''}`} style={{gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr'}}>
                                                <span className="text-gray-600 font-medium min-w-0">{formattedDate}</span>
                                                <div className="flex items-start gap-1.5 min-w-0">
                                                    <Train size={11} className="text-[#113A74] shrink-0 mt-1" />
                                                    <span className="break-all">{trainLabel}</span>
                                                </div>
                                                <span className="min-w-0 break-words">{train.from_station || '—'}</span>
                                                <span className="min-w-0 break-words">{train.to_station || '—'}</span>
                                                <span className="text-gray-600 min-w-0">{train.departure_time || '—'}</span>
                                                <span className="text-gray-600 min-w-0">{train.arrival_time || '—'}</span>
                                            </div>
                                        );
                                    })}
                                    </div>{/* end min-w train */}
                                </div>
                            </div>
                        )}

                        {/* Inclusion / Exclusion */}
                        <div className="space-y-4">
                            <h3 className="text-xl md:text-2xl font-bold text-black font-heading">Inclusion/Exclusion</h3>
                            <div className="bg-[#EBF3FF] rounded-2xl p-3 sm:p-6">
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
                        {blackoutDates?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#113A74]">
                                        <Calendar size={19} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-black font-heading">
                                        Black Out Days
                                    </h3>
                                </div>
                                <div className="rounded-[1.5rem] border border-slate-100 bg-[#FBFBFB] p-4 sm:p-8 shadow-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-3">
                                        {blackoutDates.map((range, index) => (
                                            <div key={range.id || index} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4B5872] font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                                <span>
                                                    {formatPackageDate(range.from || range.start_date)} - {formatPackageDate(range.to || range.end_date)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Policies Wrapper to reduce gap between sections */}
                        {(pkg.offer_validity || pkg.booking_policy || pkg.cancellation_policy || termsConditions || servicePolicy) && (
                            <div className="space-y-3">
                                {/* Offer Validity — separate section */}
                                {pkg.offer_validity && (
                                    <div className="border border-gray-100 rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-4 sm:py-5 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <img src={offerIcon.src || offerIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base sm:text-[20px] font-bold text-black font-heading">Offer Validity</h4>
                                        </div>
                                        <p className="text-gray-400 text-base leading-relaxed">
                                            {(() => {
                                                const date = new Date(pkg.offer_validity);
                                                if (isNaN(date.getTime())) return pkg.offer_validity;
                                                const formatted = date.toLocaleDateString('en-GB', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                });
                                                return `This offer valid only until ${formatted}`;
                                            })()}
                                        </p>
                                    </div>
                                )}

                                {/* Booking Policy — separate section */}
                                {(() => {
                                    const bp = pkg.booking_policy ? (typeof pkg.booking_policy === 'string' ? JSON.parse(pkg.booking_policy) : pkg.booking_policy) : null;
                                    return (Array.isArray(bp) ? bp.length > 0 : !!bp) && (
                                        <div className="border border-gray-100 rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <img src={bookingPolicyIcon.src || bookingPolicyIcon} alt="" className="w-5 h-5 shrink-0" />
                                                <h4 className="text-base sm:text-[20px] font-bold text-black font-heading">Booking Policy</h4>
                                            </div>
                                            {Array.isArray(bp) ? (
                                                <ul className="space-y-1.5 pl-1">
                                                    {bp.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-gray-400 text-base leading-relaxed">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                                            {typeof item === 'string' ? item : item.name || item.title || ''}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-400 text-base leading-relaxed">{bp}</p>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Cancellation Policy — separate section */}
                                {(() => {
                                    const cp = pkg.cancellation_policy ? (typeof pkg.cancellation_policy === 'string' ? JSON.parse(pkg.cancellation_policy) : pkg.cancellation_policy) : null;
                                    return (Array.isArray(cp) ? cp.length > 0 : !!cp) && (
                                        <div className="border border-gray-100 rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <img src={cancellationPolicyIcon.src || cancellationPolicyIcon} alt="" className="w-5 h-5 shrink-0" />
                                                <h4 className="text-base sm:text-[20px] font-bold text-black font-heading">Cancellation Policy</h4>
                                            </div>
                                            {Array.isArray(cp) ? (
                                                <ul className="space-y-1.5 pl-1">
                                                    {cp.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-gray-400 text-base leading-relaxed">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                                            {typeof item === 'string' ? item : item.name || item.title || ''}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-400 text-base leading-relaxed">{cp}</p>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Terms & Conditions — separate section */}
                                {(Array.isArray(termsConditions) ? termsConditions.length > 0 : !!termsConditions) && (
                                    <div className="border border-gray-100 rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <img src={bookingPolicyIcon.src || bookingPolicyIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base sm:text-[20px] font-bold text-black font-heading">Terms &amp; Conditions</h4>
                                        </div>
                                        {Array.isArray(termsConditions) ? (
                                            <ul className="space-y-1.5 pl-1">
                                                {termsConditions.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-gray-400 text-base leading-relaxed">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                                        {typeof item === 'string' ? item : item.name || item.title || ''}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400 text-base leading-relaxed">{termsConditions}</p>
                                        )}
                                    </div>
                                )}

                                {/* Service Policy — separate section */}
                                {(Array.isArray(servicePolicy) ? servicePolicy.length > 0 : !!servicePolicy) && (
                                    <div className="border border-gray-100 rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <img src={bookingPolicyIcon.src || bookingPolicyIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base sm:text-[20px] font-bold text-black font-heading">Service Policy</h4>
                                        </div>
                                        {Array.isArray(servicePolicy) ? (
                                            <ul className="space-y-1.5 pl-1">
                                                {servicePolicy.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-gray-400 text-base leading-relaxed">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                                        {typeof item === 'string' ? item : item.name || item.title || ''}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400 text-base leading-relaxed">{servicePolicy}</p>
                                        )}
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

                        {/* Links & Important Contact Grouped Container */}
                        {((pkg.links && pkg.links.length > 0) || (pkg.contacts && pkg.contacts.length > 0)) && (
                            <div className="border border-gray-100 rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-4 sm:py-5 space-y-4">
                                {/* Links */}
                                {pkg.links?.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <img src={linkIcon.src || linkIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base sm:text-[20px] font-bold text-black font-heading">Links</h4>
                                        </div>
                                        <div className="space-y-1.5 pl-5 sm:pl-8">
                                            {pkg.links.map((link, idx) => (
                                                <a
                                                    key={idx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-sm text-[#113A74] hover:underline"
                                                >
                                                    {link.name || link.title || link.label || link.url}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Horizontal separator if both exist */}
                                {pkg.links?.length > 0 && pkg.contacts?.length > 0 && (
                                    <div className="border-t border-gray-100 -mx-4 sm:-mx-6" />
                                )}

                                {/* Important Contact */}
                                {pkg.contacts?.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <img src={callIcon.src || callIcon} alt="" className="w-5 h-5 shrink-0" />
                                            <h4 className="text-base sm:text-[20px] font-bold text-black font-heading">Important Contact</h4>
                                        </div>
                                        <div className="max-w-[450px] pl-5 sm:pl-8">
                                            <div className="divide-y divide-gray-200">
                                                {pkg.contacts.map((contact, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 text-sm sm:text-base">
                                                        <span className="text-[#4B5872] font-medium min-w-[120px] sm:min-w-[160px]">
                                                            {contact.mobile ? contact.name?.replace(contact.mobile, '').replace(/[,\s]+$/, '').trim() : contact.name}
                                                        </span>
                                                        <span className="text-[#1D2A44] font-normal">{contact.mobile}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>{/* end center main content */}

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="order-2 lg:order-3 lg:w-[270px] xl:w-[300px] shrink-0 space-y-5 lg:sticky lg:top-24 self-start border border-gray-200 rounded-2xl p-1.5">

                        {/* Airlines + Operated By — single combined box */}
                        {(() => {
                            const airlineList = pkg.show_airline_on_frontend !== false ? (pkg.airlines?.length ? pkg.airlines : (pkg.airline_name ? [{ name: pkg.airline_name, logo: pkg.airline_logo }] : [])) : [];
                            if (airlineList.length === 0 && !(showOperator && pkg.operated_by_name)) return null;
                            return (
                                <div
                                    className="rounded-2xl overflow-hidden relative mb-3 px-4 py-3 flex flex-col gap-3"
                                    style={{
                                        backgroundImage: `url(${airlineBg.src || airlineBg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: '#0d2d5e',
                                    }}
                                >
                                    {airlineList.map((airline, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shrink-0 shadow overflow-hidden">
                                                {airline.logo ? (
                                                    <img src={airline.logo} alt={airline.name} className="w-[30px] h-[30px] object-contain" />
                                                ) : (
                                                    <Plane size={18} className="text-[#0d2d5e]" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">Airline</p>
                                                <p className="text-white font-bold text-[13px] leading-tight truncate">{airline.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {showOperator && pkg.operated_by_name && (
                                        <>
                                            {airlineList.length > 0 && <div className="border-t border-white/10" />}
                                            <div className="flex items-center gap-3">
                                                <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shrink-0 shadow overflow-hidden">
                                                    {pkg.operated_by_logo ? (
                                                        <img src={pkg.operated_by_logo} alt={pkg.operated_by_name} className="w-[30px] h-[30px] object-contain" />
                                                    ) : (
                                                        <Users size={18} className="text-[#0d2d5e]" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">Operated by</p>
                                                    <p className="text-white font-bold text-[13px] leading-tight truncate">{pkg.operated_by_name}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })()}

                        <div className="bg-[#113A74] rounded-[1.5rem] p-5 space-y-5 shadow-xl">
                            <h4 className="text-white font-bold text-xl font-heading tracking-wide">Package Cost</h4>
                            <div className="space-y-3 border-t border-white/10 pt-4">
                                {(() => {
                                    const cp = pkg.pricing_info?.current_pricing;
                                    const dp = pkg.pricing_info?.default_pricing;
                                    const keys = ['adult_single','adult_double','adult_triple','adult_quad','child_with_bed','child_no_bed','infant'];
                                    const merged = {};
                                    keys.forEach(k => {
                                        merged[k] = (cp?.[k] || 0) || (dp?.[k] || 0) || Number(pkg?.[`default_price_${k}`]) || 0;
                                    });
                                    const p = merged;
                                    const rows = [
                                        { label: 'Single Traveler', value: p.adult_single    },
                                        { label: 'Twin Sharing',    value: p.adult_double    },
                                        { label: 'Triple Sharing',  value: p.adult_triple    },
                                        { label: 'Quad Sharing',    value: p.adult_quad      },
                                        { label: 'Child With Bed',  value: p.child_with_bed  },
                                        { label: 'Child No Bed',    value: p.child_no_bed    },
                                        { label: 'Infant',          value: p.infant          },
                                    ].filter(r => r.value != null && r.value !== 0);
                                    if (!rows.length) return <p className="text-white/50 text-sm italic">Price on Request</p>;
                                    return rows.map(row => (
                                        <div key={row.label} className="flex items-center justify-between gap-2">
                                            <span className="text-white/70 text-base font-medium">{row.label}</span>
                                            <span className="text-white font-bold text-base">{formatPrice(row.value)}</span>
                                        </div>
                                    ));
                                })()}
                            </div>
                            <button
                                onClick={pkg?.is_rfq ? () => setIsEnquiryModalOpen(true) : handleOpenBooking}
                                className="w-full bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold rounded-full py-3 flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg text-base"
                            >
                                {pkg?.is_rfq ? 'Enquiry' : 'Book Now'} <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Booking Form */}
                        <div className="bg-[#113A74] rounded-[1.5rem] p-5 space-y-4 shadow-xl mt-4">
                            <div className="text-center space-y-2">
                                <h4 className="text-white font-black text-base font-heading tracking-wide">Booking Form</h4>
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
                                onClick={pkg?.is_rfq ? () => setIsEnquiryModalOpen(true) : handleOpenBooking}
                                className="w-full bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold rounded-full py-3 flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg text-base"
                            >
                                {pkg?.is_rfq ? 'Enquiry' : 'Book Now'} <ArrowRight size={16} />
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
                            <button
                                onClick={downloadPDF}
                                className="mt-5 flex items-center justify-between w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-[#113A74] hover:text-[#113A74] transition-colors bg-white"
                            >
                                <span>Download PDF</span>
                                <span className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 5v14M5 12l7 7 7-7"/>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>{/* end flex row */}

                {/* Promo image — mobile only (shown after main content) */}
                <div className="lg:hidden mt-6 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100">
                    <img src={bookingImg.src || bookingImg} alt="Special Offer" className="w-full h-auto object-cover" />
                </div>

                {/* Location Map Section */}
                {(pkg.location_map || pkg.destination?.name || pkg.location) ? (
                    <div className="mt-4 sm:mt-6 lg:mt-8">
                        <div className="rounded-[2rem] overflow-hidden shadow-md border border-gray-100 h-[220px] sm:h-[320px] lg:h-[450px] relative">
                            {(() => {
                                // Multi-stop route: parse location_map into coordinate stops (array | single object).
                                let routeStops = [];
                                if (pkg.location_map && !String(pkg.location_map).includes('<iframe')) {
                                    try {
                                        const parsed = typeof pkg.location_map === 'string' ? JSON.parse(pkg.location_map) : pkg.location_map;
                                        const arr = Array.isArray(parsed) ? parsed : [parsed];
                                        routeStops = arr.filter(s => s && s.lat != null && s.lng != null)
                                            .map(s => ({ lat: Number(s.lat), lng: Number(s.lng), address: s.address || '' }));
                                    } catch { /* not JSON — fall through to iframe */ }
                                }
                                if (routeStops.length >= 1) {
                                    return <PackageRouteMap locations={routeStops} />;
                                }

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
                    <div className="max-w-[1100px] mx-auto px-6 overflow-hidden">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 border border-[#113A74]/20 bg-white px-5 py-2 rounded-full mb-5">
                                <Plane size={14} className="text-[#113A74]" />
                                <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#113A74]">Related</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#113A74] font-heading">
                                Related Trips You{' '}
                                <span className="text-[#FFA500]">Might Also Like</span>
                            </h2>
                        </div>

                        {/* Slider Container */}
                        <div className="relative">
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{
                                        transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
                                    }}
                                >
                                    {relatedPackages.map((rp) => {
                                        // Build city list: prefer cities array, fall back to splitting location by comma
                                        const rpCities = (() => {
                                            if (rp.cities?.length > 0)
                                                return rp.cities.map(c => typeof c === 'string' ? c : c?.name).filter(Boolean);
                                            if (rp.location) {
                                                const parts = rp.location.split(',').map(s => s.trim()).filter(Boolean);
                                                return parts;
                                            }
                                            return [];
                                        })();
                                        const cityRows = Array.from({ length: Math.ceil(rpCities.length / 3) }, (_, row) =>
                                            rpCities.slice(row * 3, row * 3 + 3)
                                        );
                                        const hotelsIncluded = rp.hotels_included ?? rp.has_hotel;
                                        const flightsIncluded = rp.flights_included ?? rp.has_flight;
                                        const hasFood = rp.has_food;
                                        const renderRpIcon = (name, category) => {
                                            const m = iconMasters.find(i => i.name === name && i.category === category);
                                            if (!m) return null;
                                            return m.icon_url
                                                ? <img key={name} src={m.icon_url} alt={name} title={name} className="w-5 h-5 object-contain" />
                                                : <span key={name} title={name} className="text-[18px] leading-none">{m.emoji}</span>;
                                        };
                                        return (
                                            <div
                                                key={rp.id}
                                                style={{ width: `${100 / visibleCards}%` }}
                                                className="shrink-0 px-3"
                                            >
                                                <div
                                                    onClick={() => router.push(`/packages/${rp.slug || rp.id}`)}
                                                    className="cursor-pointer bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                                >
                                                    {/* Image */}
                                                    <div className="relative aspect-[4/3.6] overflow-hidden">
                                                        <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        <FavoriteButton packageId={rp.id} className="absolute top-4 right-4 z-20 !bg-white/20 hover:!bg-white/30 !shadow-none border border-white/60 !backdrop-blur-sm [&_svg]:text-white" />
                                                        <div className="absolute top-4 left-0 bg-[#113A74] text-white pl-4 pr-3 py-2 rounded-r-lg flex items-center gap-2 text-[13px] font-bold shadow-lg">
                                                            <Calendar size={13} className="opacity-90" />
                                                            <span>{rp.nights} Nights, {rp.days} Days</span>
                                                        </div>
                                                        {/* Airline + Operated by overlay — visible on hover (bottom-left) */}
                                                        {(() => {
                                                            const rpAirlines = rp.show_airline_on_frontend !== false ? (rp.airlines?.length ? rp.airlines : (rp.airline_name ? [{ name: rp.airline_name }] : [])) : [];
                                                            return (rpAirlines.length > 0 || (showOperator && rp.operated_by_name)) && (
                                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                {rpAirlines.length > 0 && (
                                                                    <div className="flex items-center gap-2 text-white text-[15px] font-heading leading-tight">
                                                                        <img src={airlineTailIcon.src || airlineTailIcon} alt="Airline" className="w-7 h-7 object-contain shrink-0 scale-150" />
                                                                        <span>Airline : {rpAirlines.map(a => a.name).join(', ')}</span>
                                                                    </div>
                                                                )}
                                                                {showOperator && rp.operated_by_name && (
                                                                    <p className="text-white/90 text-[15px] font-heading leading-tight">
                                                                        Operated by : {rp.operated_by_name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                        })()}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-3.5 sm:p-5 flex flex-col flex-1 gap-1 justify-between">
                                                        <div>
                                                            <h3 title={rp.title} className="text-[17px] sm:text-[20px] font-bold text-black font-heading tracking-tight leading-tight line-clamp-2">{rp.title}</h3>
                                                            {rpCities.length > 0 && (
                                                                <div className="flex flex-col gap-0.5 mb-0.5 mt-1">
                                                                    {cityRows.map((row, ri) => (
                                                                        <p key={ri} className="text-slate-400 text-[13px] font-medium leading-snug">
                                                                            {row.map((city, ci) => (
                                                                                <span key={ci}>
                                                                                    {city}
                                                                                    {ci < row.length - 1 && <span className="mx-1 text-slate-300">|</span>}
                                                                                </span>
                                                                            ))}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2.5 mt-auto pt-2">
                                                            {/* Amenity icons */}
                                                            <div className="flex items-center gap-2 py-0.5 flex-wrap">
                                                                {hotelsIncluded  && (renderRpIcon('Hotel', 'transport')   || <span title="Hotel"  className="text-[18px] leading-none">🏨</span>)}
                                                                {flightsIncluded && (renderRpIcon('Flight', 'transport')  || <span title="Flight" className="text-[18px] leading-none">✈️</span>)}
                                                                {hasFood         && (renderRpIcon('Dinner', 'meal')       || <span title="Food"   className="text-[18px] leading-none">🍽️</span>)}
                                                            </div>

                                                            {/* Book Now + Price */}
                                                            <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-gray-100">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); router.push(`/packages/${rp.slug || rp.id}?book=true`); }}
                                                                    className="px-4 sm:px-6 py-2 sm:py-2.5 border border-[#113A74] text-[#113A74] rounded-full text-[13px] font-sans-force font-bold hover:bg-[#113A74] hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                                                                >Book Now</button>
                                                                <div className="text-right">
                                                                    <span className="text-[#FFA500] text-xl font-black leading-none">{formatPrice(rp.price)}</span>
                                                                    <p className="text-[#113A74] text-[13px] font-bold tracking-wider mt-0.5 opacity-90">Onwards</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Slide Indicators / Dots */}
                        {relatedPackages.length > visibleCards && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: relatedPackages.length - visibleCards + 1 }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                            currentSlide === idx ? 'bg-[#FFA500] w-6' : 'bg-gray-300 w-2.5'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
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

            {/* Enquiry Modal (RFQ packages) */}
            <PackageEnquiryModal
                isOpen={isEnquiryModalOpen}
                onClose={() => setIsEnquiryModalOpen(false)}
                pkg={pkg}
            />
        </div>
    );
};

export default PackageDetailsPage;
