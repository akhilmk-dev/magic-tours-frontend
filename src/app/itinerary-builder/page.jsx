"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Calendar, Users, Briefcase, 
    Sparkles, ArrowRight, ChevronRight, 
    CheckCircle2, Search, Loader2, Info,
    Plane, Hotel, Compass, Globe, Heart
} from 'lucide-react';
import { api } from '../../api/client';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/common/Skeleton';
import Link from 'next/link';
import FavoriteButton from '../../components/common/FavoriteButton';

const ITINERARY_INTERESTS = [
    { id: 'adventure', label: 'Adventure', icon: Compass },
    { id: 'relax', label: 'Relaxation', icon: Hotel },
    { id: 'cultural', label: 'Cultural', icon: Globe },
    { id: 'honeymoon', label: 'Honeymoon', icon: Heart },
    { id: 'family', label: 'Family Friendly', icon: Users },
    { id: 'luxury', label: 'Luxury', icon: Sparkles }
];

const ItineraryBuilder = () => {
    const { user, openAuthModal } = useCustomerAuth();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [matchedPackages, setMatchedPackages] = useState([]);
    const [aiItinerary, setAiItinerary] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        adults: 2,
        children: 0,
        budget: 'premium', // basic, premium, luxury
        interests: [],
        suggestions: ''
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const toggleInterest = (id) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(id) 
                ? prev.interests.filter(i => i !== id)
                : [...prev.interests, id]
        }));
    };

    const handleSubmit = async () => {
        if (!user) {
            openAuthModal('login');
            return;
        }

        setLoading(true);
        try {
            // 1. Try to match existing packages
            const matchResponse = await api.post('/packages/match', formData);
            const matches = matchResponse.data || [];
            
            if (matches.length > 0) {
                setMatchedPackages(matches);
                setStep(4); // Move to results step
            } else {
                // 2. If no matches, generate AI itinerary
                const aiResponse = await api.post('/itinerary/generate', formData);
                setAiItinerary(aiResponse.data);
                setStep(5); // Move to AI result step
            }
        } catch (error) {
            console.error("Submission failed:", error);
            showToast("Failed to process your request. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSendToAdmin = async () => {
        setLoading(true);
        try {
            await api.post('/itinerary/submit', {
                ...formData,
                ai_itinerary: aiItinerary
            });
            setIsSubmitted(true);
            showToast("Your itinerary has been sent to our experts!", "success");
        } catch (error) {
            showToast("Failed to send to expert. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px w-8 bg-[#FFA500]" />
                            <span className="text-[#FFA500] text-xs font-black uppercase tracking-[0.3em]">AI-Powered</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#113A74] tracking-tight mb-4">
                            Build Your <span className="text-[#FFA500]">Dreams.</span>
                        </h1>
                        <p className="text-gray-500 max-w-xl text-lg font-medium leading-relaxed">
                            Tell us your vision, and we'll craft the perfect journey just for you. 
                            Instant matching with premium packages or AI-generated custom plans.
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left side: Timeline/Steps */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-40">
                            <h3 className="text-xl font-black text-[#113A74] mb-8">Your Journey</h3>
                            <div className="space-y-8">
                                {[
                                    { s: 1, label: 'Destinations & Dates', icon: MapPin },
                                    { s: 2, label: 'Travel Details', icon: Users },
                                    { s: 3, label: 'Preferences', icon: Sparkles },
                                ].map((item) => (
                                    <div key={item.s} className="flex items-center gap-4 group">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= item.s ? 'bg-[#113A74] text-white shadow-lg shadow-[#113A74]/20' : 'bg-gray-50 text-gray-300'}`}>
                                            <item.icon size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= item.s ? 'text-[#FFA500]' : 'text-gray-300'}`}>Step 0{item.s}</span>
                                            <span className={`text-sm font-black tracking-tight ${step >= item.s ? 'text-[#113A74]' : 'text-gray-400'}`}>{item.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Form Views */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#113A74]/5 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FFA500]/5 rounded-full blur-3xl" />

                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div 
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Where would you like to go?</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-all" size={20} />
                                                    <input 
                                                        type="text" 
                                                        required
                                                        placeholder="Enter destination (e.g. Dubai, Qatar, Maldives)"
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-3xl py-5 pl-16 pr-8 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                        value={formData.destination}
                                                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Start Date</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-all" size={20} />
                                                        <input 
                                                            type="date"
                                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-3xl py-5 pl-16 pr-8 outline-none transition-all text-sm font-bold text-[#113A74]"
                                                            value={formData.startDate}
                                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">End Date</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-all" size={20} />
                                                        <input 
                                                            type="date"
                                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-3xl py-5 pl-16 pr-8 outline-none transition-all text-sm font-bold text-[#113A74]"
                                                            value={formData.endDate}
                                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                onClick={handleNext}
                                                disabled={!formData.destination}
                                                className="w-full relative group overflow-hidden bg-[#113A74] text-white rounded-full py-6 px-10 font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-[#1c4d91] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#113A74]/20 flex items-center justify-center gap-3"
                                            >
                                                <span>Next Step</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div 
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Group Size</label>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex-1 space-y-2">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adults</span>
                                                        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 px-4">
                                                            <button onClick={() => setFormData({...formData, adults: Math.max(1, formData.adults - 1)})} className="w-8 h-8 rounded-xl bg-white text-[#113A74] flex items-center justify-center font-black shadow-sm hover:bg-[#FFA500] hover:text-white transition-all">-</button>
                                                            <span className="flex-1 text-center font-black text-[#113A74]">{formData.adults}</span>
                                                            <button onClick={() => setFormData({...formData, adults: formData.adults + 1})} className="w-8 h-8 rounded-xl bg-white text-[#113A74] flex items-center justify-center font-black shadow-sm hover:bg-[#FFA500] hover:text-white transition-all">+</button>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Children</span>
                                                        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 px-4">
                                                            <button onClick={() => setFormData({...formData, children: Math.max(0, formData.children - 1)})} className="w-8 h-8 rounded-xl bg-white text-[#113A74] flex items-center justify-center font-black shadow-sm hover:bg-[#FFA500] hover:text-white transition-all">-</button>
                                                            <span className="flex-1 text-center font-black text-[#113A74]">{formData.children}</span>
                                                            <button onClick={() => setFormData({...formData, children: formData.children + 1})} className="w-8 h-8 rounded-xl bg-white text-[#113A74] flex items-center justify-center font-black shadow-sm hover:bg-[#FFA500] hover:text-white transition-all">+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Budget Preference</label>
                                                <div className="grid grid-cols-3 gap-3 bg-gray-50 p-2 rounded-2xl">
                                                    {['basic', 'premium', 'luxury'].map((b) => (
                                                        <button 
                                                            key={b}
                                                            onClick={() => setFormData({...formData, budget: b})}
                                                            className={`py-3 rounded-[0.9rem] text-[10px] font-black uppercase tracking-widest transition-all ${formData.budget === b ? 'bg-[#113A74] text-white shadow-lg' : 'text-gray-400 hover:text-[#113A74]'}`}
                                                        >
                                                            {b}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={handleBack}
                                                className="w-1/3 bg-gray-100 text-gray-400 rounded-full py-6 px-10 font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-gray-200"
                                            >
                                                Back
                                            </button>
                                            <button 
                                                onClick={handleNext}
                                                className="w-2/3 relative group overflow-hidden bg-[#113A74] text-white rounded-full py-6 px-10 font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-[#1c4d91] shadow-xl shadow-[#113A74]/20 flex items-center justify-center gap-3"
                                            >
                                                <span>Almost There</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div 
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-6">
                                            <label className="text-xs font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1 text-center block w-full">What are you interested in?</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {ITINERARY_INTERESTS.map((item) => (
                                                    <button 
                                                        key={item.id}
                                                        onClick={() => toggleInterest(item.id)}
                                                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${formData.interests.includes(item.id) ? 'bg-[#FFA500]/5 border-[#FFA500] text-[#113A74]' : 'bg-white border-gray-100 text-gray-400 hover:border-[#113A74]/20'}`}
                                                    >
                                                        <item.icon size={24} className={formData.interests.includes(item.id) ? 'text-[#FFA500]' : ''} />
                                                        <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Describe your dream trip</label>
                                            <textarea 
                                                rows={4}
                                                placeholder="Tell us about specific places you want to visit, or things you want to do..."
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-3xl py-6 px-8 outline-none transition-all text-sm font-semibold text-[#113A74] placeholder:text-gray-300 resize-none"
                                                value={formData.suggestions}
                                                onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={handleBack}
                                                className="w-1/3 bg-gray-100 text-gray-400 rounded-full py-6 px-10 font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-gray-200"
                                            >
                                                Back
                                            </button>
                                            <button 
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className="w-2/3 relative group overflow-hidden bg-[#FFA500] text-white rounded-full py-6 px-10 font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-[#e69500] shadow-xl shadow-[#FFA500]/20 flex items-center justify-center gap-3 disabled:opacity-70"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                                    <>
                                                        <span>Craft My Itinerary</span>
                                                        <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {loading ? (
                                    <div className="space-y-8 py-10">
                                        <div className="text-center space-y-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                                <Compass className="text-gray-200" size={32} />
                                            </div>
                                            <Skeleton width="60%" height="2rem" className="mx-auto" />
                                            <Skeleton width="40%" height="1rem" className="mx-auto" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[1, 2].map(i => (
                                                <div key={i} className="space-y-4">
                                                    <Skeleton height="12rem" className="rounded-[2rem]" />
                                                    <Skeleton width="80%" height="1.5rem" />
                                                    <Skeleton width="40%" height="1rem" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : step === 4 ? (
                                    /* --- MATCHED PACKAGES VIEW --- */
                                    <motion.div 
                                        key="step4"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-8"
                                    >
                                        <div className="text-center space-y-2">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle2 className="text-green-500" size={32} />
                                            </div>
                                            <h2 className="text-3xl font-black text-[#113A74]">We found some matches!</h2>
                                            <p className="text-gray-500 font-medium">These packages perfectly align with your preferences.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                            {matchedPackages.map((pkg) => (
                                                <div key={pkg.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all group">
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        <FavoriteButton 
                                                            packageId={pkg.id} 
                                                            className="absolute top-4 right-4 z-20"
                                                        />
                                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                                                            <span className="text-[10px] font-black text-[#113A74] uppercase tracking-widest">{pkg.duration} Days</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <h4 className="text-lg font-black text-[#113A74] mb-2 line-clamp-1">{pkg.title}</h4>
                                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                                            <span className="text-[#FFA500] font-black italic">QAR {pkg.price} <span className="text-[10px] uppercase font-bold not-italic">Onwards</span></span>
                                                            <Link href={`/tours/${pkg.id}`} className="text-[10px] font-black text-[#113A74] uppercase tracking-widest hover:text-[#FFA500] transition-colors">View Details</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-center pt-6 border-t border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Not exactly what you had in mind?</p>
                                            <button 
                                                onClick={async () => {
                                                    setLoading(true);
                                                    try {
                                                        const response = await api.post('/itinerary/generate', formData);
                                                        setAiItinerary(response.data);
                                                        setStep(5);
                                                    } catch (e) {
                                                        showToast("Failed to generate custom itinerary.", "error");
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                                className="text-xs font-black text-[#113A74] uppercase tracking-[0.3em] hover:text-[#FFA500] transition-colors flex items-center justify-center gap-2 mx-auto"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                                Generate AI Custom Itinerary instead
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : step === 5 ? (
                                    /* --- AI GENERATED ITINERARY VIEW --- */
                                    <motion.div 
                                        key="step5"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-10"
                                    >
                                        {isSubmitted ? (
                                            <div className="text-center py-20 space-y-6">
                                                <div className="w-24 h-24 bg-[#113A74] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#113A74]/30">
                                                    <CheckCircle2 className="text-white" size={48} />
                                                </div>
                                                <h2 className="text-4xl font-black text-[#113A74]">Itinerary Submitted!</h2>
                                                <p className="text-gray-500 max-w-md mx-auto font-medium">
                                                    Your custom-crafted journey has been sent to our experts. 
                                                    We'll review it and get back to you with a final package soon.
                                                </p>
                                                <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-black text-[#FFA500] uppercase tracking-[0.3em] hover:opacity-80 transition-all pt-8">
                                                    View Status in Profile <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <Sparkles className="text-[#FFA500]" size={24} />
                                                        <h2 className="text-3xl font-black text-[#113A74]">AI-Crafted Itinerary</h2>
                                                    </div>
                                                    <p className="text-gray-500 font-medium">Based on your preferences, here is a suggested plan. Approval required by our experts.</p>
                                                </div>

                                                <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                                                    <div className="prose prose-blue max-w-none">
                                                        {aiItinerary?.map((day, idx) => (
                                                            <div key={idx} className="mb-10 last:mb-0">
                                                                <div className="flex items-center gap-4 mb-4">
                                                                    <div className="w-8 h-8 rounded-full bg-[#113A74] text-white flex items-center justify-center text-[10px] font-black">D{idx+1}</div>
                                                                    <h4 className="text-lg font-black text-[#113A74] uppercase tracking-tight m-0">{day.title || `Day ${idx+1}`}</h4>
                                                                </div>
                                                                <p className="text-sm text-[#113A74]/80 font-medium leading-relaxed pl-12">{day.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <button 
                                                        onClick={() => setStep(3)}
                                                        className="w-1/3 bg-gray-100 text-gray-400 rounded-full py-6 px-10 font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-gray-200"
                                                    >
                                                        Edit Info
                                                    </button>
                                                    <button 
                                                        onClick={handleSendToAdmin}
                                                        disabled={loading}
                                                        className="w-2/3 relative group overflow-hidden bg-[#113A74] text-white rounded-full py-6 px-10 font-black text-xs uppercase tracking-[0.4em] transition-all hover:bg-[#1c4d91] shadow-xl shadow-[#113A74]/20 flex items-center justify-center gap-3"
                                                    >
                                                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                                            <>
                                                                <span>Confirm & Send to Expert</span>
                                                                <CheckCircle2 size={18} />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryBuilder;
