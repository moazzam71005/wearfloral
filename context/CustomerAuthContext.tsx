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
import type { Profile } from "@/lib/types";

interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface CustomerAuthContextValue {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  signUp: (data: SignUpData) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  clearError: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

function isAdminUser(user: User): boolean {
  return (
    user.user_metadata?.is_admin === true ||
    user.app_metadata?.role === "admin"
  );
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    address: data.address,
    city: data.city,
    createdAt: data.created_at,
  };
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async (userId: string) => {
    const p = await fetchProfile(userId);
    setProfile(p);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user ?? null;
      if (sessionUser && !isAdminUser(sessionUser)) {
        setUser(sessionUser);
        await loadProfile(sessionUser.id);
      }
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user ?? null;
        if (sessionUser && !isAdminUser(sessionUser)) {
          setUser(sessionUser);
          await loadProfile(sessionUser.id);
        } else if (!sessionUser || isAdminUser(sessionUser)) {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const signUp = useCallback(async (data: SignUpData) => {
    setError("");
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            address: data.address,
            city: data.city,
          },
        },
      });
      if (authError) {
        setError(authError.message);
        return false;
      }
      if (!authData.user) {
        setError("Signup failed. Please try again.");
        return false;
      }
      if (isAdminUser(authData.user)) {
        await supabase.auth.signOut();
        setError("Invalid account type.");
        return false;
      }
      await supabase
        .from("profiles")
        .update({
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
        })
        .eq("id", authData.user.id);
      setUser(authData.user);
      await loadProfile(authData.user.id);
      return true;
    } catch {
      setError("An unexpected error occurred.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        return false;
      }
      if (!data.user) {
        setError("Login failed.");
        return false;
      }
      if (isAdminUser(data.user)) {
        await supabase.auth.signOut();
        setError("Please use the admin login page.");
        return false;
      }
      setUser(data.user);
      await loadProfile(data.user.id);
      return true;
    } catch {
      setError("An unexpected error occurred.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!user) return false;
      const { error: err } = await supabase
        .from("profiles")
        .update({
          name: updates.name,
          phone: updates.phone,
          address: updates.address,
          city: updates.city,
        })
        .eq("id", user.id);
      if (err) return false;
      await loadProfile(user.id);
      return true;
    },
    [user, loadProfile]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      isLoading,
      error,
      signUp,
      signIn,
      signOut,
      updateProfile,
      clearError: () => setError(""),
    }),
    [user, profile, isLoading, error, signUp, signIn, signOut, updateProfile]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
}
