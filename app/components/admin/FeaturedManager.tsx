"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Star, Loader2, Sparkles, Filter } from "lucide-react";
import { ListingWithDetails } from "@/app/lib/types/type";

export default function FeaturedManagerClient() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "FEATURED_ONLY">("ALL");

  // 1. FETCH LISTINGS
  // Scarichiamo tutti i listing attivi. Limit alto (100) per gestirli agevolmente.
  const { data: listingsResponse, isLoading } = useQuery<{
    data: ListingWithDetails[];
  }>({
    queryKey: ["listings", "all-active"],
    queryFn: async () => {
      const res = await fetch("/api/listings?limit=100&isActive=true");
      if (!res.ok) throw new Error("Errore fetch");
      return res.json();
    },
  });

  const listings = listingsResponse?.data || [];

  // 2. MUTATION (Toggle Featured)
  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      currentState,
    }: {
      id: string;
      currentState: boolean;
    }) => {
      // Invertiamo lo stato
      const newState = !currentState;

      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Mandiamo SOLO il campo da aggiornare.
        // La tua API gestisce bene il fatto che 'variants' sia undefined.
        body: JSON.stringify({ isFeatured: newState }),
      });

      if (!res.ok) throw new Error("Update failed");
      return { id, newState };
    },
    // OPTIMISTIC UPDATE: Aggiorna la UI prima che il server risponda
    onMutate: async ({ id, currentState }) => {
      await queryClient.cancelQueries({ queryKey: ["listings", "all-active"] });

      const previousData = queryClient.getQueryData(["listings", "all-active"]);

      queryClient.setQueryData(
        ["listings", "all-active"],
        (old: { data: ListingWithDetails[] }) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((l: ListingWithDetails) =>
              l.id === id ? { ...l, isFeatured: !currentState } : l,
            ),
          };
        },
      );

      return { previousData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["listings", "all-active"],
        context?.previousData,
      );
      alert("Errore nell'aggiornamento. Riprova.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", "all-active"] });
    },
  });

  // 3. LOGICA FILTRAGGIO CLIENT-SIDE
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.item.name.toLowerCase().includes(search.toLowerCase()) ||
      l.item.sku?.toLowerCase().includes(search.toLowerCase());

    if (filterMode === "FEATURED_ONLY") {
      return matchesSearch && l.isFeatured;
    }
    return matchesSearch;
  });

  const featuredCount = listings.filter((l) => l.isFeatured).length;

  if (isLoading)
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Cerca per nome o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-bold outline-none focus:ring-2 ring-black transition-all"
          />
        </div>

        {/* Filter Toggles */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setFilterMode("ALL")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              filterMode === "ALL"
                ? "bg-black text-white shadow-md"
                : "text-gray-400 hover:text-black"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode("FEATURED_ONLY")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              filterMode === "FEATURED_ONLY"
                ? "bg-amber-400 text-black shadow-md"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Featured{" "}
            <span className="bg-white/50 px-1.5 rounded text-[9px]">
              {featuredCount}
            </span>
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredListings.map((listing) => {
          const photoUrl =
            listing.photos.find((p) => p.isMain)?.url ||
            listing.photos[0]?.url ||
            "/placeholder.png";
          const isFeatured = listing.isFeatured;

          return (
            <div
              key={listing.id}
              onClick={() =>
                toggleMutation.mutate({
                  id: listing.id,
                  currentState: isFeatured,
                })
              }
              className={`
                group cursor-pointer relative flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95
                ${
                  isFeatured
                    ? "border-amber-400 bg-amber-50 shadow-lg shadow-amber-100"
                    : "border-transparent bg-white hover:border-gray-200 shadow-sm"
                }
              `}
            >
              {/* STAR BADGE */}
              <div
                className={`
                absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300
                ${
                  isFeatured
                    ? "bg-amber-400 text-black rotate-0 scale-100"
                    : "bg-gray-100 text-gray-300 group-hover:bg-gray-200 group-hover:text-gray-400"
                }
              `}
              >
                <Star
                  size={16}
                  fill={isFeatured ? "currentColor" : "none"}
                  strokeWidth={3}
                />
              </div>

              {/* IMAGE */}
              <div className="relative aspect-square bg-white m-2 rounded-xl overflow-hidden">
                <Image
                  src={photoUrl}
                  alt="shoe"
                  fill
                  className={`object-contain p-2 mix-blend-multiply transition-opacity ${
                    isFeatured
                      ? "opacity-100"
                      : "opacity-60 group-hover:opacity-100"
                  }`}
                />

                {/* Overlay "FEATURED" text */}
                {isFeatured && (
                  <div className="absolute inset-0 flex items-end justify-center pb-2 bg-gradient-to-t from-amber-400/20 to-transparent">
                    <span className="bg-amber-400 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest shadow-sm flex items-center gap-1">
                      <Sparkles size={8} /> Featured
                    </span>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="px-4 pb-4 pt-0 text-center">
                <h3 className="text-xs font-black uppercase italic truncate text-gray-900">
                  {listing.item.name}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  {listing.item.sku}
                </p>
                <div
                  className={`h-1 w-8 mx-auto mt-3 rounded-full transition-colors ${
                    isFeatured
                      ? "bg-amber-400"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-20 text-gray-300">
          <Filter size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-xs">
            No listings found
          </p>
        </div>
      )}
    </div>
  );
}
