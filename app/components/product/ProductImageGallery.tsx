"use client";
import Image from "next/image";
import { useState } from "react";

interface Photo {
  id: string;
  url: string;
}

interface ProductImageGalleryProps {
  photos: Photo[];
  productName: string;
}

export function ProductImageGallery({
  photos,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Se non ci sono foto, usa un'immagine placeholder
  const hasPhotos = photos && photos.length > 0;
  const currentImage = hasPhotos
    ? photos[selectedImageIndex].url
    : "/placeholder-product.jpg";

  return (
    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
      {/* Immagine principale */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={currentImage}
          alt={productName}
          width={500}
          height={500}
          priority
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
        />
      </div>

      {/* Galleria miniature */}
      {hasPhotos && photos.length > 1 && (
        <div className="grid grid-cols-5 gap-3 mt-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-gray-50 border-2 transition-all hover:border-gray-400 ${
                selectedImageIndex === index
                  ? "border-gray-600 ring-2 ring-gray-200"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={photo.url}
                alt={`${productName} - foto ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicatore immagine corrente */}
      {hasPhotos && photos.length > 1 && (
        <div className="text-center mt-3 text-sm text-gray-600">
          {selectedImageIndex + 1} di {photos.length}
        </div>
      )}
    </div>
  );
}
