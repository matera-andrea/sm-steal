// /app/components/FeaturedGrid.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import ProductCard from "@/app/components/cards/ProductCard";
import { ListingWithDetails } from "@/app/lib/types/type";

interface FeaturedGridProps {
  limit?: number;
  showPagination?: boolean;
}

export default function FeaturedGrid({
  limit = 8,
  showPagination = false, // eslint-disable-line @typescript-eslint/no-unused-vars
}: FeaturedGridProps) {
  const currentPage = 1;

  const { data, isLoading, isError } = useQuery({
    // Aggiungi currentPage alle chiavi se in futuro userai la paginazione
    queryKey: ["listings", "featured", limit, currentPage],

    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        isActive: "true",
        isFeatured: "true",
      });

      const response = await fetch(`/api/listings?${params.toString()}`);

      if (!response.ok) {
        // Gestione specifica per il Rate Limit
        if (response.status === 429) throw new Error("Rate limit exceeded");
        throw new Error("Errore nel caricamento dei prodotti");
      }

      return response.json();
    },

    // --- CONFIGURAZIONE ANTI-LOOP / ANTI-429 ---
    staleTime: 1000 * 60 * 10, // 10 minuti: I prodotti in vetrina non cambiano ogni secondo.
    gcTime: 1000 * 60 * 30, // 30 minuti: Mantieni in cache anche se cambi pagina.
    refetchOnWindowFocus: false, // Fondamentale: non rifetchare se l'utente fa alt-tab.
    refetchOnMount: false, // Se i dati sono in cache (e non stale), non rifetchare al mount.
    retry: (failureCount, error) => {
      // Se becchiamo un 429, smettiamo subito di martellare il server
      if (error.message === "Rate limit exceeded") return false;
      return failureCount < 2;
    },
  });

  const listings: ListingWithDetails[] = data?.data || [];

  // --- LOADING SKELETON ---
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

  // --- ERROR STATE (Opzionale ma consigliato) ---
  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        <p>Impossible to load featured products at the moment.</p>
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
