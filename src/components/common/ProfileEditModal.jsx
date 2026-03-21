"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import InternationalPhoneInput from './InternationalPhoneInput';

const ProfileEditSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(2, 'Name is too short'),
    phone: Yup.string().required('Phone number is required'),
});

const ProfileEditModal = () => {
    const { 
        isProfileEditModalOpen, 
        closeProfileEditModal, 
        user, 
        updateUser,
        fetchProfile 
    } = useCustomerAuth();
    const [initialValues, setInitialValues] = useState({ name: '', phone: '', email: '' });
    const [fetching, setFetching] = useState(false);
    const { success: toastSuccess, error: toastError } = useToast();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isProfileEditModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isProfileEditModalOpen]);

    useEffect(() => {
        // Only fetch when the modal actually opens
        if (isProfileEditModalOpen && user) {
            setFetching(true);
            fetchProfile().then(profile => {
                if (profile) {
                    setInitialValues({
                        name: profile.name || '',
                        phone: profile.phone || '',
                        email: profile.email || '',
                    });
                }
                setFetching(false);
            });
        }
    }, [isProfileEditModalOpen]); // Removed user and fetchProfile to break potential loops

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Only send name and phone to the update API as email is usually read-only
            const { name, phone } = values;
            const response = await api.put('/customers/profile', { name, phone });
            const updatedProfile = response.data?.profile || response.profile;
            
            if (updatedProfile) {
                updateUser(updatedProfile);
                toastSuccess("Profile updated successfully!");
                closeProfileEditModal();
            }
        } catch (err) {
            console.error("Profile update failed:", err);
            toastError(err.response?.data?.error || "Update failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isProfileEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProfileEditModal}
                        className="absolute inset-0 bg-[#0A1D37]/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="bg-[#113A74] p-8 text-white relative">
                            <button
                                onClick={closeProfileEditModal}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-3xl font-black mb-2">Edit Profile</h2>
                            <p className="text-white/70 text-sm font-medium">Keep your account details up to date</p>
                        </div>

                        {/* Content */}
                        <div className="p-8 pb-10">
                            {fetching ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="animate-spin text-[#113A74]" size={40} />
                                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Profile...</p>
                                </div>
                            ) : (
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={ProfileEditSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                                        <Form className="space-y-6">
                                            {/* Name Field */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                                                <div className="relative group">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#113A74] transition-colors font-bold">
                                                        <User size={18} />
                                                    </div>
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        className={`w-full bg-gray-50 border-2 py-4 pl-14 pr-6 rounded-2xl outline-none transition-all font-bold text-[#113A74] placeholder:text-gray-300 focus:bg-white ${
                                                            errors.name && touched.name ? 'border-red-100' : 'border-transparent focus:border-[#113A74]/10'
                                                        }`}
                                                    />
                                                </div>
                                                {errors.name && touched.name && (
                                                    <p className="text-red-500 text-[10px] font-bold ml-4">{errors.name}</p>
                                                )}
                                            </div>

                                            {/* Email Field (Read-only) */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                                                <div className="relative group opacity-60">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                                        <Mail size={18} />
                                                    </div>
                                                    <Field
                                                        name="email"
                                                        type="email"
                                                        readOnly
                                                        className="w-full bg-gray-100 border-2 border-transparent py-4 pl-14 pr-6 rounded-2xl outline-none font-bold text-[#113A74] cursor-not-allowed"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-gray-400 ml-4 italic">* Email cannot be changed</p>
                                            </div>

                                            {/* Phone Field */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                                                <div className="relative group">
                                                    <InternationalPhoneInput
                                                        value={values.phone}
                                                        onChange={(val) => setFieldValue('phone', val)}
                                                        error={errors.phone && touched.phone}
                                                    />
                                                </div>
                                                {errors.phone && touched.phone && (
                                                    <p className="text-red-500 text-[10px] font-bold ml-4">{errors.phone}</p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="pt-4 flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={closeProfileEditModal}
                                                    className="flex-1 py-4 px-6 border-2 border-gray-100 rounded-2xl text-gray-500 font-black text-sm hover:bg-gray-50 transition-all uppercase tracking-widest"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="flex-2 py-4 px-10 bg-[#113A74] text-white rounded-2xl font-black text-sm hover:bg-[#1c4d91] transition-all shadow-lg shadow-[#113A74]/20 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest min-w-[160px]"
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            Update Profile <CheckCircle2 size={18} />
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileEditModal;
