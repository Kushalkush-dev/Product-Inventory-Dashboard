"use client";

import React from "react";
import { ProductCategory } from "@/types/product";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    <Select
      value={selectedCategory || "all"}
      onValueChange={(val) => onSelectCategory(val || "all")}
      disabled={disabled || isLoading}
    >
      <SelectTrigger aria-label="Filter by category" className="w-[180px]">
        <SelectValue placeholder="All Categories">
          {(val: string | null) => {
            if (!val || val === "all") return "All Categories";
            const found = categories.find((c) => c.slug === val);
            return found ? found.name : val;
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.slug} value={cat.slug} className="capitalize">
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
