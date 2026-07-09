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
  display_price: number;
  discount_price: number;
  purchase_price: number;
  is_sold: boolean;
  created_at: string;
}

export function mapDbProduct(row: DbProduct): Product {
  return {
    id: row.id,
    productCode: row.product_code,
    name: row.name,
    brand: row.brand,
    volume: row.volume,
    description: row.description,
    imagePath: row.image_path,
    imageUrl: getProductImageUrl(row.image_path),
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
    display_price: product.displayPrice,
    discount_price: product.discountPrice,
    purchase_price: product.purchasePrice,
    is_sold: product.isSold ?? false,
  };
}
