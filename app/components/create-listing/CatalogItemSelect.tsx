import type { DropdownItem } from "@/hooks/useItems";

interface CatalogItemSelectProps {
  items: DropdownItem[];
  isLoading: boolean;
  value: string;
  onChange: (id: string) => void;
}

export default function CatalogItemSelect({
  items,
  isLoading,
  value,
  onChange,
}: CatalogItemSelectProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
        Catalog Item
      </h2>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-black text-white rounded-xl font-black uppercase text-xs outline-none"
      >
        <option value="">{isLoading ? "Loading..." : "Select Item"}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} ({item.sku})
          </option>
        ))}
      </select>
    </section>
  );
}
