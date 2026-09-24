"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";

interface ProductCardsProps {
  products: Product[];
  onDeleteClick?: (product: Product) => void;
}

export function ProductCards({ products, onDeleteClick }: ProductCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => {
        const isLowStock = product.stock <= 5;
        const isOutOfStock = product.stock === 0;

        return (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              {/* Product Image Banner */}
              <div className="relative w-full h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No Image</span>
                )}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-xs text-slate-700 shadow-xs capitalize">
                  {product.category}
                </span>
                <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-amber-700 shadow-xs border border-amber-200/50">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <Link
                  href={`/products/${product.id}`}
                  className="font-semibold text-slate-900 hover:text-blue-600 transition line-clamp-1 block text-base"
                >
                  {product.title}
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
                <div className="text-[11px] font-medium mt-0.5">
                  <span
                    className={
                      isOutOfStock
                        ? "text-red-600"
                        : isLowStock
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }
                  >
                    {product.stock} in stock
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href={`/products/${product.id}`}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/products/${product.id}/edit`}
                  className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                  title="Edit product"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                {onDeleteClick && (
                  <button
                    onClick={() => onDeleteClick(product)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
