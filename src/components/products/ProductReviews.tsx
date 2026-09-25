import React from "react";
import { ProductReview } from "@/types/product";
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProductReviewsProps {
  reviews?: ProductReview[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="p-6 text-center text-sm text-muted-foreground">
        No reviews have been left for this product yet.
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Customer Reviews ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                className="flex flex-col justify-between space-y-3 rounded-lg border bg-muted/30 p-3.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < Math.round(rev.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{dateFormatted}</span>
                  </div>
                  <p className="text-sm italic text-foreground">&quot;{rev.comment}&quot;</p>
                </div>

                <div className="flex items-center gap-2 border-t pt-2">
                  <Avatar size="sm" className="size-6">
                    <AvatarFallback className="text-[10px]">
                      {rev.reviewerName?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium truncate">{rev.reviewerName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
