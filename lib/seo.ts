import type { Metadata } from "next";
import { BRANDS, STORE_EMAIL, STORE_NAME, STORE_TAGLINE } from "./constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://wearfloral.vercel.app";

export const SITE_DESCRIPTION =
  "Shop premium unstitched fabrics from Sapphire, Gul Ahmed, Khaadi, Maria B, Bareezé and more. Unique one-of-a-kind pieces with WhatsApp checkout across Pakistan.";

const brandList = BRANDS.filter((b) => b !== "Others").join(", ");

export const SITE_KEYWORDS = [
  "Wear Floral",
  "unstitched fabrics Pakistan",
  "unstitched suits online",
  "lawn suits",
  "premium brands unstitched",
  brandList,
  "WhatsApp order fabrics",
  "online fabric shop Pakistan",
];

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${STORE_NAME}` : `${STORE_NAME} | ${STORE_TAGLINE}`;
  const desc = description ?? SITE_DESCRIPTION;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || "/logo.png");

  return {
    title: title ? { absolute: pageTitle } : undefined,
    description: desc,
    keywords: SITE_KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url,
      siteName: STORE_NAME,
      title: pageTitle,
      description: desc,
      images: [{ url: ogImage, alt: STORE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: STORE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    email: STORE_EMAIL,
    image: absoluteUrl("/logo.png"),
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
    },
    areaServed: "PK",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STORE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  imageUrl: string;
  brand: string;
  productCode: string;
  discountPrice: number;
  displayPrice: number;
  isSold: boolean;
  id: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description?.trim() ||
      `${product.brand} unstitched fabric — ${product.name}`,
    image: product.imageUrl ? [product.imageUrl] : [absoluteUrl("/logo.png")],
    sku: product.productCode,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.id}`),
      priceCurrency: "PKR",
      price: product.isSold ? product.displayPrice : product.discountPrice,
      availability: product.isSold
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };
}
