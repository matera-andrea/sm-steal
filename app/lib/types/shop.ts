// lib/types/shop.ts (o dentro il file stesso se preferisci)
export type Condition =
  | "NEW"
  | "LIKE_NEW"
  | "VERY_GOOD"
  | "GOOD"
  | "ACCEPTABLE"
  | "POOR";

export interface ShopFilters {
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
  brandId?: string;
  modelId?: string;
}
