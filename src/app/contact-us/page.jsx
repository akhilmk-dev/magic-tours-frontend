"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, Globe, Clock, CheckCircle2, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import InternationalPhoneInput from '../../components/common/InternationalPhoneInput';

// Assets
import bannerImg from '../../assets/INNER PAGE BANNER.png';
import gutterImg from '../../assets/gutter.png';

const ContactSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^\+?[\d\s-]{7,20}$/, 'Invalid phone number format')
        .required('Phone number is required'),
    subject: Yup.string()
        .required('Subject is required'),
    message: Yup.string()
        .min(10, 'Message is too short!')
        .required('Message is required'),
});

const ContactUsPage = () => {
    const { success, error } = useToast();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values, { resetForm }) => {
        setSubmitting(true);
        try {
            await api.post('/contacts/frontend/submit', values);
            success('Message sent successfully! We will get back to you soon.');
            resetForm();
        } catch (err) {
            console.error('Submission error:', err);
            error('Failed to send message. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Phone className="text-[#FFA500]" size={20} />,
            title: "Phone Number",
            details: "+971 123 456 789",
            details2: "+971 987 654 321",
            bg: "bg-orange-50"
        },
        {
            icon: <Mail className="text-[#113A74]" size={20} />,
            title: "Email Address",
            details: "info@magictours.com",
            details2: "support@magictours.com",
            bg: "bg-blue-50"
        },
        {
            icon: <MapPin className="text-[#FFA500]" size={20} />,
            title: "Our Location",
            details: "123 Business Bay",
            details2: "Dubai, United Arab Emirates",
            bg: "bg-orange-50"
        },
        {
            icon: <Clock className="text-[#113A74]" size={20} />,
            title: "Opening Hours",
            details: "Mon - Sat: 9:00 AM - 6:00 PM",
            details2: "Sunday: Closed",
            bg: "bg-blue-50"
        }
    ];

    return (
        <main className="min-h-screen bg-white font-sans pb-20 overflow-hidden">
            {/* Hero Banner Section */}
            <section className="relative min-h-[70vh] lg:min-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-slate-900 m-0 p-0 border-none">
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImg.src || bannerImg}
                        alt="Contact Us Banner"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-[#E9F7FF]/20 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-12 md:mt-20 flex flex-col items-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#113A74] mb-3 tracking-tight drop-shadow-sm font-heading"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.nav 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest"
                    >
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>Contact Us</span>
                    </motion.nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1/2">
                    <img src={gutterImg.src || gutterImg} alt="" className="w-full h-auto block border-none" />
                </div>
            </section>

            {/* Contact Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Left Side: Contact Info */}
                    <div className="lg:col-span-5 space-y-10 mt-4">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 bg-[#eff6ff] text-[#113A74] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-50/50">
                                Get In Touch
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#113A74] font-heading leading-tight">
                                Ready to Plan Your <br />
                                <span className="text-[#FFA500]">Next Adventure?</span>
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                                Have questions about our tour packages or need a custom itinerary? Our travel experts are here to help you every step of the way.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {contactInfo.map((info, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-[#FFA500]/30 hover:shadow-xl hover:shadow-[#113A74]/5 transition-all group"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${info.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500`}>
                                        {info.icon}
                                    </div>
                                    <h4 className="text-[#113A74] font-bold text-sm mb-2">{info.title}</h4>
                                    <p className="text-gray-500 text-xs font-medium mb-0.5">{info.details}</p>
                                    <p className="text-gray-400 text-[11px] font-medium">{info.details2}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links or Map Placeholder */}
                        <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-white to-[#eff6ff] border border-slate-100 shadow-lg overflow-hidden relative">
                            <div className="absolute inset-0 bg-[#113A74]/5 backdrop-blur-3xl"></div>
                            <div className="relative z-10 p-8 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#113A74]/60">Stay Connected</p>
                                    <p className="text-sm font-bold text-[#113A74]">Follow our travel updates</p>
                                </div>
                                <div className="flex gap-2">
                                    {[
                                        { icon: <Instagram size={18} />, link: '#' },
                                        { icon: <Facebook size={18} />, link: '#' },
                                        { icon: <Twitter size={18} />, link: '#' },
                                        { icon: <Linkedin size={18} />, link: '#' }
                                    ].map((social, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-white text-[#113A74] flex items-center justify-center hover:bg-[#FFA500] hover:text-white transition-all cursor-pointer shadow-sm border border-slate-50">
                                            {social.icon}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-[#113A74]/5 border border-slate-50 relative overflow-hidden"
                        >
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFA500]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="relative z-10 mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1.5 h-6 bg-[#FFA500] rounded-full"></div>
                                    <h3 className="text-2xl font-black text-[#113A74] tracking-tight font-heading">Send a Message</h3>
                                </div>
                                <p className="text-gray-400 text-xs font-medium">We usually respond within 24 hours during business days.</p>
                            </div>

                            <Formik
                                initialValues={{ name: '', email: '', phone: '', subject: '', message: '' }}
                                validationSchema={ContactSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, errors, touched, isValid, setFieldValue }) => (
                                    <Form className="space-y-6 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-[#113A74] uppercase tracking-widest ml-1">Your Name</label>
                                                <div className="relative">
                                                    <Field 
                                                        name="name" 
                                                        placeholder="John Doe" 
                                                        className={`w-full bg-[#f8fafc] border ${touched.name && errors.name ? 'border-red-300' : 'border-slate-100'} rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#113A74] focus:bg-white transition-all transition-duration-300 shadow-sm`}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#113A74]/20">
                                                        <MessageSquare size={18} />
                                                    </div>
                                                </div>
                                                <ErrorMessage name="name" component="div" className="text-red-500 text-[10px] font-bold uppercase ml-1" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-[#113A74] uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="relative">
                                                    <Field 
                                                        name="email" 
                                                        placeholder="john@example.com" 
                                                        className={`w-full bg-[#f8fafc] border ${touched.email && errors.email ? 'border-red-300' : 'border-slate-100'} rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#113A74] focus:bg-white transition-all transition-duration-300 shadow-sm`}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#113A74]/20">
                                                        <Mail size={18} />
                                                    </div>
                                                </div>
                                                <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] font-bold uppercase ml-1" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-[#113A74] uppercase tracking-widest ml-1">Phone Number</label>
                                                <InternationalPhoneInput
                                                    value={values.phone}
                                                    onChange={(val) => setFieldValue('phone', val)}
                                                    error={touched.phone && errors.phone}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-[#113A74] uppercase tracking-widest ml-1">Subject</label>
                                                <div className="relative">
                                                    <Field 
                                                        name="subject" 
                                                        placeholder="Tour Inquiry, Custom Trip..." 
                                                        className={`w-full bg-[#f8fafc] border ${touched.subject && errors.subject ? 'border-red-300' : 'border-slate-100'} rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#113A74] focus:bg-white transition-all transition-duration-300 shadow-sm`}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#113A74]/20">
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                </div>
                                                <ErrorMessage name="subject" component="div" className="text-red-500 text-[10px] font-bold uppercase ml-1" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#113A74] uppercase tracking-widest ml-1">Your Message</label>
                                            <Field 
                                                as="textarea"
                                                name="message" 
                                                rows="5"
                                                placeholder="Write your message here..." 
                                                className={`w-full bg-[#f8fafc] border ${touched.message && errors.message ? 'border-red-300' : 'border-slate-100'} rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#113A74] focus:bg-white transition-all transition-duration-300 shadow-sm resize-none`}
                                            />
                                            <ErrorMessage name="message" component="div" className="text-red-500 text-[10px] font-bold uppercase ml-1" />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={submitting || !isValid}
                                                className={`w-full bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-2xl py-5 px-10 font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-[#113A74]/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group`}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="animate-spin text-white" size={20} />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactUsPage;
