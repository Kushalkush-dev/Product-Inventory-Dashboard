"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  Sparkles,
  Zap,
  Search,
  ShieldCheck,
  Layers,
  BarChart3,
  MoonStar,
  CheckCircle2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const FEATURES = [
  {
    icon: Search,
    title: "Instant Search & Deep Filtering",
    description:
      "Real-time debounced search, category filters, and multi-field sorting with synchronized URL query states.",
  },
  {
    icon: MoonStar,
    title: "Adaptive OKLCH Theme",
    description:
      "Built with high-fidelity OKLCH color tokens, automatic system theme matching, and smooth Light/Dark mode transitions.",
  },
  {
    icon: Layers,
    title: "Catalog Lifecycle & Live Previews",
    description:
      "Add, edit, and delete catalog items with instant client persistence and an interactive live card preview editor.",
  },
  {
    icon: ShieldCheck,
    title: "Protected Sessions & Auth",
    description:
      "Enterprise route protection with test credentials, profile dropdown management, and resilient mock API fallbacks.",
  },
];

const STATS = [
  { value: "190+", label: "Catalog Products" },
  { value: "24", label: "Product Categories" },
  { value: "< 50ms", label: "Query Response" },
  { value: "100%", label: "Responsive Layout" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xs">
              <Package className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">ProductHub</span>
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Subtle Ambient Background Gradients */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-60"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="aspect-1155/678 w-[68rem] bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/10 opacity-40 dark:opacity-30"
            />
          </div>

          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3.5 py-1.5 text-xs font-semibold shadow-2xs backdrop-blur-sm">
              <Sparkles className="size-3.5 text-primary" />
              <span>Next.js 16 • Tailwind CSS v4 • Shadcn UI</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance">
                Smart Product Operations{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-base sm:text-xl text-muted-foreground text-pretty leading-relaxed">
                A high-performance product inventory platform featuring real-time debounced search, deep URL state synchronization, and reliable local mutation tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/products"
                className={buttonVariants({ size: "lg", className: "w-full sm:w-auto gap-2 text-base px-6 h-11" })}
              >
                <span>Explore Products</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto gap-2 text-base px-6 h-11" })}
              >
                <span>Demo Login</span>
              </Link>
            </div>

            {/* Platform highlights checkmarks */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> No setup needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> Pre-loaded demo credentials
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> Full CRUD simulator
              </span>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="border-y bg-muted/30 py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {STATS.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                Platform Capabilities
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to manage modern inventory
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Engineered for speed, intuitive interaction, and accessible user experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <Card key={idx} className="transition-all hover:shadow-sm">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Package className="size-4 text-primary" />
            <span>ProductHub Inventory Management</span>
          </div>
          <p>© {new Date().getFullYear()} ProductHub. Built with Next.js & Shadcn UI.</p>
        </div>
      </footer>
    </div>
  );
}
