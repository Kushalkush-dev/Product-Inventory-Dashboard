"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";

interface ProductContextType {
  addedProducts: Product[];
  deletedIds: number[];
  deletedProductIds: number[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  // Aliases for seamless compatibility
  recordAdd: (product: Product) => void;
  recordUpdate: (id: number, updates: Partial<Product>) => void;
  recordDelete: (id: number) => void;
  mergeWithServerProducts: (serverProducts: Product[]) => Product[];
  mergeSingleProduct: (serverProduct: Product) => Product | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ADDED_KEY = "local_added_products";
const DELETED_KEY = "local_deleted_ids";
const UPDATED_KEY = "local_updated_products";

export function ProductMutationProvider({ children }: { children: React.ReactNode }) {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<Record<number, Partial<Product>>>({});

  // 1. Load saved products and deletions from localStorage on mount
  useEffect(() => {
    try {
      const storedAdded = localStorage.getItem(ADDED_KEY);
      const storedDeleted = localStorage.getItem(DELETED_KEY);
      const storedUpdated = localStorage.getItem(UPDATED_KEY);

      const deleted: number[] = storedDeleted ? JSON.parse(storedDeleted) : [];
      const added: Product[] = storedAdded ? JSON.parse(storedAdded) : [];
      const updated: Record<number, Partial<Product>> = storedUpdated ? JSON.parse(storedUpdated) : {};

      // Filter added products so any deleted item never appears
      const cleanAdded = added.filter((p) => !deleted.includes(p.id));

      setDeletedIds(deleted);
      setAddedProducts(cleanAdded);
      setUpdatedProducts(updated);
    } catch (e) {
      console.error("Failed to load local products:", e);
    }
  }, []);

  // 2. Add product
  const addProduct = useCallback((product: Product) => {
    setAddedProducts((prev) => {
      const updatedList = [product, ...prev.filter((p) => p.id !== product.id)];
      localStorage.setItem(ADDED_KEY, JSON.stringify(updatedList));
      return updatedList;
    });

    setDeletedIds((prev) => {
      const nextDeleted = prev.filter((id) => id !== product.id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(nextDeleted));
      return nextDeleted;
    });
  }, []);

  // 3. Update product
  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setAddedProducts((prev) => {
      const nextAdded = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem(ADDED_KEY, JSON.stringify(nextAdded));
      return nextAdded;
    });

    setUpdatedProducts((prev) => {
      const nextUpdated = { ...prev, [id]: { ...(prev[id] || {}), ...updates } };
      localStorage.setItem(UPDATED_KEY, JSON.stringify(nextUpdated));
      return nextUpdated;
    });
  }, []);

  // 4. Delete product
  const deleteProduct = useCallback((id: number) => {
    // Remove from added products and save to localStorage
    setAddedProducts((prev) => {
      const nextAdded = prev.filter((p) => p.id !== id);
      localStorage.setItem(ADDED_KEY, JSON.stringify(nextAdded));
      return nextAdded;
    });

    // Add to deleted IDs and save to localStorage
    setDeletedIds((prev) => {
      const nextDeleted = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem(DELETED_KEY, JSON.stringify(nextDeleted));
      return nextDeleted;
    });

    // Remove from updated products
    setUpdatedProducts((prev) => {
      const nextUpdated = { ...prev };
      delete nextUpdated[id];
      localStorage.setItem(UPDATED_KEY, JSON.stringify(nextUpdated));
      return nextUpdated;
    });
  }, []);

  // 5. Merge server products with local deletions and edits
  const mergeWithServerProducts = useCallback(
    (serverProducts: Product[]): Product[] => {
      return serverProducts
        .filter((p) => !deletedIds.includes(p.id))
        .map((p) => (updatedProducts[p.id] ? { ...p, ...updatedProducts[p.id] } : p));
    },
    [deletedIds, updatedProducts]
  );

  // 6. Merge single product (for detail and edit pages)
  const mergeSingleProduct = useCallback(
    (serverProduct: Product): Product | null => {
      if (deletedIds.includes(serverProduct.id)) return null;
      return updatedProducts[serverProduct.id]
        ? { ...serverProduct, ...updatedProducts[serverProduct.id] }
        : serverProduct;
    },
    [deletedIds, updatedProducts]
  );

  return (
    <ProductContext.Provider
      value={{
        addedProducts,
        deletedIds,
        deletedProductIds: deletedIds,
        addProduct,
        updateProduct,
        deleteProduct,
        recordAdd: addProduct,
        recordUpdate: updateProduct,
        recordDelete: deleteProduct,
        mergeWithServerProducts,
        mergeSingleProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductMutations() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductMutations must be used within ProductMutationProvider");
  }
  return context;
}
