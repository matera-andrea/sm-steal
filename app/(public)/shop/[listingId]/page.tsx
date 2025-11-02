"use client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "@/app/components/cards/ProductActions";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Prisma } from "@prisma/client";

// Definisci il tipo completo del listing
type ListingWithDetails = Prisma.ListingGetPayload<{
  include: {
    item: {
      include: {
        sneakerModel: { include: { Brand: true } };
      };
    };
    photos: true;
    sizings: {
      include: {
        sizing: true;
      };
    };
  };
}>;

export default function ProductPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/listings/${listingId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Prodotto non trovato");
            return;
          }
          throw new Error("Errore nel caricamento del prodotto");
        }

        const data = await response.json();
        setListing(data);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setError("Errore nel caricamento del prodotto");
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  // Stati di caricamento ed errore
  if (loading) {
    return (
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Caricamento...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || "Prodotto non trovato"}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Il prodotto che stai cercando non esiste o non è più
                disponibile.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
              >
                Torna allo shop
              </Link>
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Estrai i dati necessari
  const mainImage =
    listing.photos && listing.photos.length > 0
      ? listing.photos[0].url
      : "/placeholder-product.jpg"; // Assicurati di avere un'immagine placeholder

  const itemName = listing.item?.sneakerModel?.name || "Prodotto senza nome";
  const brandName = listing.item?.sneakerModel?.Brand?.name || "";
  const fullName = brandName ? `${brandName} ${itemName}` : itemName;

  const price = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(listing.price);

  const description = listing.description;

  return (
    <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        {/* Sezione Immagine */}
        <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
          <div className="relative w-full min-height-[400px] aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={mainImage}
              alt={fullName}
              width={500}
              height={500}
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
            />
          </div>

          {/* Galleria miniature (se ci sono più foto) */}
          {listing.photos && listing.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {listing.photos.slice(0, 4).map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-75 transition"
                >
                  <Image
                    src={photo.url}
                    alt={`${fullName} - foto ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sezione Dettagli Prodotto */}
        <div className="mt-6 sm:mt-8 lg:mt-0">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            {fullName}
          </h1>

          <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
            <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
              {price}
            </p>
          </div>

          {/* Info aggiuntive */}
          <div className="mt-4 flex gap-4">
            <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10">
              {listing.condition === "NEW"
                ? "Nuovo"
                : listing.condition === "LIKE_NEW"
                ? "Come nuovo"
                : listing.condition === "GOOD"
                ? "Usato - Buone condizioni"
                : "Usato"}
            </span>
            {listing.stock > 0 && (
              <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                Disponibile ({listing.stock} in stock)
              </span>
            )}
          </div>

          {/* Componente con azioni (taglie e bottoni) */}
          <ProductActions listing={listing} />

          <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

          {/* Descrizione */}
          {description ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Descrizione
              </h2>
              <p className="mb-6 text-gray-500 dark:text-gray-400 whitespace-pre-line">
                {description}
              </p>
            </div>
          ) : (
            <p className="mb-6 text-gray-400 dark:text-gray-500 italic">
              Nessuna descrizione disponibile per questo prodotto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
