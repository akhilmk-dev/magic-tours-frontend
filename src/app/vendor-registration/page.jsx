"use client";

export const runtime = 'edge';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Lock, Globe, Building2,
    Eye, EyeOff, ArrowRight, Loader2, CheckCircle,
    ShieldCheck, Store, Star, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { api } from '../../api/client';
import InternationalPhoneInput from '../../components/common/InternationalPhoneInput';

// ── Shared style constants (matches login page) ─────────────────────────────
const labelClass = "text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1";
const inputBase = "w-full bg-gray-50/50 border-2 border-gray-100 focus:border-[#FFA500]/40 focus:bg-white focus:ring-4 focus:ring-[#FFA500]/10 rounded-xl outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300";
const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors";

const FieldError = ({ msg }) =>
    msg ? <div className="text-red-500 text-[10px] font-bold uppercase px-2 mt-1.5">{msg}</div> : null;

const FormInput = ({ label, icon: Icon, required, formik, name, type = 'text', placeholder }) => (
    <div className="space-y-1.5 w-full">
        <label className={labelClass}>{label} {required && <span className="text-[#FFA500]">*</span>}</label>
        <div className="relative group">
            {Icon && <Icon className={iconClass} size={18} />}
            <input
                type={type}
                placeholder={placeholder}
                className={`${inputBase} py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4`}
                {...formik.getFieldProps(name)}
            />
        </div>
        <FieldError msg={formik.touched[name] && formik.errors[name]} />
    </div>
);

const PasswordField = ({ label, formik, name, show, onToggle }) => (
    <div className="space-y-1.5 w-full">
        <label className={labelClass}>{label} <span className="text-[#FFA500]">*</span></label>
        <div className="relative group">
            <Lock className={iconClass} size={18} />
            <input
                type={show ? 'text' : 'password'}
                className={`${inputBase} py-3.5 pl-11 pr-12`}
                placeholder="••••••••"
                {...formik.getFieldProps(name)}
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFA500] transition-colors"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
        <FieldError msg={formik.touched[name] && formik.errors[name]} />
    </div>
);

const validationSchema = Yup.object({
    name: Yup.string().trim().required('Required'),
    company_name: Yup.string().trim().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
    website: Yup.string().url('Enter a valid URL e.g. https://example.com').nullable(),
    password: Yup.string().min(8, 'Min 8 characters').required('Required'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
});

export default function VendorRegistrationPage() {
    const [serverError, setServerError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            company_name: '',
            email: '',
            phone: '',
            website: '',
            password: '',
            confirm_password: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError('');
            try {
                await api.post('/vendors/register', {
                    name: values.name,
                    company_name: values.company_name,
                    email: values.email,
                    phone: values.phone,
                    website: values.website || null,
                    password: values.password,
                });
                setSubmitted(true);
            } catch (err) {
                setServerError(
                    err.response?.data?.error || err.message || 'Registration failed. Please try again.'
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white">

            {/* ── Left Decorative Panel ── */}
            <div className="w-full lg:w-[40%] bg-[#113A74] relative">
                <div className="sticky top-0 h-screen flex flex-col justify-center px-10 md:px-16 lg:px-20 pt-[80px] overflow-hidden">

                    {/* Abstract Shapes */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-[#FDB338]/10 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-12 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                    <div className="relative z-10 w-full max-w-md">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/5">
                                <Store size={14} className="text-[#FDB338]" />
                                <span className="text-white/90 text-[10px] font-bold uppercase tracking-widest">Vendor Partner Portal</span>
                            </div>
                            <h1 className="text-white font-heading font-black text-5xl leading-[1.1] tracking-tight mb-6">
                                Grow With <br /><span className="text-[#FDB338]">Magic Tours</span>
                            </h1>
                            <p className="text-white/70 text-base font-medium leading-relaxed max-w-sm">
                                Partner with one of the region's leading travel operators. List your services, reach thousands of travellers, and grow your business.
                            </p>
                        </div>

                        <div className="mt-10 space-y-4">
                            {[
                                'Access thousands of active travellers',
                                'Manage your packages from one dashboard',
                                'Real-time booking and enquiry tracking',
                            ].map((point) => (
                                <div key={point} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#FDB338]/20 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-[#FDB338]" />
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">{point}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#FDB338" className="text-[#FDB338]" />)}
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed italic mb-4 font-medium">
                                "Partnering with Magic Tours gave us access to a premium client base and a seamless platform to manage our offerings."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">VP</div>
                                <div className="text-white/60 text-xs font-bold uppercase tracking-wider">Verified Partner</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="w-full lg:w-[60%] bg-white py-20 px-6 md:px-12 lg:px-20 pt-[120px]">
                <div className="w-full max-w-2xl mx-auto">

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#113A74] text-sm font-bold mb-10 transition-colors bg-gray-50 px-5 py-2 rounded-xl w-fit border border-gray-100"
                    >
                        <ArrowLeft size={15} /> Back to Home
                    </Link>

                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="py-10"
                            >
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h2 className="text-4xl font-heading font-black text-[#113A74] tracking-tight mb-3">
                                    Application Submitted!
                                </h2>
                                <p className="text-gray-500 text-base font-medium max-w-md leading-relaxed mb-8">
                                    Thank you for registering as a vendor partner. Our team will review your application and activate your account. You'll be able to log in to the partner portal once approved.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-[#113A74] hover:bg-[#1a51a1] text-white rounded-xl px-8 py-3.5 font-heading font-black text-base transition-all shadow-lg shadow-[#113A74]/20"
                                >
                                    Back to Home <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-10">
                                    <h2 className="text-4xl font-heading font-black text-[#113A74] tracking-tight">Vendor Registration</h2>
                                    <p className="text-gray-500 text-base mt-2 font-medium">Fill in your details and our team will activate your account.</p>
                                </div>

                                {serverError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-[11px] font-bold uppercase text-center tracking-wider mb-6 flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck size={16} /> {serverError}
                                    </motion.div>
                                )}

                                <form onSubmit={formik.handleSubmit} className="space-y-12" noValidate>

                                    {/* Personal Info */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                            <User size={16} className="text-[#113A74]" />
                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Your Details</h3>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            <FormInput label="Full Name" icon={User} required formik={formik} name="name" placeholder="Your full name" />
                                            <FormInput label="Company Name" icon={Building2} required formik={formik} name="company_name" placeholder="Your company name" />
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            <FormInput label="Email Address" icon={Mail} type="email" required formik={formik} name="email" placeholder="business@example.com" />
                                            <div className="space-y-1.5 w-full">
                                                <label className={labelClass}>Phone Number <span className="text-[#FFA500]">*</span></label>
                                                <InternationalPhoneInput
                                                    value={formik.values.phone}
                                                    onChange={(val) => formik.setFieldValue('phone', val)}
                                                    onBlur={() => formik.setFieldTouched('phone', true)}
                                                    error={formik.touched.phone && formik.errors.phone}
                                                />
                                                <FieldError msg={formik.touched.phone && formik.errors.phone} />
                                            </div>
                                        </div>
                                        <FormInput label="Website" icon={Globe} formik={formik} name="website" placeholder="https://yoursite.com" />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                            <Lock size={16} className="text-[#113A74]" />
                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Set Password</h3>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            <PasswordField
                                                label="Password"
                                                formik={formik}
                                                name="password"
                                                show={showPassword}
                                                onToggle={() => setShowPassword(!showPassword)}
                                            />
                                            <PasswordField
                                                label="Confirm Password"
                                                formik={formik}
                                                name="confirm_password"
                                                show={showConfirm}
                                                onToggle={() => setShowConfirm(!showConfirm)}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={formik.isSubmitting}
                                            className="w-full bg-[#113A74] hover:bg-[#1a51a1] text-white rounded-xl py-3.5 px-8 font-heading font-black text-base transition-all shadow-lg shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 group"
                                        >
                                            {formik.isSubmitting ? (
                                                <Loader2 className="animate-spin" size={18} />
                                            ) : (
                                                <>
                                                    <span>Submit Application</span>
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-center text-gray-400 text-xs mt-5">
                                            Already have an account?{' '}
                                            <Link href="/login" className="text-[#113A74] font-bold hover:underline">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>

                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
