"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onDeleteClick?: (product: Product) => void;
}

export function ProductTable({ products, onDeleteClick }: ProductTableProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4">Product</th>
              <th scope="col" className="py-3.5 px-4">Category</th>
              <th scope="col" className="py-3.5 px-4 text-right">Price</th>
              <th scope="col" className="py-3.5 px-4 text-center">Rating</th>
              <th scope="col" className="py-3.5 px-4 text-center">Stock</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const isLowStock = product.stock <= 5;
              const isOutOfStock = product.stock === 0;

              return (
                <tr key={product.id} className="hover:bg-slate-50/70 transition">
                  {/* Image & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 relative flex items-center justify-center">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">No img</span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-medium text-slate-900 hover:text-blue-600 transition truncate block"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        {product.brand && (
                          <span className="text-xs text-slate-500 truncate block">
                            {product.brand}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
                    ${product.price.toFixed(2)}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        isOutOfStock
                          ? "bg-red-100 text-red-700"
                          : isLowStock
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                        title="Edit product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      {onDeleteClick && (
                        <button
                          onClick={() => onDeleteClick(product)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
