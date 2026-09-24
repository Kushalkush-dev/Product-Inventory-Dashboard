"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { AllowedLimit, ALLOWED_LIMITS } from "@/utils/urlParams";
import { getPaginationInfo } from "@/utils/pagination";

interface PaginationProps {
  total: number;
  page: number;
  limit: AllowedLimit;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: AllowedLimit) => void;
  disabled?: boolean;
}

export function Pagination({
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  disabled = false,
}: PaginationProps) {
  const info = getPaginationInfo(total, page, limit);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200">
      {/* Showing X–Y of Z and Limit Selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
        <span>
          Showing <strong className="text-slate-900">{info.startItem}</strong>–
          <strong className="text-slate-900">{info.endItem}</strong> of{" "}
          <strong className="text-slate-900">{info.total}</strong> products
        </span>

        <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
          <label htmlFor="limit-select" className="text-xs text-slate-500">
            Per page:
          </label>
          <select
            id="limit-select"
            value={limit}
            disabled={disabled}
            onChange={(e) => onLimitChange(Number(e.target.value) as AllowedLimit)}
            className="px-2 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:opacity-50"
          >
            {ALLOWED_LIMITS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Buttons and Page Numbers */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(info.page - 1)}
          disabled={!info.hasPrev || disabled}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Sequence */}
        <div className="flex items-center gap-1 px-1">
          {info.pageNumbers.map((num, idx) => {
            if (num === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-400 select-none"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const isCurrent = num === info.page;
            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                disabled={disabled}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                }`}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${num}`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(info.page + 1)}
          disabled={!info.hasNext || disabled}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
