"use client";

export const runtime = 'edge';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, User, Phone, Eye, EyeOff, UserPlus, X, CheckCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InternationalPhoneInput from '../../components/common/InternationalPhoneInput';
import logo from '../../assets/logo.png';
import wingBg from '../../assets/Background (1).png';

const AuthPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { 
        login, register, forgotPassword, verifyOtp, resetPassword, user 
    } = useCustomerAuth();

    const initialView = searchParams.get('view') || 'login';
    const [view, setView] = useState(initialView);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/profile');
        }
    }, [user, router]);

    // Sync view with search params if they change
    useEffect(() => {
        const currentView = searchParams.get('view');
        if (currentView && (currentView === 'login' || currentView === 'register')) {
            setView(currentView);
        }
    }, [searchParams]);

    // Forgot Password Flow States
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Register State
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // Handle Login Submit
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const result = await login(loginEmail, loginPassword);
            if (result.success) {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser?.role === 'Admin') {
                    window.location.href = 'http://localhost:5173';
                } else {
                    router.push('/profile');
                }
            } else {
                setLoginError(result.error || 'Login failed');
            }
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setLoginLoading(false);
        }
    };

    // Handle Register Submit
    const registerValidationSchema = Yup.object().shape({
        name: Yup.string().min(2, 'Name must be at least 2 characters').required('Full Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone: Yup.string().matches(/^\+?[\d\s-]{7,20}$/, 'Invalid phone number format').required('Phone Number is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
    });

    const registerFormik = useFormik({
        initialValues: {
            name: '', email: '', phone: '', password: '', confirmPassword: ''
        },
        validationSchema: registerValidationSchema,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const { confirmPassword, ...payload } = values;
                const result = await register(payload);
                if (result.success) {
                    setRegisterSuccess(true);
                    setTimeout(() => {
                        setRegisterSuccess(false);
                        setView('login');
                    }, 3000);
                } else {
                    setStatus(result.error || 'Registration failed');
                }
            } catch (err) {
                setStatus(err.message || 'Registration failed');
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Handle Forgot Password Request
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotError('');
        try {
            const result = await forgotPassword(forgotEmail);
            if (result.success) {
                setView('verify-otp');
            } else {
                setForgotError(result.error);
            }
        } catch (err) {
            setForgotError(err.message);
        } finally {
            setForgotLoading(false);
        }
    };

    // Handle OTP Verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotError('');
        try {
            const result = await verifyOtp(forgotEmail, forgotOtp);
            if (result.success) {
                setView('reset-password');
            } else {
                setForgotError(result.error);
            }
        } catch (err) {
            setForgotError(err.message);
        } finally {
            setForgotLoading(false);
        }
    };

    // Reset Password Formik
    const resetPasswordFormik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required')
        }),
        onSubmit: async (values) => {
            setForgotLoading(true);
            setForgotError('');
            try {
                const result = await resetPassword({
                    email: forgotEmail,
                    otp: forgotOtp,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                });
                if (result.success) {
                    setForgotSuccess('Password reset successful! Redirecting to login...');
                    setTimeout(() => {
                        setForgotSuccess('');
                        setView('login');
                    }, 3000);
                } else {
                    setForgotError(result.error);
                }
            } catch (err) {
                setForgotError(err.message);
            } finally {
                setForgotLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen relative flex items-center justify-center pt-32 pb-20 px-4 bg-[#f0f4f8]">
            {/* Premium Layered Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                    src={wingBg.src || wingBg} 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-15 scale-110 blur-sm" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-[#f0f4f8]/80 to-slate-200/95"></div>
                {/* Subtle Luxury Accents */}
                <div className="absolute -top-32 -left-32 w-128 h-128 bg-[#FFA500]/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-32 -right-32 w-128 h-128 bg-[#113A74]/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/40 p-8 overflow-hidden relative">
                    
                    {/* Back to Home Link */}
                    <button 
                        onClick={() => router.push('/')}
                        className="absolute top-6 left-8 text-gray-400 hover:text-[#113A74] flex items-center gap-2 text-[10px] font-bold transition-all group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>

                    <AnimatePresence mode="wait">
                        {view === 'login' ? (
                            /* --- LOGIN VIEW --- */
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-6 mt-2">
                                    <div className="mb-4 flex items-center justify-center">
                                        <img src={logo.src || logo} alt="Magic Tours Logo" className="h-10 w-auto" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#113A74] tracking-tight mb-1">Welcome Back</h2>
                                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Please sign in to continue</p>
                                </div>

                                <form className="space-y-5" onSubmit={handleLogin}>
                                    {loginError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center tracking-wider">
                                            {loginError}
                                        </motion.div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3.5 pl-12 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                    placeholder="your@email.com"
                                                    value={loginEmail}
                                                    onChange={(e) => setLoginEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                <input
                                                    type={showLoginPassword ? "text" : "password"}
                                                    required
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3.5 pl-12 pr-12 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                    placeholder="••••••••"
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                />
                                                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#113A74] transition-colors">
                                                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pr-1">
                                        <button 
                                            type="button" 
                                            onClick={() => setView('forgot-password')}
                                            className="text-[11px] font-heading font-bold text-[#FFA500] hover:text-[#e69500] transition-colors tracking-wide"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loginLoading}
                                            className="w-full relative group bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-4 px-8 font-heading font-bold text-sm transition-all shadow-xl shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                        >
                                            {loginLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                                <>
                                                    <span>Sign In</span>
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center pt-6">
                                        <p className="text-sm font-medium text-gray-400">
                                            Don't have an account?
                                            <button type="button" onClick={() => setView('register')} className="ml-2 text-[#FFA500] hover:text-[#e69500] transition-colors font-heading font-bold hover:underline underline-offset-4">
                                                Register Now
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        ) : view === 'register' ? (
                            /* --- REGISTER VIEW --- */
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {registerSuccess ? (
                                    <div className="text-center py-10">
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle className="text-green-500" size={48} />
                                        </div>
                                        <h3 className="text-3xl font-black text-[#113A74] mb-3">Account Created!</h3>
                                        <p className="text-gray-500 text-base font-medium mb-10">
                                            Welcome to Magic Tours. Redirecting to login...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center mb-6 mt-2">
                                            <div className="mb-4 flex items-center justify-center">
                                                <img src={logo.src || logo} alt="Magic Tours Logo" className="h-10 w-auto" />
                                            </div>
                                            <h2 className="text-2xl font-black text-[#113A74] tracking-tight mb-1">Create Account</h2>
                                            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Join us for premium travel</p>
                                        </div>

                                        <form onSubmit={registerFormik.handleSubmit} className="space-y-4">
                                            {registerFormik.status && (
                                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center tracking-wider">
                                                    {registerFormik.status}
                                                </motion.div>
                                            )}

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Full Name<span className="text-red-500 ml-1">*</span></label>
                                                    <div className="relative group">
                                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3 pl-12 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                            placeholder="John Doe"
                                                            {...registerFormik.getFieldProps('name')}
                                                        />
                                                    </div>
                                                    {registerFormik.touched.name && registerFormik.errors.name && (
                                                        <div className="text-red-500 text-[10px] font-bold uppercase px-2">{registerFormik.errors.name}</div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Email Address<span className="text-red-500 ml-1">*</span></label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                        <input
                                                            type="email"
                                                            className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3 pl-12 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                            placeholder="your@email.com"
                                                            {...registerFormik.getFieldProps('email')}
                                                        />
                                                    </div>
                                                    {registerFormik.touched.email && registerFormik.errors.email && (
                                                        <div className="text-red-500 text-[10px] font-bold uppercase px-2">{registerFormik.errors.email}</div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Phone Number<span className="text-red-500 ml-1">*</span></label>
                                                    <InternationalPhoneInput
                                                        value={registerFormik.values.phone}
                                                        onChange={(val) => registerFormik.setFieldValue('phone', val)}
                                                        error={registerFormik.touched.phone && registerFormik.errors.phone}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Password<span className="text-red-500 ml-1">*</span></label>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                            <input
                                                                type={showRegisterPassword ? "text" : "password"}
                                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3 pl-12 pr-12 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                                placeholder="••••••••"
                                                                {...registerFormik.getFieldProps('password')}
                                                            />
                                                            <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#113A74] transition-colors">
                                                                {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Confirm<span className="text-red-500 ml-1">*</span></label>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                            <input
                                                                type={showRegisterConfirmPassword ? "text" : "password"}
                                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3 pl-12 pr-12 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                                placeholder="••••••••"
                                                                {...registerFormik.getFieldProps('confirmPassword')}
                                                            />
                                                            <button type="button" onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#113A74] transition-colors">
                                                                {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(registerFormik.errors.password || registerFormik.errors.confirmPassword) && (
                                                    <div className="text-red-500 text-[10px] font-bold uppercase px-2">
                                                        {registerFormik.errors.password || registerFormik.errors.confirmPassword}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={registerFormik.isSubmitting}
                                                    className="w-full relative group bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-4 px-8 font-heading font-bold text-sm transition-all shadow-xl shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                                >
                                                    {registerFormik.isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                                                        <>
                                                            <span>Create Account</span>
                                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="text-center pt-4">
                                                <p className="text-sm font-medium text-gray-400">
                                                    Already have an account?
                                                    <button type="button" onClick={() => setView('login')} className="ml-2 text-[#FFA500] hover:text-[#e69500] transition-colors font-heading font-bold hover:underline underline-offset-4">
                                                        Sign In
                                                    </button>
                                                </p>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        ) : view === 'forgot-password' ? (
                            /* --- FORGOT PASSWORD VIEW --- */
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-6 mt-2">
                                    <div className="mb-4 flex items-center justify-center">
                                        <img src={logo.src || logo} alt="Magic Tours Logo" className="h-10 w-auto" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#113A74] tracking-tight mb-1">Forgot Password</h2>
                                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Enter your email for OTP</p>
                                </div>

                                <form className="space-y-5" onSubmit={handleForgotPassword}>
                                    {forgotError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center tracking-wider">
                                            {forgotError}
                                        </motion.div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3.5 pl-12 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                placeholder="your@email.com"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className="w-full relative group bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-4 px-8 font-heading font-bold text-sm transition-all shadow-xl shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                        >
                                            {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                                <>
                                                    <span>Send OTP</span>
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center pt-6">
                                        <button type="button" onClick={() => setView('login')} className="text-sm font-heading font-bold text-gray-400 hover:text-[#113A74] transition-colors">
                                            Back to Login
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : view === 'verify-otp' ? (
                            /* --- VERIFY OTP VIEW --- */
                            <motion.div
                                key="verify-otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-6 mt-2">
                                    <div className="mb-4 flex items-center justify-center">
                                        <img src={logo.src || logo} alt="Magic Tours Logo" className="h-10 w-auto" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#113A74] tracking-tight mb-1">Verify OTP</h2>
                                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Enter code sent to email</p>
                                </div>

                                <form className="space-y-5" onSubmit={handleVerifyOtp}>
                                    {forgotError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center tracking-wider">
                                            {forgotError}
                                        </motion.div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Enter OTP</label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                maxLength={5}
                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3.5 pl-12 pr-6 outline-none transition-all text-sm font-bold text-center tracking-[1em] text-[#113A74] placeholder:text-gray-300"
                                                placeholder="00000"
                                                value={forgotOtp}
                                                onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className="w-full relative group bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-4 px-8 font-heading font-bold text-sm transition-all shadow-xl shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                        >
                                            {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                                <>
                                                    <span>Verify Code</span>
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center pt-6">
                                        <p className="text-sm font-medium text-gray-400">
                                            Didn't receive code?
                                            <button type="button" onClick={handleForgotPassword} className="ml-2 text-[#FFA500] hover:text-[#e69500] transition-colors font-heading font-bold hover:underline underline-offset-4">
                                                Resend Code
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        ) : view === 'reset-password' ? (
                            /* --- RESET PASSWORD VIEW --- */
                            <motion.div
                                key="reset-password"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-6 mt-2">
                                    <div className="mb-4 flex items-center justify-center">
                                        <img src={logo.src || logo} alt="Magic Tours Logo" className="h-10 w-auto" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#113A74] tracking-tight mb-1">New Password</h2>
                                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Create a secure new password</p>
                                </div>

                                <form className="space-y-4" onSubmit={resetPasswordFormik.handleSubmit}>
                                    {forgotError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center tracking-wider">
                                            {forgotError}
                                        </motion.div>
                                    )}
                                    {forgotSuccess && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center tracking-wider">
                                            {forgotSuccess}
                                        </motion.div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">New Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                <input
                                                    type={showResetPassword ? "text" : "password"}
                                                    name="password"
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3.5 pl-12 pr-12 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                    placeholder="••••••••"
                                                    {...resetPasswordFormik.getFieldProps('password')}
                                                />
                                                <button type="button" onClick={() => setShowResetPassword(!showResetPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#113A74] transition-colors">
                                                    {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {resetPasswordFormik.touched.password && resetPasswordFormik.errors.password && (
                                                <div className="text-red-500 text-[10px] font-bold uppercase px-2">{resetPasswordFormik.errors.password}</div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Confirm Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                <input
                                                    type={showResetConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-xl py-3.5 pl-12 pr-12 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                    placeholder="••••••••"
                                                    {...resetPasswordFormik.getFieldProps('confirmPassword')}
                                                />
                                                <button type="button" onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#113A74] transition-colors">
                                                    {showResetConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword && (
                                                <div className="text-red-500 text-[10px] font-bold uppercase px-2">{resetPasswordFormik.errors.confirmPassword}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={forgotLoading || forgotSuccess}
                                            className="w-full relative group bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-4 px-8 font-heading font-bold text-sm transition-all shadow-xl shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                        >
                                            {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                                <>
                                                    <span>Reset Password</span>
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A1D37] flex items-center justify-center text-white">Loading...</div>}>
            <AuthPageContent />
        </Suspense>
    );
}
