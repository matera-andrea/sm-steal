"use client";

import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import { useBrands } from "@/hooks/useBrands";
import { SneakerModel, Brand } from "@prisma/client";
import { useMemo } from "react"; // <--- 1. Importa useMemo

type SneakerModelWithRelations = SneakerModel & {
  Brand: Pick<Brand, "id" | "name"> | null;
  _count?: {
    items: number;
  };
};

const getSneakerModelColumns = (
  brands: Pick<Brand, "id" | "name">[],
  brandsLoading: boolean,
): ColumnDef<SneakerModelWithRelations>[] => [
  {
    header: "Model Name",
    accessorKey: "name",
    renderCell: (model) => (
      <p className="text-gray-900 whitespace-no-wrap font-semibold">
        {model.name}
      </p>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className={className}
        placeholder="Model name"
        required
      />
    ),
  },
  {
    header: "Brand",
    accessorKey: "brandId",
    renderCell: (model) => (
      <p className="text-gray-700">{model.Brand?.name || "N/A"}</p>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <select
        value={formData.brandId || ""}
        onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
        className={className}
        disabled={brandsLoading}
        required
      >
        <option value="" disabled>
          {brandsLoading ? "Loading brands..." : "Select a brand"}
        </option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    renderCell: (model) => (
      <p className="text-gray-900">{model.description || "-"}</p>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <input
        type="text"
        value={formData.description || ""}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className={className}
        placeholder="Description"
      />
    ),
  },
  {
    header: "Items",
    accessorKey: "itemsCount",
    renderCell: (model) => (
      <div className="text-center">
        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {model._count?.items ?? model.itemsCount}
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    renderCell: (model) => (
      <span
        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
          model.isActive ? "text-green-900" : "text-red-900"
        }`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 opacity-50 rounded-full ${
            model.isActive ? "bg-green-200" : "bg-red-200"
          }`}
        ></span>
        <span className="relative">
          {model.isActive ? "Active" : "Inactive"}
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

const emptySneakerModel: Partial<SneakerModelWithRelations> = {
  name: "",
  description: "",
  brandId: "",
  isActive: true,
};

export default function SneakerModelTableClient() {
  const { brands, loading: brandsLoading } = useBrands();

  // 2. Memorizza le colonne per evitare il loop infinito
  const columns = useMemo(() => {
    return getSneakerModelColumns(brands, brandsLoading);
  }, [brands, brandsLoading]);

  return (
    <DataTable<SneakerModelWithRelations>
      modelName="Model"
      apiEndpoint="/api/sneakerModels"
      columns={columns}
      initialEmptyRow={emptySneakerModel}
      renderFilters={(filters, setFilters) => (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Models..."
            value={(filters as any).search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black w-48"
          />
          <select
            value={(filters as any).brandId || ""}
            onChange={(e) => setFilters({ ...filters, brandId: e.target.value })}
            className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <select
            value={(filters as any).isActive || ""}
            onChange={(e) =>
              setFilters({ ...filters, isActive: e.target.value })
            }
            className="bg-gray-50 border-none rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}
    />
  );
}
