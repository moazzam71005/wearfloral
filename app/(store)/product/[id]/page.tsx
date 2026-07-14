import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { JsonLd } from "@/components/seo/JsonLd";
import { mapDbProduct, type DbProduct } from "@/lib/db-mappers";
import { absoluteUrl, buildPageMetadata, productJsonLd } from "@/lib/seo";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: { id: string } };

async function fetchProduct(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapDbProduct(data as DbProduct);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  if (!product) {
    return buildPageMetadata({
      title: "Product",
      description: "Browse premium unstitched fabrics at Wear Floral.",
      path: `/product/${params.id}`,
    });
  }

  const description =
    product.description?.trim().slice(0, 160) ||
    `${product.brand} ${product.volume || "unstitched fabric"} — ${product.name}. Shop unique pieces at Wear Floral.`;

  return buildPageMetadata({
    title: `${product.name} | ${product.brand}`,
    description,
    path: `/product/${product.id}`,
    image: product.imageUrl || "/logo.png",
  });
}

export default async function ProductPage({ params }: Props) {
  const product = await fetchProduct(params.id);

  return (
    <>
      {product && (
        <JsonLd
          data={productJsonLd({
            id: product.id,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl
              ? product.imageUrl.startsWith("http")
                ? product.imageUrl
                : absoluteUrl(product.imageUrl)
              : absoluteUrl("/logo.png"),
            brand: product.brand,
            productCode: product.productCode,
            discountPrice: product.discountPrice,
            displayPrice: product.displayPrice,
            isSold: product.isSold,
          })}
        />
      )}
      <ProductDetailClient params={params} />
    </>
  );
}
