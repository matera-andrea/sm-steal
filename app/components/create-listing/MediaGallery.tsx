// app/components/listing/MediaGallery.tsx
import Image from "next/image";
import { X, Image as ImageIcon } from "lucide-react";

interface MediaGalleryProps {
  previewUrls: string[];
  onRemove: (index: number) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MediaGallery({
  previewUrls,
  onRemove,
  onUpload,
}: MediaGalleryProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
        Media Gallery
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {previewUrls.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group shadow-sm"
          >
            <Image src={url} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X size={12} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-2 left-2 bg-amber-400 text-[8px] font-black px-2 py-0.5 rounded uppercase text-black">
                Main
              </span>
            )}
          </div>
        ))}

        <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-gray-50/50">
          <ImageIcon className="text-gray-300 mb-2" size={24} />
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Add Media
          </span>
          <input
            type="file"
            multiple
            onChange={onUpload}
            className="hidden"
            accept="image/*"
          />
        </label>
      </div>
    </section>
  );
}
