"use client";

import React from "react";
import { AllowedSortBy, AllowedOrder } from "@/utils/urlParams";
import { ArrowDownAZ, ArrowUpZA, ArrowUpDown } from "lucide-react";

interface SortControlsProps {
  sortBy?: AllowedSortBy;
  order?: AllowedOrder;
  onSortChange: (sortBy?: AllowedSortBy, order?: AllowedOrder) => void;
  disabled?: boolean;
}

export function SortControls({
  sortBy,
  order = "asc",
  onSortChange,
  disabled = false,
}: SortControlsProps) {
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      onSortChange(undefined, undefined);
    } else {
      onSortChange(value as AllowedSortBy, order || "asc");
    }
  };

  const handleToggleOrder = () => {
    if (!sortBy) return;
    const nextOrder: AllowedOrder = order === "asc" ? "desc" : "asc";
    onSortChange(sortBy, nextOrder);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <select
          id="sort-by-select"
          value={sortBy || ""}
          disabled={disabled}
          onChange={handleSortFieldChange}
          aria-label="Sort products by"
          className="appearance-none pl-8 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 font-medium hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 transition cursor-pointer"
        >
          <option value="">Default sorting</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
        </select>

        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5" />
        </div>

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {sortBy && (
        <button
          type="button"
          onClick={handleToggleOrder}
          disabled={disabled}
          className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50 cursor-pointer"
          title={`Order: ${order === "asc" ? "Ascending (click for Descending)" : "Descending (click for Ascending)"}`}
          aria-label={`Current sort order is ${order}. Click to toggle.`}
        >
          {order === "asc" ? (
            <>
              <ArrowDownAZ className="w-4 h-4 text-blue-600" />
              <span>ASC</span>
            </>
          ) : (
            <>
              <ArrowUpZA className="w-4 h-4 text-blue-600" />
              <span>DESC</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
