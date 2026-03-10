"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Users, FileText, Calendar,
    Upload, CheckCircle, ChevronRight,
    Loader2, Info, CreditCard, Camera, ChevronDown, Globe
} from 'lucide-react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from 'next/navigation';

const API_BASE = 'https://magic-apis.staff-b0c.workers.dev';

// Upload a single file and return its public URL
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await api.post('/upload/image', formData);
    return data.url;
};

const validationSchema = Yup.object().shape({
    applicantName: Yup.string().required('Applicant Name is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    numberOfDrivers: Yup.number().min(1).required('Number of Drivers is required'),
    drivers: Yup.array().of(
        Yup.object().shape({
            fullName: Yup.string().required('Full Name is required'),
            passportNumber: Yup.string().required('Passport Number is required'),
            nationality: Yup.string().required('Nationality is required'),
            dateOfBirth: Yup.string().required('Date of Birth is required'),
            dlIssueDate: Yup.string().required('DL Issue Date is required'),
            dlExpiryDate: Yup.string().required('DL Expiry Date is required'),
            passportCopy: Yup.mixed().required('Passport Copy is required'),
            dlCopy: Yup.mixed().required('DL Copy is required'),
            photo: Yup.mixed().required('Passport Size Photo is required'),
        })
    )
});

const FileUploadField = ({ label, name, icon: Icon, setFieldValue }) => {
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const file = e.currentTarget.files[0];
        if (file) {
            setFileName(file.name);
            setFieldValue(name, file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                <Icon size={14} className="text-[#FFA500]" />
                {label}
            </label>
            <div className="relative group">
                <input
                    type="file"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*,application/pdf"
                />
                <div className="bg-white border-2 border-dashed border-gray-200 group-hover:border-[#FFA500]/50 transition-all rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[120px]">
                    {fileName ? (
                        <div className="flex flex-col items-center gap-1">
                            <CheckCircle className="text-green-500" size={24} />
                            <span className="text-xs font-medium text-gray-700 max-w-[150px] truncate">{fileName}</span>
                            <button
                                type="button"
                                className="text-[10px] text-red-500 font-bold uppercase"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFileName('');
                                    setFieldValue(name, '');
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                <Upload size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Click to Upload</span>
                            <span className="text-[9px] text-gray-300">JPG, PNG or PDF</span>
                        </>
                    )}
                </div>
            </div>
            <ErrorMessage name={name} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
        </div>
    );
};

const emptyDriver = {
    fullName: '',
    passportNumber: '',
    nationality: '',
    dateOfBirth: '',
    dlIssueDate: '',
    dlExpiryDate: '',
    passportCopy: '',
    dlCopy: '',
    photo: ''
};

const IDLPage = () => {
    const { success, error: toastError } = useToast();
    const router = useRouter();
    const { user, loading: authLoading, openAuthModal } = useCustomerAuth();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auth guard — open modal if not authenticated
    useEffect(() => {
        if (isMounted && !authLoading && !user) {
            openAuthModal('login');
        }
    }, [isMounted, authLoading, user, openAuthModal]);

    if (!isMounted || (isMounted && authLoading)) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#113A74]" size={40} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FAFC] pt-20">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-[#113A74]">Authentication Required</h2>
                <p className="text-gray-500 max-w-md text-center">You need to be logged in to apply for an International Driving License. Please sign in to continue.</p>
                <div className="flex gap-3 mt-4">
                    <button onClick={() => openAuthModal('login')} className="px-6 py-2.5 bg-[#113A74] hover:bg-[#1c4d91] transition-colors text-white rounded-xl font-bold text-sm">
                        Sign In
                    </button>
                    <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 rounded-xl font-bold text-sm">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const initialValues = {
        applicantName: '',
        mobileNumber: '',
        numberOfDrivers: 1,
        drivers: [{ ...emptyDriver }]
    };

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#113A74]" size={40} />
            </div>
        );
    }

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Upload all driver files concurrently per driver
            setUploadProgress('Uploading documents...');
            const driversPayload = await Promise.all(
                values.drivers.map(async (driver) => {
                    const [passportCopyUrl, dlCopyUrl, passportPhotoUrl] = await Promise.all([
                        uploadFile(driver.passportCopy),
                        uploadFile(driver.dlCopy),
                        uploadFile(driver.photo),
                    ]);
                    return {
                        name: driver.fullName,
                        passport_number: driver.passportNumber,
                        nationality: driver.nationality,
                        date_of_birth: driver.dateOfBirth,
                        dl_issue_date: driver.dlIssueDate,
                        dl_expiry_date: driver.dlExpiryDate,
                        passport_copy_url: passportCopyUrl,
                        dl_copy_url: dlCopyUrl,
                        passport_photo_url: passportPhotoUrl,
                    };
                })
            );

            setUploadProgress('Submitting application...');
            const payload = {
                applicant_name: values.applicantName,
                mobile_number: values.mobileNumber,
                number_of_drivers: values.numberOfDrivers,
                drivers: driversPayload,
            };

            await api.post('/idl/me', payload);
            success('IDL Application Submitted Successfully!');
            router.push('/');
        } catch (err) {
            toastError(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
            setUploadProgress('');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white rounded-full py-2 px-6 shadow-sm border border-gray-100 mb-6"
                    >
                        <CreditCard className="text-[#113A74]" size={16} />
                        <span className="text-xs font-black text-[#113A74] tracking-[0.2em] uppercase">Service Center</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-[#113A74] tracking-tight leading-tight mb-4"
                    >
                        International <span className="text-[#FFA500]">Driving License</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
                    >
                        Complete your application for a worldwide recognized driving permit. Fast, secure, and accepted in over 150 countries.
                    </motion.p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="space-y-8">
                            {/* SECTION 1: APPLICATION INFO */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-50 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA500]/5 rounded-bl-[100%] z-0" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-[#113A74] flex items-center justify-center text-white shadow-lg shadow-[#113A74]/20">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#113A74] tracking-tight">Application Info</h2>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">General Details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Applicant Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <User size={14} className="text-[#FFA500]" />
                                                Applicant Name
                                            </label>
                                            <Field
                                                name="applicantName"
                                                placeholder="e.g. John Doe"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                            />
                                            <ErrorMessage name="applicantName" component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                        </div>

                                        {/* Mobile Number */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <Phone size={14} className="text-[#FFA500]" />
                                                Mobile Number
                                            </label>
                                            <Field
                                                name="mobileNumber"
                                                placeholder="+974 0000 0000"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                            />
                                            <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                        </div>

                                        {/* Number of Drivers */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <Users size={14} className="text-[#FFA500]" />
                                                Number of Drivers
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as="select"
                                                    name="numberOfDrivers"
                                                    onChange={(e) => {
                                                        const count = parseInt(e.target.value);
                                                        setFieldValue('numberOfDrivers', count);
                                                        const drivers = [...values.drivers];
                                                        if (count > drivers.length) {
                                                            for (let i = drivers.length; i < count; i++) {
                                                                drivers.push({ ...emptyDriver });
                                                            }
                                                        } else {
                                                            drivers.length = count;
                                                        }
                                                        setFieldValue('drivers', drivers);
                                                    }}
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] appearance-none cursor-pointer pr-12"
                                                >
                                                    {[1, 2, 3, 4, 5].map(n => (
                                                        <option key={n} value={n}>{n} {n === 1 ? 'Driver' : 'Drivers'}</option>
                                                    ))}
                                                </Field>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronDown size={18} />
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </motion.div>

                            {/* SECTION 2: DRIVER DETAILS */}
                            <FieldArray name="drivers">
                                {() => (
                                    <div className="space-y-8">
                                        <AnimatePresence>
                                            {values.drivers.map((driver, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ delay: 0.1 * index }}
                                                    className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-8 md:p-12 border border-gray-50"
                                                >
                                                    <div className="flex items-center gap-4 mb-10">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#FFA500] flex items-center justify-center text-white shadow-lg shadow-[#FFA500]/20 font-black text-xl">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <h2 className="text-2xl font-black text-[#113A74] tracking-tight">Driver Details</h2>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Personnel {index + 1}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-10">
                                                        {/* Text Fields Grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                                            {/* Full Name */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <User size={14} className="text-[#FFA500]" />
                                                                    Full Name
                                                                </label>
                                                                <Field
                                                                    name={`drivers.${index}.fullName`}
                                                                    placeholder="e.g. John Smith"
                                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                                                />
                                                                <ErrorMessage name={`drivers.${index}.fullName`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>

                                                            {/* Passport Number */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <FileText size={14} className="text-[#FFA500]" />
                                                                    Passport Number
                                                                </label>
                                                                <Field
                                                                    name={`drivers.${index}.passportNumber`}
                                                                    placeholder="e.g. A1234567"
                                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                                                />
                                                                <ErrorMessage name={`drivers.${index}.passportNumber`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>

                                                            {/* Nationality */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <Globe size={14} className="text-[#FFA500]" />
                                                                    Nationality
                                                                </label>
                                                                <Field
                                                                    name={`drivers.${index}.nationality`}
                                                                    placeholder="e.g. Emirati"
                                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74]"
                                                                />
                                                                <ErrorMessage name={`drivers.${index}.nationality`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>

                                                            {/* Date of Birth */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <Calendar size={14} className="text-[#FFA500]" />
                                                                    Date of Birth
                                                                </label>
                                                                <Field
                                                                    type="date"
                                                                    name={`drivers.${index}.dateOfBirth`}
                                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] appearance-none"
                                                                />
                                                                <ErrorMessage name={`drivers.${index}.dateOfBirth`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>

                                                            {/* DL Issue Date */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <Calendar size={14} className="text-[#FFA500]" />
                                                                    DL Issue Date
                                                                </label>
                                                                <Field
                                                                    type="date"
                                                                    name={`drivers.${index}.dlIssueDate`}
                                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] appearance-none"
                                                                />
                                                                <ErrorMessage name={`drivers.${index}.dlIssueDate`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>

                                                            {/* DL Expiry Date */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <Calendar size={14} className="text-[#FFA500]" />
                                                                    DL Expiry Date
                                                                </label>
                                                                <Field
                                                                    type="date"
                                                                    name={`drivers.${index}.dlExpiryDate`}
                                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] appearance-none"
                                                                />
                                                                <ErrorMessage name={`drivers.${index}.dlExpiryDate`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>
                                                        </div>

                                                        {/* Document Uploads */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                                            <FileUploadField
                                                                label="Passport Copy"
                                                                name={`drivers.${index}.passportCopy`}
                                                                icon={FileText}
                                                                setFieldValue={setFieldValue}
                                                            />
                                                            <FileUploadField
                                                                label="DL Copy"
                                                                name={`drivers.${index}.dlCopy`}
                                                                icon={CreditCard}
                                                                setFieldValue={setFieldValue}
                                                            />
                                                            <FileUploadField
                                                                label="Passport Size Photo"
                                                                name={`drivers.${index}.photo`}
                                                                icon={Camera}
                                                                setFieldValue={setFieldValue}
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </FieldArray>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center pt-10"
                            >
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-6 px-16 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl hover:shadow-[#113A74]/30 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>{uploadProgress || 'Processing...'}</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            <span>Submit Application</span>
                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </motion.div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default IDLPage;
