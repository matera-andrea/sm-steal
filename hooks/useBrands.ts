"use client";

import { useQuery } from "@tanstack/react-query";
import { Brand } from "@prisma/client";

export type SimpleBrand = Pick<Brand, "id" | "name">;

interface BrandApiResponse {
  data: SimpleBrand[];
}

export function useBrands() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["brands-list"], // Chiave univoca per la cache
    queryFn: async () => {
      // Parametri fissi per la dropdown
      const params = new URLSearchParams({
        page: "1",
        limit: "100",
        isActive: "true",
      });

      const response = await fetch(`/api/brands?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch brands");

      const json: BrandApiResponse = await response.json();
      return json.data || [];
    },
    staleTime: 1000 * 60 * 15, // I brand non cambiano spesso: cache per 15 minuti
    refetchOnWindowFocus: false, // Evita refetch se cambi tab
  });

  return {
    brands: data || [],
    loading: isLoading,
    isError,
    refetch,
  };
}
