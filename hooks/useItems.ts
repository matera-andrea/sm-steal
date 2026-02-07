"use client";

import { Item, CategoryItem, Gender } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";

// Definiamo un tipo più ricco per il dropdown e per i controlli di duplicati
export type DropdownItem = Pick<
  Item,
  "id" | "name" | "sku" | "category" | "gender"
>;

export function useItems() {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items?limit=100");
      if (!response.ok) throw new Error("Failed to fetch items");

      const data = await response.json();

      setItems(data.data || []);
    } catch (error) {
      console.error("Error fetching items for dropdown:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, refetch: fetchItems };
}
