import { Suspense } from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import LoginPage from "./LoginPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign In",
  description: "Sign in to Wear Floral (optional). Guests can checkout on WhatsApp without an account.",
  path: "/login",
  noIndex: true,
});

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" /></div>}>
      <LoginPage />
    </Suspense>
  );
}
