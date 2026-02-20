"use client";

import {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import Image from "next/image";
import { Photo } from "@prisma/client";
import { Rotate3d } from "lucide-react";

interface ProductImageGalleryProps {
  photos: Photo[];
  productName: string;
}

const PLACEHOLDER_PHOTO: Photo = {
  id: "placeholder",
  name: "placeholder",
  url: "/placeholder.png",
  altText: null,
  isMain: true,
  order: 0,
  createdAt: new Date(),
  listingId: "",
};

export function ProductImageGallery({
  photos,
  productName,
}: ProductImageGalleryProps) {
  const safePhotos = photos.length > 0 ? photos : [PLACEHOLDER_PHOTO];
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startIndex = useRef(0);

  // StockX logic: One main image that changes index based on drag or slider
  // Sensitivity of rotation: how many pixels of drag to move 1 frame
  const sensitivity = 5;

  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    startIndex.current = activeIndex;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;

    const deltaX = clientX - startX.current;
    const offset = Math.floor(deltaX / sensitivity);

    // We want to loop back/forth
    let nextIndex = (startIndex.current - offset) % safePhotos.length;
    if (nextIndex < 0) nextIndex = safePhotos.length + nextIndex;

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleWindowMouseUp = () => handleEnd();
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, []);

  const activePhoto = safePhotos[activeIndex];

  return (
    <div className="sticky top-28 space-y-6 select-none">
      {/* 360 VIEWER CONTAINER */}
      <div
        className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing group"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* Render all photos but only show the active one (better for smooth scrubbing) */}
        {safePhotos.map((photo, index) => (
          <div
            key={photo.id || index}
            className={`absolute inset-0 ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={photo.url}
              alt={photo.altText ?? `${productName} - Vista ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-contain p-8 w-full h-full mix-blend-multiply"
              priority={index === 0}
            />
          </div>
        ))}

        {/* TOP BADGES */}
        {/* <div className="absolute top-6 left-6 flex gap-2 z-20 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/50 shadow-sm">
            Autentico Verificato
          </div>
        </div> */}

        {/* INTERACTION HINT (Visible on hover if 360 is available) */}
        {safePhotos.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
            <div className="bg-black/10 backdrop-blur-[2px] rounded-full p-4 border border-white/20">
              <Rotate3d className="text-black/40 animate-pulse" size={48} />
            </div>
          </div>
        )}
      </div>

      {/* STOCKX STYLE SCRUBBER SLIDER */}
      {safePhotos.length > 1 && (
        <div className="px-10">
          <div className="relative flex items-center group">
            <input
              type="range"
              min="0"
              max={safePhotos.length - 1}
              value={activeIndex}
              onChange={(e) => setActiveIndex(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black hover:accent-amber-500 transition-all"
              style={{
                background: `linear-gradient(to right, #000 0%, #000 ${(activeIndex / (safePhotos.length - 1)) * 100}%, #e5e7eb ${(activeIndex / (safePhotos.length - 1)) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-300 pointer-events-none">
              <span>Inizio</span>
              <span className="text-black/20 italic">Ruota il prodotto</span>
              <span>Fine</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
