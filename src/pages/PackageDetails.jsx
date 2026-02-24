
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { api } from '../api/client';
import {
    Calendar, Users, MapPin, Check, X, Clock,
    ChevronRight, Loader2, Star, Shield, Info,
    Plane, Utensils, Hotel, Camera, ChevronDown, ChevronUp, Car
} from 'lucide-react';

const PackageDetails = () => {
    const { id } = useParams();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Booking Form State
    const [bookingDate, setBookingDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/packages/${id}`);
                setPkg(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
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
            navigate('/login');
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
            alert('Failed to book. Please try again.');
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

    const inclusions = pkg.inclusions ? (typeof pkg.inclusions === 'string' ? JSON.parse(pkg.inclusions) : pkg.inclusions) : [];
    const exclusions = pkg.exclusions ? (typeof pkg.exclusions === 'string' ? JSON.parse(pkg.exclusions) : pkg.exclusions) : [];
    const gallery = pkg.gallery ? (typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : pkg.gallery) : [];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-0 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {pkg.category}
                            </span>
                            <span className="flex items-center gap-1 text-white/80 text-sm font-medium">
                                <MapPin size={14} /> {pkg.location}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl">{pkg.title}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Content Area */}
                    <div className="lg:w-2/3">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Clock className="text-primary mb-2" size={24} />
                                <span className="text-xs text-gray-400 font-bold uppercase">Duration</span>
                                <span className="text-secondary font-bold">{pkg.duration || 'N/A'}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Users className="text-primary mb-2" size={24} />
                                <span className="text-xs text-gray-400 font-bold uppercase">Group Size</span>
                                <span className="text-secondary font-bold">{pkg.slots ? `Max ${pkg.slots} ` : 'Flexible'}</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Star className="text-primary mb-2" size={24} />
                                <span className="text-xs text-gray-400 font-bold uppercase">Rating</span>
                                <span className="text-secondary font-bold">4.9 (124 reviews)</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <Shield className="text-primary mb-2" size={24} />
                                <span className="text-xs text-gray-400 font-bold uppercase">Safe Travel</span>
                                <span className="text-secondary font-bold">Verified</span>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-gray-200 mb-8 sticky top-0 bg-gray-50 z-20 pt-2 overflow-x-auto no-scrollbar">
                            {['overview', 'itinerary', 'inclusions', 'policy'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-400 hover:text-secondary'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-12">
                            {activeTab === 'overview' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-2xl font-bold text-secondary mb-6">Experience Overview</h2>
                                    <div className="prose prose-primary max-w-none text-gray-500 leading-relaxed whitespace-pre-line">
                                        {pkg.description || "No description provided."}
                                    </div>

                                    {gallery.length > 0 && (
                                        <div className="mt-12">
                                            <h3 className="text-xl font-bold text-secondary mb-6">Gallery</h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                                {gallery.map((img, i) => (
                                                    <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                                                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Gallery" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'itinerary' && (
                                <div className="animate-fadeIn space-y-6">
                                    <h2 className="text-2xl font-bold text-secondary mb-6">Daywise Itinerary</h2>
                                    {pkg.itinerary?.length > 0 ? pkg.itinerary.map((day, i) => (
                                        <div key={i} className="relative pl-8 pb-10 border-l-2 border-gray-100 last:border-0 last:pb-0">
                                            <div className="absolute -left-[11px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white shadow-sm shadow-primary/30"></div>
                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-primary/30 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">Day {day.day}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">{day.title}</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed mb-4">{day.description}</p>

                                                {/* Attractions */}
                                                {day.attractions && day.attractions.length > 0 && (
                                                    <div className="flex gap-3 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                                                        {day.attractions.map((attr) => (
                                                            <div key={attr.id} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden relative group/attr cursor-pointer shadow-sm hover:shadow-md transition-all">
                                                                <img
                                                                    src={attr.images?.[0] || 'https://images.unsplash.com/photo-1540541338287-41700207dee6'}
                                                                    alt={attr.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 bg-black/20 group-hover/attr:bg-black/40 transition-colors"></div>
                                                                <div className="absolute bottom-0 left-0 w-full p-1 bg-gradient-to-t from-black/80 to-transparent">
                                                                    <p className="text-[9px] text-white font-bold truncate text-center">{attr.name}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Services */}
                                                {(day.meals || day.transfer_details) && (
                                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                                                        {day.meals && (
                                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                                <Utensils size={14} className="text-primary" />
                                                                <span>{day.meals}</span>
                                                            </div>
                                                        )}
                                                        {day.transfer_details && (
                                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                                <Car size={14} className="text-primary" />
                                                                <span>{day.transfer_details}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-gray-400 italic">No itinerary details available.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'inclusions' && (
                                <div className="animate-fadeIn grid md:grid-cols-2 gap-8">
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100">
                                        <h3 className="text-xl font-black text-secondary flex items-center gap-3 mb-8">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                                                <Check size={20} />
                                            </div>
                                            What's Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {inclusions.map((item, i) => (
                                                <li key={i} className="flex gap-4 text-gray-500 text-sm font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100">
                                        <h3 className="text-xl font-black text-secondary flex items-center gap-3 mb-8">
                                            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                                                <X size={20} />
                                            </div>
                                            What's Excluded
                                        </h3>
                                        <ul className="space-y-4">
                                            {exclusions.map((item, i) => (
                                                <li key={i} className="flex gap-4 text-gray-500 text-sm font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'policy' && (
                                <div className="animate-fadeIn space-y-8">
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-black text-secondary mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                                <Info size={20} />
                                            </div>
                                            Terms & Conditions
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line border-l-4 border-primary/20 pl-6 italic">
                                            {pkg.terms_conditions || "Standard terms and conditions apply to this booking. Contact our support for detailed clarifications."}
                                        </p>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-black text-secondary mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                                                <Clock size={20} />
                                            </div>
                                            Cancellation Policy
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line border-l-4 border-orange-200 pl-6 italic">
                                            {pkg.cancellation_policy || "Cancellations made 48 hours prior to the trip are refundable. Fees may apply for late cancellations."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Booking Form */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24 space-y-6">
                            {/* Booking Card */}
                            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl relative overflow-hidden">
                                {bookingSuccess ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check size={40} />
                                        </div>
                                        <h3 className="text-3xl font-black text-secondary mb-4">Booking Sent!</h3>
                                        <p className="text-gray-400 text-sm px-6">Our travel specialist will contact you shortly to finalize your itinerary.</p>
                                        <button
                                            onClick={() => setBookingSuccess(false)}
                                            className="mt-10 px-8 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary-dark transition-colors"
                                        >
                                            Book another trip
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="flex-grow">
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2">Total Amount</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-sm font-black text-gray-300">AED</span>
                                                    <span className="text-5xl font-black text-primary tracking-tighter">{totalPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="bg-red-50 text-red-600 text-[9px] font-black px-3 py-1.5 rounded-full border border-red-100 uppercase tracking-widest">
                                                Best Price
                                            </div>
                                        </div>

                                        <form onSubmit={handleBooking} className="space-y-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 block">Pick a Date</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
                                                        <input
                                                            type="date"
                                                            required
                                                            className="w-full pl-14 pr-6 py-5 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-primary/10 rounded-3xl text-sm font-bold text-secondary outline-none transition-all shadow-inner"
                                                            value={bookingDate}
                                                            onChange={(e) => setBookingDate(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
                                                    <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                                                        <Users size={14} /> Travelers Breakdown
                                                    </h4>

                                                    {/* Adult Selectors */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-bold text-secondary">Adult (Double)</p>
                                                                <p className="text-[9px] text-gray-400 font-bold uppercase">AED {pkg.pricing?.price_adult_double || pkg.price}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button type="button" onClick={() => handleCountChange('adultDouble', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronDown size={14} /></button>
                                                                <span className="w-4 text-center text-sm font-black text-secondary">{counts.adultDouble}</span>
                                                                <button type="button" onClick={() => handleCountChange('adultDouble', 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronUp size={14} /></button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-bold text-secondary">Adult (Single)</p>
                                                                <p className="text-[9px] text-gray-400 font-bold uppercase">AED {pkg.pricing?.price_adult_single || pkg.price}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button type="button" onClick={() => handleCountChange('adultSingle', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronDown size={14} /></button>
                                                                <span className="w-4 text-center text-sm font-black text-secondary">{counts.adultSingle}</span>
                                                                <button type="button" onClick={() => handleCountChange('adultSingle', 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronUp size={14} /></button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-bold text-secondary">Adult (Triple)</p>
                                                                <p className="text-[9px] text-gray-400 font-bold uppercase">AED {pkg.pricing?.price_adult_triple || pkg.price}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button type="button" onClick={() => handleCountChange('adultTriple', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronDown size={14} /></button>
                                                                <span className="w-4 text-center text-sm font-black text-secondary">{counts.adultTriple}</span>
                                                                <button type="button" onClick={() => handleCountChange('adultTriple', 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronUp size={14} /></button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-bold text-secondary">Child (With Bed)</p>
                                                                <p className="text-[9px] text-gray-400 font-bold uppercase">AED {pkg.pricing?.price_child_with_bed || 0}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button type="button" onClick={() => handleCountChange('childBed', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronDown size={14} /></button>
                                                                <span className="w-4 text-center text-sm font-black text-secondary">{counts.childBed}</span>
                                                                <button type="button" onClick={() => handleCountChange('childBed', 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronUp size={14} /></button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-bold text-secondary">Infant</p>
                                                                <p className="text-[9px] text-gray-400 font-bold uppercase">AED {pkg.pricing?.price_infant || 0}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <button type="button" onClick={() => handleCountChange('infant', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronDown size={14} /></button>
                                                                <span className="w-4 text-center text-sm font-black text-secondary">{counts.infant}</span>
                                                                <button type="button" onClick={() => handleCountChange('infant', 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"><ChevronUp size={14} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={bookingLoading}
                                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-[20px] font-bold uppercase tracking-wider text-[11px] shadow-xl shadow-primary/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                                            >
                                                {bookingLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Booking'}
                                            </button>

                                            <p className="text-[10px] text-gray-300 text-center uppercase font-black tracking-widest">Secured Payment • 24/7 Concierge</p>
                                        </form>
                                    </>
                                )}
                            </div>

                            {/* Vendor Card */}
                            {pkg.vendor && (
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                        {pkg.vendor.name?.charAt(0)}
                                    </div>
                                    <div className="flex-grow">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Presented by</span>
                                        <Link
                                            to={`/vendor-packages/${pkg.vendor.id}`}
                                            className="text-secondary font-black hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            {pkg.vendor.name}
                                        </Link>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;
