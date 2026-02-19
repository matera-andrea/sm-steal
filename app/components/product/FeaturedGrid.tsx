import { Sparkles } from "lucide-react";
import ProductCard from "@/app/components/cards/ProductCard";
import prisma from "@/app/lib/prisma";
import type { ListingWithDetails } from "@/app/lib/types/type";

interface FeaturedGridProps {
  limit?: number;
}

export default async function FeaturedGrid({ limit = 8 }: FeaturedGridProps) {
  const listings = await prisma.listing.findMany({
    where: { isActive: true, isFeatured: true },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      item: {
        include: {
          sneakerModel: { include: { Brand: true } },
        },
      },
      sizings: {
        include: { sizing: true },
        orderBy: { price: "asc" },
      },
      photos: {
        orderBy: [{ isMain: "desc" }, { order: "asc" }],
      },
    },
  });

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
        <div className="bg-amber-50 p-6 rounded-full mb-4">
          <Sparkles size={32} className="text-amber-500" />
        </div>
        <h2 className="text-xl font-black uppercase italic text-gray-900">
          Nessun Drop in Evidenza
        </h2>
        <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
          Stiamo preparando il prossimo drop. Torna presto per scoprire articoli esclusivi.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {listings.map((listing) => (
          <ProductCard key={listing.id} listing={listing as unknown as ListingWithDetails} />
        ))}
      </div>
    </div>
  );
}
