"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
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
  const { signUp, isAuthenticated, error, clearError, resendVerificationEmail } =
    useCustomerAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  if (isAuthenticated && !pendingEmail) {
    router.replace(next);
    return null;
  }

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResendMessage("");
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
    Object.entries(checks).forEach(([k, v]) => {
      if (v) errors[k] = v;
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const result = await signUp(form);
    setLoading(false);

    if (!result.ok) return;

    if (result.needsVerification) {
      setPendingEmail(result.email);
      return;
    }

    router.replace(next);
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResending(true);
    setResendMessage("");
    const ok = await resendVerificationEmail(pendingEmail);
    setResending(false);
    if (ok) {
      setResendMessage("Verification email sent again. Check your inbox and spam folder.");
    }
  };

  if (pendingEmail) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Wear Floral"
            width={280}
            height={112}
            className="h-20 w-auto sm:h-24"
          />
        </div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <Mail className="h-7 w-7 text-rose-500" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          We sent a verification link to{" "}
          <span className="font-semibold text-stone-900">{pendingEmail}</span>.
          Open that email and tap <strong>Verify my email</strong> before signing in
          or checking out on WhatsApp.
        </p>
        <p className="mt-2 text-xs text-stone-500">
          Don&apos;t see it? Check spam or promotions. The link may take a minute to arrive.
        </p>
        {resendMessage && (
          <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
            {resendMessage}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={resending}
            onClick={handleResend}
          >
            {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend email
          </Button>
          <Button className="bg-rose-500 text-white hover:bg-rose-600" asChild>
            <Link href={`/login?next=${encodeURIComponent(next)}`}>
              I verified — Sign in
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8 flex justify-center">
        <Image
          src="/logo.png"
          alt="Wear Floral"
          width={280}
          height={112}
          className="h-20 w-auto sm:h-24"
        />
      </div>
      <h1 className="text-center text-2xl font-bold text-stone-900">Create Account</h1>
      <p className="mt-2 text-center text-sm text-stone-500">
        Optional — checkout works without an account
      </p>

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
            <Input
              id={id}
              type={type}
              value={form[id as keyof typeof form]}
              onChange={(e) => update(id, e.target.value)}
              className="mt-1"
            />
            {fieldErrors[id] && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors[id]}</p>
            )}
          </div>
        ))}
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-500 text-white hover:bg-rose-600"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
        <p className="text-center text-xs text-stone-500">
          Prefer a faster checkout? You can order as a guest — no signup needed.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-medium text-rose-500 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
