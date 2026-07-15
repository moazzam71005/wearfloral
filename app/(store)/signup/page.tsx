import { Suspense } from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import SignupPage from "./SignupPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Account",
  description: "Create a Wear Floral account (optional). You can also checkout as a guest via WhatsApp.",
  path: "/signup",
  noIndex: true,
});

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" /></div>}>
      <SignupPage />
    </Suspense>
  );
}
