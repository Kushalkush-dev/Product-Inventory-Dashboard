"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, User, AlertCircle, Loader2, PackageCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  // Redirect to /products immediately if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/products");
    }
  }, [authLoading, isAuthenticated, router]);

  const validate = () => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Guard against rapid duplicate clicks while submission is in-flight
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      router.replace("/products");
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Invalid credentials. Please verify your username and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setFieldErrors({});
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to ProductHub</h1>
          <p className="text-sm text-slate-500">
            Use the test credentials to access the inventory system
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-semibold block">Demo Account:</span>
            <span className="font-mono text-[11px] text-blue-700">emilys / emilyspass</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  disabled={isSubmitting}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                    fieldErrors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  } ${isSubmitting ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  placeholder="Enter username"
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition ${
                    fieldErrors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  } ${isSubmitting ? "bg-slate-50 cursor-not-allowed" : "bg-white"}`}
                  placeholder="Enter password"
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            <button
              id="login-submit-button"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
