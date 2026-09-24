"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  title = "Delete Product",
  description = "Are you sure you want to delete this product? This action cannot be undone.",
  itemName,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-50 text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 id="dialog-title" className="text-lg font-bold text-slate-900">
              {title}
            </h2>
            <p className="text-sm text-slate-500">{description}</p>
            {itemName && (
              <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-2 truncate">
                {itemName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 shadow-xs cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
