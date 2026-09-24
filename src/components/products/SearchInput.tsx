"use client";

import React from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  isLoading = false,
  placeholder = "Search products by title, description...",
  disabled = false,
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition disabled:opacity-50 disabled:bg-slate-50"
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        )}
        {!isLoading && value && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
