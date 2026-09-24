"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { productApi } from "@/api/productApi";
import { Product } from "@/types/product";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ProductReviews } from "@/components/products/ProductReviews";
import { ProductDetailsSkeleton } from "@/components/products/ProductDetailsSkeleton";
import { ErrorState } from "@/components/common/FeedbackStates";
import { ArrowLeft, Edit3, Star, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  // Unwrap Next.js 15+ promise-based route params
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (isRetry = false) => {
    // Validate id parameter
    if (!productId || isNaN(Number(productId))) {
      setError(`Invalid product ID "${productId}". Product ID must be a valid number.`);
      setIsLoading(false);
      return;
    }

    if (isRetry) {
      setIsRetrying(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await productApi.getProductById(productId);
      setProduct(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to load product details.");
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to inventory</span>
            </Link>

            {product && (
              <Link
                href={`/products/${product.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-xs transition"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>Edit Product</span>
              </Link>
            )}
          </div>

          {isLoading ? (
            <ProductDetailsSkeleton />
          ) : error ? (
            <ErrorState
              title="Product not found"
              message={error}
              onRetry={() => fetchProduct(true)}
              isRetrying={isRetrying}
            />
          ) : product ? (
            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Product Hero Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
                {/* Images Section */}
                <ImageGallery
                  images={product.images}
                  thumbnail={product.thumbnail}
                  title={product.title}
                />

                {/* Info Section */}
                <div className="flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="text-xs font-medium text-slate-500">
                          Brand: <strong className="text-slate-700">{product.brand}</strong>
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {product.title}
                    </h1>

                    {/* Rating & Stock */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-800 font-semibold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{product.rating.toFixed(2)} rating</span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          product.stock > 10
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                            : "bg-red-50 text-red-700 border border-red-200/60"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {product.stock} units available
                      </span>
                    </div>

                    {/* Price and Discount */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {product.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Description
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlights / Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                      <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{product.shippingInformation || "Ships in 2-4 business days"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{product.warrantyInformation || "1 Year Warranty included"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                      <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{product.returnPolicy || "30-Day Hassle-free Returns"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                      <span className="font-semibold text-slate-700">SKU:</span>
                      <span className="font-mono text-[11px] truncate">{product.sku || `PRD-${product.id}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <ProductReviews reviews={product.reviews} />
            </div>
          ) : null}
        </main>
      </div>
    </ProtectedRoute>
  );
}
