"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application boundary error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 p-8 shadow-xs space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <AlertOctagon className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Application Error</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          {error.message || "An unexpected error occurred while rendering the dashboard."}
        </p>
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
