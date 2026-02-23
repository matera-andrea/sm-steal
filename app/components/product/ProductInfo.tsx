"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { SizingVariant, ListingWithDetails } from "@/app/lib/types/type";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const SIZE_SLIDER_THRESHOLD = 6;
const SCROLL_AMOUNT = 220;

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sortedSizings, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

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
        <div className="relative">
          {/* Freccia sinistra — solo desktop */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scorri a sinistra"
            className={`
              hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
              w-8 h-8 items-center justify-center rounded-full
              bg-black text-white shadow-lg
              transition-opacity duration-200
              ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
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

          {/* Freccia destra — solo desktop */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scorri a destra"
            className={`
              hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
              w-8 h-8 items-center justify-center rounded-full
              bg-black text-white shadow-lg
              transition-opacity duration-200
              ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <ChevronRight size={16} strokeWidth={3} />
          </button>
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
