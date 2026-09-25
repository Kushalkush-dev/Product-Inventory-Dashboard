"use client";

import React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="pl-8 pr-9"
      />
      <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
        {isLoading && <Loader2 className="size-4 animate-spin text-primary" />}
        {!isLoading && value && (
          <Button variant="ghost" size="icon-xs" onClick={onClear} aria-label="Clear search">
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
