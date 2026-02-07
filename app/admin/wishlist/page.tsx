"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Calendar,
  User,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

// Definiamo il tipo dei dati che arrivano dalla nostra API
interface EnrichedWishlistItem {
  id: string;
  addedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    imageUrl: string;
  };
  product: {
    id: string;
    name: string;
    sku: string;
    imageUrl: string;
    priceStart: number;
  };
}

export default function AdminWishlistPage() {
  const { data: items, isLoading } = useQuery<EnrichedWishlistItem[]>({
    queryKey: ["admin-wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/admin/wishlists");
      if (!res.ok) throw new Error("Errore fetch");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Wishlist <span className="text-amber-500">Analytics.</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
          Monitora cosa gli utenti stanno salvando
        </p>
      </header>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400">
                <th className="p-6">User</th>
                <th className="p-6">Product Saved</th>
                <th className="p-6">Date Added</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items?.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  {/* UTENTE */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                        {row.user.imageUrl ? (
                          <Image
                            src={row.user.imageUrl}
                            alt="User"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 m-auto text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">
                          {row.user.fullName}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {row.user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* PRODOTTO */}
                  <td className="p-6">
                    <Link
                      href={`/shop/${row.product.id}`}
                      className="flex items-center gap-4 hover:opacity-70 transition-opacity"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image
                          src={row.product.imageUrl}
                          alt="Product"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase italic leading-tight">
                          {row.product.name}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                          SKU: {row.product.sku}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* DATA */}
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <Calendar size={14} />
                      {new Date(row.addedAt).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  {/* AZIONI */}
                  <td className="p-6 text-right">
                    <Link
                      href={`/shop/${row.product.id}`}
                      target="_blank"
                      className="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items?.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-medium">
              Nessun oggetto aggiunto alle wishlist di recente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
