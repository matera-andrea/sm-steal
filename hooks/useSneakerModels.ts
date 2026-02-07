"use client";

import { useQuery } from "@tanstack/react-query";
import { SneakerModel, Brand } from "@prisma/client";

export type SimpleSneakerModel = Pick<
  SneakerModel,
  "id" | "name" | "brandId"
> & {
  Brand: Pick<Brand, "id" | "name"> | null;
};

interface ModelsApiResponse {
  data: SimpleSneakerModel[];
}

export function useSneakerModels() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["models-list"],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "200", // Limite un po' più alto per i modelli
        isActive: "true",
      });

      const response = await fetch(`/api/sneakerModels?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch models");

      const json: ModelsApiResponse = await response.json();
      return json.data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache per 5 minuti
    refetchOnWindowFocus: false,
  });

  return {
    models: data || [],
    loading: isLoading,
    isError,
    refetch,
  };
}
