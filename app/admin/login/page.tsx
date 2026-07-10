"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const { login, isAuthenticated, error: authError } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  if (isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      router.replace("/admin");
    } else {
      setLocalError(authError || "Invalid credentials.");
    }
  };

  const displayError = localError || authError;

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Wear Floral"
            width={320}
            height={128}
            className="h-24 w-auto object-contain"
          />
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-8 shadow-2xl">
          <div className="mb-6 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10">
              <Lock className="h-5 w-5 text-rose-400" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-white">Admin Sign In</h1>
            <p className="mt-1 text-center text-sm text-stone-400">
              Sign in with your Supabase admin credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-stone-300">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-1 border-stone-700 bg-stone-800 text-white placeholder:text-stone-500 focus-visible:border-rose-400 focus-visible:ring-rose-400/20"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-stone-300">Password</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 border-stone-700 bg-stone-800 text-white placeholder:text-stone-500 focus-visible:border-rose-400 focus-visible:ring-rose-400/20"
              />
            </div>

            {displayError && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {displayError}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-stone-600">
          Access restricted to authorised administrators only.
        </p>
      </div>
    </div>
  );
}


