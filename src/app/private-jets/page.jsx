"use client";

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Plane, MapPin, ArrowRight, Loader2, CheckCircle2, Ship } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Assets
import jetImg from '../../assets/jet.png';
import interiorImg from '../../assets/Rectangle 642.png';
import jet1 from '../../assets/private-jet-1.png';
import jet2 from '../../assets/private-jet-2.png';
import formBg from '../../assets/form-background.png';
import wingBg from '../../assets/Background (1).png';

// Components
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import LocationAutocomplete from '../../components/common/LocationAutocomplete';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../api/client';

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const JET_TYPES = ['Private Jet', 'Executive Airlines', 'Charter Flights', 'Air Ambulance', 'Helicopters'];
const FLIGHT_CLASSES = ['Economy', 'Business', 'Both'];

const PrivateJetsPage = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const { user, openAuthModal } = useCustomerAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
    const [cmsData, setCmsData] = useState(null);
    const [isLoadingCMS, setIsLoadingCMS] = useState(true);

    useEffect(() => {
        const fetchCMSData = async () => {
            try {
                setIsLoadingCMS(true);
                const response = await api.get('/private-jet-cms');
                if (response.data) {
                    setCmsData(response.data);
                }
            } catch (error) {
                console.error('Error fetching Private Jet CMS data:', error);
            } finally {
                setIsLoadingCMS(false);
            }
        };
        fetchCMSData();
    }, []);

    const carouselJets = cmsData?.items || [];

    const handleNextSlide = () => {
        setCarouselIndex((prev) => (prev + 1) % carouselJets.length);
    };

    const formik = useFormik({
        initialValues: {
            jet_type: 'Private Jet',
            passenger_count: '',
            departing_from: '',
            departing_to: '',
            departure_datetime: '',
            return_datetime: '',
            return_from: '',
            return_to: '',
            flight_class: 'Business',
            additional_notes: '',
            has_return: false
        },
        validationSchema: Yup.object({
            jet_type: Yup.string().required('Required'),
            passenger_count: Yup.number().positive('Must be positive').required('Required'),
            departing_from: Yup.string().required('Required'),
            departing_to: Yup.string().required('Required'),
            departure_datetime: Yup.string().required('Required'),
            flight_class: Yup.string().required('Required'),
            return_datetime: Yup.string().when('has_return', {
                is: true,
                then: (schema) => schema.required('Required'),
                otherwise: (schema) => schema.optional()
            })
        }),
        onSubmit: async (values) => {
            if (!user) {
                openAuthModal('login');
                return;
            }

            setIsSubmitting(true);
            setSubmitStatus(null);
            try {
                const payload = {
                    customer_id: user.id,
                    ...values
                };
                delete payload.has_return; // backend doesn't need this toggle

                await api.post('/private-jet/frontend/create', payload);
                setSubmitStatus('success');
                formik.resetForm();
                setTimeout(() => setSubmitStatus(null), 5000);
            } catch (error) {
                console.error('Submission failed:', error);
                setSubmitStatus('error');
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-end overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {isLoadingCMS ? (
                        <Skeleton className="w-full h-full rounded-none" />
                    ) : (
                        <>
                            <img
                                src={cmsData?.hero_image || ''}
                                alt={cmsData?.hero_title_1 || "Private Jet Charter"}
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-[#e6eff4]/80 via-[#e6eff4]/40 to-transparent md:from-[#e6eff4]/70 md:via-[#e6eff4]/10"></div>
                        </>
                    )}
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-[50%] lg:w-[45%] text-right pt-20"
                    >
                        {isLoadingCMS ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-[80%] ml-auto" />
                                <Skeleton className="h-12 w-[60%] ml-auto" />
                                <Skeleton className="h-20 w-full ml-auto mt-6" />
                            </div>
                        ) : (
                            <>
                                <nav className="flex items-center justify-end gap-1.5 text-[10px] md:text-xs font-bold text-[#113A74] uppercase tracking-widest mb-2">
                                    <Link href="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
                                    <span className="opacity-50">—</span>
                                    <span>Private Jet</span>
                                </nav>
                                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold font-heading mb-6 drop-shadow-sm">
                                    <span className="text-[#113A74]">{cmsData?.hero_title_1} </span>
                                    {cmsData?.hero_title_2 && <span className="text-[#FFA500]">{cmsData.hero_title_2}</span>}
                                </h1>
                                <p className="text-gray-500 text-sm md:text-[13px] leading-loose max-w-sm ml-auto">
                                    {cmsData?.hero_description}
                                </p>
                                <div className="mt-8 flex items-center justify-end gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="bg-[#113A74] text-white font-bold py-4 px-10 rounded-full text-[14px] inline-flex items-center gap-3 transition-all shadow-xl shadow-[#113A74]/20 hover:bg-[#113A74]/90 h-[54px]"
                                    >
                                        Request a Charter
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>

                                    {/* Cruise Promotion Button */}
                                    <Link href="/cruises">
                                        <motion.div
                                            className="group relative flex items-center justify-start bg-[#113A74] text-white rounded-full h-[54px] cursor-pointer shadow-xl shadow-[#113A74]/20"
                                            initial="initial"
                                            whileHover="hover"
                                            variants={{
                                                initial: { width: 54 },
                                                hover: { width: 190 }
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        >
                                            <div className="flex items-center px-[17px] gap-3 shrink-0">
                                                <Ship className="w-5 h-5 shrink-0" />
                                                <motion.span
                                                    variants={{
                                                        initial: { opacity: 0, x: -10, width: 0, display: 'none' },
                                                        hover: { opacity: 1, x: 0, width: 'auto', display: 'block' }
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                    className="whitespace-nowrap font-bold text-[14px] pointer-events-none"
                                                >
                                                    Explore Cruises
                                                </motion.span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Split Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-[55%] space-y-6"
                    >
                        {isLoadingCMS ? (
                            <div className="space-y-6">
                                <Skeleton className="h-10 w-[70%]" />
                                <Skeleton className="h-10 w-[50%]" />
                                <div className="space-y-4 pt-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold font-heading leading-tight mb-8">
                                    <span className="text-[#113A74]">{cmsData?.section_title_1}<br /></span>
                                    {cmsData?.section_title_2 && <span className="text-[#FFA500]">{cmsData.section_title_2}</span>}
                                </h2>

                                <div className="space-y-4 text-gray-500 text-sm md:text-[13px] leading-[1.8]">
                                    <p>{cmsData?.section_description}</p>
                                </div>
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-[40%] lg:ml-auto"
                    >
                        <div className="rounded-[1.5rem] overflow-hidden shadow-xl aspect-[4/3] lg:aspect-[5/4] w-full">
                            {isLoadingCMS ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <img
                                    src={cmsData?.section_image || ''}
                                    alt={cmsData?.section_title_1 || 'Private Jet'}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Aircraft Carousel Section */}
            <section className="w-full bg-[#FFF6E9] py-20 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
                            <span className="text-[#113A74]">{cmsData?.items_title_1} </span>
                            {cmsData?.items_title_2 && <span className="text-[#FFA500]">{cmsData.items_title_2}</span>}
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                            {cmsData?.items_description}
                        </p>
                    </div>

                    {isLoadingCMS ? (
                        <div className="flex flex-col lg:flex-row gap-8 min-h-[450px]">
                            <Skeleton className="w-full lg:w-[60%] h-[450px] rounded-[2rem]" />
                            <div className="w-full lg:w-[40%] flex flex-col gap-8">
                                <Skeleton className="w-full flex-1 rounded-[2rem] min-h-[300px]" />
                                <Skeleton className="w-16 h-16 rounded-full" />
                            </div>
                        </div>
                    ) : carouselJets.length > 0 && (
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch relative min-h-[450px]">
                            <motion.div
                                key={`left-${carouselIndex}`}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full lg:w-[60%] relative rounded-[2rem] overflow-hidden group shadow-lg aspect-[4/3] lg:aspect-auto"
                            >
                                <img
                                    src={carouselJets[carouselIndex]?.img?.src || carouselJets[carouselIndex]?.img}
                                    alt={carouselJets[carouselIndex]?.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-8 z-10">
                                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4 sm:px-6 sm:py-5">
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                <Plane className="text-[#113A74] w-5 h-5" />
                                            </div>
                                            <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-heading mb-1">{carouselJets[carouselIndex]?.name}</h3>
                                        </div>
                                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-lg">
                                            {carouselJets[carouselIndex]?.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="w-full lg:w-[40%] flex flex-col justify-between gap-8 h-full">
                                {carouselJets.length > 1 && (
                                    <motion.div
                                        key={`right-${carouselIndex}`}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="w-full rounded-[2rem] overflow-hidden relative group shadow-md flex-1 min-h-[300px]"
                                    >
                                        <img
                                            src={carouselJets[(carouselIndex + 1) % carouselJets.length]?.img?.src || carouselJets[(carouselIndex + 1) % carouselJets.length]?.img}
                                            alt={carouselJets[(carouselIndex + 1) % carouselJets.length]?.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                        <div className="absolute bottom-4 left-4 right-4 z-10">
                                            <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4">
                                                <div className="flex items-center gap-2.5 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                        <Plane className="text-[#113A74] w-4 h-4 scale-75" />
                                                    </div>
                                                    <h3 className="text-white text-base sm:text-lg font-bold font-heading mb-1 truncate">{carouselJets[(carouselIndex + 1) % carouselJets.length]?.name}</h3>
                                                </div>
                                                <p className="text-white/70 text-xs leading-relaxed max-w-xs line-clamp-2">
                                                    {carouselJets[(carouselIndex + 1) % carouselJets.length]?.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex justify-start">
                                    <button
                                        onClick={handleNextSlide}
                                        className="w-14 h-14 md:w-16 md:h-16 border border-[#113A74]/30 rounded-full flex items-center justify-center text-[#113A74] hover:bg-[#113A74] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 group shadow-sm bg-transparent"
                                    >
                                        <ArrowUpRight className="w-6 h-6 transition-transform group-hover:rotate-45" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Form Section */}
            <section
                id="enquiry-form"
                className="w-full relative py-20 lg:py-28 overflow-hidden bg-[#1A2639]"
                style={{
                    backgroundImage: `url(${formBg.src || formBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 text-white">
                            <span>{cmsData?.form_title_1} </span>
                            {cmsData?.form_title_2 && <span className="text-[#FFA500]">{cmsData.form_title_2}</span>}
                        </h2>
                        <p className="text-white/80 text-sm md:text-[13px] leading-relaxed max-w-xl">
                            {cmsData?.form_description}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-center lg:items-stretch">
                        {/* Left: Form Card */}
                        <div className="w-full lg:flex-1 bg-white rounded-xl p-6 md:p-8 lg:p-10 shadow-2xl">
                            {submitStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="text-green-500 w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#113A74] mb-2">Request Received</h3>
                                    <p className="text-gray-500 max-w-md">Your jet charter enquiry has been submitted successfully. Our specialists will contact you shortly.</p>
                                    <button
                                        onClick={() => setSubmitStatus(null)}
                                        className="mt-8 text-[#FFA500] font-bold text-sm uppercase tracking-widest hover:underline"
                                    >
                                        Send Another Request
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={formik.handleSubmit} className="space-y-6">
                                    {/* Row 1 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Aircraft Type <span className="text-red-500">*</span></label>
                                            <select
                                                name="jet_type"
                                                {...formik.getFieldProps('jet_type')}
                                                className={`w-full border ${formik.touched.jet_type && formik.errors.jet_type ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors bg-transparent appearance-none`}
                                            >
                                                {JET_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                            {formik.touched.jet_type && formik.errors.jet_type && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.jet_type}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Number of Passengers <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                name="passenger_count"
                                                placeholder="e.g. 4"
                                                {...formik.getFieldProps('passenger_count')}
                                                className={`w-full border ${formik.touched.passenger_count && formik.errors.passenger_count ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors`}
                                            />
                                            {formik.touched.passenger_count && formik.errors.passenger_count && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.passenger_count}</p>}
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Departing From <span className="text-red-500">*</span></label>
                                            <LocationAutocomplete
                                                name="departing_from"
                                                placeholder="Airport or City"
                                                value={formik.values.departing_from}
                                                onChange={(name, val) => formik.setFieldValue(name, val)}
                                                onBlur={formik.handleBlur}
                                                hasError={formik.touched.departing_from && formik.errors.departing_from}
                                            />
                                            {formik.touched.departing_from && formik.errors.departing_from && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.departing_from}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Destination To <span className="text-red-500">*</span></label>
                                            <LocationAutocomplete
                                                name="departing_to"
                                                placeholder="Airport or City"
                                                value={formik.values.departing_to}
                                                onChange={(name, val) => formik.setFieldValue(name, val)}
                                                onBlur={formik.handleBlur}
                                                hasError={formik.touched.departing_to && formik.errors.departing_to}
                                            />
                                            {formik.touched.departing_to && formik.errors.departing_to && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.departing_to}</p>}
                                        </div>
                                    </div>

                                    {/* Row 3 - Departure DateTime & Flight Class */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Departure Date & Time <span className="text-red-500">*</span></label>
                                            <input
                                                type="datetime-local"
                                                name="departure_datetime"
                                                {...formik.getFieldProps('departure_datetime')}
                                                className={`w-full border ${formik.touched.departure_datetime && formik.errors.departure_datetime ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700`}
                                            />
                                            {formik.touched.departure_datetime && formik.errors.departure_datetime && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.departure_datetime}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Service Class <span className="text-red-500">*</span></label>
                                            <select
                                                name="flight_class"
                                                {...formik.getFieldProps('flight_class')}
                                                className={`w-full border ${formik.touched.flight_class && formik.errors.flight_class ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors bg-transparent appearance-none`}
                                            >
                                                {FLIGHT_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                            </select>
                                            {formik.touched.flight_class && formik.errors.flight_class && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.flight_class}</p>}
                                        </div>
                                    </div>

                                    {/* Toggle for Return Trip */}
                                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                                        <div
                                            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formik.values.has_return ? 'bg-[#FFA500]' : 'bg-gray-200'}`}
                                            onClick={() => formik.setFieldValue('has_return', !formik.values.has_return)}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formik.values.has_return ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                        <label className="text-[11px] font-bold text-[#113A74] uppercase tracking-wider select-none cursor-pointer" onClick={() => formik.setFieldValue('has_return', !formik.values.has_return)}>Include Return Trip</label>
                                    </div>

                                    {/* Return Trip Section */}
                                    <AnimatePresence>
                                        {formik.values.has_return && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="space-y-6 overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Return Origin</label>
                                                        <LocationAutocomplete
                                                            name="return_from"
                                                            placeholder="Airport or City"
                                                            value={formik.values.return_from}
                                                            onChange={(name, val) => formik.setFieldValue(name, val)}
                                                            onBlur={formik.handleBlur}
                                                            hasError={formik.touched.return_from && formik.errors.return_from}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Return Destination</label>
                                                        <LocationAutocomplete
                                                            name="return_to"
                                                            placeholder="Airport or City"
                                                            value={formik.values.return_to}
                                                            onChange={(name, val) => formik.setFieldValue(name, val)}
                                                            onBlur={formik.handleBlur}
                                                            hasError={formik.touched.return_to && formik.errors.return_to}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Return Date & Time <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="datetime-local"
                                                        name="return_datetime"
                                                        {...formik.getFieldProps('return_datetime')}
                                                        className={`w-full border ${formik.touched.return_datetime && formik.errors.return_datetime ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none`}
                                                    />
                                                    {formik.touched.return_datetime && formik.errors.return_datetime && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.return_datetime}</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Additional Notes */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Additional Notes</label>
                                        <textarea
                                            rows={4}
                                            name="additional_notes"
                                            placeholder="Special requirements, pets, dietary preferences..."
                                            {...formik.getFieldProps('additional_notes')}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors resize-none text-gray-700"
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-[#FFA500] hover:bg-[#e69500] text-[#113A74] font-bold py-3.5 px-10 rounded-full text-[13px] inline-flex items-center gap-2 transition-all shadow-lg shadow-[#FFA500]/20 disabled:opacity-70"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Request'}
                                            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                                        </button>
                                        {submitStatus === 'error' && (
                                            <p className="text-red-500 text-xs font-bold mt-4">Failed to submit request. Please try again later.</p>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Right: Image Card */}
                        <div className="w-full lg:w-[488px] flex lg:justify-end items-center mt-10 lg:mt-0">
                            <div className="relative w-full aspect-square lg:h-[618px] lg:w-[488px] lg:aspect-auto rounded-[1.5rem] overflow-hidden shadow-2xl group">
                                <img
                                    src={cmsData?.form_image || wingBg.src || wingBg}
                                    alt="Private Jet View"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center mt-8">
                                    <h3 className="text-white text-3xl md:text-[2.5rem] font-bold font-heading mb-4 drop-shadow-md leading-tight">
                                        {cmsData?.form_card_title_1?.split(' ').slice(0, -1).join(' ')}<br />
                                        {cmsData?.form_card_title_2 || cmsData?.form_card_title_1?.split(' ').slice(-1)}
                                    </h3>
                                    <p className="text-white/90 text-[15px] max-w-[240px] drop-shadow-sm font-medium">
                                        {cmsData?.form_card_description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Adventure Section */}
            <AdventureSection content={cmsData} loading={isLoadingCMS} />

            {/* Gallery Loop Section */}
            <GalleryLoop images={cmsData?.hero_slider} loading={isLoadingCMS} />
        </div>
    );
};

export default PrivateJetsPage;
