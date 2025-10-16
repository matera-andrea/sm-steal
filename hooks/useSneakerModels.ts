// /hooks/useSneakerModels.ts

"use client";

import { SneakerModel, Brand } from "@prisma/client";
import { useState, useEffect } from "react";

// Definiamo un tipo semplice che ci serve per la dropdown
type SimpleSneakerModel = Pick<SneakerModel, "id" | "name"> & {
  Brand: Pick<Brand, "name"> | null;
};

export function useSneakerModels() {
  const [models, setModels] = useState<SimpleSneakerModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        // Usiamo un limite alto per prenderli tutti per la select
        const response = await fetch("/api/sneakerModels");
        if (!response.ok) throw new Error("Failed to fetch sneaker models");

        const data = await response.json();
        setModels(data.data);
      } catch (error) {
        console.error("Error fetching sneaker models for dropdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return { models, loading };
}
