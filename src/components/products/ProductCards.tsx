"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardsProps {
  products: Product[];
  onDeleteClick?: (product: Product) => void;
}

export function ProductCards({ products, onDeleteClick }: ProductCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          {/* Image */}
          <div className="relative h-44 w-full border-b bg-muted">
            {product.thumbnail ? (
              <Image src={product.thumbnail} alt={product.title} fill sizes="(max-width:640px) 100vw, 50vw" className="object-contain p-2" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Image</div>
            )}
            <Badge variant="secondary" className="absolute left-2.5 top-2.5 capitalize">{product.category}</Badge>
            <Badge variant="outline" className="absolute right-2.5 top-2.5 gap-1 bg-background/90 backdrop-blur-sm">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </Badge>
          </div>

          {/* Body */}
          <CardContent className="space-y-1.5 p-4">
            <Link href={`/products/${product.id}`} className="block truncate text-base font-semibold hover:text-primary transition">
              {product.title}
            </Link>
            <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
          </CardContent>

          {/* Footer */}
          <div className="flex items-center justify-between border-t p-4 pt-2">
            <div>
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              <p className={`text-[11px] font-medium ${product.stock === 0 ? "text-destructive" : product.stock <= 5 ? "text-amber-600" : "text-emerald-600"}`}>
                {product.stock} in stock
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <Link
                href={`/products/${product.id}`}
                title="View"
                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
              >
                <Eye />
              </Link>
              <Link
                href={`/products/${product.id}/edit`}
                title="Edit"
                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
              >
                <Edit3 />
              </Link>
              {onDeleteClick && (
                <Button variant="ghost" size="icon-sm" onClick={() => onDeleteClick(product)} title="Delete">
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
