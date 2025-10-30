"use client"; // Fondamentale: questo è un Client Component

import { useState } from "react";
import { Prisma } from "@prisma/client"; // Importa i tipi generati

// Definiamo un tipo più completo per la prop `listing`
type ListingWithDetails = Prisma.ListingGetPayload<{
  include: {
    sizings: {
      include: {
        sizing: true;
      };
    };
  };
}>;

interface ProductActionsProps {
  listing: ListingWithDetails;
}

export function ProductActions({ listing }: ProductActionsProps) {
  const [selectedSizingId, setSelectedSizingId] = useState<string | null>(null);

  const hasSizings = listing.sizings.length > 0;
  const isOutOfStock = listing.stock < 1;

  // Disabilita il carrello se è fuori stock O se ci sono taglie ma nessuna è selezionata
  const isAddToCartDisabled = isOutOfStock || (hasSizings && !selectedSizingId);

  // TODO: Implementare la logica per aggiungere al carrello e ai preferiti
  const handleAddToCart = () => {
    if (isAddToCartDisabled) return;
    console.log("Aggiunto al carrello:", {
      listingId: listing.id,
      sizingId: selectedSizingId,
    });
    // Qui andrà la tua logica (es. useCart() store)
  };

  const handleAddToFavorites = () => {
    console.log("Aggiunto ai preferiti:", listing.id);
    // Qui andrà la tua logica (es. chiamata API)
  };

  return (
    <>
      {/* Sezione Selezione Taglia (Dinamica) */}
      {hasSizings && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Seleziona Taglia:
          </h3>
          <fieldset aria-label="Scegli una taglia">
            <div className="flex flex-wrap gap-3">
              {listing.sizings.map((listingSizing) => (
                <div key={listingSizing.id}>
                  <input
                    type="radio"
                    name="sizing-option"
                    id={listingSizing.id}
                    value={listingSizing.sizingId}
                    checked={selectedSizingId === listingSizing.sizingId}
                    onChange={() => setSelectedSizingId(listingSizing.sizingId)}
                    className="sr-only" // Nasconde il radio button nativo
                    aria-labelledby={`${listingSizing.id}-label`}
                  />
                  <label
                    htmlFor={listingSizing.id}
                    id={`${listingSizing.id}-label`}
                    className={`
                      flex items-center justify-center rounded-lg border
                      py-2 px-4 text-sm font-medium uppercase
                      cursor-pointer transition-colors
                      ${
                        selectedSizingId === listingSizing.sizingId
                          ? "ring-2 ring-primary-500 border-primary-500 bg-primary-50 text-primary-600"
                          : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {listingSizing.sizing.size}{" "}
                    {/* Assumendo che Sizing abbia un campo 'name' */}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {/* Sezione Pulsanti */}
      <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
        <button
          type="button"
          onClick={handleAddToFavorites}
          title="Aggiungi ai preferiti"
          className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 w-full sm:w-auto"
        >
          <svg
            className="w-5 h-5 -ms-2 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
            />
          </svg>
          Add to favorites
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          title={
            isOutOfStock
              ? "Prodotto esaurito"
              : isAddToCartDisabled
              ? "Seleziona una taglia"
              : "Aggiungi al carrello"
          }
          className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 -ms-2 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
            />
          </svg>
          {isOutOfStock ? "Esaurito" : "Add to cart"}
        </button>
      </div>
    </>
  );
}
