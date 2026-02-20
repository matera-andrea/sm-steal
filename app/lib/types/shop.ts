import type { ListingCondition } from "@prisma/client";

export type SortBy = "alphabetical" | "price_asc" | "price_desc";

export interface ShopFilters {
  condition?: ListingCondition;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
  brandId?: string;
  modelId?: string;
  sizingIds?: string[];
}

/** Partial photo shape returned by the listings list endpoint (select projection). */
export interface ListingPhotoSummary {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
}
