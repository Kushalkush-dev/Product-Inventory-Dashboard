"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface ProductTableProps {
  products: Product[];
  onDeleteClick?: (product: Product) => void;
}

function StockBadge({ stock }: { stock: number }) {
  const variant = stock === 0 ? "destructive" : stock <= 5 ? "outline" : "secondary";
  return <Badge variant={variant}>{stock} in stock</Badge>;
}

export function ProductTable({ products, onDeleteClick }: ProductTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                    {product.thumbnail ? (
                      <Image src={product.thumbnail} alt={product.title} fill sizes="40px" className="object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div className="min-w-0 max-w-xs">
                    <Link href={`/products/${product.id}`} className="block truncate font-medium hover:text-primary transition" title={product.title}>
                      {product.title}
                    </Link>
                    {product.brand && <span className="block truncate text-xs text-muted-foreground">{product.brand}</span>}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary" className="capitalize">{product.category}</Badge>
              </TableCell>

              <TableCell className="text-right font-semibold">${product.price.toFixed(2)}</TableCell>

              <TableCell className="text-center">
                <Badge variant="outline" className="gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                <StockBadge stock={product.stock} />
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <Link
                    href={`/products/${product.id}`}
                    title="View details"
                    className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  >
                    <Eye />
                  </Link>
                  <Link
                    href={`/products/${product.id}/edit`}
                    title="Edit product"
                    className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  >
                    <Edit3 />
                  </Link>
                  {onDeleteClick && (
                    <Button variant="ghost" size="icon-sm" onClick={() => onDeleteClick(product)} title="Delete product">
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
