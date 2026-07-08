import type { Category } from "./types";

export const STORE_NAME = "Wear Floral";
export const STORE_TAGLINE = "Elegant Desi Fashion for the Modern Woman";
export const STORE_EMAIL = "saleswearfloral@gmail.com";
export const STORE_PHONE = "+92 300 0000000";
export const STORE_LOCATION = "Lahore, Pakistan";

export const CATEGORIES: {
  name: Category;
  slug: string;
  description: string;
  image: string;
}[] = [
  {
    name: "Lawn",
    slug: "lawn",
    description: "Breathable printed lawn suits",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  },
  {
    name: "Kurtis",
    slug: "kurtis",
    description: "Stylish everyday kurtis",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
  },
  {
    name: "Shalwar Kameez",
    slug: "shalwar-kameez",
    description: "Classic festive ensembles",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  },
  {
    name: "Dupattas",
    slug: "dupattas",
    description: "Embroidered & chiffon dupattas",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Bags, jewelry & more",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
  },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const COLORS = [
  "White",
  "Black",
  "Pink",
  "Red",
  "Green",
  "Blue",
  "Maroon",
  "Gold",
  "Beige",
  "Navy",
] as const;

export const BRANDS = [
  "Sapphire",
  "Gul Ahmed",
  "Khaadi",
  "Maria B",
  "Alkaram",
  "Wear Floral",
] as const;

export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 250;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?filter=new", label: "New Arrivals" },
  { href: "/shop?filter=bestseller", label: "Best Sellers" },
] as const;
