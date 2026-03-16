"use client";

import React, { useEffect, useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../api/client';
import { User, Package, Calendar, MapPin, Clock, LogOut, Loader2, FileText, Globe, Info, Users } from 'lucide-react';
import ProfileSkeletons, { ProfileCardSkeleton } from '../../components/skeletons/ProfileSkeletons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const { user, logout, loading: authLoading, openAuthModal } = useCustomerAuth();
    const [bookings, setBookings] = useState([]);
    const [idlApplications, setIdlApplications] = useState([]);
    const [visaApplications, setVisaApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'idl', or 'visa'
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, idlRes, visaRes] = await Promise.all([
                    api.get('/bookings/frontend/my').catch(() => ({ data: [] })),
                    api.get('/idl/my').catch(() => ({ data: [] })),
                    api.get('/visa/my?page=1&limit=50').catch(() => ({ data: [] }))
                ]);
                setBookings(bookingsRes.data || bookingsRes || []);
                setIdlApplications(idlRes.data || []);
                setVisaApplications(visaRes.data || []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading) {
        return <ProfileSkeletons />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-gray-500">Please log in to view your profile.</p>
                <button
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20">
            {/* Top Banner / Hero */}
            <div className="bg-[#113A74] pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/20 flex items-center justify-center text-white shadow-xl flex-shrink-0">
                        <span className="text-4xl sm:text-6xl font-black">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-3xl sm:text-5xl font-black mb-2">{user.name}</h1>
                        <p className="text-white/80 font-medium tracking-wide">{user.email}</p>
                    </div>
                    <div>
                        <button
                            onClick={logout}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all text-sm font-bold text-white shadow-lg"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
                {/* Decorative gradient orb */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA500]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Quick Links */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-6 sm:p-8">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Quick Links</h3>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/visa"
                                    className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] hover:bg-[#113A74]/5 text-[#113A74] rounded-2xl transition-all font-bold group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <FileText size={18} />
                                    </div>
                                    Apply for Visa
                                </Link>
                                <Link
                                    href="/idl"
                                    className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] hover:bg-[#113A74]/5 text-[#113A74] rounded-2xl transition-all font-bold group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <User size={18} />
                                    </div>
                                    Apply for IDL
                                </Link>
                                <Link
                                    href="/tours"
                                    className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] hover:bg-[#113A74]/5 text-[#113A74] rounded-2xl transition-all font-bold group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Package size={18} />
                                    </div>
                                    Browse Packages
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Tabs & Data */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="bg-white rounded-full shadow-sm p-1.5 flex flex-wrap gap-2 mb-8 max-w-fit">
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`py-3 px-6 text-sm font-black transition-all rounded-full ${activeTab === 'bookings'
                                    ? 'bg-[#113A74] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#113A74]'
                                    }`}
                            >
                                My Bookings
                            </button>
                            <button
                                onClick={() => setActiveTab('visa')}
                                className={`py-3 px-6 text-sm font-black transition-all rounded-full ${activeTab === 'visa'
                                    ? 'bg-[#113A74] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#113A74]'
                                    }`}
                            >
                                Visa Applications
                            </button>
                            <button
                                onClick={() => setActiveTab('idl')}
                                className={`py-3 px-6 text-sm font-black transition-all rounded-full ${activeTab === 'idl'
                                    ? 'bg-[#113A74] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#113A74]'
                                    }`}
                            >
                                IDL Applications
                            </button>
                        </div>

                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <ProfileCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : activeTab === 'bookings' ? (
                            bookings.length === 0 ? (
                                <div className="bg-white rounded-3xl p-16 text-center shadow-xl shadow-gray-200/40">
                                    <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <Package className="text-gray-400" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#113A74] mb-3">No bookings yet</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't made any bookings yet. Start exploring the world with our tailored travel packages.</p>
                                    <Link href="/tours" className="inline-flex items-center justify-center px-8 py-4 text-sm font-black rounded-full text-white bg-[#113A74] hover:bg-[#1c4d91] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        Browse Packages
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {bookings.map((booking) => {
                                        const adultDouble = booking.guest_adult_double ?? booking.count_adult_double ?? 0;
                                        const adultSingle = booking.guest_adult_single ?? booking.count_adult_single ?? 0;
                                        const adultTriple = booking.guest_adult_triple ?? booking.count_adult_triple ?? 0;
                                        const childBed = booking.guest_child_with_bed ?? booking.count_child_bed ?? 0;
                                        const childNoBed = booking.guest_child_no_bed ?? booking.count_child_no_bed ?? 0;
                                        const infant = booking.guest_infant ?? booking.count_infant ?? 0;
                                        const totalPassengers = adultDouble * 2 + adultSingle + adultTriple * 3 + childBed + childNoBed + infant;
                                        const packageTitle = booking.package_title || booking.package_name || 'Tour Package';
                                        const bookingRef = booking.display_id || booking.id?.split('-').pop()?.toUpperCase();
                                        const totalAmount = booking.total_amount ?? booking.total ?? null;

                                        return (
                                            <div key={booking.id} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all border border-transparent hover:border-gray-100">
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8 pb-8 border-b border-gray-100">
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                                    booking.status === 'Pending' ? 'bg-[#FFA500]/10 text-[#FFA500]' :
                                                                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                                            'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                            <span className="text-xs font-bold text-gray-400">#{bookingRef}</span>
                                                        </div>
                                                        <h3 className="text-xl font-black text-[#113A74] mb-1">{packageTitle}</h3>
                                                        {booking.currency && (
                                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{booking.currency}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-left md:text-right bg-gray-50 py-3 px-6 rounded-2xl shrink-0">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                                        <p className="text-2xl font-black text-[#113A74]">
                                                            {totalAmount != null ? `AED ${totalAmount.toLocaleString()}` : '—'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Travel Date</p>
                                                        <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                            <Calendar size={16} className="text-[#FFA500] shrink-0" />
                                                            {booking.travel_date ? new Date(booking.travel_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Passengers</p>
                                                        <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                            <User size={16} className="text-[#FFA500] shrink-0" />
                                                            {totalPassengers} Traveler{totalPassengers !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 md:col-span-1">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Booked On</p>
                                                        <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                            <Clock size={16} className="text-[#FFA500] shrink-0" />
                                                            {booking.created_at ? new Date(booking.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        ) : activeTab === 'visa' ? (
                            /* Visa Applications View */
                            visaApplications.length === 0 ? (
                                <div className="bg-white rounded-3xl p-16 text-center shadow-xl shadow-gray-200/40">
                                    <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <FileText className="text-gray-400" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#113A74] mb-3">No Visa Applications</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Get expert assistance for your travel visas. Submit your application online.</p>
                                    <Link href="/visa" className="inline-flex items-center justify-center px-8 py-4 text-sm font-black rounded-full text-white bg-[#113A74] hover:bg-[#1c4d91] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        Apply for Visa
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {visaApplications.map((visa) => (
                                        <div key={visa.id} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all border border-transparent hover:border-gray-100">
                                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8 pb-8 border-b border-gray-100">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                            visa.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                            visa.status === 'Pending' ? 'bg-[#FFA500]/10 text-[#FFA500]' :
                                                            visa.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {visa.status || 'Pending'}
                                                        </span>
                                                        <span className="text-xs font-bold text-gray-400">#{visa.id?.split('-').pop()?.toUpperCase()}</span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-[#113A74] mb-1">
                                                        {visa.visa_name || 'Visa Application'}
                                                    </h3>
                                                    <p className="text-sm font-bold text-[#FFA500] uppercase tracking-wide">
                                                        {visa.countries?.name || 'International'}
                                                    </p>
                                                </div>
                                                <div className="text-left md:text-right bg-gray-50 py-3 px-6 rounded-2xl shrink-0">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Applied On</p>
                                                    <p className="text-xl font-black text-[#113A74]">
                                                        {visa.created_at ? new Date(visa.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Travel Date</p>
                                                    <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                        <Calendar size={16} className="text-[#FFA500] shrink-0" />
                                                        {visa.travel_date ? new Date(visa.travel_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Passengers</p>
                                                    <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                        <Users size={16} className="text-[#FFA500] shrink-0" />
                                                        {visa.number_of_passengers || 0} Pax
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Category</p>
                                                    <div className="flex items-center gap-2 text-sm font-black text-[#113A74] capitalize">
                                                        <Info size={16} className="text-[#FFA500] shrink-0" />
                                                        {visa.visa_category || 'Standard'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Nationality</p>
                                                    <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                        <Globe size={16} className="text-[#FFA500] shrink-0" />
                                                        {visa.nationality || '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            /* IDL Applications View */
                            idlApplications.length === 0 ? (
                                <div className="bg-white rounded-3xl p-16 text-center shadow-xl shadow-gray-200/40">
                                    <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <FileText className="text-gray-400" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#113A74] mb-3">No IDL Applications yet</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Apply for your International Driving License securely online through our portal.</p>
                                    <Link href="/idl" className="inline-flex items-center justify-center px-8 py-4 text-sm font-black rounded-full text-white bg-[#113A74] hover:bg-[#1c4d91] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        Apply for IDL
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {idlApplications.map((idl) => (
                                        <div key={idl.id} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all border border-transparent hover:border-gray-100">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                                <div>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${idl.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        idl.status === 'Pending' ? 'bg-[#FFA500]/10 text-[#FFA500]' :
                                                            idl.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {idl.status}
                                                    </span>
                                                    <h3 className="text-xl font-black text-[#113A74]">
                                                        {idl.id}
                                                    </h3>
                                                </div>
                                                <div className="text-left md:text-right bg-gray-50 py-3 px-6 rounded-2xl">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Applied On</p>
                                                    <p className="text-xl font-black text-[#113A74]">{new Date(idl.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Applicant Name</p>
                                                    <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                        <User size={18} className="text-[#FFA500]" />
                                                        {idl.applicant_name}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Contact</p>
                                                    <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                        <Clock size={18} className="text-[#FFA500]" />
                                                        {idl.mobile_number}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Drivers</p>
                                                    <div className="flex items-center gap-2 text-sm font-black text-[#113A74]">
                                                        <div className="w-5 h-5 rounded-full bg-[#FFA500]/20 text-[#FFA500] flex items-center justify-center font-bold text-xs">
                                                            {idl.number_of_drivers}
                                                        </div>
                                                        Driver(s)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
