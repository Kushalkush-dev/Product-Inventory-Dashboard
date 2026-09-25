"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProductForm } from "@/components/forms/ProductForm";
import { productApi } from "@/api/productApi";
import { ProductCategory, Product } from "@/types/product";
import { useProductMutations } from "@/context/ProductMutationContext";
import { Loader2 } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { recordAdd } = useProductMutations();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await productApi.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (formData: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      const addedProduct = await productApi.addProduct(formData);
      // Ensure it has a reliable local ID and fields
      const simulatedProduct: Product = {
        id: addedProduct.id || Date.now(),
        title: formData.title || "Untitled Product",
        description: formData.description || "",
        category: formData.category || "beauty",
        price: formData.price || 0,
        discountPercentage: 0,
        rating: 5.0,
        stock: formData.stock || 0,
        brand: formData.brand,
        thumbnail: formData.thumbnail || "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        images: formData.thumbnail ? [formData.thumbnail] : [],
      };

      // Record in local mutation state
      recordAdd(simulatedProduct);

      router.push("/products");
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
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProductForm
              categories={categories}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
