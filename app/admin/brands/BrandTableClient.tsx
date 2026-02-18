"use client";

import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import { Brand } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react"; // <--- 1. Importa useMemo

export default function BrandTableClient() {
  // 2. Definiamo le colonne dentro useMemo
  // Anche se qui non abbiamo dipendenze esterne (come liste di altri brand),
  // è buona pratica mantenerlo per evitare re-render inutili della tabella.
  const columns = useMemo<ColumnDef<Brand>[]>(
    () => [
      {
        header: "Brand",
        accessorKey: "name",
        renderCell: (brand) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 relative">
              {brand.logoUrl ? (
                <Image
                  className="rounded-full object-cover border border-gray-100"
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill // Usa fill per adattarsi al contenitore w-10 h-10
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap font-bold text-sm">
                {brand.name}
              </p>
            </div>
          </div>
        ),
        renderEditCell: (formData, setFormData, className) => (
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={className}
            placeholder="Brand name"
            required
          />
        ),
      },
      {
        header: "Description",
        accessorKey: "description",
        renderCell: (brand) => (
          <p className="text-gray-600 text-xs max-w-xs truncate">
            {brand.description || "-"}
          </p>
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
        header: "Logo URL",
        accessorKey: "logoUrl",
        renderCell: (brand) => (
          <p className="text-[10px] text-gray-400 truncate max-w-[100px] font-mono">
            {brand.logoUrl || "-"}
          </p>
        ),
        renderEditCell: (formData, setFormData, className) => (
          <input
            type="text"
            value={formData.logoUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, logoUrl: e.target.value })
            }
            className={className}
            placeholder="https://..."
          />
        ),
      },
      {
        header: "Items",
        accessorKey: "itemsCount",
        renderCell: (brand) => (
          <div className="text-center">
            <span className="inline-flex items-center justify-center bg-gray-100 text-gray-800 text-[10px] font-black px-2 py-1 rounded">
              {brand.itemsCount} Products
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        renderCell: (brand) => (
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase ${
              brand.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {brand.isActive ? "Active" : "Inactive"}
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
    ],
    [],
  );

  const emptyBrand: Partial<Brand> = {
    name: "",
    description: "",
    logoUrl: "",
    isActive: true,
  };

  return (
    <DataTable<Brand>
      modelName="Brand"
      apiEndpoint="/api/brands"
      columns={columns}
      initialEmptyRow={emptyBrand}
    />
  );
}
