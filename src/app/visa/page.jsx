"use client";

export const runtime = 'edge';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Users, FileText, Calendar,
    Upload, CheckCircle, ChevronRight,
    Loader2, Info, Camera, ChevronDown, Globe, MapPin, Mail, CreditCard
} from 'lucide-react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from 'next/navigation';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

// Country codes remain static as they usually include flags and logic that doesn't change much
import ServicePageSkeleton from '../../components/skeletons/ServiceSkeletons';

const COUNTRY_CODES = [
    { code: "+971", name: "UAE", flag: "🇦🇪", placeholder: "50 123 4567" },
    { code: "+966", name: "KSA", flag: "🇸🇦", placeholder: "51 234 5678" },
    { code: "+974", name: "Qatar", flag: "🇶🇦", placeholder: "3312 3456" },
    { code: "+91", name: "India", flag: "🇮🇳", placeholder: "98765 43210" },
    { code: "+1", name: "USA/Canada", flag: "🇺🇸", placeholder: "212 555 1234" },
    { code: "+44", name: "UK", flag: "🇬🇧", placeholder: "7123 456789" },
    { code: "+65", name: "Singapore", flag: "🇸🇬", placeholder: "8123 4567" }
];

const PASSENGER_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1} ${i === 0 ? 'Passenger' : 'Passengers'}`,
    value: i + 1
}));

// Reusable Custom Select Component
const CustomSelect = ({ label, name, options, value, setFieldValue, icon: Icon, placeholder, error, touched, isCountry = false, isCode = false, isVisa = false, isDestination = false, isLoading = false, isSearchable = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && isSearchable && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        } else if (!isOpen) {
            setSearchQuery('');
        }
    }, [isOpen, isSearchable]);

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

    const filteredOptions = isSearchable && searchQuery
        ? options.filter(option => {
            const optLabel = isCode ? `${option.code} ${option.name}` : (isVisa ? option.visa_name : (option.name || option.label || option));
            return String(optLabel).toLowerCase().includes(searchQuery.toLowerCase());
        })
        : options;

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
                        className="absolute z-[100] left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[300px] flex flex-col"
                    >
                        {isSearchable && (
                            <div className="p-2 border-b border-gray-100 shrink-0">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-[#113A74] focus:outline-none focus:border-[#FFA500]/50 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">No matches found</div>
                            ) : (
                                filteredOptions.map((option, idx) => {
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
                        </div>
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
                    isSearchable={true}
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

// Upload a single file
const uploadFile = async (file) => {
    if (typeof file === 'string' && file.startsWith('http')) return file;
    const formData = new FormData();
    formData.append('file', file);
    const data = await api.post('/upload/image', formData);
    return data.url;
};

const validationSchema = Yup.object().shape({
    applicantName: Yup.string().required('Required'),
    email: Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address (e.g. name@example.com)')
        .required('Email is required'),
    mobileCode: Yup.string().required('Required'),
    mobileNumber: Yup.string()
        .required('Required')
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
    nationality: Yup.string().required('Required'),
    residenceCountry: Yup.string().required('Required'),
    destinationCountryId: Yup.string().required('Required'),
    visaId: Yup.string().required('Required'),
    travelDate: Yup.string().required('Required'),
    numberOfPassengers: Yup.number().min(1).max(10).required('Required'),
    passengers: Yup.array().of(
        Yup.object().shape({
            fullName: Yup.string().required('Required'),
            nationality: Yup.string().required('Required'),
            dob: Yup.string().required('Required'),
            passportExpiry: Yup.string()
                .required('Required')
                .test('is-valid-passport', 'Must have 6 months validity', value => {
                    if (!value) return false;
                    const expiryDate = new Date(value);
                    const sixMonthsFromNow = new Date();
                    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
                    return expiryDate >= sixMonthsFromNow;
                }),
            profilePhoto: Yup.mixed().required('Required'),
            passportPhoto: Yup.mixed().required('Required'),
        })
    )
});

const FileUploadField = ({ label, name, icon: Icon, setFieldValue, touched, error }) => {
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
                {label} <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative group">
                <input
                    type="file"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                />
                <div className={`bg-white border-2 border-dashed ${touched && error ? 'border-red-100' : 'border-gray-200'} group-hover:border-[#FFA500]/50 transition-all rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[120px]`}>
                    {fileName ? (
                        <div className="flex flex-col items-center gap-1">
                            <CheckCircle className="text-green-500" size={24} />
                            <span className="text-xs font-medium text-gray-700 max-w-[150px] truncate">{fileName}</span>
                            <button
                                type="button"
                                className="text-[10px] text-red-500 font-bold uppercase hover:underline"
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
                            <span className="text-[9px] text-gray-300 uppercase font-bold">Image only</span>
                        </>
                    )}
                </div>
            </div>
            {touched && error && <div className="text-red-500 text-[10px] font-bold uppercase px-1">{error}</div>}
        </div>
    );
};

const emptyPassenger = {
    fullName: '',
    nationality: '',
    dob: '',
    passportExpiry: '',
    profilePhoto: '',
    passportPhoto: ''
};

const VisaServicesPage = () => {
    const { success, error: toastError } = useToast();
    const router = useRouter();
    const { user, loading: authLoading, openAuthModal } = useCustomerAuth();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const [countries, setCountries] = useState([]);
    const [visas, setVisas] = useState([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [isLoadingVisas, setIsLoadingVisas] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                setCountries(response.data || []);
            } catch (err) {
                console.error('Failed to fetch countries:', err);
            } finally {
                setIsLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    const fetchVisasForCountry = async (countryId) => {
        if (!countryId) {
            setVisas([]);
            return;
        }
        setIsLoadingVisas(true);
        try {
            // Fetch using the specific API requested by the user, dynamically filtered by country_id
            const response = await api.get(`/visas?page=1&limit=10&country_id=${countryId}`);
            const filteredVisas = response.data?.data || response.data || [];

            // Backend handles filtering via query param
            setVisas(filteredVisas);
        } catch (err) {
            console.error('Failed to fetch visas:', err);
        } finally {
            setIsLoadingVisas(false);
        }
    };

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
                <p className="text-gray-500 max-w-md text-center">You need to be logged in to access visa services. Please sign in to continue.</p>
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
        applicantName: user.name || '',
        email: user.email || '',
        mobileCode: '+971',
        mobileNumber: '',
        nationality: '',
        residenceCountry: '',
        notes: '',
        destinationCountryId: '',
        visaId: '',
        travelDate: '',
        numberOfPassengers: 1,
        passengers: [{ ...emptyPassenger }]
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        console.log("values", values);
        try {
            setUploadProgress('Uploading photos...');
            const passengersPayload = await Promise.all(
                values.passengers.map(async (passenger) => {
                    const [profilePhotoUrl, passportPhotoUrl] = await Promise.all([
                        uploadFile(passenger.profilePhoto),
                        uploadFile(passenger.passportPhoto),
                    ]);

                    // Fetch nationality name from ID for payload? 
                    // Swagger example shows "Indian" string, not UUID
                    const nationalityName = countries.find(c => c.id === passenger.nationality)?.name || passenger.nationality;

                    return {
                        name: passenger.fullName,
                        nationality: nationalityName,
                        date_of_birth: passenger.dob,
                        passport_expiry_date: passenger.passportExpiry,
                        profile_photo_url: profilePhotoUrl,
                        passport_photo_url: passportPhotoUrl,
                    };
                })
            );

            setUploadProgress('Submitting visa application...');

            const nationalityName = countries.find(c => c.id === values.nationality)?.name || values.nationality;
            const residenceName = countries.find(c => c.id === values.residenceCountry)?.name || values.residenceCountry;

            const payload = {
                applicant_name: values.applicantName,
                mobile_number: `${values.mobileCode}${values.mobileNumber}`,
                email: values.email,
                nationality: nationalityName,
                country_of_residence: residenceName,
                country_id: values.destinationCountryId,
                visa_id: values.visaId,
                travel_date: values.travelDate,
                number_of_passengers: values.numberOfPassengers,
                passengers: passengersPayload,
                notes: values.notes,
            };

            await api.post('/visa/me', payload);
            success('Visa Application Submitted Successfully!');
            router.push('/profile');
        } catch (err) {
            toastError(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
            setUploadProgress('');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4 md:px-6">
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #F8FAFC; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}</style>

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
                        Visa <span className="text-[#FFA500]">Services</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
                    >
                        Global visa assistance with expert guidance. Apply for your travel visa with ease and track your progress in real-time.
                    </motion.p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, touched, errors }) => (
                        <Form className="space-y-8">
                            {/* SECTION 1: APPLICATION INFORMATION */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-50 relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA500]/5 rounded-bl-[100%] rounded-tr-[2.5rem] z-0" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-[#113A74] flex items-center justify-center text-white shadow-lg shadow-[#113A74]/20">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#113A74] tracking-tight">Application Information</h2>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Applicant Contact Details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Applicant Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <User size={14} className="text-[#FFA500]" />
                                                Applicant Name <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <Field
                                                name="applicantName"
                                                placeholder="Full Legal Name"
                                                className={`w-full bg-gray-50 border-2 ${touched.applicantName && errors.applicantName ? 'border-red-100' : 'border-transparent'} focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] min-h-[56px]`}
                                            />
                                            <ErrorMessage name="applicantName" component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <Mail size={14} className="text-[#FFA500]" />
                                                Email Address <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <Field
                                                name="email"
                                                type="email"
                                                placeholder="email@example.com"
                                                className={`w-full bg-gray-50 border-2 ${touched.email && errors.email ? 'border-red-100' : 'border-transparent'} focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] min-h-[56px]`}
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                        </div>

                                        {/* Mobile Number with flags */}
                                        <MobileInput
                                            nameCode="mobileCode"
                                            nameNumber="mobileNumber"
                                            options={COUNTRY_CODES}
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            touched={touched}
                                            errors={errors}
                                        />

                                        {/* Nationality */}
                                        <CustomSelect
                                            label="Nationality"
                                            name="nationality"
                                            options={countries}
                                            value={values.nationality}
                                            setFieldValue={setFieldValue}
                                            icon={Globe}
                                            placeholder="Select Nationality"
                                            isCountry={true}
                                            isLoading={isLoadingCountries}
                                            touched={touched.nationality}
                                            error={errors.nationality}
                                            isSearchable={true}
                                        />

                                        {/* Country of Residence */}
                                        <CustomSelect
                                            label="Country of Residence"
                                            name="residenceCountry"
                                            options={countries}
                                            value={values.residenceCountry}
                                            setFieldValue={setFieldValue}
                                            icon={MapPin}
                                            placeholder="Select Residence"
                                            isCountry={true}
                                            isLoading={isLoadingCountries}
                                            touched={touched.residenceCountry}
                                            error={errors.residenceCountry}
                                        />

                                        {/* Notes */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <FileText size={14} className="text-[#FFA500]" />
                                                Additional Notes
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="notes"
                                                rows={3}
                                                placeholder="Any specific requirements or information..."
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* SECTION 2: VISA & TRAVEL DETAILS */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-50 relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#113A74]/5 rounded-bl-[100%] rounded-tr-[2.5rem] z-0" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-[#FFA500] flex items-center justify-center text-white shadow-lg shadow-[#FFA500]/20">
                                            <Globe size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#113A74] tracking-tight">Visa & Travel Details</h2>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Journey Information</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Destination Country */}
                                        <CustomSelect
                                            label="Destination Country"
                                            name="destinationCountryId"
                                            options={countries}
                                            value={values.destinationCountryId}
                                            setFieldValue={(name, val) => {
                                                setFieldValue(name, val);
                                                setFieldValue('visaId', ''); // Reset visa on country change
                                                fetchVisasForCountry(val);
                                            }}
                                            icon={MapPin}
                                            placeholder="Select Destination"
                                            isDestination={true}
                                            isLoading={isLoadingCountries}
                                            touched={touched.destinationCountryId}
                                            error={errors.destinationCountryId}
                                            isSearchable={true}
                                        />

                                        {/* Visa Type */}
                                        <CustomSelect
                                            label="Visa Type"
                                            name="visaId"
                                            options={visas}
                                            value={values.visaId}
                                            setFieldValue={setFieldValue}
                                            icon={FileText}
                                            placeholder={values.destinationCountryId ? "Select Visa Type" : "Select Country First"}
                                            isVisa={true}
                                            isLoading={isLoadingVisas}
                                            touched={touched.visaId}
                                            error={errors.visaId}
                                        />

                                        {/* Travel Date */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <Calendar size={14} className="text-[#FFA500]" />
                                                Expected Travel Date <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <Field
                                                type="date"
                                                name="travelDate"
                                                className={`w-full bg-gray-50 border-2 ${touched.travelDate && errors.travelDate ? 'border-red-100' : 'border-transparent'} focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] appearance-none min-h-[56px]`}
                                            />
                                            <ErrorMessage name="travelDate" component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                        </div>

                                        {/* Number of Passengers */}
                                        <CustomSelect
                                            label="Number of Passengers"
                                            name="numberOfPassengers"
                                            options={PASSENGER_COUNT_OPTIONS}
                                            value={values.numberOfPassengers}
                                            setFieldValue={(name, val) => {
                                                setFieldValue(name, val);
                                                const passengers = [...values.passengers];
                                                if (val > passengers.length) {
                                                    for (let i = passengers.length; i < val; i++) {
                                                        passengers.push({ ...emptyPassenger });
                                                    }
                                                } else {
                                                    passengers.length = val;
                                                }
                                                setFieldValue('passengers', passengers);
                                            }}
                                            icon={Users}
                                            placeholder="Select count"
                                            touched={touched.numberOfPassengers}
                                            error={errors.numberOfPassengers}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* SECTION 3: PASSENGER DETAILS */}
                            <FieldArray name="passengers">
                                {() => (
                                    <div className="space-y-8">
                                        <AnimatePresence>
                                            {values.passengers.map((passenger, index) => (
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
                                                            P{index + 1}
                                                        </div>
                                                        <div>
                                                            <h2 className="text-2xl font-black text-[#113A74] tracking-tight">Passenger Details</h2>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Personnel Info {index + 1}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-10">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            {/* Full Name */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <User size={14} className="text-[#FFA500]" />
                                                                    Full Legal Name <span className="text-red-500 font-bold">*</span>
                                                                </label>
                                                                <Field
                                                                    name={`passengers.${index}.fullName`}
                                                                    placeholder="As per passport"
                                                                    className={`w-full bg-gray-50 border-2 ${touched.passengers?.[index]?.fullName && errors.passengers?.[index]?.fullName ? 'border-red-100' : 'border-transparent'} focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] min-h-[56px]`}
                                                                />
                                                                <ErrorMessage name={`passengers.${index}.fullName`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>

                                                            {/* Nationality */}
                                                            <CustomSelect
                                                                label="Nationality"
                                                                name={`passengers.${index}.nationality`}
                                                                options={countries}
                                                                value={values.passengers[index].nationality}
                                                                setFieldValue={setFieldValue}
                                                                icon={Globe}
                                                                placeholder="Select Nationality"
                                                                isCountry={true}
                                                                isLoading={isLoadingCountries}
                                                                touched={touched.passengers?.[index]?.nationality}
                                                                error={errors.passengers?.[index]?.nationality}
                                                                isSearchable={true}
                                                            />

                                                            {/* DOB */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <Calendar size={14} className="text-[#FFA500]" />
                                                                    Date of Birth <span className="text-red-500 font-bold">*</span>
                                                                </label>
                                                                <Field
                                                                    type="date"
                                                                    name={`passengers.${index}.dob`}
                                                                    className={`w-full bg-gray-50 border-2 ${touched.passengers?.[index]?.dob && errors.passengers?.[index]?.dob ? 'border-red-100' : 'border-transparent'} focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] appearance-none min-h-[56px]`}
                                                                />
                                                                <ErrorMessage name={`passengers.${index}.dob`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>

                                                            {/* Passport Expiry */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-[#113A74]/70 uppercase tracking-widest flex items-center gap-2 px-1">
                                                                    <FileText size={14} className="text-[#FFA500]" />
                                                                    Passport Expiry <span className="text-red-500 font-bold">*</span>
                                                                </label>
                                                                <Field
                                                                    type="date"
                                                                    name={`passengers.${index}.passportExpiry`}
                                                                    className={`w-full bg-gray-50 border-2 ${touched.passengers?.[index]?.passportExpiry && errors.passengers?.[index]?.passportExpiry ? 'border-red-100' : 'border-transparent'} focus:border-[#FFA500]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all text-sm font-semibold text-[#113A74] appearance-none min-h-[56px]`}
                                                                />
                                                                <ErrorMessage name={`passengers.${index}.passportExpiry`} component="div" className="text-red-500 text-[10px] font-bold uppercase px-1" />
                                                            </div>
                                                        </div>

                                                        {/* Document Uploads */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                                                            <FileUploadField
                                                                label="Profile Photo"
                                                                name={`passengers.${index}.profilePhoto`}
                                                                icon={Camera}
                                                                setFieldValue={setFieldValue}
                                                                touched={touched.passengers?.[index]?.profilePhoto}
                                                                error={errors.passengers?.[index]?.profilePhoto}
                                                            />
                                                            <FileUploadField
                                                                label="Passport Photo"
                                                                name={`passengers.${index}.passportPhoto`}
                                                                icon={FileText}
                                                                setFieldValue={setFieldValue}
                                                                touched={touched.passengers?.[index]?.passportPhoto}
                                                                error={errors.passengers?.[index]?.passportPhoto}
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
                                            <span>Submit Visa Application</span>
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

export default VisaServicesPage;
