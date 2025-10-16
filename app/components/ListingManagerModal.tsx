// /components/modals/ListingManagerModal.tsx

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Listing, ListingSizing, Sizing } from "@prisma/client";

// Tipo per i listing con le taglie incluse
type ListingWithSizings = Listing & {
  sizings: (ListingSizing & { sizing: Sizing })[];
};

interface ListingManagerModalProps {
  item: { id: string; name: string }; // Passiamo solo l'essenziale
  onClose: () => void;
}

export default function ListingManagerModal({
  item,
  onClose,
}: ListingManagerModalProps) {
  const [listings, setListings] = useState<ListingWithSizings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        console.log("Fetching listings for item ID:", item.id);
        const response = await fetch(`/api/items/${item.id}/listings`);
        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [item.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">
            Manage Listings for:{" "}
            <span className="text-blue-600">{item.name}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {loading ? (
            <p>Loading listings...</p>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">
                        €{listing.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Condition: {listing.condition}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stock: {listing.stock}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Qui andranno i bottoni per Modificare/Eliminare un listing */}
                      <button className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Edit
                      </button>
                      <button className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Available Sizes:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {listing.sizings.length > 0 ? (
                        listing.sizings.map((s) => (
                          <span
                            key={s.id}
                            className="bg-gray-200 px-2 py-1 rounded-full text-xs"
                          >
                            {s.sizing.type}: {s.sizing.size}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          No sizes specified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {listings.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No listings found for this item.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t mt-auto">
          {/* Qui andrà il bottone per Aggiungere un nuovo listing */}
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Add New Listing
          </button>
        </div>
      </div>
    </div>
  );
}
