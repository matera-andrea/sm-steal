"use client";

import { useQuery } from "@tanstack/react-query";
import { Item } from "@prisma/client";

export type DropdownItem = Pick<
  Item,
  "id" | "name" | "sku" | "category" | "gender"
>;

interface ItemsApiResponse {
  data: DropdownItem[];
}

export function useItems() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["items-list"],
    queryFn: async () => {
      const response = await fetch("/api/items?limit=100");
      if (!response.ok) throw new Error("Failed to fetch items");

      const json: ItemsApiResponse = await response.json();
      return json.data || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    items: data || [],
    loading: isLoading,
    isError,
    refetch,
  };
}
