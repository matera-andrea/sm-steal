// /hooks/useBrands.ts

"use client";

import { Brand } from "@prisma/client";
import { useState, useEffect } from "react";

type SimpleBrand = Pick<Brand, "id" | "name">;

export function useBrands() {
  const [brands, setBrands] = useState<SimpleBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        // Usiamo un limite alto per assicurarci di prenderli tutti per la select
        const response = await fetch("/api/brands");
        if (!response.ok) throw new Error("Failed to fetch brands");

        const data = await response.json();
        setBrands(data.data);
      } catch (error) {
        console.error("Error fetching brands for dropdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading };
}
