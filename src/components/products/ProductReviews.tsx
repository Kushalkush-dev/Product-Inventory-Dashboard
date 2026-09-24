import React from "react";
import { ProductReview } from "@/types/product";
import { Star, User } from "lucide-react";

interface ProductReviewsProps {
  reviews?: ProductReview[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center text-slate-500 text-sm">
        No reviews have been left for this product yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((rev, index) => {
          const dateFormatted = rev.date
            ? new Date(rev.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent";

          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(rev.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{dateFormatted}</span>
                </div>
                <p className="text-sm text-slate-700 italic">&quot;{rev.comment}&quot;</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {rev.reviewerName}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
