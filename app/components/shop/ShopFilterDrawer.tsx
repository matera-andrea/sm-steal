"use client";
import { useMemo } from "react";
import { ShopFilters } from "@/app/lib/types/shop";
import type { ListingCondition, Sizing } from "@prisma/client";
import { SimpleBrand } from "@/hooks/useBrands";
import { SimpleSneakerModel } from "@/hooks/useSneakerModels";

const conditionLabels: Record<ListingCondition, string> = {
  NEW: "Nuovo",
  LIKE_NEW: "Come Nuovo",
  VERY_GOOD: "Ottimo",
  GOOD: "Buono",
  ACCEPTABLE: "Accettabile",
  POOR: "Usato",
};

interface ShopFilterDrawerProps {
  isOpen: boolean;
  tempFilters: ShopFilters;
  setTempFilters: (filters: ShopFilters) => void;
  brands: SimpleBrand[];
  models: SimpleSneakerModel[];
  sizings: Sizing[];
  brandsLoading: boolean;
  modelsLoading: boolean;
  sizingsLoading: boolean;
  onApply: () => void;
}

export default function ShopFilterDrawer({
  isOpen,
  tempFilters,
  setTempFilters,
  brands,
  models,
  sizings,
  brandsLoading,
  modelsLoading,
  sizingsLoading,
  onApply,
}: ShopFilterDrawerProps) {
  const filteredModels = useMemo(() => {
    return tempFilters.brandId
      ? models.filter((m) => m.brandId === tempFilters.brandId)
      : models;
  }, [models, tempFilters.brandId]);

  const toggleSize = (id: string) => {
    const current = tempFilters.sizingIds ?? [];
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    setTempFilters({
      ...tempFilters,
      sizingIds: next.length > 0 ? next : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="mt-6 p-8 bg-gray-50 rounded-3xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
      {/* Brand */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex justify-between">
          Brand
          {brandsLoading && <span className="animate-pulse">...</span>}
        </label>
        <select
          value={tempFilters.brandId || ""}
          onChange={(e) =>
            setTempFilters({
              ...tempFilters,
              brandId: e.target.value || undefined,
              modelId: undefined,
            })
          }
          className="w-full bg-transparent border-b-2 border-gray-300 py-2 font-bold focus:border-black outline-none transition-all cursor-pointer text-black disabled:opacity-50"
          disabled={brandsLoading}
        >
          <option value="">Tutti i Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex justify-between">
          Modello
          {modelsLoading && <span className="animate-pulse">...</span>}
        </label>
        <select
          value={tempFilters.modelId || ""}
          onChange={(e) =>
            setTempFilters({
              ...tempFilters,
              modelId: e.target.value || undefined,
            })
          }
          className="w-full bg-transparent border-b-2 border-gray-300 py-2 font-bold focus:border-black outline-none transition-all cursor-pointer text-black disabled:opacity-50"
          disabled={modelsLoading}
        >
          <option value="">Tutti i Modelli</option>
          {filteredModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-gray-400">
          Condizione
        </label>
        <select
          value={tempFilters.condition || ""}
          onChange={(e) =>
            setTempFilters({
              ...tempFilters,
              condition: (e.target.value as ListingCondition) || undefined,
            })
          }
          className="w-full bg-transparent border-b-2 border-gray-300 py-2 font-bold focus:border-black outline-none transition-all cursor-pointer text-black"
        >
          <option value="">Tutte le Condizioni</option>
          {Object.entries(conditionLabels).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-gray-400">
          Range di Prezzo (€)
        </label>
        <div className="flex gap-4">
          <input
            min={0}
            type="number"
            value={tempFilters.minPrice ?? ""}
            onChange={(e) =>
              setTempFilters({
                ...tempFilters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Min"
            className="w-full bg-transparent border-b-2 border-gray-300 py-2 font-bold focus:border-black outline-none transition-all text-black"
          />
          <input
            type="number"
            value={tempFilters.maxPrice ?? ""}
            onChange={(e) =>
              setTempFilters({
                ...tempFilters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Max"
            className="w-full bg-transparent border-b-2 border-gray-300 py-2 font-bold focus:border-black outline-none transition-all text-black"
          />
        </div>
      </div>

      {/* Size chips — full width row */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-4 space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex justify-between">
          Taglia
          {sizingsLoading && <span className="animate-pulse">...</span>}
          {(tempFilters.sizingIds?.length ?? 0) > 0 && (
            <button
              type="button"
              onClick={() =>
                setTempFilters({ ...tempFilters, sizingIds: undefined })
              }
              className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
            >
              Pulisci
            </button>
          )}
        </label>
        <div className="flex flex-wrap gap-2">
          {sizings.map((s) => {
            const selected = tempFilters.sizingIds?.includes(s.id) ?? false;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSize(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all border-2 ${
                  selected
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                }`}
              >
                {s.size}
                {s.type !== "OTHER" ? ` ${s.type}` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end">
        <button
          onClick={onApply}
          className="bg-black text-white py-4 px-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all shadow-xl active:scale-95"
        >
          Mostra Risultati
        </button>
      </div>
    </div>
  );
}
