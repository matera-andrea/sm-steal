import type { ListingCondition } from "@prisma/client";

export interface ShopFilters {
  condition?: ListingCondition;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
  brandId?: string;
  modelId?: string;
}
