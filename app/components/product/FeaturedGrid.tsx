// /app/components/FeaturedGrid.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import ProductCard from "@/app/components/cards/ProductCard";
import { ListingWithDetails } from "@/app/lib/types/type";

interface FeaturedGridProps {
  limit?: number; // Opzionale: se vuoi mostrarne solo 4 o 8 in homepage
  showPagination?: boolean; // Opzionale: nascondi paginazione in home
}

export default function FeaturedGrid({
  limit = 8,
  showPagination = false,
}: FeaturedGridProps) {
  // Per la homepage spesso non serve paginazione, ma la predisponiamo
  const currentPage = 1;

  const { data, isLoading } = useQuery({
    queryKey: ["listings", "featured", limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        isActive: "true",
        isFeatured: "true",
        // Ordiniamo per data di creazione discendente (i più recenti in alto)
        // Nota: Assicurati che il tuo backend supporti l'ordinamento,
        // altrimenti prenderà quelli di default.
      });

      const response = await fetch(`/api/listings?${params.toString()}`);
      if (!response.ok) throw new Error("Errore nel caricamento dei prodotti");
      return response.json();
    },
  });

  const listings: ListingWithDetails[] = data?.data || [];

  // --- LOADING SKELETON (Stesso stile del ProductGrid) ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 rounded-3xl" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-6 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
        <div className="bg-amber-50 p-6 rounded-full mb-4">
          <Sparkles size={32} className="text-amber-500" />
        </div>
        <h2 className="text-xl font-black uppercase italic text-gray-900">
          No Featured Drops
        </h2>
        <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
          We are curating the next drop. Check back soon for exclusive items.
        </p>
      </div>
    );
  }

  // --- GRID ---
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {listings.map((listing) => (
          <ProductCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
