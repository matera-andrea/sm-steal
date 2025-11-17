// /app/admin/items/ItemTableClient.tsx

"use client";

import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import ListingManagerModal from "@/app/components/ListingManagerModal";
import { useSneakerModels } from "@/hooks/useSneakerModels";
import {
  Item,
  SneakerModel,
  Brand,
  CategoryItem,
  Gender,
} from "@prisma/client";
import { useState } from "react";

// Definiamo un tipo che rappresenta i dati come arrivano dall'API
type ItemWithRelations = Item & {
  sneakerModel: (SneakerModel & { Brand: Pick<Brand, "name"> | null }) | null;
  minPrice: number | null;
  maxPrice: number | null;
  // I conteggi sono ora proprietà di primo livello, non più in `_count`
  listingCount: number;
  wishlistItemsCount: number;
};

// Mappiamo gli enum di Prisma per usarli nelle select
const categoryOptions: CategoryItem[] = [
  "SNEAKER",
  "SHOE",
  "COLLECTIBLE",
  "CLOTHING",
  "ACCESSORY",
  "OTHER",
];
const genderOptions: Gender[] = ["MEN", "WOMEN", "UNISEX", "KIDS"];

// Funzione che genera la configurazione delle colonne
const getItemColumns = (
  models: ReturnType<typeof useSneakerModels>["models"],
  modelsLoading: boolean,
  onManageListings: (item: ItemWithRelations) => void
): ColumnDef<ItemWithRelations>[] => [
  {
    header: "Item Name",
    accessorKey: "name",
    renderCell: (item) => (
      <div>
        <p className="font-semibold text-gray-900">{item.name}</p>
        <p className="text-xs text-gray-500">
          {item.sneakerModel?.Brand?.name} / {item.sneakerModel?.name}
        </p>
      </div>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        className={className}
        placeholder="Item name"
        required
      />
    ),
  },
  {
    header: "Model",
    accessorKey: "sneakerModelId",
    renderCell: (item) => <p>{item.sneakerModel?.name || "N/A"}</p>,
    renderEditCell: (formData, setFormData, className) => (
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
          {modelsLoading ? "Loading..." : "Select a model"}
        </option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.Brand?.name} - {model.name}
          </option>
        ))}
      </select>
    ),
  },
  {
    header: "SKU",
    accessorKey: "sku",
    renderCell: (item) => (
      <p className="font-mono text-xs">{item.sku || "-"}</p>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <input
        type="text"
        value={formData.sku || ""}
        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        className={className}
        placeholder="SKU"
      />
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
    renderCell: (item) => (
      <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
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
        required
      >
        <option value="" disabled>
          Select category
        </option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    ),
  },
  {
    header: "Inventory",
    accessorKey: "listingCount",
    renderCell: (item) => (
      <div className="flex items-center justify-between">
        <div>
          {item.listingCount > 0 ? (
            <>
              <p className="text-sm font-semibold text-gray-800">
                {item.minPrice === item.maxPrice
                  ? `€${item.minPrice?.toFixed(2)}`
                  : `€${item.minPrice?.toFixed(2)} - €${item.maxPrice?.toFixed(
                      2
                    )}`}
              </p>
              <p className="text-xs text-gray-500">
                {item.listingCount} active listing(s)
              </p>
              <p className="text-xs text-gray-500">
                {item.wishlistItemsCount} wish(es)
              </p>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">
              No active listings
            </span>
          )}
        </div>
        <button
          onClick={() => onManageListings(item)}
          className="ml-4 px-2 py-1 text-xs font-semibold text-white bg-gray-700 hover:bg-gray-800 rounded"
        >
          Manage
        </button>
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    renderCell: (item) => (
      <span
        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
          item.isActive ? "text-green-900" : "text-red-900"
        }`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 opacity-50 rounded-full ${
            item.isActive ? "bg-green-200" : "bg-red-200"
          }`}
        ></span>
        <span className="relative">
          {item.isActive ? "Active" : "Inactive"}
        </span>
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

const emptyItem: Partial<ItemWithRelations> = {
  name: "",
  sku: "",
  category: "SNEAKER",
  gender: "UNISEX",
  isActive: true,
  sneakerModelId: "",
};

export default function ItemTableClient() {
  const { models, loading: modelsLoading } = useSneakerModels();
  const [managingItem, setManagingItem] = useState<ItemWithRelations | null>(
    null
  );
  const columns = getItemColumns(models, modelsLoading, (item) =>
    setManagingItem(item)
  );
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
        modelName="Item"
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
