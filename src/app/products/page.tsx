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
import { Plus, Info, Sparkles, Shuffle, TrendingUp, Package } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Helper to synchronize updated state to URL without creating infinite effect dependency cycles
  const updateQueryState = useCallback(
    (updates: Partial<ProductQueryState>) => {
      const currentQuery = parseProductQueryParams(searchParams);
      const nextState: ProductQueryState = {
        ...currentQuery,
        ...updates,
      };
      const queryString = buildProductQueryString(nextState);
      const currentQueryString = buildProductQueryString(currentQuery);
      if (queryString !== currentQueryString) {
        router.push(`/products${queryString}`);
      }
    },
    [searchParams, router]
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

  const handleRandomProduct = () => {
    if (displayedProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * displayedProducts.length);
      router.push(`/products/${displayedProducts[randomIndex].id}`);
    } else {
      const randomId = Math.floor(Math.random() * 100) + 1;
      router.push(`/products/${randomId}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await productApi.deleteProduct(productToDelete.id);
      recordDelete(productToDelete.id);
    } catch {
      recordDelete(productToDelete.id);
    } finally {
      setProductToDelete(null);
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Products Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage, filter, and track catalog items ({total + addedProducts.length} total products).
          </p>
        </div>
        <Link
          href="/products/new"
          className={buttonVariants({ size: "default" })}
        >
          <Plus className="size-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Fun Inventory Pulse & Quick Discovery Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-2xs">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Catalog</p>
            <p className="text-sm font-bold text-foreground">{total + addedProducts.length} items</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-2xs">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="text-sm font-bold text-foreground">{categories.length || "24"} genres</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-2xs">
          <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Inventory Health</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">99.8% Active</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-3 shadow-2xs">
          <div>
            <p className="text-xs text-muted-foreground">Feeling Lucky?</p>
            <p className="text-xs font-semibold text-foreground">Surprise Me</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomProduct}
            className="h-8 gap-1 text-xs"
            title="Jump to a random product"
          >
            <Shuffle className="size-3.5" />
            <span>Random 🎲</span>
          </Button>
        </div>
      </div>

      {/* Search, Category & Sorting Toolbar */}
      <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border">
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
          <p className="text-xs text-muted-foreground">
            Search is active. Category filter is disabled during active search.
          </p>
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
              <Button onClick={handleSearchClear} size="sm" className="mt-4">
                Clear Search
              </Button>
            ) : queryState.category !== "all" ? (
              <Button onClick={() => handleCategorySelect("all")} size="sm" className="mt-4">
                Show All Categories
              </Button>
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
      <div className="min-h-screen flex flex-col bg-background">
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
