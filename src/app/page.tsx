"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  Layers,
  Search,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Home() {
  return (
    <div className="flex h-screen flex-col justify-between bg-background text-foreground overflow-hidden">
      {/* Top Header */}
      <header className="w-full border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">StockPulse</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Sign In
            </Link>
            <Link
              href="/products"
              className={buttonVariants({ size: "sm" })}
            >
              Launch App
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero - Single Section (No scroll needed) */}
      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            <span>Live Inventory Management System</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground text-balance">
              Modern Inventory & Product Management
            </h1>
            <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground text-pretty leading-relaxed">
              Streamline catalog operations, track stock levels, and organize products with speed and precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/products"
              className={buttonVariants({ size: "default", className: "w-full sm:w-auto gap-2 px-6" })}
            >
              <span>Access Inventory</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "default", className: "w-full sm:w-auto px-6" })}
            >
              <span>Demo Login</span>
            </Link>
          </div>

          {/* Clean 3-Pill Highlights */}
          <div className="pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="flex items-center gap-2.5 rounded-lg border bg-card p-3">
              <Search className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Real-time Search</p>
                <p className="text-[11px] text-muted-foreground">Instant filters & sorting</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border bg-card p-3">
              <Layers className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Complete Catalog</p>
                <p className="text-[11px] text-muted-foreground">Full CRUD operations</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border bg-card p-3">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Secure Sessions</p>
                <p className="text-[11px] text-muted-foreground">Protected route access</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground bg-background">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
          <p className="font-medium text-foreground">StockPulse</p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
