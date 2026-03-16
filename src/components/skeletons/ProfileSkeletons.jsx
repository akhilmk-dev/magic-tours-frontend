import React from 'react';
import Skeleton from '../common/Skeleton';

export const ProfileHeaderSkeleton = () => {
    return (
        <div className="bg-[#113A74] pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-xl flex-shrink-0 animate-pulse bg-white/10">
                    <Skeleton className="w-full h-full bg-white/10" />
                </div>
                <div className="text-center sm:text-left flex-1 space-y-3">
                    <Skeleton className="h-10 sm:h-14 w-64 mx-auto sm:mx-0 bg-white/10 rounded-xl" />
                    <Skeleton className="h-4 w-48 mx-auto sm:mx-0 bg-white/10 rounded-lg" />
                </div>
                <div>
                  <Skeleton className="w-32 h-12 rounded-full bg-white/10" />
                </div>
            </div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA500]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        </div>
    );
};

export const ProfileSidebarSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-6 sm:p-8">
            <Skeleton className="h-4 w-32 mb-6 rounded-md" />
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-2xl">
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                        <Skeleton className="h-5 w-full rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProfileTabSkeleton = () => {
    return (
        <div className="bg-white rounded-full shadow-sm p-1.5 flex flex-wrap gap-2 mb-8 max-w-fit">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-32 sm:w-40 rounded-full" />
            ))}
        </div>
    );
};

export const ProfileCardSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 border border-transparent">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="w-20 h-6 rounded-full" />
                        <Skeleton className="w-16 h-4 rounded-md" />
                    </div>
                    <Skeleton className="h-8 w-3/4 rounded-xl" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                </div>
                <div className="bg-gray-50 py-3 px-6 rounded-2xl shrink-0 w-32 h-16">
                    <Skeleton className="w-16 h-2 mb-2 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-md" />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="w-16 h-2 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="w-24 h-4 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProfileSkeletons = () => {
    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20">
            <ProfileHeaderSkeleton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <ProfileSidebarSkeleton />
                    </div>
                    <div className="lg:col-span-3">
                        <ProfileTabSkeleton />
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <ProfileCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeletons;
