/* eslint-disable @next/next/no-img-element */
// components/ProductCard.tsx

import { Listing } from "@prisma/client";

// 1. Definiamo un tipo per le props che il componente accetterà
type ProductCardProps = {
  listing: Listing;
  photoUrl: string;
  itemName: string;
};

// 2. Usiamo le props per popolare dinamicamente il componente
export default function ProductCard({
  listing,
  photoUrl,
  itemName,
}: ProductCardProps) {
  return (
    <a href={`/shop/${listing.id}`} className="group block">
      <img
        src={photoUrl}
        alt={listing.description || "Product Image"}
        className="aspect-square w-full rounded-sm object-cover"
      />

      <div className="mt-3">
        <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
          {itemName}
        </h3>

        <p className="mt-1 text-sm text-gray-700">{listing.price}</p>
      </div>
    </a>
  );
}
