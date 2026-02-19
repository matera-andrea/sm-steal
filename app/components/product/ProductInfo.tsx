"use client";

import { SizingVariant, ListingWithDetails } from "@/app/lib/types/type";
import { Check } from "lucide-react";

interface ProductInfoProps {
  listing: ListingWithDetails;
  selectedVariantId?: string;
  onVariantChange: (variant: SizingVariant) => void;
}

export function ProductInfo({
  listing,
  selectedVariantId,
  onVariantChange,
}: ProductInfoProps) {
  // Ordiniamo le varianti: Prima per Taglia, poi per Prezzo
  const sortedSizings = [...listing.sizings].sort((a, b) => {
    // Logica semplificata di sort per taglia (potresti aver bisogno di una logica custom per US/UK/EU)
    const sizeA = parseFloat(a.sizing.size) || 0;
    const sizeB = parseFloat(b.sizing.size) || 0;
    return sizeA - sizeB;
  });
  if (sortedSizings.length !== 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Seleziona Taglia e Condizione
          </h3>
          {/* <span className="text-[10px] font-bold underline cursor-pointer hover:text-amber-500">
          Size Guide
        </span> */}
        </div>

        {/* GRIGLIA VARIANTI */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sortedSizings.map((variant) => {
            const isSelected = selectedVariantId === variant.id;

            return (
              <button
                key={variant.id}
                onClick={() => onVariantChange(variant)}
                className={`
                relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 group
                ${
                  isSelected
                    ? "border-black bg-black text-white shadow-xl scale-[1.02]"
                    : "border-gray-100 bg-white hover:border-black hover:shadow-md text-black"
                }
              `}
              >
                {/* Size */}
                <span
                  className={`text-sm font-black ${
                    isSelected ? "text-amber-400" : "text-black"
                  }`}
                >
                  {variant.sizing.size}{" "}
                  <span className="text-[10px] font-medium opacity-70">
                    {variant.sizing.type}
                  </span>
                </span>

                {/* Price */}
                <span className="text-lg font-bold mt-1">€{variant.price}</span>

                {/* Condition Badge (Piccolo) */}
                <span
                  className={`
                mt-2 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded
                ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }
              `}
                >
                  {variant.condition === "NEW"
                    ? "Nuovo"
                    : variant.condition.replace("_", " ")}
                </span>

                {/* Checkmark icon on selection */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-black rounded-full p-1 shadow-sm">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  } else
    return (
      <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
        <p className="text-sm font-bold text-gray-400">Esaurito</p>
      </div>
    );
}
