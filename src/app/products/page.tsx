"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { productApi } from "@/api/productApi";
import { Product } from "@/types/product";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductCards } from "@/components/products/ProductCards";
import { TableSkeleton, CardsSkeleton } from "@/components/common/Skeletons";
import { ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadProducts = useCallback(async (isRetry = false) => {
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
      const data = await productApi.getProducts({ limit: 10, skip: 0 }, controller.signal);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        setError(error.message || "Failed to load products");
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadProducts]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Top Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products Inventory</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage, filter, and track all catalog items ({total} total products).
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
                <TableSkeleton rows={8} />
              </div>
              <div className="block md:hidden">
                <CardsSkeleton count={6} />
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
              message="No products are currently available in the inventory."
              action={
                <Link
                  href="/products/new"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" /> Add your first product
                </Link>
              }
            />
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <ProductTable products={products} />
              </div>

              {/* Mobile Cards View */}
              <div className="block md:hidden">
                <ProductCards products={products} />
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
