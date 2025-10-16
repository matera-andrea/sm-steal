"use client"; 

import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import { Brand } from "@prisma/client";
import Image from "next/image";

// 1. La definizione delle colonne ora vive all'interno di un Client Component.
//    Ora è sicuro definire funzioni come `renderCell`.
const brandColumns: ColumnDef<Brand>[] = [
  {
    header: "Brand",
    accessorKey: "name",
    renderCell: (brand) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10">
          {brand.logoUrl ? (
            <Image
              className="w-full h-full rounded-full object-cover"
              src={brand.logoUrl}
              alt={brand.name}
              width={40}
              height={40}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
              {brand.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-3">
          <p className="text-gray-900 whitespace-no-wrap font-semibold">
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
      />
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    renderCell: (brand) => (
      <p className="text-gray-900">{brand.description || "-"}</p>
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
  // Aggiungo anche Logo URL che mancava nell'edit
  {
    header: "Logo URL",
    accessorKey: "logoUrl",
    renderCell: (brand) => (
      <p className="text-xs text-gray-600 truncate max-w-[100px]">
        {brand.logoUrl || "-"}
      </p>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <input
        type="text"
        value={formData.logoUrl || ""}
        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
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
        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {brand.itemsCount}
        </span>
      </div>
    ),
    // Nessun renderEditCell, è un valore calcolato
  },
  {
    header: "Status",
    accessorKey: "isActive",
    renderCell: (brand) => (
      <span
        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
          brand.isActive ? "text-green-900" : "text-red-900"
        }`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 opacity-50 rounded-full ${
            brand.isActive ? "bg-green-200" : "bg-red-200"
          }`}
        ></span>
        <span className="relative">
          {brand.isActive ? "Active" : "Inactive"}
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

// 2. Definisci l'oggetto vuoto per la creazione
const emptyBrand: Partial<Brand> = {
  name: "",
  description: "",
  logoUrl: "",
  isActive: true,
};

// 3. Crea il componente che renderizza la DataTable
export default function BrandTableClient() {
  return (
    <DataTable<Brand>
      modelName="Brand"
      apiEndpoint="/api/brands"
      columns={brandColumns}
      initialEmptyRow={emptyBrand}
    />
  );
}
