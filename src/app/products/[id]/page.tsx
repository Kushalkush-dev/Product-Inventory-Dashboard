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
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (isRetry = false) => {
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
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="size-4" />
              <span>Back to inventory</span>
            </Link>

            {product && (
              <Link
                href={`/products/${product.id}/edit`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Edit3 className="size-4" />
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
            <div className="space-y-6">
              {/* Product Info Card */}
              <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                  {/* Images */}
                  <ImageGallery
                    images={product.images}
                    thumbnail={product.thumbnail}
                    title={product.title}
                  />

                  {/* Details */}
                  <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {product.category}
                        </Badge>
                        {product.brand && (
                          <span className="text-xs text-muted-foreground">
                            Brand: <strong className="text-foreground">{product.brand}</strong>
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {product.title}
                      </h1>

                      {/* Rating & Stock */}
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline" className="gap-1 font-semibold">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          {product.rating.toFixed(2)} rating
                        </Badge>

                        <Badge
                          variant={
                            product.stock === 0
                              ? "destructive"
                              : product.stock <= 5
                              ? "outline"
                              : "secondary"
                          }
                          className="gap-1"
                        >
                          <CheckCircle2 className="size-3.5" />
                          {product.stock} in stock
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-3 pt-1">
                        <span className="text-3xl font-extrabold tracking-tight">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <Badge variant="secondary" className="text-xs text-emerald-600 bg-emerald-500/10">
                            {product.discountPercentage}% OFF
                          </Badge>
                        )}
                      </div>

                      <Separator />

                      {/* Description */}
                      <div className="space-y-1.5">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Description
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-2 gap-2.5 pt-4 text-xs">
                      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2.5">
                        <Truck className="size-4 text-primary shrink-0" />
                        <span className="truncate">{product.shippingInformation || "Standard delivery"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2.5">
                        <ShieldCheck className="size-4 text-primary shrink-0" />
                        <span className="truncate">{product.warrantyInformation || "1 Year Warranty"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2.5">
                        <RefreshCw className="size-4 text-primary shrink-0" />
                        <span className="truncate">{product.returnPolicy || "30-Day Returns"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2.5">
                        <span className="font-semibold">SKU:</span>
                        <span className="font-mono truncate">{product.sku || `PRD-${product.id}`}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Reviews Section */}
              <ProductReviews reviews={product.reviews} />
            </div>
          ) : null}
        </main>
      </div>
    </ProtectedRoute>
  );
}
