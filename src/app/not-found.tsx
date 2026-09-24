import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <PackageX className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          The page or product resource you are searching for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
