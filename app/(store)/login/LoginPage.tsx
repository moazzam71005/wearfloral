"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { validateEmail, validatePassword } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { signIn, isAuthenticated, error, clearError } = useCustomerAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    router.replace(next);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const errors: Record<string, string> = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const ok = await signIn(email, password);
    setLoading(false);
    if (ok) router.replace(next);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex justify-center">
        <Image src="/logo.png" alt="Wear Floral" width={160} height={64} className="h-14 w-auto" />
      </div>
      <h1 className="text-center text-2xl font-bold text-stone-900">Welcome Back</h1>
      <p className="mt-2 text-center text-sm text-stone-500">Sign in to place your order</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" placeholder="you@email.com" />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
        </div>
        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600 text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Don&apos;t have an account?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-rose-500 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
