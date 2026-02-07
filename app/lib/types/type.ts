// /types/listings.ts
import {
  Listing,
  Item,
  Photo,
  Sizing,
  ListingSizing,
  SneakerModel,
  Brand,
} from "@prisma/client";

// Il cuore della modifica: la variante specifica taglia/prezzo
export type SizingVariant = ListingSizing & {
  sizing: Sizing;
};

// Il listing completo che riceviamo dalle API
export type ListingWithDetails = Listing & {
  item: Item & {
    sneakerModel: SneakerModel & {
      Brand: Brand;
    };
  };
  photos: Photo[];
  sizings: SizingVariant[];
};

// Copia esatta degli Enum del tuo Schema Prisma per il frontend
export type Gender = "MEN" | "WOMEN" | "UNISEX" | "KIDS";
export type CategoryItem =
  | "SNEAKER"
  | "SHOE"
  | "COLLECTIBLE"
  | "CLOTHING"
  | "ACCESSORY"
  | "OTHER";
export type ListingCondition =
  | "NEW"
  | "LIKE_NEW"
  | "VERY_GOOD"
  | "GOOD"
  | "ACCEPTABLE"
  | "POOR";
export type SizingType = "UK" | "US" | "IT" | "OFA" | "OTHER";

// Risposta API Kicks (StockX)
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
    gender: string; // StockX restituisce stringhe tipo 'men', 'child'
    product_type: string; // StockX restituisce 'sneakers', etc.
  };
}

// Struttura variante per il form (corrisponde a ListingSizing)
export interface ListingVariantState {
  sizingId: string;
  price: number;
  condition: ListingCondition;
  stock: number; // Aggiunto come da tuo schema ListingSizing
}
