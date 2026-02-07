// app/components/listing/InventoryManager.tsx
import { Trash2 } from "lucide-react";
import { ListingVariantState, CONDITION_OPTIONS } from "./listingShared";
import { ListingCondition } from "@/app/lib/types/type";

interface Sizing {
  id: string;
  size: string;
  type: string;
}

interface InventoryManagerProps {
  variants: ListingVariantState[];
  currentVariant: ListingVariantState;
  setCurrentVariant: (v: ListingVariantState) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  sizings: Sizing[];
}

export default function InventoryManager({
  variants,
  currentVariant,
  setCurrentVariant,
  onAdd,
  onRemove,
  sizings,
}: InventoryManagerProps) {
  return (
    <section className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
        Inventory
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={currentVariant.sizingId}
          onChange={(e) =>
            setCurrentVariant({ ...currentVariant, sizingId: e.target.value })
          }
          className="p-3 bg-white rounded-xl text-xs font-bold border-none col-span-2"
        >
          <option value="">Select Size</option>
          {sizings.map((s) => (
            <option key={s.id} value={s.id}>
              {s.size} ({s.type})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price €"
          value={currentVariant.price || ""}
          onChange={(e) =>
            setCurrentVariant({
              ...currentVariant,
              price: parseFloat(e.target.value),
            })
          }
          className="p-3 bg-white rounded-xl text-xs font-bold border-none"
        />

        <input
          type="number"
          placeholder="Qty"
          value={currentVariant.stock}
          onChange={(e) =>
            setCurrentVariant({
              ...currentVariant,
              stock: parseInt(e.target.value),
            })
          }
          className="p-3 bg-white rounded-xl text-xs font-bold border-none"
        />

        <select
          value={currentVariant.condition}
          onChange={(e) =>
            setCurrentVariant({
              ...currentVariant,
              condition: e.target.value as ListingCondition,
            })
          }
          className="p-3 bg-white rounded-xl text-xs font-bold border-none col-span-2"
        >
          {CONDITION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="w-full py-3 bg-amber-400 text-black font-black uppercase text-[10px] rounded-xl hover:bg-black hover:text-white transition-all"
      >
        Add Size Variant
      </button>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {variants.map((v, i) => {
          const sizeObj = sizings.find((s) => s.id === v.sizingId);
          return (
            <div
              key={i}
              className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm border border-gray-100"
            >
              <div>
                <div className="font-black text-xs">
                  {sizeObj?.size}{" "}
                  <span className="text-gray-400">{sizeObj?.type}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-bold mt-1">
                  {v.condition} • Qty: {v.stock}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-amber-500 text-sm">
                  €{v.price}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
