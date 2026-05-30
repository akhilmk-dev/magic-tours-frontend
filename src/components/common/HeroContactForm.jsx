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
    const [errors, setErrors] = useState({});

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

    const validate = (data) => {
        const e = {};
        if (!data.name.trim())        e.name        = 'Full name is required';
        if (!data.phone.trim())       e.phone       = 'Phone number is required';
        if (!data.email.trim())       e.email       = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email address';
        if (!data.destination)        e.destination = 'Please select a destination';
        if (!data.message.trim())     e.message     = 'Message is required';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSelectDestination = (dest) => {
        setFormData(prev => ({ ...prev, destination: dest }));
        setShowDestDropdown(false);
        if (errors.destination) setErrors(prev => ({ ...prev, destination: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch('https://api.magictours.qa/journey-inquiries/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    destination: formData.destination,
                    message: formData.message,
                }),
            });

            if (!response.ok) throw new Error('Submission failed');

            showToast('Message sent successfully!', 'success');
            setFormData({ name: '', email: '', phone: '', destination: '', message: '' });
            setErrors({});
        } catch (error) {
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const destinations = [
        "Europe", "Asia", "Middle East", "Africa", "North America", "South America", "Australia"
    ];

    const getInputStyle = (field) => ({
        background: 'transparent',
        border: 'none',
        borderBottom: errors[field]
            ? '1px solid rgba(255, 100, 100, 0.8)'
            : minimal ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
        color: 'white',
        width: '100%',
        padding: '10px 25px 10px 0',
        outline: 'none',
        borderRadius: '0',
        fontSize: '13px'
    });

    const labelStyle = {
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '0.1em',
        color: minimal ? 'rgba(255, 255, 255, 0.6)' : 'white',
        textTransform: 'uppercase',
        marginBottom: '4px'
    };

    const ErrorMsg = ({ field }) => errors[field] ? (
        <p className="text-[10px] font-semibold mt-1" style={{ color: 'rgba(255, 150, 150, 1)' }}>
            {errors[field]}
        </p>
    ) : null;

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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label style={labelStyle}>FULL NAME</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            style={getInputStyle('name')}
                            className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]' : 'placeholder:text-white/40 focus:border-[#FDB338]'} transition-colors`}
                        />
                        <ErrorMsg field="name" />
                    </div>
                    <div className="flex-1">
                        <label style={labelStyle}>PHONE NUMBER</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Your Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={getInputStyle('phone')}
                            className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]' : 'placeholder:text-white/40 focus:border-[#FDB338]'} transition-colors`}
                        />
                        <ErrorMsg field="phone" />
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
                            style={getInputStyle('email')}
                            className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]' : 'placeholder:text-white/40 focus:border-[#FDB338]'} transition-colors`}
                        />
                        <ErrorMsg field="email" />
                    </div>
                    <div className="flex-1">
                        <label style={labelStyle}>DESTINATION</label>
                        <div className="relative">
                            <div
                                onClick={() => setShowDestDropdown(!showDestDropdown)}
                                style={{
                                    ...getInputStyle('destination'),
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
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
                                                        onClick={() => handleSelectDestination(dest)}
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
                        <ErrorMsg field="destination" />
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
                            border: errors.message
                                ? '1px solid rgba(255, 100, 100, 0.8)'
                                : minimal ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.25)',
                            borderRadius: '15px',
                            padding: '15px',
                            color: 'white',
                            height: '110px',
                            outline: 'none',
                            resize: 'none'
                        }}
                        className={`${minimal ? 'placeholder:text-white/30 focus:border-[#FDB338]/50' : 'placeholder:text-white/40 focus:border-[#FDB338]/50'} transition-colors`}
                    />
                    <ErrorMsg field="message" />
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
