import Image from "next/image";
import { Edit3, Loader2, CheckCircle2 } from "lucide-react";
import {
  TempProductData,
  GENDER_OPTIONS,
  CATEGORY_OPTIONS,
} from "./listingShared";
import { CategoryItem, Gender } from "@/app/lib/types/type";

interface ProductSyncPreviewProps {
  data: TempProductData;
  setData: (data: TempProductData) => void;
  previewUrls: string[];
  isDownloadingImage: boolean;
  onSync: () => void;
  isSyncing: boolean;
}

export default function ProductSyncPreview({
  data,
  setData,
  previewUrls,
  isDownloadingImage,
  onSync,
  isSyncing,
}: ProductSyncPreviewProps) {
  return (
    <div className="mt-6 p-8 bg-amber-50 rounded-[2.5rem] border-2 border-amber-200 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 mb-6 text-amber-700">
          <Edit3 size={18} />
          <h2 className="font-black uppercase italic text-sm tracking-tighter">
            Review & Edit Info
          </h2>
        </div>

        {isDownloadingImage ? (
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold animate-pulse">
            <Loader2 size={14} className="animate-spin" /> Downloading Images...
          </div>
        ) : (
          previewUrls[0] && (
            <div className="relative">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
                <Image
                  src={previewUrls[0]}
                  alt="StockX"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              {previewUrls.length > 1 && (
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[8px] font-black px-1.5 py-0.5 rounded-full text-black leading-none">
                  +{previewUrls.length - 1}
                </span>
              )}
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-amber-600 ml-2">
            Brand
          </label>
          <input
            className="w-full p-3 bg-white rounded-xl font-bold border-none outline-none focus:ring-2 ring-amber-400"
            value={data.brand}
            onChange={(e) => setData({ ...data, brand: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-amber-600 ml-2">
            Model
          </label>
          <input
            className="w-full p-3 bg-white rounded-xl font-bold border-none outline-none focus:ring-2 ring-amber-400"
            value={data.model}
            onChange={(e) => setData({ ...data, model: e.target.value })}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase text-amber-600 ml-2">
            Full Title
          </label>
          <input
            className="w-full p-3 bg-white rounded-xl font-bold border-none outline-none focus:ring-2 ring-amber-400"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-amber-600 ml-2">
            Gender
          </label>
          <select
            className="w-full p-3 bg-white rounded-xl font-bold border-none outline-none"
            value={data.gender}
            onChange={(e) =>
              setData({ ...data, gender: e.target.value as Gender })
            }
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-amber-600 ml-2">
            Category
          </label>
          <select
            className="w-full p-3 bg-white rounded-xl font-bold border-none outline-none"
            value={data.category}
            onChange={(e) =>
              setData({ ...data, category: e.target.value as CategoryItem })
            }
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onSync}
        disabled={isSyncing}
        className="mt-8 w-full py-4 bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
      >
        {isSyncing ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <CheckCircle2 size={16} /> Sync to Catalog
          </>
        )}
      </button>
    </div>
  );
}
