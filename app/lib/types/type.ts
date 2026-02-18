import {
  Listing,
  Item,
  Photo,
  Sizing,
  ListingSizing,
  SneakerModel,
  Brand,
} from "@prisma/client";

// Re-export Prisma enums for frontend usage
export type {
  Gender,
  CategoryItem,
  ListingCondition,
  SizingType,
} from "@prisma/client";

export type SizingVariant = ListingSizing & {
  sizing: Sizing;
};

export type ListingWithDetails = Listing & {
  item: Item & {
    sneakerModel: SneakerModel & {
      Brand: Brand;
    };
  };
  photos: Photo[];
  sizings: SizingVariant[];
};

export interface KicksProductResponse {
  data: {
    id: string;
    title: string;
    brand: string;
    model: string;
    sku: string;
    description: string;
    image: string;
    slug: string;
    gender: string;
    product_type: string;
  };
}
