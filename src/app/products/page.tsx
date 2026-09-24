"use client";

import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { productApi } from "@/api/productApi";
import { Product } from "@/types/product";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductCards } from "@/components/products/ProductCards";
import { Pagination } from "@/components/products/Pagination";
import { TableSkeleton, CardsSkeleton } from "@/components/common/Skeletons";
import { ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import {
  parseProductQueryParams,
  buildProductQueryString,
  AllowedLimit,
  ProductQueryState,
} from "@/utils/urlParams";
import { calculateSkip } from "@/utils/pagination";
import Link from "next/link";
import { Plus } from "lucide-react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Centralized URL state parsing
  const queryState: ProductQueryState = parseProductQueryParams(searchParams);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper to synchronize updated state to URL
  const updateQueryState = useCallback(
    (updates: Partial<ProductQueryState>) => {
      const nextState: ProductQueryState = {
        ...queryState,
        ...updates,
      };
      const queryString = buildProductQueryString(nextState);
      router.push(`/products${queryString}`);
    },
    [queryState, router]
  );

  const handlePageChange = (newPage: number) => {
    updateQueryState({ page: newPage });
  };

  const handleLimitChange = (newLimit: AllowedLimit) => {
    // Changing page size resets to page 1
    updateQueryState({ limit: newLimit, page: 1 });
  };

  const loadProducts = useCallback(
    async (isRetry = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isRetry) {
        setIsRetrying(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const skip = calculateSkip(queryState.page, queryState.limit);
        const data = await productApi.getProducts(
          {
            limit: queryState.limit,
            skip,
            search: queryState.search,
            category: queryState.category,
            sortBy: queryState.sortBy,
            order: queryState.order,
          },
          controller.signal
        );

        setProducts(data.products);
        setTotal(data.total);

        // Normalize out-of-range page if server returns total less than current page offset
        const maxPages = Math.max(1, Math.ceil(data.total / queryState.limit));
        if (queryState.page > maxPages && data.total > 0) {
          updateQueryState({ page: maxPages });
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          setError(error.message || "Failed to load products");
        }
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    [queryState.page, queryState.limit, queryState.search, queryState.category, queryState.sortBy, queryState.order, updateQueryState]
  );

  useEffect(() => {
    loadProducts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadProducts]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, filter, and track catalog items ({total} total products).
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Data Presentation */}
      {isLoading ? (
        <div>
          <div className="hidden md:block">
            <TableSkeleton rows={queryState.limit} />
          </div>
          <div className="block md:hidden">
            <CardsSkeleton count={Math.min(6, queryState.limit)} />
          </div>
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to fetch products"
          message={error}
          onRetry={() => loadProducts(true)}
          isRetrying={isRetrying}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="No products match your current filters or page selection."
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ProductTable products={products} />
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden">
            <ProductCards products={products} />
          </div>

          {/* Manual URL-synced Pagination */}
          <Pagination
            total={total}
            page={queryState.page}
            limit={queryState.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            disabled={isLoading}
          />
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <Suspense
          fallback={
            <div className="max-w-7xl w-full mx-auto px-4 py-8">
              <TableSkeleton rows={10} />
            </div>
          }
        >
          <ProductsContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
