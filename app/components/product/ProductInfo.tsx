"use client";

import { SizingVariant, ListingWithDetails } from "@/app/lib/types/type";
import { Check } from "lucide-react";

const SIZE_SLIDER_THRESHOLD = 6;

interface ProductInfoProps {
  listing: ListingWithDetails;
  selectedVariantId?: string;
  onVariantChange: (variant: SizingVariant) => void;
}

function VariantCard({
  variant,
  isSelected,
  onVariantChange,
  compact,
}: {
  variant: SizingVariant;
  isSelected: boolean;
  onVariantChange: (variant: SizingVariant) => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={() => onVariantChange(variant)}
      className={`
        relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 group
        ${compact ? "p-3 shrink-0 w-24" : "p-4"}
        ${
          isSelected
            ? "border-black bg-black text-white shadow-xl scale-[1.02]"
            : "border-gray-100 bg-white hover:border-black hover:shadow-md text-black"
        }
      `}
    >
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

      <span className={`font-bold mt-1 ${compact ? "text-base" : "text-lg"}`}>
        €{variant.price}
      </span>

      <span
        className={`
          mt-1.5 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded
          ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}
        `}
      >
        {variant.condition === "NEW"
          ? "Nuovo"
          : variant.condition.replace("_", " ")}
      </span>

      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-amber-400 text-black rounded-full p-1 shadow-sm">
          <Check size={12} strokeWidth={4} />
        </div>
      )}
    </button>
  );
}

export function ProductInfo({
  listing,
  selectedVariantId,
  onVariantChange,
}: ProductInfoProps) {
  const sortedSizings = [...listing.sizings].sort((a, b) => {
    const sizeA = parseFloat(a.sizing.size) || 0;
    const sizeB = parseFloat(b.sizing.size) || 0;
    return sizeA - sizeB;
  });

  if (sortedSizings.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
        <p className="text-sm font-bold text-gray-400">Esaurito</p>
      </div>
    );
  }

  const useSlider = sortedSizings.length > SIZE_SLIDER_THRESHOLD;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          Seleziona Taglia e Condizione
        </h3>
      </div>

      {useSlider ? (
        <div
          className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {sortedSizings.map((variant) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              isSelected={selectedVariantId === variant.id}
              onVariantChange={onVariantChange}
              compact
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sortedSizings.map((variant) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              isSelected={selectedVariantId === variant.id}
              onVariantChange={onVariantChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
