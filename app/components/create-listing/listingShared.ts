import { ListingCondition, Gender, CategoryItem } from "@/app/lib/types/type";

export const CONDITION_OPTIONS: { value: ListingCondition; label: string }[] = [
  { value: "NEW", label: "Brand New" },
  { value: "LIKE_NEW", label: "Used - Like New" },
  { value: "VERY_GOOD", label: "Used - Very Good" },
  { value: "GOOD", label: "Used - Good" },
  { value: "ACCEPTABLE", label: "Used - Acceptable" },
  { value: "POOR", label: "Used - Poor" },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "UNISEX", label: "Unisex" },
  { value: "KIDS", label: "Kids" },
];

export const CATEGORY_OPTIONS: { value: CategoryItem; label: string }[] = [
  { value: "SNEAKER", label: "Sneaker" },
  { value: "SHOE", label: "Shoe" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "ACCESSORY", label: "Accessory" },
  { value: "COLLECTIBLE", label: "Collectible" },
  { value: "OTHER", label: "Other" },
];

export const mapStockXGender = (g: string): Gender => {
  const lower = g?.toLowerCase() || "";
  if (lower.includes("wom")) return "WOMEN";
  if (lower.includes("men")) return "MEN";
  if (
    lower.includes("gs") ||
    lower.includes("ps") ||
    lower.includes("td") ||
    lower.includes("kid")
  )
    return "KIDS";
  return "UNISEX";
};

// Tipi locali utili ai componenti
export interface ListingVariantState {
  sizingId: string;
  price: number;
  condition: ListingCondition;
  stock: number;
}

export interface ListingFormData {
  itemId: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  variants: ListingVariantState[];
  photos: File[];
}

export interface TempProductData {
  brand: string;
  model: string;
  title: string;
  sku: string;
  rawDescription: string;
  gender: Gender;
  category: CategoryItem;
}

/**
 * Extended product data shape returned by the KicksDB/StockX proxy API.
 * `images` holds all available 360° photos when the external API provides them.
 */
export interface KicksProductData {
  id: string;
  title: string;
  brand: string;
  model: string;
  sku: string;
  description: string;
  image: string;
  gallery?: string[];
  gallery_360?: string[];
  slug: string;
  gender: string;
  product_type: string;
}

export interface KicksMultiImageResponse {
  data: KicksProductData;
}
