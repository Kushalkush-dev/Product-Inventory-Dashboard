"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Package, LogOut, User as UserIcon, Plus } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/products" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <span>ProductHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link
              href="/products"
              className="text-slate-700 hover:text-blue-600 transition"
            >
              Inventory
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-medium hover:bg-blue-700 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>

          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight">@{user.username}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition text-xs font-medium cursor-pointer"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
