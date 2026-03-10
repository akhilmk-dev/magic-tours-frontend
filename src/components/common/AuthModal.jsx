"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, User, Phone, Eye, EyeOff, UserPlus, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AuthModal = () => {
    const { isAuthModalOpen, authModalView, openAuthModal, closeAuthModal, login, register } = useCustomerAuth();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Register State
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isAuthModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isAuthModalOpen]);

    // Handle Login Submit
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const result = await login(loginEmail, loginPassword);
            if (result.success) {
                closeAuthModal();
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser?.role === 'Admin') {
                    window.location.href = 'http://localhost:5173';
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
        phone: Yup.string().matches(/^\+?[\d\s-]+$/, 'Invalid phone number format').required('Phone Number is required'),
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
                        openAuthModal('login');
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

    return (
        <AnimatePresence>
            {isAuthModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center font-inter p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAuthModal}
                        className="absolute inset-0 bg-[#0A1D37]/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative z-10 w-full max-w-[450px]"
                    >
                        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 p-8 overflow-hidden relative">
                            {/* Close Button */}
                            <button
                                onClick={closeAuthModal}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
                            >
                                <X size={20} />
                            </button>

                            {authModalView === 'login' ? (
                                /* --- LOGIN VIEW --- */
                                <>
                                    <div className="text-center mb-6 mt-4">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-[#FFA500] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FFA500]/30">
                                            <ShieldCheck className="text-white" size={24} />
                                        </motion.div>
                                        <h2 className="text-2xl font-black text-[#113A74] tracking-tight mb-1">Welcome Back</h2>
                                        <p className="text-gray-500 text-xs font-medium">Please enter your details to sign in</p>
                                    </div>

                                    <form className="space-y-4" onSubmit={handleLogin}>
                                        {loginError && (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50/80 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center">
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
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
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
                                                        type="password"
                                                        required
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                        placeholder="••••••••"
                                                        value={loginPassword}
                                                        onChange={(e) => setLoginPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={loginLoading}
                                                className="w-full relative group bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-5 px-8 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                            >
                                                {loginLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                                    <>
                                                        <span>Sign In</span>
                                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="text-center pt-4">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Don't have an account?
                                                <button type="button" onClick={() => openAuthModal('register')} className="ml-2 text-[#FFA500] hover:text-[#e69500] transition-colors underline decoration-2 underline-offset-4">
                                                    Register Now
                                                </button>
                                            </p>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                /* --- REGISTER VIEW --- */
                                <AnimatePresence mode='wait'>
                                    {registerSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-8"
                                        >
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle className="text-green-500" size={40} />
                                            </div>
                                            <h3 className="text-2xl font-black text-[#113A74] mb-2">Account Created!</h3>
                                            <p className="text-gray-500 text-sm font-medium mb-8">
                                                Welcome to Magic Tours. Redirecting to login...
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar"
                                        >
                                            <div className="text-center mb-6 mt-4">
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-[#FFA500] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FFA500]/30">
                                                    <UserPlus className="text-white" size={24} />
                                                </motion.div>
                                                <h2 className="text-2xl font-black text-[#113A74] tracking-tight mb-1">Create Account</h2>
                                                <p className="text-gray-500 text-xs font-medium">Join us for premium travel experiences</p>
                                            </div>

                                            <form onSubmit={registerFormik.handleSubmit} className="space-y-4">
                                                {registerFormik.status && (
                                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50/80 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase text-center">
                                                        {registerFormik.status}
                                                    </motion.div>
                                                )}

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Full Name</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-3 pl-14 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                            placeholder="John Doe"
                                                            {...registerFormik.getFieldProps('name')}
                                                        />
                                                    </div>
                                                    {registerFormik.touched.name && registerFormik.errors.name && (
                                                        <div className="text-red-500 text-[10px] font-bold uppercase px-2">{registerFormik.errors.name}</div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Email Address</label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-3 pl-14 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                            placeholder="your@email.com"
                                                            {...registerFormik.getFieldProps('email')}
                                                        />
                                                    </div>
                                                    {registerFormik.touched.email && registerFormik.errors.email && (
                                                        <div className="text-red-500 text-[10px] font-bold uppercase px-2">{registerFormik.errors.email}</div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Phone Number</label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-3 pl-14 pr-6 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                            placeholder="+974 0000 0000"
                                                            {...registerFormik.getFieldProps('phone')}
                                                        />
                                                    </div>
                                                    {registerFormik.touched.phone && registerFormik.errors.phone && (
                                                        <div className="text-red-500 text-[10px] font-bold uppercase px-2">{registerFormik.errors.phone}</div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                        <input
                                                            type={showRegisterPassword ? "text" : "password"}
                                                            name="password"
                                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-3 pl-14 pr-12 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                            placeholder="••••••••"
                                                            {...registerFormik.getFieldProps('password')}
                                                        />
                                                        <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#113A74] transition-colors">
                                                            {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </div>
                                                    {registerFormik.touched.password && registerFormik.errors.password && (
                                                        <div className="text-red-500 text-[10px] font-bold uppercase px-2">{registerFormik.errors.password}</div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-[#113A74]/60 uppercase tracking-[0.2em] px-1">Confirm Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFA500] transition-colors" size={18} />
                                                        <input
                                                            type={showRegisterConfirmPassword ? "text" : "password"}
                                                            name="confirmPassword"
                                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-3 pl-14 pr-12 outline-none transition-all text-sm font-bold text-[#113A74] placeholder:text-gray-300"
                                                            placeholder="••••••••"
                                                            {...registerFormik.getFieldProps('confirmPassword')}
                                                        />
                                                        <button type="button" onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#113A74] transition-colors">
                                                            {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </div>
                                                    {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
                                                        <div className="text-red-500 text-[10px] font-bold uppercase px-2">{registerFormik.errors.confirmPassword}</div>
                                                    )}
                                                </div>

                                                <div className="pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={registerFormik.isSubmitting}
                                                        className="w-full relative group bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-4 px-8 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#113A74]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                                    >
                                                        {registerFormik.isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
                                                            <>
                                                                <span>Create Account</span>
                                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="text-center pt-2">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        Already have an account?
                                                        <button type="button" onClick={() => openAuthModal('login')} className="ml-2 text-[#FFA500] hover:text-[#e69500] transition-colors underline decoration-2 underline-offset-4">
                                                            Sign In
                                                        </button>
                                                    </p>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
