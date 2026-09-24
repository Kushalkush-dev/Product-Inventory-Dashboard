"use client";

import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { productApi } from "@/api/productApi";
import { Product, ProductCategory } from "@/types/product";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductCards } from "@/components/products/ProductCards";
import { Pagination } from "@/components/products/Pagination";
import { SearchInput } from "@/components/products/SearchInput";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { SortControls } from "@/components/products/SortControls";
import { DeleteConfirmationDialog } from "@/components/products/DeleteConfirmationDialog";
import { TableSkeleton, CardsSkeleton } from "@/components/common/Skeletons";
import { ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import { useProductMutations } from "@/context/ProductMutationContext";
import {
  parseProductQueryParams,
  buildProductQueryString,
  AllowedLimit,
  AllowedSortBy,
  AllowedOrder,
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

  // Local mutation tracking context
  const { addedProducts, mergeWithServerProducts, recordDelete } = useProductMutations();

  // Local immediate search input state for responsive keystrokes
  const [searchTerm, setSearchTerm] = useState<string>(queryState.search);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 400);

  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // AbortController ref to cancel in-flight stale network requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Request ID counter to guarantee stale-response protection (latest request always wins)
  const requestIdRef = useRef<number>(0);

  // Load categories once on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        const cats = await productApi.getCategories();
        if (isMounted) {
          setCategories(cats);
        }
      } catch (e) {
        console.error("Failed to load categories:", e);
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    }
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleCategorySelect = (selectedCat: string) => {
    setSearchTerm("");
    updateQueryState({ category: selectedCat, search: "", page: 1 });
  };

  const handleSortChange = (newSortBy?: AllowedSortBy, newOrder?: AllowedOrder) => {
    updateQueryState({ sortBy: newSortBy, order: newOrder, page: 1 });
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await productApi.deleteProduct(productToDelete.id);
      recordDelete(productToDelete.id);
      setProductToDelete(null);
    } catch (e) {
      console.error("Delete failed on API, still recording local deletion:", e);
      recordDelete(productToDelete.id);
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Loads products with AbortController cancellation and requestId sequence check.
   */
  const loadProducts = useCallback(
    async (isRetry = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

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

        if (currentRequestId === requestIdRef.current) {
          setRawProducts(data.products);
          setTotal(data.total);

          const maxPages = Math.max(1, Math.ceil(data.total / queryState.limit));
          if (queryState.page > maxPages && data.total > 0) {
            updateQueryState({ page: maxPages });
          }
        }
      } catch (err: unknown) {
        const error = err as Error;
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

  // Combine server products with local mutations (edits & deletions)
  const mergedProducts = mergeWithServerProducts(rawProducts);

  // If on page 1 without search or category filter, prepend local additions
  const isDefaultView = queryState.page === 1 && !queryState.search && queryState.category === "all";
  const displayedProducts = isDefaultView
    ? [...addedProducts, ...mergedProducts.filter((p) => !addedProducts.some((a) => a.id === p.id))]
    : mergedProducts;

  const isSearchActive = !!queryState.search.trim();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, filter, and track catalog items ({total + addedProducts.length} total products).
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

      {/* Non-Persistent Mutation Info Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Client-side simulation active:</strong> The DummyJSON API does not persistently commit CRUD operations to its remote database. Created, updated, and deleted products are synced into a client-side mutation store for this session.
        </span>
      </div>

      {/* Search, Category & Sorting Toolbar */}
      <div className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={handleSearchClear}
            isLoading={isLoading && isSearchActive}
          />

          <div className="flex flex-wrap items-center gap-3">
            <CategoryFilter
              categories={categories}
              selectedCategory={queryState.category}
              onSelectCategory={handleCategorySelect}
              isLoading={isLoadingCategories}
              disabled={isSearchActive}
            />

            <SortControls
              sortBy={queryState.sortBy}
              order={queryState.order}
              onSortChange={handleSortChange}
              disabled={isLoading}
            />
          </div>
        </div>

        {isSearchActive && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/60 text-xs text-amber-800">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Search is active. Category filter is disabled because the API cannot filter by category and search simultaneously.</span>
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
      ) : displayedProducts.length === 0 ? (
        <EmptyState
          title={isSearchActive ? `No results for "${queryState.search}"` : "No products found"}
          message={
            isSearchActive
              ? "We couldn't find any products matching your search term. Try adjusting your spelling or searching for another keyword."
              : queryState.category !== "all"
              ? `No products found in category "${queryState.category}".`
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
            ) : queryState.category !== "all" ? (
              <button
                onClick={() => handleCategorySelect("all")}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
              >
                Show All Categories
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block">
            <ProductTable products={displayedProducts} onDeleteClick={setProductToDelete} />
          </div>

          <div className="block md:hidden">
            <ProductCards products={displayedProducts} onDeleteClick={setProductToDelete} />
          </div>

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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={!!productToDelete}
        itemName={productToDelete?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />
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
