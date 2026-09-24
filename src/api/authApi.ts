import apiClient from "./axios";
import { LoginCredentials, LoginResponse } from "@/types/auth";

/**
 * Authentication API Service
 * Centralizes all authentication endpoints.
 */

export const authApi = {
  /**
   * Authenticates user with username & password against /auth/login.
   * Supports optional AbortSignal for request cancellation.
   */
  login: async (credentials: LoginCredentials, signal?: AbortSignal): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials, {
      signal,
    });
    return response.data;
  },
};
