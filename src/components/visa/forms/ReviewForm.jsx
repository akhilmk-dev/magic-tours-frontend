import React from 'react';
import { Shield } from 'lucide-react';

const ReviewForm = ({ formData }) => {

    const InfoRow = ({ label, value }) => (
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <p className="font-bold text-gray-900">{value || '-'}</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Final Review</h2>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <InfoRow label="Full Name" value={`${formData.first_name} ${formData.last_name}`} />
                    <InfoRow label="Nationality" value={formData.nationality} />
                    <InfoRow label="Email" value={formData.email} />
                    <InfoRow label="Passport Number" value={formData.passport_number} />
                    <InfoRow label="Passport Expiry" value={formData.passport_expiry} />
                    <InfoRow label="Destination" value={formData.destination} />
                    <InfoRow label="Travel Date" value={formData.travel_date} />
                    <InfoRow label="Visa Type" value={formData.visa_type} />
                </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl text-green-800 leading-relaxed font-medium">
                <Shield size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">
                    By submitting this application, you confirm that all information provided is accurate and true to the best of your knowledge.
                    Information provided will be securely processed and used solely for visa application purposes.
                </p>
            </div>
        </div>
    );
};

export default ReviewForm;
