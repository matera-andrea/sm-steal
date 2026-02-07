//hooks/useSizings.ts
"use client";

import { Sizing } from "@prisma/client";
import { useState, useEffect } from "react";

export function useSizings() {
  const [sizings, setSizings] = useState<Sizing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSizings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/sizings");
        if (!response.ok) throw new Error("Failed to fetch sizings");

        const data = await response.json();
        setSizings(data.data);
      } catch (error) {
        console.error("Error fetching sizings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSizings();
  }, []);

  return { sizings, loading };
}
