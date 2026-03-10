"use client";

import React, { useEffect, useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../api/client';
import { User, Package, Calendar, MapPin, Clock, LogOut, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const { user, logout, loading: authLoading } = useCustomerAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings');
                setBookings(response.data || response);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
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
        <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* User Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                    <User size={40} />
                                </div>
                                <h2 className="text-xl font-bold text-secondary">{user.name}</h2>
                                <p className="text-sm text-gray-500 mb-6">{user.email}</p>

                                <Link
                                    href="/visa-application"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-colors font-medium text-sm mb-3"
                                >
                                    <FileText size={16} /> Apply for Visa
                                </Link>

                                <button
                                    onClick={logout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium text-sm"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Bookings */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-secondary mb-6">My Bookings</h2>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-primary" size={40} />
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
                                <p className="text-gray-500 mb-6">You haven't made any bookings yet. Start your journey today!</p>
                                <Link href="/packages" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark transition-all">
                                    Browse Packages
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                            <div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                <h3 className="text-lg font-bold text-secondary">
                                                    Booking #{booking.id}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
                                                <p className="text-2xl font-black text-primary">AED {booking.total_amount?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Travel Date</p>
                                                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                                                    <Calendar size={16} className="text-primary" />
                                                    {new Date(booking.travel_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Trip End</p>
                                                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                                                    <Clock size={16} className="text-primary" />
                                                    {booking.trip_end ? new Date(booking.trip_end).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Travelers</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {booking.count_adult_double > 0 && <span className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100">{booking.count_adult_double} Adult(s) [Double]</span>}
                                                    {booking.count_adult_single > 0 && <span className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100">{booking.count_adult_single} Adult(s) [Single]</span>}
                                                    {booking.count_adult_triple > 0 && <span className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100">{booking.count_adult_triple} Adult(s) [Triple]</span>}
                                                    {(booking.count_child_bed > 0 || booking.count_child_no_bed > 0) && (
                                                        <span className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                            {(booking.count_child_bed || 0) + (booking.count_child_no_bed || 0)} Child(ren)
                                                        </span>
                                                    )}
                                                    {booking.count_infant > 0 && <span className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100">{booking.count_infant} Infant(s)</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
