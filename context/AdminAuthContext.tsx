"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function isAdminUser(user: User): boolean {
  // Check user_metadata.is_admin (set from Supabase Auth dashboard)
  // OR app_metadata.role === "admin" (set via service-role key / SQL)
  return (
    user.user_metadata?.is_admin === true ||
    user.app_metadata?.role === "admin"
  );
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      if (sessionUser && isAdminUser(sessionUser)) {
        setUser(sessionUser);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      if (sessionUser && isAdminUser(sessionUser)) {
        setUser(sessionUser);
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return false;
      }

      const loggedInUser = data.user;
      if (!loggedInUser) {
        setError("Login failed. Please try again.");
        setIsLoading(false);
        return false;
      }

      if (!isAdminUser(loggedInUser)) {
        await supabase.auth.signOut();
        setError("Access denied. This account does not have admin privileges.");
        setIsLoading(false);
        return false;
      }

      setUser(loggedInUser);
      setIsLoading(false);
      return true;
    } catch {
      setError("An unexpected error occurred.");
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      isLoading,
      user,
      error,
      login,
      logout,
    }),
    [user, isLoading, error, login, logout]
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
