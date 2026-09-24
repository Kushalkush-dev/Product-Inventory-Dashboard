import Link from "next/link";
import { ArrowRight, Box, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-linear-to-b from-slate-50 via-white to-slate-100">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-600/20">
          <Zap className="w-3.5 h-3.5" /> Next.js App Router Dashboard
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Product Management <br />
          <span className="text-blue-600">Reimagined</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          High-performance product operations platform featuring real-time debounced search, deep URL state synchronization, and reliable mutation tracking.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Access Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            <Box className="w-4 h-4 text-slate-500" /> View Products
          </Link>
        </div>
      </div>
    </div>
  );
}
