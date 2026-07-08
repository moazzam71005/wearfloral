"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ADMIN_PASSWORD } from "@/lib/constants";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const AUTH_STORAGE_KEY = "wearfloral-admin-auth";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(stored === "true");
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: hydrated ? isAuthenticated : false,
      login,
      logout,
    }),
    [hydrated, isAuthenticated, login, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
