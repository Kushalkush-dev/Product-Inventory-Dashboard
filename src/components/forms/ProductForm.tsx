"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, ProductCategory } from "@/types/product";
import {
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
  Sparkles,
  Package,
  Eye,
  ImageIcon,
  Star,
  CheckCircle2,
  DollarSign,
  Tag,
  Boxes,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ProductFormProps {
  initialData?: Partial<Product>;
  categories: ProductCategory[];
  isEditMode?: boolean;
  onSubmit: (formData: Partial<Product>) => Promise<void>;
  isSubmitting?: boolean;
}

const SAMPLE_IMAGES = [
  { name: "Beauty", url: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp" },
  { name: "Perfume", url: "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp" },
  { name: "Laptop", url: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14/thumbnail.webp" },
  { name: "Phone", url: "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp" },
];

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
  const [category, setCategory] = useState(initialData?.category || categories[0]?.slug || "beauty");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");

  const [error, setError] = useState<string | null>(null);

  const priceNum = Number(price) || 0;
  const stockNum = Number(stock) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim()) {
      setError("Product title is required.");
      return;
    }
    const parsedPrice = Number(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid price greater than $0.");
      return;
    }
    const parsedStock = Number(stock);
    if (stock === "" || isNaN(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
      setError("Please enter a valid non-negative integer for stock quantity.");
      return;
    }

    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        stock: parsedStock,
        category,
        brand: brand.trim() || undefined,
        thumbnail: thumbnail.trim() || undefined,
      });
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to save product.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to inventory</span>
        </Link>

        <Badge variant="outline" className="gap-1.5 py-1 px-3">
          <Sparkles className="size-3.5 text-primary" />
          <span>{isEditMode ? "Edit Mode" : "New Product Creator"}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container: 7 Columns */}
        <div className="lg:col-span-7">
          <Card className="shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Package className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {isEditMode ? "Edit Product Details" : "Create New Product"}
                  </CardTitle>
                  <CardDescription>
                    {isEditMode
                      ? "Update the product details and inventory specifications below."
                      : "Fill in the details to add a new item to your catalog."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Section: General Details */}
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="product-title" className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                      Product Title *
                    </Label>
                    <Input
                      id="product-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Wireless Noise-Cancelling Headphones"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="product-category" className="font-medium text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Tag className="size-3" />
                        Category *
                      </Label>
                      <Select
                        value={category}
                        onValueChange={(val) => setCategory(val || "")}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="product-category" className="w-full capitalize">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug} className="capitalize">
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="product-brand" className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                        Brand
                      </Label>
                      <Input
                        id="product-brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Sony, Apple, Nike"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="product-desc" className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="product-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the key features, materials, and highlights..."
                      disabled={isSubmitting}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Section: Price & Stock */}
                <div className="rounded-xl border bg-muted/20 p-4 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="product-price" className="font-medium text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <DollarSign className="size-3 text-primary" />
                        Price ($) *
                      </Label>
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="29.99"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="product-stock" className="font-medium text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Boxes className="size-3 text-primary" />
                        Stock Quantity *
                      </Label>
                      <Input
                        id="product-stock"
                        type="number"
                        step="1"
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="50"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Image URL & Quick Sample Fillers */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="product-thumbnail" className="font-medium text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <ImageIcon className="size-3" />
                      Image URL (Optional)
                    </Label>
                  </div>
                  <Input
                    id="product-thumbnail"
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://images.example.com/item.webp"
                    disabled={isSubmitting}
                  />

                  {/* Sample image quick picks */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                    <span>Quick presets:</span>
                    {SAMPLE_IMAGES.map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        onClick={() => setThumbnail(sample.url)}
                        className="rounded-md border border-input bg-muted/50 px-2 py-0.5 text-[11px] font-medium hover:bg-accent hover:text-accent-foreground transition cursor-pointer"
                      >
                        {sample.name}
                      </button>
                    ))}
                    {thumbnail && (
                      <button
                        type="button"
                        onClick={() => setThumbnail("")}
                        className="text-[11px] text-destructive hover:underline ml-1 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
                <Link
                  href="/products"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Cancel
                </Link>

                <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      <span>{isEditMode ? "Save Changes" : "Create Product"}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Live Preview Panel: 5 Columns */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Eye className="size-3.5 text-primary" />
              Live Catalog Preview
            </h3>
            <span className="text-[11px] text-muted-foreground">Real-time</span>
          </div>

          <Card className="overflow-hidden border shadow-sm">
            {/* Image Preview */}
            <div className="relative h-48 w-full border-b bg-muted/40 flex items-center justify-center overflow-hidden">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={title || "Preview"}
                  fill
                  unoptimized
                  className="object-contain p-3 transition-all duration-300"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                  <ImageIcon className="size-8 stroke-1 text-muted-foreground/60" />
                  <span className="text-xs font-medium">No image preview</span>
                </div>
              )}
              <Badge variant="secondary" className="absolute left-3 top-3 capitalize text-[11px]">
                {category || "Category"}
              </Badge>
              <Badge variant="outline" className="absolute right-3 top-3 gap-1 bg-background/90 backdrop-blur-sm text-[11px]">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                5.0
              </Badge>
            </div>

            {/* Body */}
            <CardContent className="p-4 space-y-1.5">
              {brand ? (
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {brand}
                </p>
              ) : null}
              <p className="font-semibold text-base line-clamp-1">
                {title.trim() || "Product Title Goes Here"}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description.trim() || "Add a descriptive overview of features, specs, and materials..."}
              </p>
            </CardContent>

            {/* Footer */}
            <div className="flex items-center justify-between border-t p-4 pt-3 bg-muted/10">
              <div>
                <span className="text-xl font-bold">${priceNum.toFixed(2)}</span>
                <p
                  className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${
                    stockNum === 0
                      ? "text-destructive"
                      : stockNum <= 5
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <CheckCircle2 className="size-3" />
                  {stockNum} units in stock
                </p>
              </div>
              <Badge variant="outline" className="text-[11px]">Catalog Preview</Badge>
            </div>
          </Card>

          {/* User-friendly Help Box */}
          <div className="rounded-xl border bg-muted/30 p-3.5 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              💡 User Guide
            </p>
            <p className="leading-relaxed">
              New items are saved instantly to your local inventory store and will appear at the top of your product catalog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
