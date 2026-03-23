"use client";

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Anchor, MapPin, ArrowRight, Ship, Compass, Wind, Camera, Loader2, CheckCircle2, Plane } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Assets
import wingBg from '../../assets/Background (1).png';
import formBg from '../../assets/form-background.png';

// Components
import AdventureSection from '../../components/Home/AdventureSection';
import GalleryLoop from '../../components/Home/GalleryLoop';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../api/client';

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const YACHT_TYPES = ['Motorboat', 'Speedboats', 'Dhows', 'Catamarans', 'Gullet', 'Houseboat', 'Sailing Yacht', 'Superyacht'];

const YachtsPage = () => {
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
                const response = await api.get('/yacht-cms');
                if (response.data) {
                    setCmsData(response.data);
                }
            } catch (error) {
                console.error('Error fetching Yacht CMS data:', error);
            } finally {
                setIsLoadingCMS(false);
            }
        };
        fetchCMSData();
    }, []);

    const yachtTypes = cmsData?.items || [];
    const galleryImages = cmsData?.section_slider || [];

    const handleNextSlide = () => {
        if (yachtTypes.length > 0) {
            setCarouselIndex((prev) => (prev + 1) % yachtTypes.length);
        }
    };

    const formik = useFormik({
        initialValues: {
            yacht_type: YACHT_TYPES[0],
            passenger_count: '',
            location: '',
            start_datetime: '',
            end_datetime: '',
            additional_notes: ''
        },
        validationSchema: Yup.object({
            yacht_type: Yup.string().required('Required'),
            passenger_count: Yup.number().positive('Must be positive').required('Required'),
            location: Yup.string().required('Required'),
            start_datetime: Yup.string().required('Required'),
            end_datetime: Yup.string().required('Required')
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

                await api.post('/yacht/frontend/create', payload);
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
                                alt={cmsData?.hero_title_1 || "Luxury Yacht Charters"}
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

                                    {/* Private Jet Promotion Button */}
                                    <Link href="/private-jets">
                                        <motion.div
                                            className="group relative flex items-center justify-start bg-[#113A74] text-white rounded-full h-[54px] cursor-pointer shadow-xl shadow-[#113A74]/20"
                                            initial="initial"
                                            whileHover="hover"
                                            variants={{
                                                initial: { width: 54 },
                                                hover: { width: 220 }
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        >
                                            <div className="flex items-center px-[17px] gap-3 shrink-0">
                                                <Plane className="w-5 h-5 shrink-0" />
                                                <motion.span
                                                    variants={{
                                                        initial: { opacity: 0, x: -10, width: 0, display: 'none' },
                                                        hover: { opacity: 1, x: 0, width: 'auto', display: 'block' }
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                    className="whitespace-nowrap font-bold text-[14px] pointer-events-none"
                                                >
                                                    Explore Private Jet
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
                                    alt={cmsData?.section_title_1 || 'Yacht Interior'}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Yacht Types Carousel Section */}
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
                                <div className="flex justify-start">
                                    <Skeleton className="w-16 h-16 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch relative">
                            <motion.div
                                key={`left-${carouselIndex}`}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full lg:w-[60%] relative rounded-[2rem] overflow-hidden group shadow-lg h-[300px] md:h-[420px] lg:h-[480px]"
                            >
                                <img
                                    src={yachtTypes[carouselIndex]?.img?.src || yachtTypes[carouselIndex]?.img}
                                    alt={yachtTypes[carouselIndex]?.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-8 z-10">
                                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4 sm:px-6 sm:py-5">
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                <Ship className="text-[#113A74] w-5 h-5" />
                                            </div>
                                            <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-heading mb-1">{yachtTypes[carouselIndex]?.name}</h3>
                                        </div>
                                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-lg">
                                            {yachtTypes[carouselIndex]?.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="w-full lg:w-[40%] flex flex-col justify-between gap-8 h-full">
                                <motion.div
                                    key={`right-${carouselIndex}`}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="w-full rounded-[2rem] overflow-hidden relative group shadow-md h-[280px] lg:h-[380px]"
                                >
                                    <img
                                        src={yachtTypes[(carouselIndex + 1) % yachtTypes.length]?.img?.src || yachtTypes[(carouselIndex + 1) % yachtTypes.length]?.img}
                                        alt={yachtTypes[(carouselIndex + 1) % yachtTypes.length]?.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                    <div className="absolute bottom-4 left-4 right-4 z-10">
                                        <div className="bg-black/30 backdrop-blur-xl rounded-2xl px-5 py-4">
                                            <div className="flex items-center gap-2.5 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                    <Compass className="text-[#113A74] w-4 h-4" />
                                                </div>
                                                <h3 className="text-white text-base sm:text-lg font-bold font-heading mb-1 truncate">{yachtTypes[(carouselIndex + 1) % yachtTypes.length]?.name}</h3>
                                            </div>
                                            <p className="text-white/70 text-xs leading-relaxed max-w-xs line-clamp-2">
                                                {yachtTypes[(carouselIndex + 1) % yachtTypes.length]?.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

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
                                    <h3 className="text-2xl font-bold text-[#113A74] mb-2">Enquiry Sent</h3>
                                    <p className="text-gray-500 max-w-md">Your yacht charter enquiry has been submitted successfully. We will check availability and contact you shortly.</p>
                                    <button 
                                        onClick={() => setSubmitStatus(null)}
                                        className="mt-8 text-[#FFA500] font-bold text-sm uppercase tracking-widest hover:underline"
                                    >
                                        Send Another Enquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={formik.handleSubmit} className="space-y-6">
                                    {/* Row 1 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Yacht Type <span className="text-red-500">*</span></label>
                                            <select 
                                                name="yacht_type"
                                                {...formik.getFieldProps('yacht_type')}
                                                className={`w-full border ${formik.touched.yacht_type && formik.errors.yacht_type ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors bg-transparent appearance-none`}
                                            >
                                                {YACHT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                            {formik.touched.yacht_type && formik.errors.yacht_type && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.yacht_type}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Number of Guests <span className="text-red-500">*</span></label>
                                            <input 
                                                type="number" 
                                                name="passenger_count"
                                                placeholder="e.g. 12" 
                                                {...formik.getFieldProps('passenger_count')}
                                                className={`w-full border ${formik.touched.passenger_count && formik.errors.passenger_count ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] text-gray-700 focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors`} 
                                            />
                                            {formik.touched.passenger_count && formik.errors.passenger_count && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.passenger_count}</p>}
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Preferred Location / Route <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input 
                                                type="text" 
                                                name="location"
                                                placeholder="Port, City or Specific Route" 
                                                {...formik.getFieldProps('location')}
                                                className={`w-full border ${formik.touched.location && formik.errors.location ? 'border-red-400' : 'border-gray-200'} rounded-lg pl-10 pr-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700`} 
                                            />
                                        </div>
                                        {formik.touched.location && formik.errors.location && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.location}</p>}
                                    </div>

                                    {/* Row 3 - Dates */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Charter Start <span className="text-red-500">*</span></label>
                                            <input 
                                                type="datetime-local" 
                                                name="start_datetime"
                                                {...formik.getFieldProps('start_datetime')}
                                                className={`w-full border ${formik.touched.start_datetime && formik.errors.start_datetime ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700`} 
                                            />
                                            {formik.touched.start_datetime && formik.errors.start_datetime && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.start_datetime}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Charter End <span className="text-red-500">*</span></label>
                                            <input 
                                                type="datetime-local" 
                                                name="end_datetime"
                                                {...formik.getFieldProps('end_datetime')}
                                                className={`w-full border ${formik.touched.end_datetime && formik.errors.end_datetime ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-3.5 text-[13px] focus:outline-none focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-colors text-gray-700`} 
                                            />
                                            {formik.touched.end_datetime && formik.errors.end_datetime && <p className="text-red-500 text-[11px] font-semibold mt-1">{formik.errors.end_datetime}</p>}
                                        </div>
                                    </div>

                                    {/* Row 4 */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-[#113A74] uppercase tracking-wider block">Additional Notes</label>
                                        <textarea 
                                            rows={4} 
                                            name="additional_notes"
                                            placeholder="Catering, water sports equipment, specific route..." 
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
                                            <p className="text-red-500 text-xs font-bold mt-4">Failed to submit enquiry. Please try again later.</p>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Right: Image Card */}
                        <div className="w-full lg:w-[488px] flex lg:justify-end items-center mt-10 lg:mt-0">
                            <div className="relative w-full aspect-square lg:h-[618px] lg:w-[488px] lg:aspect-auto rounded-[1.5rem] overflow-hidden shadow-2xl group border border-white/10">
                                <img
                                    src={cmsData?.form_image || wingBg.src || wingBg}
                                    alt="Marine Fleet"
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
            <AdventureSection />

            {/* Gallery Loop Section */}
            <GalleryLoop images={galleryImages} loading={isLoadingCMS} />
        </div>
    );
};

export default YachtsPage;
