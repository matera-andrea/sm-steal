"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

// Hooks
import { useBrands } from "@/hooks/useBrands";
import { useSneakerModels } from "@/hooks/useSneakerModels";

// Types
import { ListingWithDetails } from "../lib/types/type";
import { ShopFilters } from "@/app/lib/types/shop"; // Assicurati di aver creato questo tipo o copialo qui

// Sub-Components
import ShopTopBar from "./shop/ShopTopBar";
import ShopFilterDrawer from "./shop/ShopFilterDrawer";
import ShopGrid from "./shop/ShopGrid";
import ShopPagination from "./shop/ShopPagination";

export default function ProductGrid() {
  // --- STATE ---
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<ShopFilters>({});
  const [tempFilters, setTempFilters] = useState<ShopFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // --- HOOKS ---
  const { brands, loading: brandsLoading } = useBrands();
  const { models, loading: modelsLoading } = useSneakerModels();
  const searchParams = useSearchParams();

  // --- EFFECTS ---

  // 1. URL Sync
  useEffect(() => {
    const querySearch = searchParams.get("search");
    if (querySearch && querySearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: querySearch }));
      setSearchTerm(querySearch);
    }
  }, [searchParams, filters.search]);

  // 2. Drawer Sync
  useEffect(() => {
    if (showFilters) {
      setTempFilters(filters);
    }
  }, [showFilters, filters]);

  // --- DATA FETCHING ---
  const { data, isLoading } = useQuery({
    queryKey: ["listings", currentPage, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "50");
      params.append("isActive", "true");

      if (filters.condition) params.append("condition", filters.condition);
      if (filters.minPrice)
        params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
      if (filters.isFeatured !== undefined)
        params.append("isFeatured", filters.isFeatured.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.brandId) params.append("brandId", filters.brandId);
      if (filters.modelId) params.append("modelId", filters.modelId);

      const response = await fetch(`/api/listings?${params.toString()}`);
      if (!response.ok)
        return { data: [], pagination: { total: 0, totalPages: 1 } };
      return response.json();
    },
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
  });

  const listings: ListingWithDetails[] = data?.data || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };

  // --- HANDLERS ---

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setShowFilters(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (term === filters.search) return;
    setFilters((prev) => ({ ...prev, search: term || undefined }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setTempFilters({});
    setFilters({});
    setSearchTerm("");
    setCurrentPage(1);
    // Pulizia visiva se c'era search dalla X
    if (filters.search) {
      setFilters((prev) => ({ ...prev, search: undefined }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Wrapper per gestire lo scroll al cambio pagina
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-0">
      <ShopTopBar
        totalItems={pagination.total}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        activeFilterCount={Object.keys(filters).length}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onResetFilters={resetFilters}
      />

      <ShopFilterDrawer
        isOpen={showFilters}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        brands={brands}
        models={models}
        brandsLoading={brandsLoading}
        modelsLoading={modelsLoading}
        onApply={applyFilters}
      />

      <ShopGrid isLoading={isLoading} listings={listings} />

      <ShopPagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
