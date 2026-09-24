"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export function ImageGallery({ images, thumbnail, title }: ImageGalleryProps) {
  // Consolidate images list, placing thumbnail first if not present
  const allImages = Array.from(new Set([thumbnail, ...(images || [])])).filter(Boolean);
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || thumbnail);

  return (
    <div className="space-y-4">
      {/* Main Feature Image */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center p-4">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain transition-all duration-300"
            priority
          />
        ) : (
          <span className="text-slate-400 text-sm">No preview image</span>
        )}
      </div>

      {/* Thumbnails row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {allImages.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 shrink-0 transition cursor-pointer ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
