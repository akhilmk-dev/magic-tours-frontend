"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const HeroContactForm = ({ minimal = false }) => {
    const { showToast } = useToast();
    const { user } = useCustomerAuth();
    const [submitting, setSubmitting] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        destination: '',
        message: ''
    });

    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                phone: user.phone || prev.phone
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch('https://magic-apis.staff-b0c.workers.dev/contacts/frontend/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: 'Frontend Contact Inquiry',
                    message: `Destination: ${formData.destination}\n\n${formData.message || 'New contact inquiry from website.'}`,
                }),
            });

            if (!response.ok) throw new Error('Submission failed');

            showToast('Message sent successfully!', 'success');
            setFormData({ name: '', email: '', phone: '', destination: '', message: '' });
        } catch (error) {
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const destinations = [
        "Europe", "Asia", "Middle East", "Africa", "North America", "South America", "Australia"
    ];

    const inputStyle = {
        background: 'transparent',
        border: 'none',
        borderBottom: minimal ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
        color: 'white',
        width: '100%',
        padding: '10px 25px 10px 0',
        outline: 'none',
        borderRadius: '0',
        fontSize: '13px'
    };

    const labelStyle = {
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '0.1em',
        color: minimal ? 'rgba(255, 255, 255, 0.6)' : 'white',
        textTransform: 'uppercase',
        marginBottom: '4px'
    };

    return (
        <motion.div
            initial={minimal ? { opacity: 0, y: 20 } : { opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: minimal ? 0 : 0.2 }}
            className={`relative z-20 overflow-hidden ${minimal ? 'w-full p-0 bg-transparent' : 'w-full lg:w-[400px] p-6 sm:p-[30px] rounded-[30px] sm:rounded-[35px] bg-white/15 backdrop-blur-[30px] border-2 border-white/50'}`}
            style={minimal ? {} : {
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                WebkitBackdropFilter: 'blur(30px)'
            }}
        >
            {!minimal && (
                <>
                    <div className="mb-4">
                        <h2 className="text-white text-[28px] leading-tight font-heading">
                            Plan Your Journey
                        </h2>
                        <p className="text-white/90 text-sm mt-1">
                            Tell us your preferences. We'll craft your perfect trip.
                        </p>
                    </div>

                    <div className="flex items-center gap-0 mb-4">
                        <div className="flex-1 h-[1px] bg-white/20"></div>
                        <div className="text-[#FDB338] px-4">✦</div>
                        <div className="flex-1 h-[1px] bg-white/20"></div>
                    </div>
                </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label style={labelStyle}>FULL NAME</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            style={inputStyle}
                            className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]' : 'placeholder:text-white/40 focus:border-[#FDB338]'} transition-colors`}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label style={labelStyle}>PHONE NUMBER</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Your Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={inputStyle}
                            className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]' : 'placeholder:text-white/40 focus:border-[#FDB338]'} transition-colors`}
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label style={labelStyle}>EMAIL ADDRESS</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            style={inputStyle}
                            className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]' : 'placeholder:text-white/40 focus:border-[#FDB338]'} transition-colors`}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label style={labelStyle}>DESTINATION</label>
                        <div className="relative">
                            <div
                                onClick={() => setShowDestDropdown(!showDestDropdown)}
                                style={{ ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                className="transition-colors text-white"
                            >
                                <span className={`whitespace-nowrap overflow-hidden text-ellipsis mr-2 ${formData.destination ? 'text-white' : (minimal ? 'text-white/30' : 'text-white/40')}`}>
                                    {formData.destination || "Where to go?"}
                                </span>
                                <ChevronDown className={`transition-transform duration-300 shrink-0 ${showDestDropdown ? 'rotate-180' : ''} ${minimal ? 'text-white/40' : 'text-white/60'}`} size={16} />
                            </div>

                            <AnimatePresence>
                                {showDestDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowDestDropdown(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-white/20 shadow-2xl backdrop-blur-3xl bg-[#022C54]/95"
                                        >
                                            <div className="max-h-[200px] overflow-y-auto py-2">
                                                {destinations.map(dest => (
                                                    <div
                                                        key={dest}
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, destination: dest }));
                                                            setShowDestDropdown(false);
                                                        }}
                                                        className="px-4 py-2.5 text-white text-sm font-medium hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-between group"
                                                    >
                                                        {dest}
                                                        {formData.destination === dest && <div className="w-1.5 h-1.5 rounded-full bg-[#FDB338] shadow-[0_0_10px_#FDB338]" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label style={labelStyle}>MESSAGE</label>
                    <textarea
                        name="message"
                        placeholder="Tell us about your trip..."
                        value={formData.message}
                        onChange={handleChange}
                        style={{
                            background: minimal ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.08)',
                            border: minimal ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.25)',
                            borderRadius: '15px',
                            padding: '15px',
                            color: 'white',
                            height: '110px',
                            outline: 'none',
                            resize: 'none'
                        }}
                        className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]/50' : 'placeholder:text-white/40 focus:border-[#FDB338]/50'} transition-colors`}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 mt-4 rounded-full font-heading font-bold text-lg tracking-wider text-white shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                    style={{
                        background: 'linear-gradient(90deg, #FDB338 0%, #022C54 100%)'
                    }}
                >
                    {submitting ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <span>START MY JOURNEY</span>
                            <span className="text-2xl leading-none">→</span>
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default HeroContactForm;
