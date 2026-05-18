/**
 * AuthContext — WooCommerce / WordPress JWT Authentication
 *
 * Stores the JWT token in localStorage. On app load, validates the token
 * and hydrates the user. On login it calls the JWT endpoint and on register
 * it creates a WooCommerce customer then auto-logs them in.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, customersApi } from "@/lib/woocommerce/api";
import type { AuthUser } from "@/lib/woocommerce/types";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "wc_jwt";
const USER_KEY = "wc_user";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const cached = localStorage.getItem(USER_KEY);
      return cached ? (JSON.parse(cached) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ── Persist user to localStorage whenever it changes ──
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user]);

  // ── Validate token on app start ──
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      const valid = await authApi.validateToken(token);
      if (!valid) {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      setIsLoading(false);
    };

    validateSession();
  }, []);

  // ── Login ──
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem(TOKEN_KEY, res.token);

      // Fetch WC customer data by email to get customer ID
      // WC REST API: GET /customers?email=... (admin-level)
      // We store the token, display name and email from JWT response
      const authUser: AuthUser = {
        id: 0, // We'll get this from WC if needed
        token: res.token,
        email: res.user_email,
        displayName: res.user_display_name,
        firstName: res.user_nicename,
        lastName: "",
        avatarUrl: "",
      };

      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Register ──
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setIsLoading(true);
      try {
        await authApi.register(email, password, firstName, lastName);
        // Auto-login after registration
        await login(email, password);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  // ── Logout ──
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Also clear legacy auth key if present
    localStorage.removeItem("skybd_user");
  }, []);

  // ── Refresh user from WC API ──
  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const customer = await customersApi.getById(user.id);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              firstName: customer.first_name,
              lastName: customer.last_name,
              avatarUrl: customer.avatar_url,
            }
          : null
      );
    } catch {
      // Silent fail – user data refresh is non-critical
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
