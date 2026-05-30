"use client";

export const runtime = 'edge';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, User, Eye, EyeOff, CheckCircle, ArrowLeft, Building2, UserCircle, Calendar, MapPin, Globe, Check, CreditCard, Plane, Star, Phone, Upload, X } from 'lucide-react';
import { api } from '../../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InternationalPhoneInput from '../../components/common/InternationalPhoneInput';
import Link from 'next/link';

// ── Shared style constants ──────────────────────────────────────────────────
const labelClass = "text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1";
const inputBase = "w-full bg-gray-50/50 border-2 border-gray-100 focus:border-[#FFA500]/40 focus:bg-white focus:ring-4 focus:ring-[#FFA500]/10 rounded-xl outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300";
const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors";

const PrimaryBtn = ({ label, loading, disabled, type="submit", onClick, icon: Icon = ArrowRight }) => (
    <button type={type} onClick={onClick} disabled={loading || disabled}
        className="w-full bg-[#113A74] hover:bg-[#1a51a1] text-white rounded-xl py-3.5 px-8 font-heading font-black text-base transition-all shadow-lg shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 group">
        {loading ? <Loader2 className="animate-spin" size={18} /> : (
            <><span>{label}</span><Icon size={18} className="group-hover:translate-x-1 transition-transform" /></>
        )}
    </button>
);

const ErrorBox = ({ msg }) => msg ? (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-[11px] font-bold uppercase text-center tracking-wider mb-6 flex items-center justify-center gap-2">
        <ShieldCheck size={16} /> {msg}
    </motion.div>
) : null;

const FieldError = ({ msg }) => msg ? <div className="text-red-500 text-[10px] font-bold uppercase px-2 mt-1.5">{msg}</div> : null;

const FormInput = ({ label, icon: Icon, required, formik, name, type = "text", placeholder, ...props }) => (
    <div className="space-y-1.5 w-full">
        <label className={labelClass}>{label} {required && <span className="text-[#FFA500]">*</span>}</label>
        <div className="relative group">
            {Icon && <Icon className={iconClass} size={18} />}
            <input type={type} placeholder={placeholder} className={`${inputBase} py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4`} {...formik.getFieldProps(name)} {...props} />
        </div>
        <FieldError msg={formik.touched[name] && formik.errors[name]} />
    </div>
);

const FormSelect = ({ label, icon: Icon, required, formik, name, options, ...props }) => (
    <div className="space-y-1.5 w-full">
        <label className={labelClass}>{label} {required && <span className="text-[#FFA500]">*</span>}</label>
        <div className="relative group">
            {Icon && <Icon className={iconClass} size={18} />}
            <select className={`${inputBase} py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-10 appearance-none`} {...formik.getFieldProps(name)} {...props}>
                <option value="">Select...</option>
                {options.map(opt => (
                    <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                ))}
            </select>
        </div>
        <FieldError msg={formik.touched[name] && formik.errors[name]} />
    </div>
);

const PasswordField = ({ label, value, show, onToggle, formikProps, error, placeholder = "••••••••" }) => (
    <div className="space-y-1.5 w-full">
        <label className={labelClass}>{label} <span className="text-[#FFA500]">*</span></label>
        <div className="relative group">
            <Lock className={iconClass} size={18} />
            <input type={show ? 'text' : 'password'} className={`${inputBase} py-3.5 pl-11 pr-12`} placeholder={placeholder} {...formikProps} />
            <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFA500] transition-colors">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
        <FieldError msg={error} />
    </div>
);

const MultiSelectTags = ({ label, options, formik, name }) => {
    const values = formik.values[name] || [];
    const toggle = (opt) => {
        if (values.includes(opt)) formik.setFieldValue(name, values.filter(v => v !== opt));
        else formik.setFieldValue(name, [...values, opt]);
    };
    return (
        <div className="space-y-2 col-span-full">
            <label className={labelClass}>{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button type="button" key={opt} onClick={() => toggle(opt)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${values.includes(opt) ? 'bg-[#113A74] border-[#113A74] text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-[#113A74]/30 hover:bg-gray-50'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            <FieldError msg={formik.touched[name] && formik.errors[name]} />
        </div>
    );
};

// ── Image Upload Component ──────────────────────────────────────────────────
const ImageUpload = ({ label, formik, name, required, circle = false }) => {
    const [uploading, setUploading] = React.useState(false);
    const value = formik.values[name];
    const error = formik.touched[name] && formik.errors[name];

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please upload an image file (JPG, PNG)'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); return; }
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        try {
            const response = await api.post('/upload/image', data);
            if (response?.url) formik.setFieldValue(name, response.url);
            else throw new Error('Upload failed - No URL returned');
        } catch (err) {
            console.error('Upload Error:', err);
            alert(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const previewEl = circle ? (
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#113A74]/20 shadow">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
    ) : (
        <div className="w-full h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
    );

    return (
        <div className="space-y-1.5 col-span-full">
            <label className={labelClass}>{label} {required && <span className="text-[#FFA500]">*</span>}</label>
            <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
                error ? 'border-red-300 bg-red-50' : uploading ? 'border-[#FFA500]/40 bg-[#FFA500]/5' : value ? 'border-[#113A74]/20 bg-[#113A74]/5' : 'border-gray-200 hover:border-[#FFA500]/40 hover:bg-gray-50'
            }`}>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" />

                {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 size={28} className="text-[#FFA500] animate-spin" />
                        <p className="text-sm font-bold text-gray-500">Uploading...</p>
                    </div>
                ) : value ? (
                    <div className="flex flex-col items-center gap-3">
                        {previewEl}
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); formik.setFieldValue(name, ''); }}
                            className="relative z-20 text-xs text-red-500 font-bold hover:underline flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-red-100">
                            <X size={12} /> Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                            error ? 'bg-red-100 text-red-500' : 'bg-gray-50 text-gray-400 group-hover:bg-[#FFA500]/10 group-hover:text-[#FFA500]'
                        }`}>
                            <Upload size={22} />
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${error ? 'text-red-600' : 'text-gray-700'}`}>Click to upload or drag & drop</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    </div>
                )}
            </div>
            <FieldError msg={error} />
        </div>
    );
};

// ── Validation Schemas ───────────────────────────────────────────────────────
const individualSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
    password: Yup.string().min(8, 'Min 8 chars').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
    address: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    date_of_birth: Yup.date().required('Required'),
    nationality: Yup.string().required('Required'),
    country_of_residence: Yup.string().required('Required'),
    passport_number: Yup.string().required('Required'),
    passport_issue_country: Yup.string().required('Required'),
    passport_issue_date: Yup.date().required('Required'),
    passport_expiry_date: Yup.date().required('Required'),
});

const corporateSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
    password: Yup.string().min(8, 'Min 8 chars').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
    address: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    company_name: Yup.string().required('Required'),
    trade_license_number: Yup.string().required('Required'),
    country_of_registration: Yup.string().required('Required'),
    contact_full_name: Yup.string().required('Required'),
    contact_email: Yup.string().email('Invalid').required('Required'),
    contact_mobile: Yup.string().required('Required'),
});

// ── Main Component ───────────────────────────────────────────────────────────
const AuthPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login, register, forgotPassword, verifyOtp, resendOtp, resetPassword, user } = useCustomerAuth();

    const [resendTimer, setResendTimer] = useState(0);
    const [view, setView] = useState(searchParams.get('view') || 'login');
    const [countryList, setCountryList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const [customerType, setCustomerType] = useState('individual');
    const [showLoginPw, setShowLoginPw] = useState(false);
    const [showRegPw, setShowRegPw] = useState(false);
    const [showRegConfirmPw, setShowRegConfirmPw] = useState(false);

    useEffect(() => {
        if (user) router.replace(searchParams.get('callback') || '/');
    }, [user, searchParams, router]);

    // Fetch countries for dropdowns
    useEffect(() => {
        fetch('https://api.magictours.qa/countries')
            .then(r => r.json())
            .then(d => { 
                if (d?.data) {
                    setCountryList(d.data.map(c => c.name).sort());
                } 
            }).catch(err => console.error("Failed to load countries:", err));
    }, []);

    // Fetch cities for dropdowns
    useEffect(() => {
        api.get('/cities')
            .then(d => {
                if (Array.isArray(d)) {
                    setCityList(d.map(c => c.name).sort());
                } else if (d?.data && Array.isArray(d.data)) {
                    setCityList(d.data.map(c => c.name).sort());
                }
            }).catch(err => console.error("Failed to load cities:", err));
    }, []);

    useEffect(() => {
        const v = searchParams.get('view');
        if (v && ['login', 'register'].includes(v)) setView(v);
    }, [searchParams]);

    useEffect(() => {
        let t = null;
        if (resendTimer > 0) t = setInterval(() => setResendTimer(p => p - 1), 1000);
        return () => { if (t) clearInterval(t); };
    }, [resendTimer]);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [showResetPw, setShowResetPw] = useState(false);
    const [showResetConfirmPw, setShowResetConfirmPw] = useState(false);

    const [registerSuccess, setRegisterSuccess] = useState(false);
    const isSubFlow = ['forgot-password', 'verify-otp', 'reset-password'].includes(view);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true); setLoginError('');
        try {
            const result = await login(loginEmail, loginPassword);
            if (result.success) {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser?.role === 'Admin') { window.location.href = 'http://localhost:5173'; }
                else router.replace(searchParams.get('callback') || '/');
            } else setLoginError(result.error || 'Login failed');
        } catch (err) { setLoginError(err.message); }
        finally { setLoginLoading(false); }
    };

    const registerFormik = useFormik({
        initialValues: {
            name: '', email: '', password: '', confirmPassword: '', phone: '', address: '', city: '', country: '',
            gender: '', date_of_birth: '', nationality: '', country_of_residence: '',
            whatsapp: '', preferred_contact: 'email',
            passport_number: '', passport_issue_country: '', passport_issue_date: '', passport_expiry_date: '', passport_url: '', profile_image: '',
            preferred_departure_airport: '', preferred_travel_class: '', preferred_hotel_category: '',
            preferred_destinations: [], travel_interests: [], meal_preference: '', special_assistance: '', frequent_flyer_number: '',
            frequent_flyers: [{ airline: '', membership_number: '' }],
            marketing_consent: true,
            company_name: '', trade_name: '', trade_license_number: '', tax_vat_number: '', industry: '', website: '',
            country_of_registration: '', company_address: '',
            contact_full_name: '', contact_designation: '', contact_mobile: '', contact_email: '', contact_whatsapp: '', contact_preferred_method: 'email',
            accounts_contact_name: '', accounts_email: '', accounts_mobile: '', billing_address: '',
            payment_terms_required: '', purchase_order_required: false, services_required: [], main_destinations: [],
            estimated_monthly_volume: '', estimated_annual_spend: '', num_travellers: '',
            logo_url: '', trade_license_url: '', tax_certificate_url: '', company_id_url: '', signatory_id_url: '', po_format_url: '', travel_policy_url: '',
        },
        validationSchema: customerType === 'individual' ? individualSchema : corporateSchema,
        validateOnMount: false,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const payload = {
                    name: values.name, email: values.email, password: values.password,
                    phone: values.phone, address: values.address, customer_type: customerType,
                };

                if (customerType === 'individual') {
                    payload.status = 'Active';
                    payload.individual_profile = {
                        full_name: values.name, gender: values.gender, date_of_birth: values.date_of_birth,
                        nationality: values.nationality, country_of_residence: values.country_of_residence,
                        mobile: values.phone, whatsapp: values.whatsapp || values.phone,
                        address: values.address, city: values.city, country: values.country,
                        preferred_contact: values.preferred_contact, passport_number: values.passport_number,
                        passport_issue_country: values.passport_issue_country,
                        passport_issue_date: values.passport_issue_date,
                        passport_expiry_date: values.passport_expiry_date,
                        passport_url: values.passport_url,
                        profile_image: values.profile_image,
                        preferred_departure_airport: values.preferred_departure_airport,
                        preferred_travel_class: values.preferred_travel_class,
                        preferred_hotel_category: values.preferred_hotel_category,
                        preferred_destinations: values.preferred_destinations,
                        travel_interests: values.travel_interests.map(i => i.toLowerCase()), meal_preference: values.meal_preference,
                        special_assistance: values.special_assistance,
                        marketing_consent: values.marketing_consent,
                    };
                    payload.frequent_flyer = values.frequent_flyers.filter(ff => ff.airline.trim() && ff.membership_number.trim());
                } else {
                    payload.corporate_profile = {
                        registered_company_name: values.company_name, trade_name: values.trade_name,
                        trade_license_number: values.trade_license_number, tax_vat_number: values.tax_vat_number,
                        industry: values.industry, website: values.website,
                        country_of_registration: values.country_of_registration,
                        company_address: values.company_address || values.address, city: values.city, country: values.country,
                        contact_full_name: values.contact_full_name || values.name,
                        contact_designation: values.contact_designation,
                        contact_mobile: values.contact_mobile || values.phone,
                        contact_email: values.contact_email || values.email,
                        contact_whatsapp: values.contact_whatsapp, contact_preferred_method: values.contact_preferred_method,
                        accounts_contact_name: values.accounts_contact_name, accounts_email: values.accounts_email,
                        accounts_mobile: values.accounts_mobile, billing_address: values.billing_address,
                        payment_terms_required: values.payment_terms_required, purchase_order_required: values.purchase_order_required,
                        services_required: values.services_required.map(s => s.toLowerCase()), main_destinations: values.main_destinations,
                        estimated_monthly_volume: values.estimated_monthly_volume, estimated_annual_spend: values.estimated_annual_spend,
                        num_travellers: values.num_travellers, marketing_consent: values.marketing_consent,
                        logo_url: values.logo_url,
                        trade_license_url: values.trade_license_url,
                        tax_certificate_url: values.tax_certificate_url,
                        company_id_url: values.company_id_url,
                        signatory_id_url: values.signatory_id_url,
                        po_format_url: values.po_format_url,
                        travel_policy_url: values.travel_policy_url,
                    };
                }

                const result = await register(payload);
                if (result.success) {
                    setRegisterSuccess(true);
                    setTimeout(() => { setRegisterSuccess(false); registerFormik.resetForm(); setView('login'); window.scrollTo(0,0); }, 3000);
                } else setStatus(result.error || 'Registration failed');
            } catch (err) { setStatus(err.message || 'Registration failed'); }
            finally { setSubmitting(false); }
        }
    });

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(forgotEmail)) {
            setForgotError('Please enter a valid email address'); return;
        }
        setForgotLoading(true); setForgotError('');
        try {
            const result = await forgotPassword(forgotEmail);
            if (result.success) { setResendTimer(30); setView('verify-otp'); }
            else setForgotError(result.error);
        } catch (err) { setForgotError(err.message); }
        finally { setForgotLoading(false); }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0 || forgotLoading) return;
        setForgotLoading(true); setForgotError('');
        try {
            const result = await resendOtp(forgotEmail);
            if (result.success) setResendTimer(30); else setForgotError(result.error);
        } catch (err) { setForgotError(err.message); }
        finally { setForgotLoading(false); }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (forgotOtp.length !== 6) { setForgotError('Enter a valid 6-digit OTP'); return; }
        setForgotLoading(true); setForgotError('');
        try {
            const result = await verifyOtp(forgotEmail, forgotOtp);
            if (result.success) setView('reset-password'); else setForgotError(result.error);
        } catch (err) { setForgotError(err.message); }
        finally { setForgotLoading(false); }
    };
    
    const resetPasswordFormik = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            password: Yup.string().min(8, 'Min 8 characters').required('Required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
        }),
        onSubmit: async (values) => {
            setForgotLoading(true); setForgotError('');
            try {
                const result = await resetPassword({ email: forgotEmail, otp: forgotOtp, ...values });
                if (result.success) {
                    setForgotSuccess('Password reset! Redirecting to sign in...');
                    setTimeout(() => { setForgotSuccess(''); setForgotEmail(''); setForgotOtp(''); resetPasswordFormik.resetForm(); setView('login'); }, 3000);
                } else setForgotError(result.error);
            } catch (err) { setForgotError(err.message); }
            finally { setForgotLoading(false); }
        }
    });

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white">
            
            {/* ── Left Decorative Panel (Edge-to-Edge) ── */}
            <div className="w-full lg:w-[40%] bg-[#113A74] relative">
                <div className="sticky top-0 h-screen flex flex-col justify-center px-10 md:px-16 lg:px-20 pt-[80px] overflow-hidden">
                    
                    {/* Abstract Shapes */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-[#FDB338]/10 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-12 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 w-full max-w-md">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/5">
                                <Plane size={14} className="text-[#FDB338]" />
                                <span className="text-white/90 text-[10px] font-bold uppercase tracking-widest">Premium Travel</span>
                            </div>
                            <h1 className="text-white font-heading font-black text-5xl leading-[1.1] tracking-tight mb-6">
                                Discover the <br/><span className="text-[#FDB338]">Extraordinary</span>
                            </h1>
                            <p className="text-white/70 text-base font-medium leading-relaxed max-w-sm">
                                Join the world's most exclusive travel network. Experience luxury without compromise.
                            </p>
                        </div>

                        <div className="mt-16 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <div className="flex gap-1 mb-4">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FDB338" className="text-[#FDB338]" />)}
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed italic mb-4 font-medium">
                                "The seamless booking and white-glove service completely redefined our corporate travel."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">JD</div>
                                <div className="text-white/60 text-xs font-bold uppercase tracking-wider">Corporate Client</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Form Panel (Edge-to-Edge) ── */}
            <div className="w-full lg:w-[60%] bg-white py-20 px-6 md:px-12 lg:px-20 pt-[120px]">
                
                <div className="w-full max-w-2xl mx-auto">
                    {/* ── Toggle Header ── */}
                    {!isSubFlow && (
                        <div className="flex bg-gray-50 p-1.5 rounded-xl mb-12 border border-gray-100 max-w-[320px]">
                            {['login','register'].map(v => (
                                <button key={v} type="button" onClick={() => { setView(v); registerFormik.resetForm(); }}
                                    className={`flex-1 py-3 rounded-lg text-sm font-heading font-bold transition-all duration-300 ${view === v ? 'bg-white text-[#113A74] shadow-sm border border-gray-200/60' : 'text-gray-400 hover:text-gray-600'}`}>
                                    {v === 'login' ? 'Sign In' : 'Register'}
                                </button>
                            ))}
                        </div>
                    )}

                    {isSubFlow && (
                        <button type="button" onClick={() => setView('login')}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#113A74] text-sm font-bold mb-10 transition-colors bg-gray-50 px-5 py-2 rounded-xl w-fit border border-gray-100">
                            <ArrowLeft size={15} /> Back to Sign In
                        </button>
                    )}

                    <AnimatePresence mode="wait">
                        
                        {/* ── LOGIN ── */}
                        {view === 'login' && (
                            <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-md">
                                <div className="mb-10">
                                    <h2 className="text-4xl font-heading font-black text-[#113A74] tracking-tight">Welcome Back</h2>
                                    <p className="text-gray-500 text-base mt-2 font-medium">Please enter your details to sign in.</p>
                                </div>
                                
                                <form className="space-y-6" onSubmit={handleLogin}>
                                    <ErrorBox msg={loginError} />
                                    
                                    <FormInput label="Email Address" icon={Mail} type="email" required formik={registerFormik} name="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                                    
                                    <div className="space-y-1.5 w-full">
                                        <div className="flex justify-between items-center px-1">
                                            <label className={labelClass}>Password</label>
                                            <button type="button" onClick={() => setView('forgot-password')} className="text-[10px] font-bold text-[#FFA500] hover:text-[#e69500] uppercase tracking-wider transition-colors">Forgot Password?</button>
                                        </div>
                                        <div className="relative group">
                                            <Lock className={iconClass} size={18} />
                                            <input type={showLoginPw ? 'text' : 'password'} required className={`${inputBase} py-3.5 pl-11 pr-12`} placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                                            <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFA500] transition-colors"><Eye size={18} /></button>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4"><PrimaryBtn label="Secure Sign In" loading={loginLoading} /></div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── REGISTER ── */}
                        {view === 'register' && (
                            <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                {registerSuccess ? (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="text-green-500" size={40} /></div>
                                        <h3 className="text-3xl font-heading font-black text-[#113A74] mb-3">Account Created!</h3>
                                        <p className="text-gray-500 text-base font-medium">Welcome to Magic Tours. Redirecting you...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-10">
                                            <h2 className="text-4xl font-heading font-black text-[#113A74] tracking-tight">Create an Account</h2>
                                            <p className="text-gray-500 text-base mt-2 font-medium">Unlock exclusive travel experiences and rates.</p>
                                        </div>

                                        <div className="flex gap-4 mb-10 max-w-[500px]">
                                            <button type="button" onClick={() => { setCustomerType('individual'); registerFormik.resetForm(); }}
                                                className={`flex-1 flex flex-col items-center justify-center py-5 rounded-2xl border-2 transition-all duration-300 ${customerType === 'individual' ? 'border-[#113A74] bg-[#113A74]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}>
                                                <UserCircle size={28} className={`mb-2 ${customerType === 'individual' ? 'text-[#113A74]' : 'text-gray-400'}`} />
                                                <span className={`text-xs font-black uppercase tracking-widest ${customerType === 'individual' ? 'text-[#113A74]' : 'text-gray-500'}`}>Individual</span>
                                            </button>
                                            <button type="button" onClick={() => { setCustomerType('corporate'); registerFormik.resetForm(); }}
                                                className={`flex-1 flex flex-col items-center justify-center py-5 rounded-2xl border-2 transition-all duration-300 ${customerType === 'corporate' ? 'border-[#113A74] bg-[#113A74]/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}>
                                                <Building2 size={28} className={`mb-2 ${customerType === 'corporate' ? 'text-[#113A74]' : 'text-gray-400'}`} />
                                                <span className={`text-xs font-black uppercase tracking-widest ${customerType === 'corporate' ? 'text-[#113A74]' : 'text-gray-500'}`}>Corporate</span>
                                            </button>
                                        </div>

                                        <form onSubmit={registerFormik.handleSubmit} className="space-y-12">
                                            <ErrorBox msg={registerFormik.status} />

                                            {/* BASIC INFO */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                                    <User size={16} className="text-[#113A74]" />
                                                    <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Account Details</h3>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                    <FormInput label="Account Name" icon={User} required formik={registerFormik} name="name" />
                                                    <FormInput label="Email Address" icon={Mail} type="email" required formik={registerFormik} name="email" />
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                    <div className="space-y-1.5 w-full">
                                                        <label className={labelClass}>Primary Phone <span className="text-[#FFA500]">*</span></label>
                                                        <InternationalPhoneInput value={registerFormik.values.phone} onChange={v => registerFormik.setFieldValue('phone', v)} error={registerFormik.touched.phone && registerFormik.errors.phone} />
                                                    </div>
                                                    <div className="space-y-1.5 w-full">
                                                        <label className={labelClass}>WhatsApp Number</label>
                                                        <InternationalPhoneInput value={registerFormik.values.whatsapp} onChange={v => registerFormik.setFieldValue('whatsapp', v)} error={registerFormik.touched.whatsapp && registerFormik.errors.whatsapp} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                    <FormSelect label="City" icon={MapPin} required formik={registerFormik} name="city" options={cityList} />
                                                    <FormSelect label="Country" icon={Globe} required formik={registerFormik} name="country" options={countryList} />
                                                </div>
                                                <FormInput label="Main Address" icon={MapPin} required formik={registerFormik} name="address" />
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                    <PasswordField label="Password" value={registerFormik.values.password} show={showRegPw} onToggle={() => setShowRegPw(!showRegPw)} formikProps={registerFormik.getFieldProps('password')} error={registerFormik.touched.password && registerFormik.errors.password} />
                                                    <PasswordField label="Confirm Password" value={registerFormik.values.confirmPassword} show={showRegConfirmPw} onToggle={() => setShowRegConfirmPw(!showRegConfirmPw)} formikProps={registerFormik.getFieldProps('confirmPassword')} error={registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword} />
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                    <FormSelect label="Preferred Contact Method" icon={Phone} formik={registerFormik} name="preferred_contact" options={[{label:'Email',value:'email'},{label:'WhatsApp',value:'whatsapp'},{label:'Phone',value:'phone'}]} />
                                                </div>
                                            </div>

                                            {/* INDIVIDUAL SECTION */}
                                            {customerType === 'individual' && (
                                                <>
                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                                            <ShieldCheck size={16} className="text-[#113A74]" />
                                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Personal & Passport Details</h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <FormSelect label="Gender" icon={User} required formik={registerFormik} name="gender" options={['Male','Female','Other']} />
                                                            <FormInput label="Date of Birth" icon={Calendar} type="date" required formik={registerFormik} name="date_of_birth" />
                                                            <FormSelect label="Nationality" icon={Globe} required formik={registerFormik} name="nationality" options={countryList} />
                                                            <FormSelect label="Country of Residence" icon={MapPin} required formik={registerFormik} name="country_of_residence" options={countryList} />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                                                            <FormInput label="Passport Number" icon={ShieldCheck} required formik={registerFormik} name="passport_number" />
                                                            <FormSelect label="Passport Issue Country" icon={Globe} required formik={registerFormik} name="passport_issue_country" options={countryList} />
                                                            <FormInput label="Passport Issue Date" icon={Calendar} type="date" required formik={registerFormik} name="passport_issue_date" />
                                                            <FormInput label="Passport Expiry Date" icon={Calendar} type="date" required formik={registerFormik} name="passport_expiry_date" />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                                                            <ImageUpload label="Passport Copy" formik={registerFormik} name="passport_url" />
                                                            <ImageUpload label="Profile Photo" formik={registerFormik} name="profile_image" circle />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                                            <Plane size={16} className="text-[#113A74]" />
                                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Travel & Luxury Preferences</h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <FormSelect label="Flight Class" formik={registerFormik} name="preferred_travel_class" options={['Economy','Premium Economy','Business','First Class']} />
                                                            <FormInput label="Preferred Departure Airport" icon={Plane} formik={registerFormik} name="preferred_departure_airport" placeholder="e.g. DXB, LHR" />
                                                            <FormSelect label="Hotel Category" formik={registerFormik} name="preferred_hotel_category" options={['3 Star','4 Star','5 Star','Luxury/Boutique']} />
                                                            <FormInput label="Special Meal Request" icon={Check} formik={registerFormik} name="meal_preference" placeholder="e.g. Vegetarian, Halal" />
                                                            <FormInput label="Special Assistance Needed" icon={Check} formik={registerFormik} name="special_assistance" placeholder="e.g. Wheelchair, None" />
                                                        </div>
                                                        
                                                        <div className="mt-4 p-5 bg-gray-50/50 rounded-xl border border-gray-100">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Frequent Flyer Memberships (Optional)</h4>
                                                                <button type="button" onClick={() => registerFormik.setFieldValue('frequent_flyers', [...registerFormik.values.frequent_flyers, { airline: '', membership_number: '' }])}
                                                                    className="text-xs text-[#FFA500] font-bold hover:underline flex items-center gap-1">
                                                                    + Add Airline
                                                                </button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                {registerFormik.values.frequent_flyers.map((item, index) => (
                                                                    <div key={index} className="flex gap-3 items-end">
                                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                            <div className="space-y-1">
                                                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Airline</label>
                                                                                <input type="text" placeholder="e.g. Emirates" className={`${inputBase} py-2.5 px-4`}
                                                                                    value={item.airline} onChange={e => {
                                                                                        const updated = [...registerFormik.values.frequent_flyers];
                                                                                        updated[index].airline = e.target.value;
                                                                                        registerFormik.setFieldValue('frequent_flyers', updated);
                                                                                    }} />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Membership Number</label>
                                                                                <input type="text" placeholder="e.g. EK123456" className={`${inputBase} py-2.5 px-4`}
                                                                                    value={item.membership_number} onChange={e => {
                                                                                        const updated = [...registerFormik.values.frequent_flyers];
                                                                                        updated[index].membership_number = e.target.value;
                                                                                        registerFormik.setFieldValue('frequent_flyers', updated);
                                                                                    }} />
                                                                            </div>
                                                                        </div>
                                                                        {registerFormik.values.frequent_flyers.length > 1 && (
                                                                            <button type="button" onClick={() => registerFormik.setFieldValue('frequent_flyers', registerFormik.values.frequent_flyers.filter((_, i) => i !== index))}
                                                                                className="text-red-500 hover:text-red-700 font-bold text-xs pb-3">
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <MultiSelectTags label="Preferred Destinations (Select multiple)" formik={registerFormik} name="preferred_destinations" options={['London','New York','Paris','Dubai','Singapore','Tokyo','Sydney','Bangkok']} />
                                                        <MultiSelectTags label="Travel Interests (Select multiple)" formik={registerFormik} name="travel_interests" options={['Adventure','Beach','Culture & History','Relaxation','Nature','Wildlife Safari','City Breaks','Food & Wine']} />
                                                    </div>
                                                </>
                                            )}

                                            {/* CORPORATE SECTION */}
                                            {customerType === 'corporate' && (
                                                <>
                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                                            <Building2 size={16} className="text-[#113A74]" />
                                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Company Registry</h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <FormInput label="Registered Name" icon={Building2} required formik={registerFormik} name="company_name" />
                                                            <FormInput label="Trade Name" icon={Building2} formik={registerFormik} name="trade_name" />
                                                            <FormInput label="Trade License Number" required formik={registerFormik} name="trade_license_number" />
                                                            <FormInput label="Tax/VAT Number" formik={registerFormik} name="tax_vat_number" />
                                                            <FormSelect label="Industry Sector" formik={registerFormik} name="industry" options={['Hospitality','Oil & Gas','Banking & Finance','Healthcare','Technology','Real Estate','Education','Government','Retail','Manufacturing','Media & Entertainment','Other']} />
                                                            <FormSelect label="Registration Country" icon={Globe} required formik={registerFormik} name="country_of_registration" options={countryList} />
                                                            <FormInput label="Company Website" icon={Globe} formik={registerFormik} name="website" />
                                                            <FormInput label="Company Address" icon={MapPin} formik={registerFormik} name="company_address" placeholder="Office address" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                                            <UserCircle size={16} className="text-[#113A74]" />
                                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Key Contacts</h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <FormInput label="Primary Contact Name" required formik={registerFormik} name="contact_full_name" />
                                                            <FormInput label="Designation / Role" formik={registerFormik} name="contact_designation" />
                                                            <FormInput label="Direct Email" type="email" required formik={registerFormik} name="contact_email" />
                                                            <FormInput label="Direct Mobile" required formik={registerFormik} name="contact_mobile" />
                                                            <div className="space-y-1.5 w-full">
                                                                <label className={labelClass}>Contact WhatsApp</label>
                                                                <InternationalPhoneInput value={registerFormik.values.contact_whatsapp} onChange={v => registerFormik.setFieldValue('contact_whatsapp', v)} error={registerFormik.touched.contact_whatsapp && registerFormik.errors.contact_whatsapp} />
                                                            </div>
                                                            <FormSelect label="Preferred Contact Method" icon={Phone} formik={registerFormik} name="contact_preferred_method" options={[{label:'Email',value:'email'},{label:'WhatsApp',value:'whatsapp'},{label:'Phone',value:'phone'}]} />
                                                        </div>
                                                        
                                                        <div className="mt-4 p-5 bg-gray-50/50 rounded-xl border border-gray-100">
                                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Accounts & Billing Department (Optional)</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <FormInput label="Contact Name" formik={registerFormik} name="accounts_contact_name" />
                                                                <FormInput label="Email Address" type="email" formik={registerFormik} name="accounts_email" />
                                                                <FormInput label="Mobile Number" formik={registerFormik} name="accounts_mobile" />
                                                                <FormInput label="Billing Address" icon={MapPin} formik={registerFormik} name="billing_address" placeholder="Billing address" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                                            <ShieldCheck size={16} className="text-[#113A74]" />
                                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Company Documents & Uploads</h3>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <ImageUpload label="Company Logo" formik={registerFormik} name="logo_url" circle />
                                                            <ImageUpload label="Trade License Document" formik={registerFormik} name="trade_license_url" />
                                                            <ImageUpload label="Tax Certificate" formik={registerFormik} name="tax_certificate_url" />
                                                            <ImageUpload label="Company ID Document" formik={registerFormik} name="company_id_url" />
                                                            <ImageUpload label="Signatory ID Card" formik={registerFormik} name="signatory_id_url" />
                                                            <ImageUpload label="Purchase Order Format Copy" formik={registerFormik} name="po_format_url" />
                                                            <ImageUpload label="Company Travel Policy" formik={registerFormik} name="travel_policy_url" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                                            <CreditCard size={16} className="text-[#113A74]" />
                                                            <h3 className="text-xs font-black text-[#113A74] uppercase tracking-widest">Volume & Requirements</h3>
                                                        </div>
                                                        <MultiSelectTags label="Required Corporate Services" formik={registerFormik} name="services_required" options={['Flights','Hotels','Visas','Transfers','Corporate Events','MICE']} />
                                                        <MultiSelectTags label="Main Destinations" formik={registerFormik} name="main_destinations" options={['London','New York','Paris','Dubai','Singapore','Tokyo','Sydney','Bangkok']} />
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                                                            <FormInput label="Est. Monthly Volume" formik={registerFormik} name="estimated_monthly_volume" placeholder="e.g. 10-20 bookings" />
                                                            <FormSelect label="Est. Annual Spend" formik={registerFormik} name="estimated_annual_spend" options={['Under $50k','$50k - $100k','$100k - $500k','$500k+']} />
                                                            <FormInput label="Active Travellers" type="number" formik={registerFormik} name="num_travellers" />
                                                            <FormSelect label="Requested Payment Terms" formik={registerFormik} name="payment_terms_required" options={['Prepaid','15 Days','30 Days','45 Days']} />
                                                        </div>
                                                        <label className="flex items-center gap-3 cursor-pointer mt-4">
                                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#113A74] focus:ring-[#113A74]" {...registerFormik.getFieldProps('purchase_order_required')} checked={registerFormik.values.purchase_order_required} />
                                                            <span className="text-sm font-bold text-gray-700">Strict Purchase Order (PO) required for all bookings</span>
                                                        </label>
                                                        <label className="flex items-center gap-3 cursor-pointer mt-2">
                                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#113A74] focus:ring-[#113A74]" checked={registerFormik.values.marketing_consent} onChange={e => registerFormik.setFieldValue('marketing_consent', e.target.checked)} />
                                                            <span className="text-sm font-bold text-gray-700">I consent to receive marketing communications</span>
                                                        </label>
                                                    </div>
                                                </>
                                            )}

                                            <div className="pt-8">
                                                <PrimaryBtn label="Complete Registration" loading={registerFormik.isSubmitting} icon={CheckCircle} />
                                            </div>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        )}

                        {/* ── FORGOT PASSWORD ── */}
                        {view === 'forgot-password' && (
                            <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-md">
                                <div className="mb-10">
                                    <h2 className="text-4xl font-heading font-black text-[#113A74] tracking-tight">Forgot Password</h2>
                                    <p className="text-gray-500 text-base mt-2 font-medium">Enter your email and we'll send you an OTP</p>
                                </div>
                                <form className="space-y-6" onSubmit={handleForgotPassword}>
                                    <ErrorBox msg={forgotError} />
                                    <FormInput label="Email Address" icon={Mail} type="email" required formik={{getFieldProps: () => ({})}} name="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                                    <div className="pt-4"><PrimaryBtn label="Send Recovery Code" loading={forgotLoading} /></div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── VERIFY OTP ── */}
                        {view === 'verify-otp' && (
                            <motion.div key="verify-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-md">
                                <div className="mb-10">
                                    <h2 className="text-4xl font-heading font-black text-[#113A74] tracking-tight">Verify Identity</h2>
                                    <p className="text-gray-500 text-base mt-2 font-medium">
                                        6-digit code sent to <span className="text-[#113A74] font-black">{forgotEmail}</span>
                                    </p>
                                </div>
                                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                                    <ErrorBox msg={forgotError} />
                                    <div className="space-y-1.5 w-full">
                                        <label className={labelClass}>Enter OTP Code</label>
                                        <div className="relative group">
                                            <ShieldCheck className={iconClass} size={18} />
                                            <input type="text" required minLength={6} maxLength={6}
                                                className={`${inputBase} py-4 pl-12 pr-4 text-center tracking-[1em] text-2xl font-black`}
                                                placeholder="000000" value={forgotOtp} onChange={e => setForgotOtp(e.target.value.replace(/\D/g, ''))} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        <PrimaryBtn label="Verify Code" loading={forgotLoading} />
                                        <button type="button" onClick={handleResendOtp} disabled={forgotLoading || resendTimer > 0}
                                            className="w-full bg-gray-50 border border-gray-200 hover:border-[#FFA500] hover:bg-white hover:text-[#FFA500] text-gray-500 rounded-xl py-3.5 px-8 font-heading font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                            {forgotLoading ? <Loader2 className="animate-spin" size={16} /> : 'Resend Code'}
                                            {resendTimer > 0 && <span className="text-[11px] font-black">({resendTimer}s)</span>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── RESET PASSWORD ── */}
                        {view === 'reset-password' && (
                            <motion.div key="reset-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-md">
                                <div className="mb-10">
                                    <h2 className="text-4xl font-heading font-black text-[#113A74] tracking-tight">New Password</h2>
                                    <p className="text-gray-500 text-base mt-2 font-medium">Create a new secure password</p>
                                </div>
                                <form className="space-y-6" onSubmit={resetPasswordFormik.handleSubmit}>
                                    <ErrorBox msg={forgotError} />
                                    {forgotSuccess && (
                                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-[11px] font-bold uppercase text-center mb-6">
                                            {forgotSuccess}
                                        </motion.div>
                                    )}
                                    <PasswordField label="New Password" value={resetPasswordFormik.values.password} show={showResetPw} onToggle={() => setShowResetPw(!showResetPw)} formikProps={resetPasswordFormik.getFieldProps('password')} />
                                    <FieldError msg={resetPasswordFormik.touched.password && resetPasswordFormik.errors.password} />
                                    <PasswordField label="Confirm New Password" value={resetPasswordFormik.values.confirmPassword} show={showResetConfirmPw} onToggle={() => setShowResetConfirmPw(!showResetConfirmPw)} formikProps={resetPasswordFormik.getFieldProps('confirmPassword')} />
                                    <FieldError msg={resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword} />
                                    <div className="pt-4"><PrimaryBtn label="Reset Password" loading={forgotLoading} disabled={!!forgotSuccess} /></div>
                                </form>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#113A74]" /></div>}>
            <AuthPageContent />
        </Suspense>
    );
}
