"use client";

import React from "react";
import { ProductCategory } from "@/types/product";
import { Filter, Loader2 } from "lucide-react";

interface CategoryFilterProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
  disabled = false,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          id="category-filter-select"
          value={selectedCategory}
          disabled={disabled || isLoading}
          onChange={(e) => onSelectCategory(e.target.value)}
          aria-label="Filter by category"
          className="appearance-none pl-8 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 font-medium hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-100 transition cursor-pointer capitalize"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <Filter className="w-3.5 h-3.5" />
          )}
        </div>

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
