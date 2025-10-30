"use client";
import Image from "next/image";
import { notFound } from "next/navigation"; // Utile per gestire prodotti non trovati
import { ProductActions } from "@/app/components/cards/ProductActions";
import prisma from "@/app/lib/prisma";
import { ListingWithDetails } from "@/app/components/ProductGrid";
import { useState, useEffect } from "react";

interface ProductPageProps {
  params: {
    listingId: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { listingId } = await params;
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Questa funzione viene eseguita nel browser dopo il caricamento della pagina
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listings/${listingId}`);
        const data = await response.json();
        setListings(data.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        {/* Sezione Immagine (ora usa next/image) */}
        <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg">
            <Image
              src={mainImage}
              alt={item.name} // Alt text dinamico
              fill
              priority // Carica l'immagine principale più velocemente
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
            />
          </div>
          {/* TODO: Aggiungere una galleria di immagini se ci sono più foto */}
        </div>

        {/* Sezione Dettagli Prodotto */}
        <div className="mt-6 sm:mt-8 lg:mt-0">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            {item.name} {/* Titolo dinamico */}
          </h1>
          <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
            <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
              {price} {/* Prezzo dinamico formattato */}
            </p>
            {/* TODO: Aggiungere info su Condizione e Stock se necessario */}
            {/* <p className="text-sm text-gray-500">{listing.condition}</p> */}
            {/* <p className="text-sm text-green-600">In Stock: {listing.stock}</p> */}
          </div>

          {/* Delega tutta la parte interattiva (taglie, bottoni) 
            a un Componente Client.
          */}
          <ProductActions listing={listing} />

          <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

          {/* Descrizione Dinamica */}
          {description ? (
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {description}
            </p>
          ) : (
            <p className="mb-6 text-gray-400 dark:text-gray-500 italic">
              Nessuna descrizione disponibile per questo prodotto.
            </p>
          )}

          {/* Potresti voler spostare le descrizioni statiche 
            nel campo `description` del tuo modello `Listing` o `Item`.
          */}
        </div>
      </div>
    </div>
  );
}
