"use client";

import { Item } from "@prisma/client";
import { useState, useEffect } from "react";

type SimpleItem = Pick<Item, "id" | "name">;

export function useItems() {
  const [items, setItems] = useState<SimpleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/items");
        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();
        setItems(data.data);
      } catch (error) {
        console.error("Error fetching items for dropdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading };
}
