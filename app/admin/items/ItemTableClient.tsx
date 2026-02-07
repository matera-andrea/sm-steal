"use client";

import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import ListingManagerModal from "@/app/components/ListingManagerModal";
import { useSneakerModels } from "@/hooks/useSneakerModels";
import { Item, SneakerModel, Brand, CategoryItem } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";

// Aggiorniamo il tipo per riflettere la nuova struttura relazionale
type ItemWithRelations = Item & {
  sneakerModel: (SneakerModel & { Brand: Pick<Brand, "name"> | null }) | null;
  // I prezzi ora arrivano dal backend come aggregati calcolati sulle varianti dei listings
  minPrice: number | null;
  maxPrice: number | null;
  listingCount: number;
  wishlistItemsCount: number;
};

const categoryOptions: CategoryItem[] = [
  "SNEAKER",
  "SHOE",
  "COLLECTIBLE",
  "CLOTHING",
  "ACCESSORY",
  "OTHER",
];

const getItemColumns = (
  models: ReturnType<typeof useSneakerModels>["models"],
  modelsLoading: boolean,
  onManageListings: (item: ItemWithRelations) => void,
): ColumnDef<ItemWithRelations>[] => [
  {
    header: "Item Name",
    accessorKey: "name",
    renderCell: (item) => (
      <div className="py-2">
        <p className="font-bold text-gray-900 uppercase tracking-tight">
          {item.name}
        </p>
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
          {item.sneakerModel?.Brand?.name || "No Brand"} /{" "}
          {item.sneakerModel?.name || "No Model"}
        </p>
      </div>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className={className}
        placeholder="Es: Jordan 1 Lost & Found"
        required
      />
    ),
  },
  {
    header: "Model & SKU",
    accessorKey: "sku",
    renderCell: (item) => (
      <div>
        <p className="text-sm text-gray-600">
          {item.sneakerModel?.name || "N/A"}
        </p>
        <p className="font-mono text-[10px] text-gray-400">
          {item.sku || "NO SKU"}
        </p>
      </div>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <div className="flex flex-col gap-2">
        <select
          value={formData.sneakerModelId || ""}
          onChange={(e) =>
            setFormData({ ...formData, sneakerModelId: e.target.value })
          }
          className={className}
          disabled={modelsLoading}
          required
        >
          <option value="" disabled>
            Select Model
          </option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.Brand?.name} - {model.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={formData.sku || ""}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className={className}
          placeholder="SKU"
        />
      </div>
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
    renderCell: (item) => (
      <span className="text-[10px] font-black bg-black text-white px-2 py-1 uppercase tracking-tighter">
        {item.category}
      </span>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <select
        value={formData.category || ""}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value as CategoryItem })
        }
        className={className}
      >
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    ),
  },
  {
    header: "Market Value & Listings",
    accessorKey: "listingCount",
    renderCell: (item) => (
      <div className="flex items-center justify-between min-w-[200px]">
        <div>
          {item.listingCount > 0 ? (
            <>
              <p className="text-sm font-black text-gray-900">
                {item.minPrice !== null && item.maxPrice !== null ? (
                  item.minPrice === item.maxPrice ? (
                    `€${item.minPrice.toFixed(2)}`
                  ) : (
                    `€${item.minPrice.toFixed(2)} - €${item.maxPrice.toFixed(
                      2,
                    )}`
                  )
                ) : (
                  <span className="text-red-600 uppercase">Out of Stock</span>
                )}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {item.listingCount} Listings
                </span>
                <span className="text-[10px] font-bold text-amber-500 uppercase">
                  {item.wishlistItemsCount} Wish
                </span>
              </div>
            </>
          ) : (
            <span className="text-[10px] font-bold text-gray-300 uppercase italic">
              Inactive / No Stock
            </span>
          )}
        </div>
        <button
          onClick={() => onManageListings(item)}
          className="ml-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-black hover:bg-amber-500 transition-colors rounded"
        >
          Listings
        </button>
      </div>
    ),
  },
  {
    header: "Visibility",
    accessorKey: "isActive",
    renderCell: (item) => (
      <span
        className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
          item.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {item.isActive ? "Public" : "Hidden"}
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
        <option value="true">Public</option>
        <option value="false">Hidden</option>
      </select>
    ),
  },
];

export default function ItemTableClient() {
  const { models, loading: modelsLoading } = useSneakerModels();
  const [managingItem, setManagingItem] = useState<ItemWithRelations | null>(
    null,
  );

  // 2. Stabilizziamo la funzione di callback per evitare che cambi a ogni render
  const handleManageListings = useCallback((item: ItemWithRelations) => {
    setManagingItem(item);
  }, []);

  // 3. Usiamo useMemo per calcolare le colonne SOLO se models o loading cambiano
  const columns = useMemo(() => {
    return getItemColumns(models, modelsLoading, handleManageListings);
  }, [models, modelsLoading, handleManageListings]);

  const emptyItem: Partial<ItemWithRelations> = {
    name: "",
    sku: "",
    category: "SNEAKER",
    gender: "UNISEX",
    isActive: true,
    sneakerModelId: "",
  };

  return (
    <>
      <DataTable<ItemWithRelations>
        modelName="Catalog Item"
        apiEndpoint="/api/items"
        columns={columns}
        initialEmptyRow={emptyItem}
      />
      {managingItem && (
        <ListingManagerModal
          item={managingItem}
          onClose={() => setManagingItem(null)}
        />
      )}
    </>
  );
}
