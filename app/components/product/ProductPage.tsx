"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ProductImageGallery } from "@/app/components/product/ProductImageGallery";
import { ProductInfo } from "@/app/components/product/ProductInfo";
import { ProductDetails } from "@/app/components/product/ProductDetails";

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

  if (loading) {
    return (
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento...</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Prodotto non trovato"}
            </h2>
            <p className="text-gray-600 mb-4">
              Il prodotto che stai cercando non esiste o non è più disponibile.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
            >
              Torna allo shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const itemName = listing.item?.sneakerModel?.name || "Prodotto senza nome";
  const brandName = listing.item?.sneakerModel?.Brand?.name || "";
  const fullName = brandName ? `${brandName} ${itemName}` : itemName;

  return (
    <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        <ProductImageGallery photos={listing.photos} productName={fullName} />

        <div className="mt-6 sm:mt-8 lg:mt-0">
          <ProductInfo listing={listing} fullName={fullName} />
          <ProductDetails description={listing.description} />
        </div>
      </div>
    </div>
  );
}
