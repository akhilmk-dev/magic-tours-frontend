import React from 'react';

const TravelForm = ({ values, errors, touched, handleChange, handleBlur }) => {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Travel Information</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Destination Country <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="destination"
                        value={values.destination}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.destination && errors.destination ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="e.g. France, Japan, etc."
                    />
                    {touched.destination && errors.destination && (
                        <p className="text-xs text-red-500 mt-1 font-bold">{errors.destination}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Expected Travel Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="travel_date"
                            value={values.travel_date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${touched.travel_date && errors.travel_date ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {touched.travel_date && errors.travel_date && (
                            <p className="text-xs text-red-500 mt-1 font-bold">{errors.travel_date}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Visa Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="visa_type"
                            value={values.visa_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer ${touched.visa_type && errors.visa_type ? 'border-red-500' : 'border-gray-200'}`}
                        >
                            <option value="Tourist">Tourist Visa</option>
                            <option value="Business">Business Visa</option>
                            <option value="Transit">Transit Visa</option>
                            <option value="Student">Student Visa</option>
                        </select>
                        {touched.visa_type && errors.visa_type && (
                            <p className="text-xs text-red-500 mt-1 font-bold">{errors.visa_type}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelForm;
