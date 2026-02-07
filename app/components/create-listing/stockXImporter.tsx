// app/components/listing/StockXImporter.tsx
import { Link as LinkIcon, Loader2 } from "lucide-react";

interface StockXImporterProps {
  url: string;
  setUrl: (url: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export default function StockXImporter({
  url,
  setUrl,
  onFetch,
  isLoading,
}: StockXImporterProps) {
  return (
    <div className="mt-8 flex gap-3 p-2 bg-gray-50 rounded-[2rem] border-2 border-transparent focus-within:border-black transition-all shadow-sm">
      <div className="flex items-center pl-4 text-gray-400">
        <LinkIcon size={18} />
      </div>
      <input
        className="flex-1 bg-transparent py-3 font-bold outline-none text-sm"
        placeholder="Incolla Link StockX (es: https://stockx.com/air-jordan-1...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="button"
        onClick={onFetch}
        disabled={isLoading || !url}
        className="bg-black text-white px-8 rounded-full font-black uppercase text-[10px] hover:bg-amber-400 hover:text-black transition-all flex items-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          "Fetch Data"
        )}
      </button>
    </div>
  );
}
