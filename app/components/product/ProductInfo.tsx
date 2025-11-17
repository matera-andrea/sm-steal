"use client";
import { ProductActions } from "@/app/components/cards/ProductActions";

interface ProductInfoProps {
  listing: any;
  fullName: string;
}

export function ProductInfo({ listing, fullName }: ProductInfoProps) {
  const price = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(listing.price);

  const getConditionLabel = (condition: string) => {
    const conditions: Record<string, string> = {
      NEW: "Nuovo",
      LIKE_NEW: "Come nuovo",
      GOOD: "Usato - Buone condizioni",
      USED: "Usato",
    };
    return conditions[condition] || condition;
  };

  return (
    <div>
      {/* Nome prodotto */}
      <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
        {fullName}
      </h1>

      {/* Prezzo */}
      <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
        <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          {price}
        </p>
      </div>

      {/* Badge condizione e disponibilità */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
          {getConditionLabel(listing.condition)}
        </span>

        {listing.stock > 0 ? (
          <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Disponibile ({listing.stock} in stock)
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            Esaurito
          </span>
        )}
      </div>

      {/* Azioni prodotto (taglie e bottoni) */}
      <ProductActions listing={listing} />
    </div>
  );
}
