"use client";

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Users, FileText, Calendar,
    Upload, CheckCircle, ChevronRight,
    Loader2, Info, CreditCard, Camera, ChevronDown, Globe
} from 'lucide-react';
import Link from 'next/link';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from 'next/navigation';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

import ServicePageSkeleton from '../../components/skeletons/ServiceSkeletons';

const API_BASE = 'https://magic-apis.staff-b0c.workers.dev';

// Country codes remain static as they usually include flags and logic that doesn't change much
const COUNTRY_CODES = [
    { code: "+971", name: "UAE", flag: "🇦🇪", placeholder: "50 123 4567" },
    { code: "+966", name: "KSA", flag: "🇸🇦", placeholder: "51 234 5678" },
    { code: "+974", name: "Qatar", flag: "🇶🇦", placeholder: "3312 3456" },
    { code: "+91", name: "India", flag: "🇮🇳", placeholder: "98765 43210" },
    { code: "+1", name: "USA/Canada", flag: "🇺🇸", placeholder: "212 555 1234" },
    { code: "+44", name: "UK", flag: "🇬🇧", placeholder: "7123 456789" },
    { code: "+65", name: "Singapore", flag: "🇸🇬", placeholder: "8123 4567" }
];

// Reusable Custom Select Component
const CustomSelect = ({ label, name, options, value, setFieldValue, icon: Icon, placeholder, error, touched, isCountry = false, isCode = false, isVisa = false, isDestination = false, isLoading = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const findOption = () => {
        if (isCode) return options.find(opt => opt.code === value);
        if (isCountry || isDestination) return options.find(opt => opt.name === value || opt.id === value);
        if (isVisa) return options.find(opt => opt.visa_id === value);
        return options.find(opt => (opt.value === value || opt === value));
    };

    const selectedOption = findOption();

    const getDisplayLabel = () => {
        if (isLoading) return 'Loading...';
        if (!value) return placeholder || 'Select option';
        if (isCode) return `${selectedOption?.flag} ${selectedOption?.code}`;
        if (isCountry || isDestination) return `📍 ${selectedOption?.name}`;
        if (isVisa) return selectedOption?.visa_name;
        return selectedOption?.label || selectedOption?.name || selectedOption;
    };

    return (
        <div className={`space-y-2 relative ${isCode ? 'w-[120px] shrink-0' : 'w-full'} ${isOpen ? 'z-[101]' : 'z-auto'}`} ref={containerRef}>
            {label && (
                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                    {Icon && <Icon size={14} className="text-[#FFA500]" />}
                    {label} <span className="text-red-500 font-bold">*</span>
                </label>
            )}
            <div
                onClick={() => !isLoading && setIsOpen(!isOpen)}
                className={`w-full bg-gray-50 border-2 ${touched && error ? 'border-red-100' : 'border-transparent'} hover:border-[#FFA500]/20 focus-within:border-[#FFA500]/30 rounded-2xl ${isCode ? 'py-4 px-4' : 'py-4 px-6'} flex items-center justify-between cursor-pointer transition-all min-h-[56px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <div className="flex items-center gap-2 truncate">
                    <span className={`text-sm font-semibold truncate ${value ? 'text-[#113A74]' : 'text-gray-400'}`}>
                        {getDisplayLabel()}
                    </span>
                </div>
                {!isLoading && <ChevronDown size={14} className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />}
                {isLoading && <Loader2 size={14} className="animate-spin text-gray-400" />}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-[100] left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[250px] overflow-y-auto custom-scrollbar"
                    >
                        {options.length === 0 ? (
                            <div className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">No options available</div>
                        ) : (
                            options.map((option, idx) => {
                                const optVal = isCode ? option.code : (isDestination || isCountry ? option.name : (isVisa ? option.visa_id : (option.value || option.name || option)));
                                const optID = isDestination || isCountry ? option.id : null;
                                const optLabel = isCode ? `${option.flag} ${option.code} (${option.name})` : (isVisa ? option.visa_name : (option.name || option.label || option));
                                const isSelected = isDestination || isCountry ? optID === value : optVal === value;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            if (isDestination || isCountry) {
                                                setFieldValue(name, option.id);
                                            } else {
                                                setFieldValue(name, optVal);
                                            }
                                            setIsOpen(false);
                                        }}
                                        className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-3 ${isSelected ? 'bg-[#113A74] text-white' : 'hover:bg-gray-50 text-[#113A74]'}`}
                                    >
                                        <span className="truncate">{optLabel}</span>
                                    </div>
                                );
                            })
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {!isCode && touched && error && <div className="text-red-500 text-[10px] font-bold uppercase px-1">{error}</div>}
        </div>
    );
};

// Error handle for Mobile field
const MobileInput = ({ nameCode, nameNumber, options, values, setFieldValue, touched, errors }) => {
    // Find the current country to get its placeholder
    const currentCountry = options.find(opt => opt.code === values[nameCode]);
    const dynamicPlaceholder = currentCountry?.placeholder || "000 0000";

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                <Phone size={14} className="text-[#FFA500]" />
                Mobile Number <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="flex gap-2 items-start">
                <CustomSelect
                    name={nameCode}
                    options={options}
                    value={values[nameCode]}
                    setFieldValue={setFieldValue}
                    isCode={true}
                    touched={touched[nameCode]}
                    error={errors[nameCode]}
                />
                <div className="flex-1 space-y-2">
                    <Field
                        name={nameNumber}
                        placeholder={dynamicPlaceholder}
                        className={`w-full bg-gray-50 border-2 ${touched[nameNumber] && errors[nameNumber] ? 'border-red-100' : 'border-transparent'} focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] min-h-[56px]`}
                    />
                    <ErrorMessage name={nameNumber} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                </div>
            </div>
        </div>
    );
};

// Upload a single file and return its public URL
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await api.post('/upload/image', formData);
    return data.url;
};

const validationSchema = Yup.object().shape({
    applicantName: Yup.string().required('Applicant Name is required'),
    mobileCode: Yup.string().required('Required'),
    mobileNumber: Yup.string()
        .required('Mobile Number is required')
        .test('is-valid-phone', 'Invalid phone number for selected country', function (value) {
            const { mobileCode } = this.parent;
            if (!value || !mobileCode) return true;

            const digitsOnly = value.replace(/\s/g, '');

            // --- Special Case for India (+91) ---
            if (mobileCode === '+91') {
                // Strictly 10 digits and starts with 6, 7, 8, or 9
                const is10Digits = /^[6789]\d{9}$/.test(digitsOnly);
                if (!is10Digits) {
                    return this.createError({ message: 'Indian mobiles must be 10 digits starting with 6-9' });
                }
                return true;
            }

            // --- General Case for Other Countries ---
            try {
                const fullNumber = `${mobileCode}${digitsOnly}`;
                const phoneNumber = parsePhoneNumber(fullNumber);

                // Must be a valid number for that country
                if (!phoneNumber.isValid()) return false;

                // Only reject if it's explicitly identified as a landline/fixed-line
                const type = phoneNumber.getType();
                if (type === 'FIXED_LINE') {
                    return this.createError({ message: 'Mobile number required, landlines are not accepted' });
                }

                return true;
            } catch (error) {
                return false;
            }
        }),
    numberOfDrivers: Yup.number().min(1).required('Number of Drivers is required'),
    drivers: Yup.array().of(
        Yup.object().shape({
            fullName: Yup.string().required('Full Name is required'),
            passportNumber: Yup.string().required('Passport Number is required'),
            nationality: Yup.string().required('Nationality is required'),
            dateOfBirth: Yup.string().required('Date of Birth is required'),
            dlIssueDate: Yup.date()
                .required('DL Issue Date is required')
                .max(new Date(), 'Issue date cannot be in the future'),
            dlExpiryDate: Yup.date()
                .required('DL Expiry Date is required')
                .min(new Date(), 'Expiry date cannot be in the past'),
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
    const { user, loading: authLoading, isAuthModalOpen, openAuthModal } = useCustomerAuth();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auth guard — open modal if not authenticated
    useEffect(() => {
        if (isMounted && !authLoading && !user) {
            if (!isAuthModalOpen && !hasAttemptedAuth) {
                openAuthModal('login');
                setHasAttemptedAuth(true); // Mark that we've prompted them
            } else if (!isAuthModalOpen && hasAttemptedAuth) {
                // If they closed the modal without logging in, send them to home
                router.push('/');
            }
        }
    }, [isMounted, authLoading, user, isAuthModalOpen, hasAttemptedAuth, openAuthModal, router]);

    if (!isMounted || (isMounted && authLoading)) {
        return <ServicePageSkeleton />;
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
        mobileCode: '+971',
        mobileNumber: '',
        numberOfDrivers: 1,
        drivers: [{ ...emptyDriver }]
    };

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
                mobile_number: `${values.mobileCode}${values.mobileNumber}`,
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
                    <nav className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest mb-4">
                        <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                        <span className="opacity-50">—</span>
                        <span>Visa Services</span>
                    </nav>
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
                    {({ values, setFieldValue, touched, errors }) => (
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
                                        <div className="md:col-span-2">
                                            <MobileInput
                                                nameCode="mobileCode"
                                                nameNumber="mobileNumber"
                                                options={COUNTRY_CODES}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                touched={touched}
                                                errors={errors}
                                            />
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
                                    className="group relative bg-[#113A74] hover:bg-[#1c4d91] text-white rounded-full py-4 px-10 md:py-6 md:px-16 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all shadow-2xl hover:shadow-[#113A74]/30 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
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
