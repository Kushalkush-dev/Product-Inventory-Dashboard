"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { AllowedLimit, ALLOWED_LIMITS } from "@/utils/urlParams";
import { getPaginationInfo } from "@/utils/pagination";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface PaginationProps {
  total: number;
  page: number;
  limit: AllowedLimit;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: AllowedLimit) => void;
  disabled?: boolean;
}

export function Pagination({ total, page, limit, onPageChange, onLimitChange, disabled = false }: PaginationProps) {
  const info = getPaginationInfo(total, page, limit);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t py-4 sm:flex-row">
      {/* Summary + limit selector */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{info.startItem}</strong>–
          <strong className="text-foreground">{info.endItem}</strong> of{" "}
          <strong className="text-foreground">{info.total}</strong>
        </span>

        <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v) as AllowedLimit)} disabled={disabled}>
          <SelectTrigger className="w-[70px]" aria-label="Items per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALLOWED_LIMITS.map((size) => (
              <SelectItem key={size} value={String(size)}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(info.page - 1)} disabled={!info.hasPrev || disabled} aria-label="Previous">
          <ChevronLeft />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {info.pageNumbers.map((num, idx) =>
          num === "ellipsis" ? (
            <span key={`e-${idx}`} className="px-2 text-muted-foreground"><MoreHorizontal className="size-4" /></span>
          ) : (
            <Button
              key={num}
              variant={num === info.page ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => onPageChange(num)}
              disabled={disabled}
              aria-current={num === info.page ? "page" : undefined}
              aria-label={`Page ${num}`}
            >
              {num}
            </Button>
          )
        )}

        <Button variant="outline" size="sm" onClick={() => onPageChange(info.page + 1)} disabled={!info.hasNext || disabled} aria-label="Next">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
