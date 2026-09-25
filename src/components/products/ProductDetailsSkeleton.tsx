import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Skeleton className="h-5 w-32" />

      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Images */}
          <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-lg shrink-0" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
