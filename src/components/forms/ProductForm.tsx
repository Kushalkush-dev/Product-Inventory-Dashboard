"use client";

import React, { useState } from "react";
import { Product, ProductCategory } from "@/types/product";
import { Loader2, AlertCircle, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialData?: Partial<Product>;
  categories: ProductCategory[];
  isEditMode?: boolean;
  onSubmit: (formData: Partial<Product>) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormErrors {
  title?: string;
  price?: string;
  stock?: string;
  category?: string;
}

export function ProductForm({
  initialData,
  categories,
  isEditMode = false,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [stock, setStock] = useState(initialData?.stock !== undefined ? String(initialData.stock) : "");
  const [category, setCategory] = useState(initialData?.category || (categories[0]?.slug || "beauty"));
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Product title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!price || isNaN(Number(price))) {
      newErrors.price = "Valid price is required.";
    } else if (Number(price) <= 0) {
      newErrors.price = "Price must be greater than $0.";
    }

    if (!stock || isNaN(Number(stock))) {
      newErrors.stock = "Valid stock quantity is required.";
    } else if (Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      newErrors.stock = "Stock must be a non-negative integer.";
    }

    if (!category) {
      newErrors.category = "Please select a category.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Guard against rapid duplicate submissions
    if (isSubmitting) return;

    if (!validate()) return;

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category,
        brand: brand.trim() || undefined,
        thumbnail: thumbnail.trim() || undefined,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || "Failed to save product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel and return</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditMode ? "Edit Product" : "Create New Product"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isEditMode
              ? "Modify product details and inventory specifications."
              : "Fill out the fields below to add a product to the catalog."}
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="product-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="product-title"
              type="text"
              disabled={isSubmitting}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                errors.title
                  ? "border-red-300 focus:ring-red-100 focus:border-red-500"
                  : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600 font-medium">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="product-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              id="product-desc"
              rows={3}
              disabled={isSubmitting}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of features, materials, and specifications..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            />
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0.01"
                disabled={isSubmitting}
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                placeholder="29.99"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                  errors.price
                    ? "border-red-300 focus:ring-red-100 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.price && <p className="mt-1 text-xs text-red-600 font-medium">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="product-stock" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="product-stock"
                type="number"
                step="1"
                min="0"
                disabled={isSubmitting}
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  if (errors.stock) setErrors((prev) => ({ ...prev, stock: undefined }));
                }}
                placeholder="50"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                  errors.stock
                    ? "border-red-300 focus:ring-red-100 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.stock && <p className="mt-1 text-xs text-red-600 font-medium">{errors.stock}</p>}
            </div>
          </div>

          {/* Category & Brand Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="product-category"
                disabled={isSubmitting}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition capitalize cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600 font-medium">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="product-brand" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand
              </label>
              <input
                id="product-brand"
                type="text"
                disabled={isSubmitting}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Sony, Apple, Samsung"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label htmlFor="product-thumbnail" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Image URL (optional)
            </label>
            <input
              id="product-thumbnail"
              type="url"
              disabled={isSubmitting}
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving product...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? "Save Changes" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
