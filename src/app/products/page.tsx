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
import { SearchInput } from "@/components/products/SearchInput";
import { TableSkeleton, CardsSkeleton } from "@/components/common/Skeletons";
import { ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import {
  parseProductQueryParams,
  buildProductQueryString,
  AllowedLimit,
  ProductQueryState,
} from "@/utils/urlParams";
import { calculateSkip } from "@/utils/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { Plus, Info } from "lucide-react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Centralized URL state parsing
  const queryState: ProductQueryState = parseProductQueryParams(searchParams);

  // Local immediate search input state for responsive keystrokes
  const [searchTerm, setSearchTerm] = useState<string>(queryState.search);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 400);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // AbortController ref to cancel in-flight stale network requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Request ID counter to guarantee stale-response protection (latest search always wins)
  const requestIdRef = useRef<number>(0);

  // Synchronize local search input if URL changes externally (e.g. Back/Forward)
  useEffect(() => {
    setSearchTerm(queryState.search);
  }, [queryState.search]);

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

  // When debounced search term changes, sync with URL and reset page to 1
  useEffect(() => {
    if (debouncedSearchTerm !== queryState.search) {
      updateQueryState({
        search: debouncedSearchTerm,
        page: 1, // Search change resets page to 1
        // Note: When search is active, category is cleared/disabled due to API limitation
        category: debouncedSearchTerm.trim() ? "all" : queryState.category,
      });
    }
  }, [debouncedSearchTerm, queryState.search, queryState.category, updateQueryState]);

  const handlePageChange = (newPage: number) => {
    updateQueryState({ page: newPage });
  };

  const handleLimitChange = (newLimit: AllowedLimit) => {
    updateQueryState({ limit: newLimit, page: 1 });
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    updateQueryState({ search: "", page: 1 });
  };

  /**
   * Loads products with:
   * 1. AbortController cancellation for previous in-flight requests.
   * 2. Request identity sequence check (requestIdRef) to ensure delayed responses (e.g., &delay=2000)
   *    can never overwrite newer responses.
   */
  const loadProducts = useCallback(
    async (isRetry = false) => {
      // 1. Cancel previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 2. Increment request identity counter
      const currentRequestId = ++requestIdRef.current;

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

        // 3. Stale Response Guard: Only commit state if this request is still the latest one
        if (currentRequestId === requestIdRef.current) {
          setProducts(data.products);
          setTotal(data.total);

          // Normalize out-of-range page if server returns total less than current page offset
          const maxPages = Math.max(1, Math.ceil(data.total / queryState.limit));
          if (queryState.page > maxPages && data.total > 0) {
            updateQueryState({ page: maxPages });
          }
        }
      } catch (err: unknown) {
        const error = err as Error;
        // Ignore aborted requests; only set error for the latest active request
        if (
          currentRequestId === requestIdRef.current &&
          error.name !== "CanceledError" &&
          error.name !== "AbortError"
        ) {
          setError(error.message || "Failed to load products");
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
          setIsRetrying(false);
        }
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

  const isSearchActive = !!queryState.search.trim();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Title & Actions */}
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

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleSearchClear}
          isLoading={isLoading && isSearchActive}
        />

        {/* Search / Category limitation alert */}
        {isSearchActive && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/60 text-xs text-amber-800">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Search is active. Category filters are temporarily disabled due to API limitations.</span>
          </div>
        )}
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
          title={isSearchActive ? `No results for "${queryState.search}"` : "No products found"}
          message={
            isSearchActive
              ? "We couldn't find any products matching your search term. Try adjusting your spelling or searching for another keyword."
              : "No products match your current filters."
          }
          action={
            isSearchActive ? (
              <button
                onClick={handleSearchClear}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
              >
                Clear Search
              </button>
            ) : undefined
          }
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
