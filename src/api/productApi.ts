import apiClient from "./axios";
import { Product, ProductsResponse, ProductCategory, ProductQueryParams } from "@/types/product";

/**
 * Product API Service
 * Centralizes all product data operations with support for signal cancellation.
 * All requests pass through apiClient to inherit authentication and error handling.
 */
export const productApi = {
  /**
   * Fetches products based on current query parameters.
   * Dynamically switches between:
   * 1. Search endpoint (/products/search?q=...)
   * 2. Category endpoint (/products/category/{category})
   * 3. Base endpoint (/products)
   */
  getProducts: async (params: ProductQueryParams = {}, signal?: AbortSignal): Promise<ProductsResponse> => {
    const { limit = 10, skip = 0, search, category, sortBy, order, delay } = params;

    let url = "/products";
    const queryParams: Record<string, string | number> = {
      limit,
      skip,
    };

    if (delay) {
      queryParams.delay = delay;
    }

    if (sortBy) {
      queryParams.sortBy = sortBy;
      if (order) {
        queryParams.order = order;
      }
    }

    if (search && search.trim()) {
      url = "/products/search";
      queryParams.q = search.trim();
    } else if (category && category !== "all") {
      url = `/products/category/${encodeURIComponent(category)}`;
    }

    const response = await apiClient.get<ProductsResponse>(url, {
      params: queryParams,
      signal,
    });

    return response.data;
  },

  /**
   * Fetches full categories list.
   */
  getCategories: async (signal?: AbortSignal): Promise<ProductCategory[]> => {
    const response = await apiClient.get<ProductCategory[]>("/products/categories", { signal });
    return response.data;
  },

  /**
   * Fetches a single product by ID.
   */
  getProductById: async (id: number | string, signal?: AbortSignal): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`, { signal });
    return response.data;
  },

  /**
   * Adds a new product.
   */
  addProduct: async (data: Partial<Product>, signal?: AbortSignal): Promise<Product> => {
    const response = await apiClient.post<Product>("/products/add", data, { signal });
    return response.data;
  },

  /**
   * Updates an existing product.
   */
  updateProduct: async (id: number | string, data: Partial<Product>, signal?: AbortSignal): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data, { signal });
    return response.data;
  },

  /**
   * Deletes a product by ID.
   */
  deleteProduct: async (id: number | string, signal?: AbortSignal): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> => {
    const response = await apiClient.delete(`/products/${id}`, { signal });
    return response.data;
  },
};
