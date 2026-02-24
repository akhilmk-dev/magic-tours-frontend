import React from 'react';
import Skeleton from '../common/Skeleton';

const PackageCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Image Container Skeleton */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
                <Skeleton className="w-full h-full" />

                {/* Tag Skeleton */}
                <div className="absolute top-4 left-4">
                    <Skeleton className="w-16 h-6 rounded-full" />
                </div>

                {/* Price Badge on Image Skeleton */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Skeleton className="w-32 h-5" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-4 h-4 rounded-full" />
                    ))}
                </div>

                {/* Title */}
                <div className="space-y-2 mb-3">
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-1/2 h-6" />
                </div>

                {/* Description */}
                <div className="space-y-2 mb-6">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                </div>

                {/* Info Box */}
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded-full" />
                        <Skeleton className="w-20 h-4" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="w-24 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageCardSkeleton;
