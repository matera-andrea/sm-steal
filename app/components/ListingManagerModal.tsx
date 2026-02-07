"use client";

import { useEffect, useState } from "react";
import {
  X,
  Tag,
  Box,
  Trash2,
  Edit3,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Listing, ListingSizing, Sizing } from "@prisma/client";
import { useRouter } from "next/navigation";

type ListingWithSizings = Listing & {
  sizings: (ListingSizing & { sizing: Sizing })[];
};

interface ListingManagerModalProps {
  item: { id: string; name: string };
  onClose: () => void;
}

export default function ListingManagerModal({
  item,
  onClose,
}: ListingManagerModalProps) {
  const router = useRouter();
  const [listings, setListings] = useState<ListingWithSizings[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
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

  // --- LOGICA ELIMINAZIONE ---
  const handleDelete = async (listingId: string) => {
    if (
      !confirm(
        "Sei sicuro di voler eliminare questo annuncio? Questa azione è irreversibile."
      )
    )
      return;

    setIsDeleting(listingId);
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");

      // Update locale della UI
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (error) {
      console.error(error);
      alert("Errore nell'eliminazione dell'annuncio");
    } finally {
      setIsDeleting(null);
    }
  };

  // --- LOGICA MODIFICA ---
  const handleEdit = (listingId: string) => {
    // Reindirizziamo l'utente alla pagina di creazione/modifica che abbiamo già reso typesafe
    router.push(`/admin/listings/edit/${listingId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-300">
        {/* HEADER */}
        <div className="flex justify-between items-center p-8 border-b border-gray-50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-2">
              Inventory Management
            </p>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-black leading-none">
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-4 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all transform hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* LISTINGS CONTENT */}
        <div className="p-8 overflow-y-auto flex-grow custom-scrollbar space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <RefreshCw
                className="animate-spin text-amber-500 mb-4"
                size={40}
              />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loading catalog...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {listings.map((listing) => {
                const prices = listing.sizings.map((s) => s.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);

                return (
                  <div
                    key={listing.id}
                    className="group bg-gray-50 rounded-[2.5rem] p-8 border-2 border-transparent hover:border-black transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-black rounded-[1.2rem] text-white shadow-lg shadow-black/20">
                          <Tag size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Market Value Range
                          </p>
                          <p className="text-3xl font-black italic tracking-tighter text-black">
                            {prices.length > 0
                              ? min === max
                                ? `€${min}`
                                : `€${min} — €${max}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(listing.id)}
                          className="p-3 bg-white text-gray-400 hover:text-black hover:shadow-md rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={isDeleting === listing.id}
                          className="p-3 bg-white text-gray-400 hover:text-red-500 hover:shadow-md rounded-xl transition-all disabled:opacity-50"
                        >
                          {isDeleting === listing.id ? (
                            <RefreshCw className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Box size={14} className="text-amber-500" /> Active Size
                        Variants
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {listing.sizings.map((s) => (
                          <div
                            key={s.id}
                            className="bg-white px-4 py-3 rounded-2xl border border-gray-100 flex flex-col shadow-sm"
                          >
                            <span className="text-xs font-black italic text-black">
                              EU {s.sizing.size}
                            </span>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs font-black text-amber-500 font-mono">
                                €{s.price}
                              </span>
                              <span className="text-[8px] font-bold text-gray-300 uppercase">
                                {s.condition}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {listings.length === 0 && (
                <div className="text-center py-24 border-4 border-dashed border-gray-50 rounded-[3rem]">
                  <AlertCircle
                    className="mx-auto text-gray-200 mb-4"
                    size={60}
                  />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 italic">
                    Vault is empty
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={() => router.push(`/admin/addListing?itemId=${item.id}`)}
            className="w-full bg-black text-white py-6 rounded-full font-black uppercase tracking-[0.4em] text-xs hover:bg-amber-500 hover:text-black transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95"
          >
            <Plus size={20} /> New Listing Drop
          </button>
        </div>
      </div>
    </div>
  );
}
