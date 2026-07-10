import type { Product } from "./types";
import { getProductImageUrl } from "./supabase";

export interface DbProduct {
  id: string;
  product_code: string;
  name: string;
  brand: string;
  volume: string;
  description: string;
  image_path: string;
  image_paths?: string[] | null;
  thumbnail_index?: number | null;
  display_price: number;
  discount_price: number;
  purchase_price: number;
  is_sold: boolean;
  created_at: string;
}

export function mapDbProduct(row: DbProduct): Product {
  const imagePaths =
    row.image_paths && row.image_paths.length > 0
      ? row.image_paths
      : row.image_path
        ? [row.image_path]
        : [];
  const thumbnailIndex = Math.max(
    0,
    Math.min(row.thumbnail_index ?? 0, Math.max(0, imagePaths.length - 1))
  );
  const imageUrls = imagePaths.map((p) => getProductImageUrl(p));
  const imageUrl =
    imageUrls[thumbnailIndex] ??
    imageUrls[0] ??
    getProductImageUrl(row.image_path ?? "");

  return {
    id: row.id,
    productCode: row.product_code,
    name: row.name,
    brand: row.brand,
    volume: row.volume,
    description: row.description,
    imagePath: imagePaths[thumbnailIndex] ?? row.image_path ?? "",
    imageUrl,
    imagePaths,
    imageUrls,
    thumbnailIndex,
    displayPrice: Number(row.display_price),
    discountPrice: Number(row.discount_price),
    purchasePrice: Number(row.purchase_price),
    isSold: row.is_sold,
    createdAt: row.created_at,
  };
}

export function productToDb(
  product: Partial<Product> & {
    productCode: string;
    name: string;
    brand: string;
    displayPrice: number;
    discountPrice: number;
    purchasePrice: number;
  }
) {
  return {
    product_code: product.productCode,
    name: product.name,
    brand: product.brand,
    volume: product.volume ?? "",
    description: product.description ?? "",
    image_path: product.imagePath ?? "",
    image_paths: product.imagePaths ?? (product.imagePath ? [product.imagePath] : []),
    thumbnail_index: product.thumbnailIndex ?? 0,
    display_price: product.displayPrice,
    discount_price: product.discountPrice,
    purchase_price: product.purchasePrice,
    is_sold: product.isSold ?? false,
  };
}
