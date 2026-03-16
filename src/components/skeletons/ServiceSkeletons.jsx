import React from 'react';
import Skeleton from '../common/Skeleton';

export const ServiceHeaderSkeleton = () => {
    return (
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full py-2 px-6 shadow-sm border border-gray-100 mb-6">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-3 w-24 rounded-full" />
            </div>
            <Skeleton className="h-12 w-3/4 max-w-lg mx-auto mb-4 rounded-2xl" />
            <Skeleton className="h-4 w-5/6 max-w-xl mx-auto rounded-lg" />
        </div>
    );
};

export const FormSectionSkeleton = ({ fields = 3 }) => {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-50 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
                <Skeleton className="w-12 h-12 rounded-2xl shadow-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48 rounded-lg" />
                    <Skeleton className="h-3 w-32 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(fields)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-3 w-24 ml-1 rounded-full" />
                        <Skeleton className="h-[56px] w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ServicePageSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                <ServiceHeaderSkeleton />
                <div className="space-y-8">
                    <FormSectionSkeleton fields={3} />
                    <FormSectionSkeleton fields={6} />
                    <div className="flex justify-center pt-10">
                        <Skeleton className="h-16 w-64 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const VisaApplicationSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-4 w-96 rounded-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Steps */}
                    <div className="lg:col-span-3 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                        ))}
                    </div>

                    {/* Center Form */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                            <Skeleton className="h-8 w-48 mb-6 rounded-lg" />
                            <div className="grid grid-cols-2 gap-6">
                                <Skeleton className="h-20 w-full rounded-xl" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                            </div>
                            <Skeleton className="h-20 w-full rounded-xl" />
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <Skeleton className="h-12 w-32 rounded-xl" />
                            <Skeleton className="h-12 w-48 rounded-xl" />
                        </div>
                    </div>

                    {/* Right Summary */}
                    <div className="lg:col-span-3">
                        <Skeleton className="h-64 w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicePageSkeleton;
