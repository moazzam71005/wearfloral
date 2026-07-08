"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { STORE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      router.replace("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
            <Lock className="h-6 w-6 text-rose-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-stone-900">
            {STORE_NAME} Admin
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Enter your password to access the dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="mt-1"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-rose-400 hover:bg-rose-500 text-white"
          >
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-stone-400">
          Demo password: wearfloral2024
        </p>
      </div>
    </div>
  );
}
