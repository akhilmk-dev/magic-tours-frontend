import React from 'react';
import { Calendar } from 'lucide-react';

const PersonalForm = ({ values, errors, touched, handleChange, handleBlur }) => {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={values.first_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.first_name && errors.first_name ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="John"
                        />
                        {touched.first_name && errors.first_name && (
                            <p className="text-xs text-red-500 mt-1 font-bold">{errors.first_name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={values.last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.last_name && errors.last_name ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="Doe"
                        />
                        {touched.last_name && errors.last_name && (
                            <p className="text-xs text-red-500 mt-1 font-bold">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={values.dob}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.dob && errors.dob ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {touched.dob && errors.dob && (
                            <p className="text-xs text-red-500 mt-1 font-bold">{errors.dob}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Nationality <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="nationality"
                            value={values.nationality}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer ${touched.nationality && errors.nationality ? 'border-red-500' : 'border-gray-200'}`}
                        >
                            <option value="">Select Country</option>
                            <option value="UAE">UAE</option>
                            <option value="USA">USA</option>
                            <option value="India">India</option>
                            <option value="UK">UK</option>
                        </select>
                        {touched.nationality && errors.nationality && (
                            <p className="text-xs text-red-500 mt-1 font-bold">{errors.nationality}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300 ${touched.email && errors.email ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="john.doe@example.com"
                    />
                    {touched.email && errors.email && (
                        <p className="text-xs text-red-500 mt-1 font-bold">{errors.email}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalForm;
