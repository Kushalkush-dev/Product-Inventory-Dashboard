"use client";

import React from "react";
import { AllowedSortBy, AllowedOrder } from "@/utils/urlParams";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SortControlsProps {
  sortBy?: AllowedSortBy;
  order?: AllowedOrder;
  onSortChange: (sortBy?: AllowedSortBy, order?: AllowedOrder) => void;
  disabled?: boolean;
}

const SORT_LABELS: Record<string, string> = {
  price: "Price",
  rating: "Rating",
  title: "Title",
};

export function SortControls({
  sortBy,
  order = "asc",
  onSortChange,
  disabled = false,
}: SortControlsProps) {
  const handleSortChange = (value: string | null) => {
    if (!value || value === "default" || value === "none") {
      onSortChange(undefined, undefined);
    } else {
      onSortChange(value as AllowedSortBy, order || "asc");
    }
  };

  const toggleOrder = () => {
    if (!sortBy) return;
    onSortChange(sortBy, order === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex items-center gap-1.5">
      <Select value={sortBy || "default"} onValueChange={handleSortChange} disabled={disabled}>
        <SelectTrigger aria-label="Sort products by" className="w-[160px]">
          <SelectValue placeholder="Default Sorting">
            {(val: string | null) =>
              !val || val === "default" || val === "none"
                ? "Default Sorting"
                : SORT_LABELS[val] || val
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Sorting</SelectItem>
          <SelectItem value="price">Price</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>

      {sortBy && (
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleOrder}
          disabled={disabled}
          aria-label={`Sort order: ${order}`}
        >
          {order === "asc" ? <ArrowDownAZ className="text-primary size-4" /> : <ArrowUpZA className="text-primary size-4" />}
          {order === "asc" ? "ASC" : "DESC"}
        </Button>
      )}
    </div>
  );
}
