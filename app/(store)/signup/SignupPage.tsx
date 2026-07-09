"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import {
  validateAddress,
  validateCity,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const { signUp, isAuthenticated, error, clearError } = useCustomerAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", address: "", city: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    router.replace(next);
    return null;
  }

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const errors: Record<string, string> = {};
    const checks = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
      address: validateAddress(form.address),
      city: validateCity(form.city),
    };
    Object.entries(checks).forEach(([k, v]) => { if (v) errors[k] = v; });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const ok = await signUp(form);
    setLoading(false);
    if (ok) router.replace(next);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8 flex justify-center">
        <Image src="/logo.png" alt="Wear Floral" width={160} height={64} className="h-14 w-auto" />
      </div>
      <h1 className="text-center text-2xl font-bold text-stone-900">Create Account</h1>
      <p className="mt-2 text-center text-sm text-stone-500">Sign up to checkout and track orders</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {[
          { id: "name", label: "Full Name", type: "text" },
          { id: "email", label: "Email", type: "email" },
          { id: "phone", label: "Phone (03XX-XXXXXXX)", type: "tel" },
          { id: "password", label: "Password", type: "password" },
          { id: "confirmPassword", label: "Confirm Password", type: "password" },
          { id: "address", label: "Delivery Address", type: "text" },
          { id: "city", label: "City", type: "text" },
        ].map(({ id, label, type }) => (
          <div key={id}>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type={type} value={form[id as keyof typeof form]} onChange={(e) => update(id, e.target.value)} className="mt-1" />
            {fieldErrors[id] && <p className="mt-1 text-xs text-red-500">{fieldErrors[id]}</p>}
          </div>
        ))}
        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600 text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-rose-500 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
