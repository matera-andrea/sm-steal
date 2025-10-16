// /app/admin/listings/ListingTableClient.tsx

"use client";

import { useState, Dispatch, SetStateAction } from "react";
import DataTable, { ColumnDef } from "@/app/components/admin/DataTable";
import { useItems } from "@/hooks/useItems";
import { useSizings } from "@/hooks/useSizings";
import {
  Listing,
  Item,
  Sizing,
  ListingSizing,
  ListingCondition,
} from "@prisma/client";
import { ChevronDown } from "lucide-react";

// TIPO: Definisce la struttura dei dati come arrivano dall'API per la visualizzazione
type ListingWithRelations = Listing & {
  item: Pick<Item, "id" | "name"> | null;
  sizings: (ListingSizing & { sizing: Sizing })[];
  // Aggiungiamo sizingIds qui per renderlo compatibile con il form
  sizingIds?: string[];
};

// ----------------------------------------------------------------
// HELPER COMPONENT: Multi-Select (locale a questo file)
// ----------------------------------------------------------------
const SizingMultiSelect = ({
  availableSizings,
  selectedIds,
  onChange,
  className,
}: {
  availableSizings: Sizing[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onChange(newSelection);
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} flex justify-between items-center text-left`}
      >
        <span>{selectedIds.length} size(s) selected</span>{" "}
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className="fixed z-100 w-full bg-white border rounded shadow-lg max-h-48 overflow-y-auto mt-1">
          {availableSizings.map((sizing) => (
            <label
              key={sizing.id}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(sizing.id)}
                onChange={() => handleSelect(sizing.id)}
              />
              <span>
                {sizing.type}: {sizing.size}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// CONFIGURAZIONE
// ----------------------------------------------------------------
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
  sizings: ReturnType<typeof useSizings>["sizings"]
): ColumnDef<ListingWithRelations>[] => [
  {
    header: "Item",
    accessorKey: "itemId",
    renderCell: (listing) => (
      <p className="font-semibold">{listing.item?.name || "N/A"}</p>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <select
        value={formData.itemId || ""}
        onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
        className={className}
        disabled={itemsLoading}
        required
      >
        <option value="" disabled>
          {itemsLoading ? "Loading..." : "Select Item"}
        </option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    ),
  },
  {
    header: "Details",
    accessorKey: "price",
    renderCell: (listing) => (
      <div>
        <p className="font-bold">€{listing.price.toFixed(2)}</p>
        <p className="text-xs">Stock: {listing.stock}</p>{" "}
        <p className="text-xs text-gray-600">{listing.condition}</p>
      </div>
    ),
    renderEditCell: (formData, setFormData, className) => (
      <div className="space-y-1">
        <label>Prezzo</label>
        <input
          type="number"
          step="0.01"
          value={formData.price || 0}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          className={className}
          placeholder="Price"
          required
        />
        <label>Stock</label>
        <input
          type="number"
          value={formData.stock || 1}
          onChange={(e) =>
            setFormData({ ...formData, stock: parseInt(e.target.value) })
          }
          className={className}
          placeholder="Stock"
          required
        />
        <label>Condizione</label>

        <select
          value={formData.condition || "NEW"}
          onChange={(e) =>
            setFormData({
              ...formData,
              condition: e.target.value as ListingCondition,
            })
          }
          className={className}
        >
          {conditionOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    ),
  },
  {
    header: "Sizes",
    accessorKey: "id",
    renderCell: (listing) => (
      <div className="flex flex-wrap gap-1 max-w-xs z-100">
        {listing.sizings.map((s) => (
          <span
            key={s.id}
            className="text-xs bg-gray-200 px-2 py-1 rounded-full"
          >
            {s.sizing.type}: {s.sizing.size}
          </span>
        ))}
      </div>
    ),
    // NOTA: Poiché il tuo DataTable usa un solo tipo generico, qui dobbiamo gestire la conversione.
    // Quando si modifica, popoliamo `sizingIds` dall'array `sizings`.
    renderEditCell: (formData, setFormData, className) => {
      // Inizializza sizingIds se non esiste (la prima volta che si clicca "edit")
      if (formData.sizingIds === undefined) {
        formData.sizingIds = formData.sizings?.map((s) => s.sizingId) || [];
      }
      return (
        <SizingMultiSelect
          availableSizings={sizings}
          selectedIds={formData.sizingIds || []}
          onChange={(ids) => setFormData({ ...formData, sizingIds: ids })}
          className={className}
        />
      );
    },
  },
  {
    header: "Status",
    accessorKey: "isActive",
    renderCell: (listing) => (
      <span
        className={`relative inline-block px-3 py-1 font-semibold ${
          listing.isActive ? "text-green-900" : "text-red-900"
        }`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 opacity-50 rounded-full ${
            listing.isActive ? "bg-green-200" : "bg-red-200"
          }`}
        ></span>
        <span className="relative">
          {listing.isActive ? "Active" : "Inactive"}
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

// ----------------------------------------------------------------
// COMPONENTE PRINCIPALE
// ----------------------------------------------------------------
export default function ListingTableClient() {
  const { items, loading: itemsLoading } = useItems();
  const { sizings, loading: sizingsLoading } = useSizings();
  const columns = getListingColumns(items, itemsLoading, sizings);

  // L'oggetto per la riga "Aggiungi" ora include `sizingIds`
  const emptyListing: Partial<ListingWithRelations> = {
    itemId: "",
    price: 0,
    stock: 1,
    condition: "NEW",
    isActive: true,
    sizingIds: [],
  };

  return (
    <DataTable<ListingWithRelations>
      modelName="Listing"
      apiEndpoint="/api/listings"
      columns={columns}
      initialEmptyRow={emptyListing}
    />
  );
}
