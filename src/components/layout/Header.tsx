"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Package, LogOut, Plus, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { GithubIcon } from "@/components/common/GithubIcon";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/products" className="flex items-center gap-2 text-lg font-bold">
            <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
              <Package className="size-5" />
            </div>
            StockPulse
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition">
              Inventory
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Kushalkush-dev/Product-Inventory-Dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "h-8 px-2 text-muted-foreground hover:text-foreground gap-1.5",
            })}
            title="View on GitHub"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="size-4" />
            <span className="hidden sm:inline text-xs font-medium">GitHub</span>
          </a>

          <ThemeToggle />

          <Link href="/products/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>

          {user && (
            <div className="flex items-center border-l pl-3">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="User menu"
                  className="flex items-center gap-2 rounded-lg p-1 text-left transition hover:bg-muted/60 outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <Avatar size="default" className="size-8">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.firstName} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-semibold leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      @{user.username}
                    </p>
                  </div>

                  <ChevronDown className="size-3.5 text-muted-foreground transition-transform" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="space-y-0.5">
                    <p className="font-semibold text-xs text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-normal">
                      @{user.username}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer gap-2"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
