import React from "react";

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}></div>
  );
};

export const CourseCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.35)] backdrop-blur">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-5 flex-grow space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
      <div className="flex justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};

export default Skeleton;
