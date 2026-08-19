import type { Metadata } from "next";
import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo";
import ShopPage from "./ShopPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Unstitched Fabrics",
  description:
    "Browse unique unstitched fabrics and King size bedsheets from Sapphire, Gul Ahmed, Khaadi, Maria B, Bareezé and more.",
  path: "/shop",
});

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
        </div>
      }
    >
      <ShopPage />
    </Suspense>
  );
}
