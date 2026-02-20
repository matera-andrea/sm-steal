// app/admin/listings/ListingTableClient.tsx
"use client";

import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import { useBrands } from "@/hooks/useBrands";
import { useItems } from "@/hooks/useItems";
import { useSizings } from "@/hooks/useSizings";
import { useSneakerModels } from "@/hooks/useSneakerModels";
import {
  Listing,
  Item,
  Sizing,
  ListingSizing,
  ListingCondition,
} from "@prisma/client";
import { Plus, Trash2, X } from "lucide-react";
import { useMemo } from "react"; // <--- 1. Importa useMemo

type ListingWithRelations = Listing & {
  item: Pick<Item, "id" | "name"> | null;
  sizings: (ListingSizing & { sizing: Sizing })[];
  variants?: {
    sizingId: string;
    price: number;
    condition: ListingCondition;
    stock: number;
  }[];
};

const conditionOptions: ListingCondition[] = [
  "NEW",
  "LIKE_NEW",
  "VERY_GOOD",
  "GOOD",
  "ACCEPTABLE",
  "POOR",
];

const getListingColumns = (
  items: ReturnType<typeof useItems>["items"],
  itemsLoading: boolean,
  availableSizings: Sizing[],
): ColumnDef<ListingWithRelations>[] => [
  {
    header: "Item",
    accessorKey: "itemId",
    renderCell: (listing) => (
      <div className="py-2">
        <p className="font-black uppercase italic tracking-tighter text-gray-900">
          {listing.item?.name || "N/A"}
        </p>
        <p className="text-[10px] text-gray-400 font-mono">{listing.id}</p>
      </div>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <select
        value={formData.itemId || ""}
        onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
        className={`${className} font-bold uppercase text-xs`}
        disabled={itemsLoading}
        required
      >
        <option value="">Select Item</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    ),
  },
  {
    header: "Price Range & Condition",
    accessorKey: "id",
    renderCell: (listing) => {
      const prices = listing.sizings.map((s) => s.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return (
        <div className="space-y-1">
          <p className="font-black text-amber-500">
            {prices.length > 0
              ? min === max
                ? `€${min}`
                : `€${min} - €${max}`
              : "N/A"}
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(listing.sizings.map((s) => s.condition))).map(
              (c) => (
                <span
                  key={c}
                  className="text-[9px] bg-gray-100 px-1 font-bold uppercase"
                >
                  {c}
                </span>
              ),
            )}
          </div>
        </div>
      );
    },
    renderEditCell: () => (
      <span className="text-[10px] text-gray-400 italic">
        Managed in Variants →
      </span>
    ),
  },
  {
    header: "Variants (Size / Price / Stock)",
    accessorKey: "sizings",
    renderCell: (listing) => (
      <div className="grid grid-cols-1 gap-1 min-w-[200px]">
        {listing.sizings.map((s) => (
          <div
            key={s.id}
            className="text-[10px] border border-gray-100 p-1.5 rounded bg-gray-50 flex items-center justify-between gap-2"
          >
            <div className="flex gap-2">
              <span className="font-bold w-12">
                {s.sizing.size}{" "}
                <span className="text-gray-400 font-normal">
                  {s.sizing.type}
                </span>
              </span>
              <span className="text-gray-500 uppercase text-[9px] w-16 truncate">
                {s.condition.replace("_", " ")}
              </span>
            </div>

            <div className="flex gap-3">
              <span className="text-amber-600 font-black w-12 text-right">
                €{s.price}
              </span>
              <span
                className={`font-mono font-bold w-8 text-center rounded ${
                  s.stock > 0
                    ? "bg-white text-black border border-gray-200"
                    : "bg-red-100 text-red-500"
                }`}
              >
                x{s.stock}
              </span>
            </div>
          </div>
        ))}
      </div>
    ),
    renderEditCell: (formData, setFormData) => {
      if (formData.variants === undefined) {
        formData.variants =
          formData.sizings?.map((s) => ({
            sizingId: s.sizingId,
            price: s.price,
            condition: s.condition,
            stock: s.stock ?? 1,
          })) || [];
      }

      const addVariant = () => {
        setFormData({
          ...formData,
          variants: [
            ...(formData.variants || []),
            { sizingId: "", price: 0, condition: "NEW", stock: 1 },
          ],
        });
      };

      const updateVariant = (
        index: number,
        field: keyof NonNullable<ListingWithRelations["variants"]>[number],
        value: string | number,
      ) => {
        const newVariants = [...(formData.variants || [])];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
      };

      const removeVariant = (index: number) => {
        setFormData({
          ...formData,
          variants: formData.variants?.filter((_, i) => i !== index),
        });
      };

      return (
        <div className="space-y-3 min-w-[450px] p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Manage Variants (Size • Price • Stock)
            </span>
            <button
              onClick={addVariant}
              type="button"
              className="bg-black text-white p-1.5 rounded hover:bg-amber-500 hover:text-black transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {formData.variants.length === 0 && (
              <div className="text-center py-4 text-xs text-gray-400 italic">
                No variants added.
              </div>
            )}

            {formData.variants.map((v, i) => (
              <div
                key={i}
                className="flex gap-2 items-center bg-white p-2 rounded-md shadow-sm border border-gray-100 group"
              >
                <select
                  value={v.sizingId}
                  onChange={(e) => updateVariant(i, "sizingId", e.target.value)}
                  className="text-[10px] font-bold p-1.5 border border-gray-200 rounded w-1/4 outline-none focus:border-black"
                >
                  <option value="">Size</option>
                  {availableSizings.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.size} ({s.type})
                    </option>
                  ))}
                </select>

                <div className="relative w-1/5">
                  <span className="absolute left-1.5 top-1.5 text-[10px] text-gray-400">
                    €
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={v.price}
                    onChange={(e) =>
                      updateVariant(i, "price", parseFloat(e.target.value))
                    }
                    className="text-[10px] font-bold p-1.5 pl-4 border border-gray-200 rounded w-full outline-none focus:border-black"
                  />
                </div>

                <div className="relative w-[15%]">
                  <span className="absolute left-1.5 top-1.5 text-[10px] text-gray-400">
                    #
                  </span>
                  <input
                    type="number"
                    placeholder="Qty"
                    min="0"
                    value={v.stock}
                    onChange={(e) =>
                      updateVariant(i, "stock", parseInt(e.target.value))
                    }
                    className="text-[10px] font-bold p-1.5 pl-4 border border-gray-200 rounded w-full outline-none focus:border-black"
                  />
                </div>

                <select
                  value={v.condition}
                  onChange={(e) =>
                    updateVariant(i, "condition", e.target.value)
                  }
                  className="text-[10px] font-bold p-1.5 border border-gray-200 rounded w-1/4 outline-none focus:border-black"
                >
                  {conditionOptions.map((o) => (
                    <option key={o} value={o}>
                      {o.replace("_", " ")}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "isActive",
    renderCell: (listing) => (
      <span
        className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
          listing.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {listing.isActive ? "Online" : "Offline"}
      </span>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <select
        value={String(formData.isActive ?? true)}
        onChange={(e) =>
          setFormData({ ...formData, isActive: e.target.value === "true" })
        }
        className={className}
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    ),
  },
];

interface ListingFilters {
  brandId?: string;
  modelId?: string;
  search?: string;
  isActive?: string;
}

export default function ListingTableClient() {
  const { items, loading: itemsLoading } = useItems();
  const { sizings } = useSizings();
  const { brands } = useBrands();
  const { models } = useSneakerModels();

  // 2. Utilizza useMemo per evitare il loop infinito
  const columns = useMemo(() => {
    return getListingColumns(items, itemsLoading, sizings);
  }, [items, itemsLoading, sizings]);

  return (
    <DataTable<ListingWithRelations, ListingFilters>
      modelName="Drop"
      apiEndpoint="/api/listings"
      columns={columns}
      initialEmptyRow={{ itemId: "", isActive: true, variants: [] }}
      initialFilters={{ brandId: "", modelId: "", search: "", isActive: "" }}
      renderFilters={(filters, setFilters) => (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search Drops..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black w-48"
          />
          <select
            value={filters.brandId || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                brandId: e.target.value,
                modelId: "",
              })
            }
            className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Brands</option>
            {brands?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={filters.modelId || ""}
            onChange={(e) =>
              setFilters({ ...filters, modelId: e.target.value })
            }
            className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Models</option>
            {models
              ?.filter((m) => !filters.brandId || m.brandId === filters.brandId)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>

          <select
            value={filters.isActive || ""}
            onChange={(e) =>
              setFilters({ ...filters, isActive: e.target.value })
            }
            className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Status</option>
            <option value="true">Online</option>
            <option value="false">Offline</option>
          </select>

          {(filters.brandId ||
            filters.modelId ||
            filters.search ||
            filters.isActive) && (
            <button
              onClick={() =>
                setFilters({
                  brandId: "",
                  modelId: "",
                  search: "",
                  isActive: "",
                })
              }
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    />
  );
}
