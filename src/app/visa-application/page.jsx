"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import VisaSteps from '../../components/visa/VisaSteps';
import FeeSummary from '../../components/visa/FeeSummary';
import PersonalForm from '../../components/visa/forms/PersonalForm';
import PassportForm from '../../components/visa/forms/PassportForm';
import TravelForm from '../../components/visa/forms/TravelForm';
import DocumentsForm from '../../components/visa/forms/DocumentsForm';
import ReviewForm from '../../components/visa/forms/ReviewForm';

const validationSchemas = [
    // Step 0: Personal Information
    Yup.object().shape({
        first_name: Yup.string().required('First Name is required'),
        last_name: Yup.string().required('Last Name is required'),
        dob: Yup.string().required('Date of Birth is required'),
        nationality: Yup.string().required('Nationality is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    // Step 1: Passport Details
    Yup.object().shape({
        passport_number: Yup.string().required('Passport Number is required'),
        passport_expiry: Yup.string().required('Passport Expiry Date is required'),
        passport_issue_place: Yup.string().required('Place of Issue is required'),
    }),
    // Step 2: Travel Information
    Yup.object().shape({
        destination: Yup.string().required('Destination is required'),
        travel_date: Yup.string().required('Travel Date is required'),
        visa_type: Yup.string().required('Visa Type is required'),
    }),
    // Step 3: Document Upload
    Yup.object().shape({
        passport_photo_url: Yup.string().required('Passport Photo is required'),
        passport_scan_url: Yup.string().required('Passport Scan is required'),
    }),
    // Step 4: Review (No validation needed)
    Yup.object().shape({})
];

const VisaApplicationPage = () => {
    const { user } = useCustomerAuth();
    const { success, error: toastError } = useToast();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const initialValues = {
        first_name: user?.name?.split(' ')[0] || '',
        last_name: user?.name?.split(' ').slice(1).join(' ') || '',
        dob: '',
        nationality: '',
        email: user?.email || '',
        destination: '',
        travel_date: '',
        visa_type: 'Tourist',
        passport_number: '',
        passport_expiry: '',
        passport_issue_place: '',
        passport_photo_url: '',
        passport_scan_url: '',
        visa_status: 'Pending Processing',
        customer_id: user?.id || ''
    };

    const handleNext = async (validateForm, setTouched) => {
        const errors = await validateForm();
        const currentSchema = validationSchemas[currentStep];

        // Manually check if fields in current step has errors
        const schemaKeys = Object.keys(currentSchema.fields);
        const hasStepErrors = schemaKeys.some(key => errors[key]);

        if (!hasStepErrors) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        } else {
            // Touch all fields in current step to show errors
            const touchedFields = {};
            schemaKeys.forEach(key => { touchedFields[key] = true; });
            setTouched({ ...touchedFields });
            toastError("Please fill in all required fields accurately.");
        }
    };

    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await api.post('/visa', values);
            success('Visa Application Submitted Successfully!');
            router.push('/profile');
        } catch (err) {
            toastError(err.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (formikProps) => {
        switch (currentStep) {
            case 0: return <PersonalForm {...formikProps} />;
            case 1: return <PassportForm {...formikProps} />;
            case 2: return <TravelForm {...formikProps} />;
            case 3: return <DocumentsForm {...formikProps} />;
            case 4: return <ReviewForm formData={formikProps.values} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Visa Application Form</h1>
                        <p className="text-gray-500 mt-2">Complete the details below to apply for your travel visa. Powered by AI Assistant.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={validationSchemas[currentStep]}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps) => (
                            <>
                                {/* Left Column: Steps */}
                                <div className="lg:col-span-3">
                                    <VisaSteps currentStep={currentStep} />
                                </div>

                                {/* Center Column: Form */}
                                <div className="lg:col-span-6 space-y-8">
                                    <Form>
                                        {renderStepContent(formikProps)}
                                    </Form>

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center pt-4">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            disabled={currentStep === 0}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all
                                                ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            <ChevronLeft size={16} /> Back
                                        </button>

                                        {currentStep === 4 ? (
                                            <button
                                                type="button"
                                                onClick={() => formikProps.submitForm()}
                                                disabled={loading}
                                                className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                                Submit Application
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleNext(formikProps.validateForm, formikProps.setTouched)}
                                                className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all"
                                            >
                                                Continue <ChevronRight size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </Formik>

                    {/* Right Column: Fee Summary */}
                    <div className="lg:col-span-3">
                        <FeeSummary />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisaApplicationPage;
