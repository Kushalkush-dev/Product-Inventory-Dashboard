import React from "react";

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Top back button skeleton */}
      <div className="h-6 w-32 bg-slate-200 rounded-sm" />

      {/* Main product view grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="h-80 w-full bg-slate-200 rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 w-16 bg-slate-200 rounded-lg shrink-0" />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-4">
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
          <div className="h-8 w-3/4 bg-slate-200 rounded-sm" />
          <div className="h-6 w-32 bg-slate-200 rounded-sm" />
          <div className="h-20 w-full bg-slate-100 rounded-sm" />
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="h-12 bg-slate-100 rounded-lg" />
            <div className="h-12 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Reviews skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
        <div className="h-6 w-40 bg-slate-200 rounded-sm" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
