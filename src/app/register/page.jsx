"use client";
import React, { useState } from 'react';
import { api } from '../../api/client';
import { Mail, Lock, User, Phone, MapPin, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Name must be at least 2 characters')
            .required('Full Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        phone: Yup.string()
            .matches(/^\+?[\d\s-]+$/, 'Invalid phone number format')
            .required('Phone Number is required'),
        address: Yup.string()
            .optional(),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                // Exclude confirmPassword from API payload
                const { confirmPassword, ...payload } = values;
                await api.post('/customers/register', payload);
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } catch (err) {
                setStatus(err.message || 'Registration failed');
            } finally {
                setSubmitting(false);
            }
        }
    });

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User size={40} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-secondary">Account Created!</h2>
                    <p className="mt-2 text-gray-600">Your account has been successfully created. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary">
                        Create Your Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join Magic Tours and start your journey today.
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={formik.handleSubmit}>
                    {formik.status && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-bold">
                            {formik.status}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name */}
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="name"
                                type="text"
                                className={`appearance-none relative block w-full px-10 py-3 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                placeholder="Full Name"
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-xs mt-1 font-bold pl-1">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="email"
                                type="email"
                                className={`appearance-none relative block w-full px-10 py-3 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                placeholder="Email address"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs mt-1 font-bold pl-1">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="phone"
                                type="tel"
                                className={`appearance-none relative block w-full px-10 py-3 border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                placeholder="Phone Number"
                                {...formik.getFieldProps('phone')}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <p className="text-red-500 text-xs mt-1 font-bold pl-1">{formik.errors.phone}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="address"
                                type="text"
                                className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Address (Optional)"
                                {...formik.getFieldProps('address')}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className={`appearance-none relative block w-full px-10 py-3 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10`}
                                placeholder="Password"
                                {...formik.getFieldProps('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-500 text-xs mt-1 font-bold pl-1">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className={`appearance-none relative block w-full px-10 py-3 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10`}
                                placeholder="Confirm Password"
                                {...formik.getFieldProps('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1 font-bold pl-1">{formik.errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {formik.isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
