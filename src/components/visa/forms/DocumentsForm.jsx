import React, { useState } from 'react';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import { api } from '../../../api/client';
import { useToast } from '../../../context/ToastContext';

const DocumentsForm = ({ values, errors, touched, setFieldValue }) => {
    const { error: toastError } = useToast();

    // Helper component for uploads
    const FileUpload = ({ label, subLabel, value, fieldName }) => {
        const [uploading, setUploading] = useState(false);

        const handleFileChange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toastError('Please upload an image file (JPG, PNG)');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toastError('File size must be less than 5MB');
                return;
            }

            setUploading(true);
            const data = new FormData();
            data.append('file', file);

            try {
                // Modified: removed custom Content-Type header to let browser set it with boundary
                const response = await api.post('/upload/image', data);

                if (response?.url) {
                    setFieldValue(fieldName, response.url);
                } else {
                    throw new Error('Upload failed - No URL returned');
                }
            } catch (err) {
                console.error('Upload Error:', err);
                toastError(err.message || 'Failed to upload image');
            } finally {
                setUploading(false);
            }
        };

        return (
            <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-900">
                    {label} <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center hover:bg-gray-50 transition-all cursor-pointer group relative ${touched[fieldName] && errors[fieldName] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-200'}`}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={24} className="text-green-500 animate-spin" />
                            <p className="text-sm font-bold text-gray-900">Uploading...</p>
                        </div>
                    ) : value ? (
                        <div className="flex flex-col items-center gap-3">
                            {/* Preview if it's an image URL */}
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            </div>

                            <div className="text-center z-20">
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldValue(fieldName, ''); }}
                                    className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1 mx-auto bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm"
                                >
                                    <X size={12} /> Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${touched[fieldName] && errors[fieldName] ? 'bg-red-100 text-red-500' : 'bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-green-500'}`}>
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <p className={`text-sm font-bold ${touched[fieldName] && errors[fieldName] ? 'text-red-600' : 'text-gray-900'}`}>Click to upload or drag and drop</p>
                                <p className={`text-xs mt-1 ${touched[fieldName] && errors[fieldName] ? 'text-red-400' : 'text-gray-400'}`}>{subLabel}</p>
                            </div>
                        </div>
                    )}
                </div>
                {touched[fieldName] && errors[fieldName] && (
                    <p className="text-xs text-red-500 mt-1 font-bold">{errors[fieldName]}</p>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Document Upload</h2>

            <div className="space-y-8">
                <FileUpload
                    label="Passport Photo (4x6)"
                    subLabel="PNG, JPG up to 5MB"
                    value={values.passport_photo_url}
                    fieldName="passport_photo_url"
                />

                <FileUpload
                    label="Passport Bio-data Page Scan"
                    subLabel="PNG, JPG up to 5MB"
                    value={values.passport_scan_url}
                    fieldName="passport_scan_url"
                />
            </div>
        </div>
    );
};

export default DocumentsForm;
