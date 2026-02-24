import React from 'react';

const PassportForm = ({ values, errors, touched, handleChange, handleBlur }) => {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Passport Details</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Passport Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="passport_number"
                        value={values.passport_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.passport_number && errors.passport_number ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Enter your passport number"
                    />
                    {touched.passport_number && errors.passport_number && (
                        <p className="text-xs text-red-500 mt-1 font-bold">{errors.passport_number}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Date of Expiry <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="passport_expiry"
                                value={values.passport_expiry}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.passport_expiry && errors.passport_expiry ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {touched.passport_expiry && errors.passport_expiry && (
                                <p className="text-xs text-red-500 mt-1 font-bold">{errors.passport_expiry}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Place of Issue <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="passport_issue_place"
                        value={values.passport_issue_place}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.passport_issue_place && errors.passport_issue_place ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Enter place of issue"
                    />
                    {touched.passport_issue_place && errors.passport_issue_place && (
                        <p className="text-xs text-red-500 mt-1 font-bold">{errors.passport_issue_place}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PassportForm;
