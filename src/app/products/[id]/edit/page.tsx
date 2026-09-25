"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProductForm } from "@/components/forms/ProductForm";
import { productApi } from "@/api/productApi";
import { ProductCategory, Product } from "@/types/product";
import { useProductMutations } from "@/context/ProductMutationContext";
import { Loader2 } from "lucide-react";
import { ErrorState } from "@/components/common/FeedbackStates";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);

  const { recordUpdate, mergeSingleProduct } = useProductMutations();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (isNaN(productId)) {
        setError("Invalid product ID.");
        setIsLoading(false);
        return;
      }

      try {
        const [cats, prod] = await Promise.all([
          productApi.getCategories(),
          productApi.getProductById(productId),
        ]);
        setCategories(cats);
        // Merge with any existing local edits
        const merged = mergeSingleProduct(prod);
        if (!merged) {
          setError("Product was deleted locally.");
        } else {
          setProduct(merged);
        }
      } catch (err: unknown) {
        const e = err as Error;
        setError(e.message || "Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [productId, mergeSingleProduct]);

  const handleSubmit = async (formData: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      await productApi.updateProduct(productId, formData);
      // Persist in local mutation state
      recordUpdate(productId, formData);
      router.push(`/products/${productId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <ErrorState title="Cannot edit product" message={error} />
          ) : product ? (
            <ProductForm
              initialData={product}
              categories={categories}
              isEditMode={true}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          ) : null}
        </main>
      </div>
    </ProtectedRoute>
  );
}
