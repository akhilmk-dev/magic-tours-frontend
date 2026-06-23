"use client";

import React, { useState } from 'react';
import { X, Loader2, Send, User, Mail, Phone, Calendar, Users, MessageSquare } from 'lucide-react';
import { api } from '../../api/client';

const PackageEnquiryModal = ({ isOpen, onClose, pkg }) => {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', travel_date: '', travelers: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.full_name.trim() || !form.email.trim()) {
            setError('Name and email are required.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await api.post('/package-enquiries/submit', {
                ...form,
                package_id: pkg?.id || null,
                package_title: pkg?.title || null,
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.message || 'Failed to send enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({ full_name: '', email: '', phone: '', travel_date: '', travelers: '', message: '' });
        setSubmitted(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#113A74]">
                    <div>
                        <h2 className="text-lg font-bold text-white">Package Enquiry</h2>
                        {pkg?.title && <p className="text-xs text-white/70 mt-0.5 truncate max-w-xs">{pkg.title}</p>}
                    </div>
                    <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {submitted ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Send size={28} className="text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Enquiry Sent!</h3>
                        <p className="text-sm text-gray-500 mb-6">Our team will get back to you within 24 hours.</p>
                        <button
                            onClick={handleClose}
                            className="px-8 py-2.5 bg-[#113A74] text-white rounded-full font-bold text-sm hover:bg-[#0e2f5e] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#113A74] focus:ring-2 focus:ring-[#113A74]/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#113A74] focus:ring-2 focus:ring-[#113A74]/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+974 5000 0000"
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#113A74] focus:ring-2 focus:ring-[#113A74]/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Preferred Travel Date</label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="travel_date"
                                        type="date"
                                        value={form.travel_date}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#113A74] focus:ring-2 focus:ring-[#113A74]/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-600 mb-1">Number of Travelers</label>
                                <div className="relative">
                                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="travelers"
                                        value={form.travelers}
                                        onChange={handleChange}
                                        placeholder="e.g. 2 Adults, 1 Child"
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#113A74] focus:ring-2 focus:ring-[#113A74]/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-600 mb-1">Message / Special Requests</label>
                                <div className="relative">
                                    <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Any special requirements or questions..."
                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#113A74] focus:ring-2 focus:ring-[#113A74]/10 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 bg-[#FFA500] text-[#113A74] rounded-full font-bold text-sm hover:bg-[#e69500] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Send Enquiry
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PackageEnquiryModal;
