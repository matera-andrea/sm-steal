"use client";

import { useState } from "react";
import Image from "next/image";
import { Photo } from "@prisma/client"; // O il tuo tipo Photo

interface ProductImageGalleryProps {
  photos: Photo[];
  productName: string;
}

export function ProductImageGallery({
  photos,
  productName,
}: ProductImageGalleryProps) {
  // Se non ci sono foto, usiamo un placeholder
  const safePhotos =
    photos.length > 0
      ? photos
      : [{ id: "ph", url: "/placeholder.png", isMain: true }];
  const [activePhoto, setActivePhoto] = useState(safePhotos[0].url);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 sticky top-28">
      {/* THUMBNAILS (Verticali su Desktop, Orizzontali su Mobile) */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
        {safePhotos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setActivePhoto(photo.url)}
            className={`relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-2xl border-2 overflow-hidden transition-all ${
              activePhoto === photo.url
                ? "border-black ring-1 ring-black"
                : "border-transparent bg-gray-50 hover:border-gray-200"
            }`}
          >
            <Image
              src={photo.url}
              alt="Thumbnail"
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="flex-1 relative aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100">
        {/* QUI APPLICHIAMO LA LOGICA "Option 3": 
            Sfondo grigio chiaro + Immagine 'contain' + Mix Blend (opzionale) 
         */}
        <Image
          src={activePhoto}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain p-8 w-full h-full mix-blend-multiply transition-opacity duration-500"
          priority
        />

        {/* Badge "New Arrival" o altro */}
        <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/50 shadow-sm">
          Authentic Verified
        </div>
      </div>
    </div>
  );
}
