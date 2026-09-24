"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";

interface ProductMutationContextType {
  addedProducts: Product[];
  updatedProducts: Record<number, Partial<Product>>;
  deletedProductIds: number[];
  recordAdd: (product: Product) => void;
  recordUpdate: (id: number, updates: Partial<Product>) => void;
  recordDelete: (id: number) => void;
  mergeWithServerProducts: (serverProducts: Product[]) => Product[];
  mergeSingleProduct: (serverProduct: Product) => Product | null;
}

const LOCAL_STORAGE_MUTATIONS_KEY = "producthub_local_mutations";

interface StoredMutations {
  addedProducts: Product[];
  updatedProducts: Record<number, Partial<Product>>;
  deletedProductIds: number[];
}

const ProductMutationContext = createContext<ProductMutationContextType | undefined>(undefined);

export function ProductMutationProvider({ children }: { children: React.ReactNode }) {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<Record<number, Partial<Product>>>({});
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);

  // Restore mutations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_MUTATIONS_KEY);
      if (stored) {
        const parsed: StoredMutations = JSON.parse(stored);
        setAddedProducts(parsed.addedProducts || []);
        setUpdatedProducts(parsed.updatedProducts || {});
        setDeletedProductIds(parsed.deletedProductIds || []);
      }
    } catch (e) {
      console.error("Failed to restore mutation state from localStorage:", e);
    }
  }, []);

  // Save changes to storage whenever mutations change
  const saveToStorage = (
    nextAdded: Product[],
    nextUpdated: Record<number, Partial<Product>>,
    nextDeleted: number[]
  ) => {
    try {
      const data: StoredMutations = {
        addedProducts: nextAdded,
        updatedProducts: nextUpdated,
        deletedProductIds: nextDeleted,
      };
      localStorage.setItem(LOCAL_STORAGE_MUTATIONS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist mutation state:", e);
    }
  };

  const recordAdd = useCallback(
    (product: Product) => {
      setAddedProducts((prev) => {
        // Ensure new additions are placed at the beginning
        const next = [product, ...prev.filter((p) => p.id !== product.id)];
        saveToStorage(next, updatedProducts, deletedProductIds);
        return next;
      });
    },
    [updatedProducts, deletedProductIds]
  );

  const recordUpdate = useCallback(
    (id: number, updates: Partial<Product>) => {
      // If this product was locally added, update it in addedProducts directly
      setAddedProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );

      // Also record in updatedProducts for server-originated items
      setUpdatedProducts((prev) => {
        const next = {
          ...prev,
          [id]: { ...(prev[id] || {}), ...updates },
        };
        saveToStorage(addedProducts, next, deletedProductIds);
        return next;
      });
    },
    [addedProducts, deletedProductIds]
  );

  const recordDelete = useCallback(
    (id: number) => {
      // Remove from local additions if it was added locally
      setAddedProducts((prev) => prev.filter((p) => p.id !== id));

      // Add to deletedProductIds
      setDeletedProductIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        saveToStorage(addedProducts, updatedProducts, next);
        return next;
      });
    },
    [addedProducts, updatedProducts]
  );

  /**
   * Merges server-retrieved products with client-side mutation state:
   * 1. Exclude items present in deletedProductIds.
   * 2. Apply field overrides from updatedProducts.
   * 3. Prepend local additions if on page 1 without search/category filters.
   */
  const mergeWithServerProducts = useCallback(
    (serverProducts: Product[]): Product[] => {
      // 1. Filter out deleted products and apply updates
      const modifiedServerList = serverProducts
        .filter((prod) => !deletedProductIds.includes(prod.id))
        .map((prod) => {
          if (updatedProducts[prod.id]) {
            return {
              ...prod,
              ...updatedProducts[prod.id],
            };
          }
          return prod;
        });

      return modifiedServerList;
    },
    [deletedProductIds, updatedProducts]
  );

  /**
   * Merges a single product (e.g. for /products/[id]) with local updates or returns null if deleted
   */
  const mergeSingleProduct = useCallback(
    (serverProduct: Product): Product | null => {
      if (deletedProductIds.includes(serverProduct.id)) {
        return null;
      }
      if (updatedProducts[serverProduct.id]) {
        return {
          ...serverProduct,
          ...updatedProducts[serverProduct.id],
        };
      }
      return serverProduct;
    },
    [deletedProductIds, updatedProducts]
  );

  return (
    <ProductMutationContext.Provider
      value={{
        addedProducts,
        updatedProducts,
        deletedProductIds,
        recordAdd,
        recordUpdate,
        recordDelete,
        mergeWithServerProducts,
        mergeSingleProduct,
      }}
    >
      {children}
    </ProductMutationContext.Provider>
  );
}

export function useProductMutations() {
  const context = useContext(ProductMutationContext);
  if (!context) {
    throw new Error("useProductMutations must be used within a ProductMutationProvider");
  }
  return context;
}
