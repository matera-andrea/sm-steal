// /app/admin/sneaker-models/SneakerModelTableClient.tsx

"use client";

import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import { useBrands } from "@/hooks/useBrands";
import { SneakerModel, Brand } from "@prisma/client";

// FIX 1: Definiamo un tipo più accurato che rappresenta ESATTAMENTE
// ciò che arriva dalla nostra API GET. Include sia la relazione `Brand`
// sia l'oggetto `_count` per il numero di item.
type SneakerModelWithRelations = SneakerModel & {
  Brand: Pick<Brand, "id" | "name"> | null;
  _count?: {
    items: number;
  };
};

// NOTA: Questa è una buona pratica. Definiamo le colonne come una funzione
// che riceve i dati necessari (come la lista dei brand), rendendo il codice
// più pulito e organizzato.
const getSneakerModelColumns = (
  brands: Pick<Brand, "id" | "name">[],
  brandsLoading: boolean
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
          {/* FIX 2: Ora accediamo a `_count.items` in modo sicuro, senza `any`.
              Usiamo `itemsCount` come fallback se `_count` non fosse presente. */}
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

// FIX 3: L'oggetto per la riga di aggiunta DEVE corrispondere al tipo `Partial<T>`
// che la DataTable si aspetta. In questo caso, `Partial<SneakerModelWithRelations>`.
const emptySneakerModel: Partial<SneakerModelWithRelations> = {
  name: "",
  description: "",
  brandId: "",
  isActive: true,
};

// Componente principale che ora gestisce il caricamento dei dati per le colonne
export default function SneakerModelTableClient() {
  // Carichiamo i brand qui, al livello più alto del componente client.
  const { brands, loading: brandsLoading } = useBrands();

  // Passiamo i brand caricati alla funzione che genera le colonne.
  const columns = getSneakerModelColumns(brands, brandsLoading);

  return (
    <DataTable<SneakerModelWithRelations>
      modelName="Sneaker Model"
      apiEndpoint="/api/sneakerModels"
      columns={columns}
      initialEmptyRow={emptySneakerModel}
    />
  );
}
