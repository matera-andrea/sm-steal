import { SearchX } from "lucide-react";
import ProductCard from "@/app/components/cards/ProductCard";
import { ListingWithDetails } from "@/app/lib/types/type";

interface ShopGridProps {
  isLoading: boolean;
  listings: ListingWithDetails[];
}

export default function ShopGrid({ isLoading, listings }: ShopGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 rounded-3xl" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-6 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-gray-50 p-8 rounded-full mb-6">
          <SearchX size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-black uppercase italic text-black">
          No items found
        </h2>
        <p className="text-gray-400 mt-2">
          Try adjusting your filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
