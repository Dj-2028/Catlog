import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-[#E7E5E4] rounded-lg ${className}`} />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden flex flex-col p-4 space-y-3 shadow-xs">
      <Skeleton className="w-full aspect-4/3 rounded-xl" />
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="pt-4 border-t border-[#F5F5F4] flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
};
