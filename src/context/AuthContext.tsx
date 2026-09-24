"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContextType, AuthUser, LoginCredentials } from "@/types/auth";
import { authApi } from "@/api/authApi";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/api/axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on client-mount safely without SSR hydration mismatches
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to restore session from storage:", e);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials);
    const resolvedToken = data.accessToken || data.token || "";

    const userObj: AuthUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      accessToken: resolvedToken,
      refreshToken: data.refreshToken,
    };

    localStorage.setItem(AUTH_TOKEN_KEY, resolvedToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));

    setToken(resolvedToken);
    setUser(userObj);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
