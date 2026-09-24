import React from "react";

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="h-12 bg-slate-100/70 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-lg shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-slate-200 rounded-sm" />
                <div className="h-3 w-24 bg-slate-100 rounded-sm" />
              </div>
            </div>
            <div className="h-4 w-20 bg-slate-200 rounded-sm hidden sm:block" />
            <div className="h-4 w-16 bg-slate-200 rounded-sm" />
            <div className="h-4 w-12 bg-slate-200 rounded-sm hidden md:block" />
            <div className="h-4 w-14 bg-slate-200 rounded-sm hidden lg:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="h-36 bg-slate-200 rounded-lg w-full" />
          <div className="h-4 bg-slate-200 rounded-sm w-3/4" />
          <div className="h-3 bg-slate-100 rounded-sm w-1/2" />
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="h-4 bg-slate-200 rounded-sm w-16" />
            <div className="h-4 bg-slate-200 rounded-sm w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
