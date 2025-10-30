// /app/components/ProductGrid.tsx
"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/app/components/cards/ProductCard";
import { Listing, Item, Photo } from "@prisma/client";

export type ListingWithDetails = Listing & {
  item: Pick<Item, "name"> | null;
  photos: Pick<Photo, "url">[];
};

type Condition =
  | "NEW"
  | "LIKE_NEW"
  | "VERY_GOOD"
  | "GOOD"
  | "ACCEPTABLE"
  | "POOR";

interface Filters {
  isActive?: boolean;
  isFeatured?: boolean;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
}

const conditionLabels: Record<Condition, string> = {
  NEW: "Nuovo",
  LIKE_NEW: "Come Nuovo",
  VERY_GOOD: "Ottime Condizioni",
  GOOD: "Buone Condizioni",
  ACCEPTABLE: "Accettabile",
  POOR: "Povere Condizioni",
};

export default function ProductGrid() {
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [tempFilters, setTempFilters] = useState<Filters>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchListings();
  }, [filters, currentPage]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        isActive: "true", // Mostra solo prodotti attivi
      });

      if (filters.isFeatured !== undefined) {
        params.append("isFeatured", filters.isFeatured.toString());
      }
      if (filters.condition) {
        params.append("condition", filters.condition);
      }
      if (filters.minPrice !== undefined) {
        params.append("minPrice", filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined) {
        params.append("maxPrice", filters.maxPrice.toString());
      }

      const response = await fetch(`/api/listings?${params.toString()}`);
      const data = await response.json();

      setListings(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1); // Reset alla prima pagina quando si applicano nuovi filtri
    setShowFilters(false);
  };

  const resetFilters = () => {
    setTempFilters({});
    setFilters({});
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setTempFilters({
      ...tempFilters,
      [type === "min" ? "minPrice" : "maxPrice"]: numValue,
    });
  };

  const activeFilterCount = Object.keys(filters).length;

  if (loading && listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Caricamento prodotti...
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header con filtri */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            I Nostri Prodotti
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {total} prodotti disponibili
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtri
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Pannello Filtri */}
      {showFilters && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Condizione */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condizione
              </label>
              <select
                value={tempFilters.condition || ""}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    condition: e.target.value as Condition | undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tutte</option>
                {Object.entries(conditionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prezzo Minimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo Minimo (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tempFilters.minPrice ?? ""}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Prezzo Massimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo Massimo (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tempFilters.maxPrice ?? ""}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                placeholder="999.99"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* In Evidenza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Prodotto
              </label>
              <select
                value={
                  tempFilters.isFeatured === undefined
                    ? ""
                    : tempFilters.isFeatured.toString()
                }
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    isFeatured:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tutti</option>
                <option value="true">In Evidenza</option>
                <option value="false">Standard</option>
              </select>
            </div>
          </div>

          {/* Bottoni Azioni */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={applyFilters}
              className="flex-1 sm:flex-initial px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Applica Filtri
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 sm:flex-initial px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Filtri Attivi (Chips) */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.condition && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Condizione: {conditionLabels[filters.condition]}
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.condition;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filters.minPrice !== undefined && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Min: €{filters.minPrice}
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.minPrice;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filters.maxPrice !== undefined && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Max: €{filters.maxPrice}
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.maxPrice;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filters.isFeatured !== undefined && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {filters.isFeatured ? "In Evidenza" : "Standard"}
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.isFeatured;
                  setFilters(newFilters);
                  setTempFilters(newFilters);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Griglia Prodotti */}
      {listings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">
            Nessun prodotto trovato
          </h2>
          <p className="mt-2 text-gray-500">
            Prova a modificare i filtri di ricerca
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {listings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Precedente
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Successiva
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
