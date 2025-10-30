/* eslint-disable @next/next/no-img-element */
// /app/components/cards/ProductCard.tsx

import Link from "next/link"; // Usa Link per una navigazione veloce senza ricaricare la p
import { ListingWithDetails } from "../ProductGrid";

// Funzione helper per formattare il prezzo
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

// Il componente ora accetta solo la prop `listing` arricchita
export default function ProductCard({
  listing,
}: {
  listing: ListingWithDetails;
}) {
  // Estraiamo i dati necessari per pulizia
  const itemName = listing.item?.name || "Untitled Item";
  const photoUrl = listing.photos?.[0]?.url;
  const formattedPrice = formatPrice(listing.price);
  const placeholderImage =
    "https://placehold.co/500x500/F3F4F6/9CA3AF?text=No+Image";

  return (
    <Link
      href={`/shop/${listing.id}`}
      className="group block overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={photoUrl || placeholderImage}
          alt={itemName}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Badge della condizione */}
        <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
          {listing.condition.replace("_", " ")}
        </div>
      </div>

      <div className="p-4 bg-white">
        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {itemName}
        </h3>

        <p className="mt-1 text-lg font-bold text-gray-900">{formattedPrice}</p>
      </div>
    </Link>
  );
}
