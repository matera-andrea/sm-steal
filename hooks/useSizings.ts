"use client";

import { useQuery } from "@tanstack/react-query";
import { Sizing } from "@prisma/client";

interface SizingsApiResponse {
  data: Sizing[];
}

export function useSizings() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sizings-list"],
    queryFn: async () => {
      const response = await fetch("/api/sizings");
      if (!response.ok) throw new Error("Failed to fetch sizings");

      const json: SizingsApiResponse = await response.json();
      return json.data || [];
    },
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  return {
    sizings: data || [],
    loading: isLoading,
    isError,
    refetch,
  };
}
