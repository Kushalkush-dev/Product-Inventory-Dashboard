"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-7 w-13 rounded-full border border-input bg-muted/50 p-0.5"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={`Current: ${resolvedTheme === "dark" ? "Dark" : "Light"} (click to toggle)`}
      className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border border-input bg-muted p-0.5 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={cn(
          "pointer-events-none flex size-6 items-center justify-center rounded-full bg-background shadow-xs transition-transform duration-200",
          isDark ? "translate-x-6 text-primary" : "translate-x-0 text-amber-500"
        )}
      >
        {isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      </span>
    </button>
  );
}
