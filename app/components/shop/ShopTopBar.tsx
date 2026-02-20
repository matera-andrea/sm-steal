import { Search, X, SlidersHorizontal } from "lucide-react";
import { SortBy } from "@/app/lib/types/shop";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "alphabetical", label: "A → Z" },
  { value: "price_asc", label: "Prezzo ↑" },
  { value: "price_desc", label: "Prezzo ↓" },
];

interface ShopTopBarProps {
  totalItems: number;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  activeFilterCount: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onResetFilters: () => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
}

export default function ShopTopBar({
  totalItems,
  isLoading,
  searchTerm,
  setSearchTerm,
  onSearch,
  activeFilterCount,
  showFilters,
  setShowFilters,
  onResetFilters,
  sortBy,
  onSortChange,
}: ShopTopBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-6 mb-8 transition-all">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-black">
        {/* 1. Titolo */}
        <div className="flex items-baseline gap-2 w-full md:w-auto">
          <span className="text-3xl font-black italic uppercase tracking-tighter">
            {isLoading ? "..." : totalItems}
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Articoli
          </span>
        </div>

        {/* 2. Search */}
        <div className="flex-1 w-full md:max-w-md relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Cerca sneakers, sku..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
            onClick={onSearch}
          />
          {searchTerm && (
            <X
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>

        {/* 3. Sort + Filtri */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="h-10.5 px-4 border-2 border-gray-200 rounded-full text-xs font-black uppercase tracking-widest bg-white cursor-pointer hover:border-black transition-all outline-none appearance-none text-black"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="text-xs font-bold uppercase underline decoration-2 underline-offset-4 hover:text-amber-500 transition-colors whitespace-nowrap"
            >
              Pulisci Tutto
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 transition-all font-black text-xs uppercase tracking-widest whitespace-nowrap ${
              showFilters || activeFilterCount > 0
                ? "border-black bg-black text-white"
                : "border-gray-200 hover:border-black"
            }`}
          >
            <SlidersHorizontal size={14} />
            {showFilters ? "Chiudi" : "Filtri"}
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-amber-400 text-black px-1.5 rounded-sm">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
