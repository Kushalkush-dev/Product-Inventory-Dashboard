import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * Shared Axios instance configured with base URL, authentication interceptor,
 * centralized error normalization, and request cancellation support.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";
export const AUTH_TOKEN_KEY = "producthub_auth_token";
export const AUTH_USER_KEY = "producthub_auth_user";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/**
 * Request Interceptor: Automatically attaches Bearer token from localStorage
 * without needing manual token management in individual API calls.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Centralizes error handling and token expiration detection.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If request was canceled by AbortController, rethrow cleanly
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear invalid auth data if 401 Unauthorized occurs on protected operations
        const isAuthEndpoint = error.config?.url?.includes("/auth/login");
        if (!isAuthEndpoint) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          // Optional redirect can be triggered or handled by context
        }
      }
    }

    // Standardize error message extraction
    const responseData = error.response?.data as { message?: string } | undefined;
    const message = responseData?.message || error.message || "An unexpected error occurred";
    const customError = new Error(message);
    (customError as unknown as { status?: number }).status = error.response?.status;

    return Promise.reject(customError);
  }
);

export default apiClient;
