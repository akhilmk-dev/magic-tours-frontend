"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import { api } from '../../../api/client';
import {
    Calendar, Users, MapPin, Check, X, Clock,
    ChevronRight, Loader2, Star, Shield, Info,
    Plane, Utensils, Hotel, Camera, ChevronDown, ChevronUp, Car,
    ArrowRight, Globe, Map, CalendarCheck, QrCode, Train, BedDouble, LogIn, LogOut
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
import GalleryLoop from '../../../components/Home/GalleryLoop';
import AdventureSection from '../../../components/Home/AdventureSection';

const PackageDetailsPage = () => {
    const params = useParams();
    const id = params.id;
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Booking Form State
    const [bookingDate, setBookingDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Itinerary Accordion State
    const [expandedDays, setExpandedDays] = useState([1]);

    const mockItinerary = [
        {
            day: 1,
            title: "Overnight Flight",
            description: "There are many variations of passages of available but majority have alteration in some by inject humour words. Lorem ipsum dolor sit amet, error insolens ea pri verterem phaedr vel ea isque aliquam.",
            extraBox: "Board your overnight flight, bound for Italy! Fresh gelato and homemade pasta will soon be yours. Venture Into Venice proper or see the area surrounding your accommodation. So, so soon."
        },
        { day: 2, title: "Arrive in Venice + Welcome Dinner" },
        { day: 3, title: "Tour Venice" },
        { day: 4, title: "Travel to Milan via Verona" }
    ];

    const toggleDay = (day) => {
        setExpandedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };
    const toggleAllDays = () => {
        if (expandedDays.length === mockItinerary.length) {
            setExpandedDays([]);
        } else {
            setExpandedDays(mockItinerary.map(item => item.day));
        }
    };

    // Auto-loop state for Related Images
    const relatedImages = [img4, img5, img1, img2, img3, img6];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % relatedImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    // Advanced Pricing State
    const [counts, setCounts] = useState({
        adultDouble: 2,
        adultSingle: 0,
        adultTriple: 0,
        childBed: 0,
        childNoBed: 0,
        infant: 0
    });
    const { user } = useCustomerAuth();
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        // Mock Data for Design Phase Layout
        const mockPkg = {
            id,
            title: "South Korea Experience",
            category: "Cultural",
            location: "South Korea",
            price: 59,
            duration: "6 Days, 3 Nights",
            slots: 20,
            description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            inclusions: ["Accommodation", "Breakfast", "Transport", "Local Guide"],
            exclusions: ["Flight tickets", "Personal expenses", "Visa fees"],
            gallery: [],
            itinerary: [
                { day: 1, title: "Arrival in Seoul", description: "Welcome to Seoul. Transfer to the hotel and rest.", attractions: [] },
                { day: 2, title: "City Tour", description: "Visit Gyeongbokgung Palace and Bukchon Hanok Village.", attractions: [] }
            ],
            terms_conditions: "Standard Magic Tours terms apply.",
            cancellation_policy: "Refundable if cancelled 48 hours before the trip.",
            vendor: { id: 1, name: "Magic Tours LLC" }
        };

        setPkg(mockPkg);
        setLoading(false);
    }, [id]);

    const totalPrice = useMemo(() => {
        if (!pkg) return 0;
        const p = pkg.pricing;
        if (!p) return pkg.price * (counts.adultDouble + counts.adultSingle + counts.adultTriple + counts.childBed + counts.childNoBed);

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
            total_amount: totalPrice,
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
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
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

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading">
                        Packages Detail
                    </h1>

                    {/* Breadcrumbs */}
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-[0.05em]">
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

            {/* New Package Info Section */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        {/* Left Side: Title & Description */}
                        <div className="lg:w-1/2">
                            <h2 className="text-[44px] font-extrabold text-brand-heading leading-[1.1] mb-4 font-heading">
                                Explore Switzerland for more fun!
                            </h2>
                            <p className="text-gray-500 text-sm md:text-base mb-8 max-w-lg">
                                Lorem ipsum proin gravida nibh vel velit auctor aliquenean sollicitudin.
                            </p>
                            <button className="bg-[#113A74] hover:bg-[#0d2a56] text-white px-8 py-3 rounded-full font-medium flex inline-flex items-center gap-2 transition-colors">
                                Book Now <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Right Side: Details Grid */}
                        <div className="lg:w-1/2 w-full">
                            <div className="flex flex-col divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
                                {/* Row 1 */}
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 text-sm justify-start md:justify-end">
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-[#113A74]" />
                                        <span className="font-bold text-[#113A74]">Country :</span>
                                        <span className="text-gray-500">Dignissim</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <Map size={16} className="text-[#113A74]" />
                                        <span className="font-bold text-[#113A74]">City :</span>
                                        <span className="text-gray-500">Consequat</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-[#113A74]" />
                                        <span className="font-bold text-[#113A74]">Travel Date :</span>
                                        <span className="text-gray-500">5 Sep 2026</span>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="flex flex-wrap items-center justify-start md:justify-end gap-x-6 gap-y-3 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarCheck size={16} className="text-[#113A74]" />
                                        <span className="font-bold text-[#113A74]">Validity Date :</span>
                                        <span className="text-gray-500">25 Sep 2026</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <QrCode size={16} className="text-[#113A74]" />
                                        <span className="font-bold text-[#113A74]">Tour Code :</span>
                                        <span className="text-gray-500">65R78UV</span>
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="flex items-center justify-start md:justify-end py-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[#113A74] font-bold text-xs uppercase tracking-wider">Per Day :</span>
                                        <span className="text-[#FFA500] font-bold text-sm ml-1">AED</span>
                                        <span className="text-[#FFA500] font-bold text-2xl">{pkg.price || 89}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-100">
                <div className="grid grid-cols-12 gap-2 md:gap-3">
                    {/* Row 1 */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-3 h-48 sm:h-64 md:h-[200px] lg:h-[260px]">
                        <img src={img1.src || img1} alt="Gallery 1" className="w-full h-full object-cover shadow-sm" />
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-5 h-48 sm:h-64 md:h-[200px] lg:h-[260px]">
                        <img src={img2.src || img2} alt="Gallery 2" className="w-full h-full object-cover shadow-sm" />
                    </div>
                    <div className="col-span-12 md:col-span-4 h-48 sm:h-64 md:h-[200px] lg:h-[260px]">
                        <img src={img3.src || img3} alt="Gallery 3" className="w-full h-full object-cover shadow-sm" />
                    </div>
                    {/* Row 2 */}
                    <div className="col-span-12 md:col-span-8 h-48 sm:h-64 md:h-[200px] lg:h-[260px]">
                        <img src={img4.src || img4} alt="Gallery 4" className="w-full h-full object-cover shadow-sm" />
                    </div>
                    <div className="col-span-6 md:col-span-2 h-48 sm:h-64 md:h-[200px] lg:h-[260px]">
                        <img src={img5.src || img5} alt="Gallery 5" className="w-full h-full object-cover shadow-sm" />
                    </div>
                    <div className="col-span-6 md:col-span-2 h-48 sm:h-64 md:h-[200px] lg:h-[260px]">
                        <img src={img6.src || img6} alt="Gallery 6" className="w-full h-full object-cover shadow-sm" />
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Main Content Area */}
                    <div className="lg:w-[69.23%] space-y-12">
                        {/* Over View */}
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#113A74] font-heading">
                                Over <span className="text-[#FFA500]">View</span> :
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {pkg.description}
                                Lorem ipsum dolor sit amet consectetur. Scelerisque facilisis facilisis nulla ullamcorper mattis. Dui nec at porttitor justo sit viverra commodo est ornare. Arcu tristique mauris morbi sed. Fermentum rhoncus elit in vulputate massa amet adipiscing. Suspendisse odio ut sit nisl ridiculus. Egestas tincidunt purus pharetra ultrices. Amet id morbi dignissim nunc feugiat neque. Cras fusce sit elementum neque pretium. Fermentum mi orci faucibus rhoncus vel volutpat tincidunt.
                            </p>
                        </div>

                        {/* Top Highlights */}
                        <div className="bg-[#f7f5f2] p-8 md:p-10 rounded-xl space-y-6">
                            <h3 className="text-2xl font-bold text-[#113A74] font-heading">
                                Top <span className="text-[#FFA500]">Highlights</span> :
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Bali is more than just a tropical destination—it's a paradise filled with unforgettable experiences. From its sacred temples perched on dramatic cliffs to golden beaches that stretch for miles, every corner of the island offers something unique.
                            </p>
                            <ul className="space-y-3 pl-5 list-disc text-gray-500 text-sm marker:text-gray-400">
                                <li>Explore iconic sites like Tanah Lot, Uluwatu, and Besakih Temple.</li>
                                <li>Relax on Kuta, Seminyak, Nusa Dua, and Jimbaran Bay.</li>
                                <li>Discover rice terraces, art markets, yoga retreats, and monkey forests.</li>
                                <li>Hike an active volcano for breathtaking sunrise views.</li>
                                <li>Experience beach clubs, rooftop bars, and live music in Seminyak and Canggu.</li>
                                <li>Visit Tegenungan, Gitgit, and Sekumpul waterfalls for adventure and serenity.</li>
                            </ul>
                        </div>

                        {/* Trip Summery */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-[#113A74] font-heading">Trip Summery</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Lorem Ipsum Dolor Sit Amet Consectetur. Scelerisque Facilisis Facilisis Nulla Ullamcorper Mattis. Dui Nec At Porttitor Justo Sit Viverra Commodo Est Ornare. Arcu Tristique Mauris Morbi Sed. Fermentum Rhoncus Elit In Vulputate Massa Amet Adipiscing. Suspendisse Odio Ut Sit Nisl Ridiculus. Egestas Tincidunt Purus Pharetra Ultrices. Amet Id Morbi Dignissim Nunc Feugiat Neque. Cras Fusce Sit Elementum Neque Pretium. Fermentum Mi Orci Faucibus Rhoncus Vel Volutpat Tincidunt.
                            </p>
                        </div>

                        {/* Trip at a Glance */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-[#113A74] font-heading">
                                Trip at a <span className="text-[#FFA500]">Glance</span>
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur. Scelerisque facilisis facilisis nulla ullamcorper mattis. Dui nec at porttitor justo sit viverra commodo est ornare. Arcu tristique mauris morbi sed. Fermentum rhoncus elit in vulputate massa amet adipiscing. Suspendisse odio.
                            </p>
                        </div>

                        {/* Itinerary Accordion */}
                        <div className="space-y-6 pt-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#113A74] font-heading">Itinerary</h3>
                                <div className="flex items-center gap-3 cursor-pointer" onClick={toggleAllDays}>
                                    <span className="text-sm font-medium text-gray-500">Expand all</span>
                                    <button
                                        className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${expandedDays.length === mockItinerary.length ? 'bg-[#FFA500]' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm ${expandedDays.length === mockItinerary.length ? 'left-[22px]' : 'left-[2px]'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-0 relative py-2">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[19px] top-6 bottom-6 w-[1.5px] bg-gray-100 -z-10"></div>

                                {mockItinerary.map((item) => {
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
                                                    <span className="text-[#113A74]">Day 0{item.day} : </span>
                                                    <span className="text-gray-800">{item.title}</span>
                                                </h4>
                                                {isExpanded ? (
                                                    <ChevronUp className="text-[#FFA500] w-5 h-5 transition-transform" />
                                                ) : (
                                                    <ChevronDown className="text-gray-400 w-5 h-5 transition-transform group-hover:text-[#FFA500]" />
                                                )}
                                            </button>

                                            {/* Expanded Content */}
                                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-sm text-gray-500 leading-relaxed mb-6 pr-4">
                                                    {item.description}
                                                </p>
                                                {item.extraBox && (
                                                    <div className="bg-[#d5e0f9]/50 p-6 rounded-sm border border-[#d5e0f9] text-gray-500 text-xs leading-relaxed max-w-[90%]">
                                                        {item.extraBox}
                                                    </div>
                                                )}
                                            </div>

                                            {!isExpanded && <div className="border-b border-gray-100 mr-4"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Include & Exclude Box */}
                        <div className="bg-[#f7f5f2] rounded-3xl p-8 md:p-12 w-full mt-8">
                            <h3 className="text-2xl md:text-3xl font-bold font-heading mb-8">
                                <span className="text-[#113A74]">Include & </span>
                                <span className="text-[#FFA500]">Exclude :</span>
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                                {/* Includes */}
                                <ul className="space-y-4 flex-1">
                                    {[
                                        "Specialized bilingual guide",
                                        "Private Transport",
                                        "Entrance Fees",
                                        "Breakfast And Lunch Box"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* Excludes */}
                                <ul className="space-y-4 flex-1">
                                    {[
                                        "Guide Service Fee",
                                        "Room Service Fees",
                                        "Driver Service Fee",
                                        "Any Private Expenses"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:w-[30.77%] space-y-8">
                        {/* Search Here */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-5 bg-[#113A74]"></div>
                                <h4 className="text-[#113A74] font-bold font-heading text-lg">Search Here</h4>
                            </div>
                            <div className="relative">
                                <input type="text" placeholder="Search here..." className="w-full bg-[#f4f7f9] rounded-full py-3.5 px-5 text-sm outline-none placeholder:text-gray-400 border border-gray-100/50 focus:border-[#113A74]/20 transition-colors" />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#113A74]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </button>
                            </div>
                        </div>

                        {/* BOOKING FORM */}
                        <div className="bg-[#113A74] rounded-xl p-8 md:p-10 relative overflow-hidden shadow-2xl">
                            <h4 className="text-white text-center font-heading font-bold text-xl mb-3 tracking-wide">BOOKING FORM</h4>
                            <p className="text-white/80 text-center text-xs mb-8 leading-relaxed max-w-[200px] mx-auto">
                                Malesuada incidunt excepturi proident quo eros? Sinterdum praesent magnis, eius cumque.
                            </p>

                            <form className="space-y-5 relative z-10" onSubmit={handleBooking}>
                                <div>
                                    <input required type="text" placeholder="Your Name..." className="w-full bg-white rounded-full py-3.5 px-6 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 transition-all font-medium" />
                                </div>
                                <div>
                                    <input required type="email" placeholder="Your Email..." className="w-full bg-white rounded-full py-3.5 px-6 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 transition-all font-medium" />
                                </div>
                                <div className="pt-2">
                                    <button disabled={bookingLoading} type="submit" className="w-full bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold rounded-full py-4 px-6 text-sm flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg shadow-[#FFA500]/20">
                                        {bookingLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Book Now'} <ArrowRight size={16} />
                                    </button>
                                </div>
                                {bookingSuccess && (
                                    <p className="text-green-400 text-xs text-center mt-4">Booking Successful!</p>
                                )}
                            </form>
                        </div>

                        {/* Related Images */}
                        <div className="pt-4 space-y-5">
                            <h4 className="text-[#113A74] font-bold font-heading text-xl text-center mb-1">Related Images</h4>
                            <p className="text-gray-500 text-center text-xs max-w-[260px] mx-auto leading-relaxed">
                                Quaerat inventore! Vestibulum aenean volutpat gravida. Sagittis, euismod perferendis.
                            </p>
                            <div className="relative overflow-hidden px-2 h-[220px]">
                                {mounted && (
                                    <div className="flex gap-4 h-full">
                                        {[0, 1].map((offset) => {
                                            const idx = (currentImageIndex + offset) % relatedImages.length;
                                            const image = relatedImages[idx];
                                            return (
                                                <motion.div
                                                    key={`${currentImageIndex}-${offset}`}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="w-1/2 rounded-[1.5rem] overflow-hidden shadow-md h-full"
                                                >
                                                    <img
                                                        src={image.src || image}
                                                        className="w-full h-full object-cover"
                                                        alt={`Related Image ${idx}`}
                                                    />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {/* Pagination Dots */}
                            <div className="flex justify-center gap-2 pt-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${Math.floor(currentImageIndex / 2) === i ? 'bg-[#113A74] w-4' : 'bg-gray-300'
                                            }`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Discount Banner Placeholder (Matches screenshot cut-off) */}
                        <div className="rounded-[1.5rem] overflow-hidden mt-8 shadow-md">
                            <img src={bgImg.src || bgImg} alt="Special Discount Offering" className="w-full h-auto object-cover" />
                        </div>

                        {/* Booking Image */}
                        <div className="mt-8 flex justify-center w-full">
                            <img src={bookingImg.src || bookingImg} alt="Booking Information" className="w-full h-auto object-contain rounded-3xl shadow-sm" />
                        </div>
                    </div>
                </div>

                {/* Transport & Logistics Section */}
                <div className="mt-20">
                    <div className="mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-3">
                            <span className="text-[#113A74]">Transport & </span>
                            <span className="text-[#FFA500]">Logistics</span>
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">Manage your travel itinerary and accommodation details in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 md:px-10 lg:px-16">
                        {/* Hotels Card */}
                        <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="relative h-44 md:h-48">
                                <img src={hotel1.src || hotel1} className="w-full h-full object-cover" alt="Hotel" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <BedDouble className="w-4 h-4 text-[#113A74]" />
                                    <span className="text-[10px] font-bold text-[#113A74] tracking-wide">STAY</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-8">
                                <h3 className="text-[#113A74] text-xl font-bold font-heading mb-6">Hotels</h3>
                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="bg-[#FAF7F2] rounded-xl p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <LogIn className="w-4 h-4 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CHECK-IN</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">3:00 PM</span>
                                    </div>
                                    <div className="bg-[#FAF7F2] rounded-xl p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <LogOut className="w-4 h-4 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CHECK-OUT</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">11:00 AM</span>
                                    </div>
                                </div>
                                <button className="bg-[#113A74] hover:bg-[#113A74]/90 text-white rounded-full py-2.5 px-6 text-xs font-medium w-fit transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Flights Card */}
                        <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="relative h-44 md:h-48">
                                <img src={flightImg.src || flightImg} className="w-full h-full object-cover" alt="Flight" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <Plane className="w-4 h-4 text-[#113A74]" />
                                    <span className="text-[10px] font-bold text-[#113A74] tracking-wide">AIR</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-8">
                                <h3 className="text-[#113A74] text-xl font-bold font-heading mb-6">Flights</h3>
                                <div className="mb-6 flex-1 flex flex-col justify-between">
                                    {/* Route graphic */}
                                    <div className="flex items-center justify-between mt-2">
                                        <div>
                                            <div className="text-2xl font-black text-gray-900 leading-none">JFK</div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase mt-1">NEW YORK</div>
                                        </div>
                                        <div className="flex-1 px-4 relative flex items-center justify-center">
                                            <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-[#FFA500]/40 -translate-y-1/2"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                                <Plane className="w-3 h-3 text-[#FFA500] rotate-45 mb-1" fill="#FFA500" strokeWidth={1} />
                                                <span className="text-[9px] font-bold text-[#FFA500] uppercase pt-1 bg-white px-1">6H 00M</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-gray-900 leading-none">LHR</div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase mt-1">LONDON</div>
                                        </div>
                                    </div>

                                    {/* Departure/Arrival info box */}
                                    <div className="bg-[#FAF7F2] rounded-xl p-4 flex justify-between items-center mt-4">
                                        <div>
                                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">DEPARTURE</div>
                                            <div className="text-xs font-bold text-gray-800">10:00 AM</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">ARRIVAL</div>
                                            <div className="text-xs font-bold text-gray-800">4:00 PM</div>
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-[#113A74] hover:bg-[#113A74]/90 text-white rounded-full py-2.5 px-6 text-xs font-medium w-fit transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Trains Card */}
                        <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="relative h-44 md:h-48">
                                <img src={trainImg.src || trainImg} className="w-full h-full object-cover" alt="Train" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <Train className="w-4 h-4 text-[#113A74]" />
                                    <span className="text-[10px] font-bold text-[#113A74] tracking-wide">RAIL</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-8">
                                <h3 className="text-[#113A74] text-xl font-bold font-heading mb-6">Trains</h3>
                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="bg-[#FAF7F2] rounded-xl p-4 flex justify-between items-center">
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-4 h-4 text-[#113A74] mt-0.5" />
                                            <div>
                                                <div className="text-[9px] font-bold text-[#113A74]/50 uppercase tracking-wider mb-0.5">DEPARTURE</div>
                                                <div className="text-[11px] font-semibold text-gray-800">Gare du Nord, Paris</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">9:30 AM</span>
                                    </div>
                                    <div className="bg-[#FAF7F2] rounded-xl p-4 flex justify-between items-center">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-[#113A74] mt-0.5" />
                                            <div>
                                                <div className="text-[9px] font-bold text-[#113A74]/50 uppercase tracking-wider mb-0.5">ARRIVAL</div>
                                                <div className="text-[11px] font-semibold text-gray-800">St Pancras Int, London</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">12:15 PM</span>
                                    </div>
                                </div>
                                <button className="bg-[#113A74] hover:bg-[#113A74]/90 text-white rounded-full py-2.5 px-6 text-xs font-medium w-fit transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dummy Location Map Section */}
                <div className="mt-20">
                    <div className="rounded-[2rem] overflow-hidden shadow-md border border-gray-100 h-[450px] relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25279998157!2d-74.14448744574943!3d40.69763123338357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1709999999999!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Dummy Location Map"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Related Trips Section (Full Width Background) */}
            <div className="bg-[#E9F7FF] py-20 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center mb-16">
                        <div className="bg-white rounded-full py-2 px-6 flex items-center gap-2 mb-6 shadow-sm">
                            <Plane className="w-4 h-4 text-[#113A74]" />
                            <span className="text-xs font-bold text-[#113A74] tracking-widest uppercase">RELATED</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold font-heading text-center">
                            <span className="text-[#113A74]">Related Trips You </span>
                            <span className="text-[#FFA500]">Might Also Like</span>
                        </h2>
                    </div>

                    {/* Cards Loop Carousel */}
                    <div className="relative overflow-hidden -mx-4 md:-mx-10 lg:-mx-16 px-4 md:px-10 lg:px-16 pb-12 min-h-[500px]">
                        {mounted && (
                            <motion.div
                                className="flex gap-12"
                                animate={{
                                    x: [0, -1400]
                                }}
                                transition={{
                                    duration: 35,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                {[...Array(6)].map((_, loopIdx) => (
                                    [img1, img2, img3].map((image, index) => (
                                        <div key={`${loopIdx}-${index}`} className="flex-shrink-0 w-[300px] md:w-[320px] lg:w-[350px] bg-white rounded-[1.8rem] overflow-hidden shadow-sm flex flex-col group hover:shadow-xl transition-all duration-300">
                                            {/* Image Box */}
                                            <div className="relative h-60 overflow-hidden rounded-t-[1.8rem]">
                                                <div className="absolute top-4 right-4 bg-[#FFA500] text-white text-[9px] font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                                                    27% Off
                                                </div>
                                                <img src={image.src || image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Related Trip" />
                                            </div>

                                            {/* Content Box - Overlapping Curve */}
                                            <div className="bg-white rounded-t-[2.5rem] -mt-10 relative z-10 p-6 md:p-7 pt-8 flex flex-col flex-1">
                                                <h3 className="text-xl md:text-2xl font-bold font-heading text-[#113A74] mb-4">South Korea</h3>

                                                <div className="bg-[#FDF8F2] rounded-2xl p-5 space-y-2.5 mb-6 flex-1">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-5 h-5 rounded-full bg-[#113A74] flex items-center justify-center shrink-0">
                                                            <Clock className="w-2.5 h-2.5 text-white" />
                                                        </div>
                                                        <span className="text-[11px] text-gray-600 font-semibold">4 Days - 3 Nights</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-5 h-5 rounded-full bg-[#113A74] flex items-center justify-center shrink-0">
                                                            <Star className="w-2.5 h-2.5 text-white fill-white" />
                                                        </div>
                                                        <span className="text-[11px] text-gray-600 font-semibold">Tour Type :Lorem ipsum dolor</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-5 h-5 rounded-full bg-[#113A74] flex items-center justify-center shrink-0">
                                                            <MapPin className="w-2.5 h-2.5 text-white" />
                                                        </div>
                                                        <span className="text-[11px] text-gray-600 font-semibold">Brooklyn,NY</span>
                                                    </div>
                                                    <div className="mt-2 inline-block bg-[#FFA500] text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        Honey Moon Package
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-sm md:text-base font-black text-[#113A74]">AED 189</span>
                                                        <span className="text-[10px] text-gray-400 line-through">AED 259</span>
                                                    </div>
                                                    <button className="bg-[#113A74] hover:bg-[#0d2a56] text-white rounded-full py-2 px-5 text-[10px] font-bold transition-all shadow-md active:scale-95">
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-12">
                        <div className="w-2 h-2 rounded-full border border-gray-300"></div>
                        <div className="w-2 h-2 rounded-full border border-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                </div>
            </div>

            {/* Adventure Section (Image with Text) */}
            <AdventureSection />

            {/* Moving Images Section */}
            <div className="bg-[#E9F7FF]">
                <GalleryLoop />
            </div>
        </div>
    );
};

export default PackageDetailsPage;
