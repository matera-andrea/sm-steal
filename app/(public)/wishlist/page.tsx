"use client";

import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/app/components/cards/ProductCard";
import { Heart, Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function WishlistPage() {
  const { wishlistListings, isLoading } = useWishlist();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-[#FDFDFD] pb-20 pt-32 relative overflow-hidden">
          {/* BACKGROUND DECORATION (Dot Pattern) */}
          <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />

          <div className="max-w-7xl mx-auto px-6">
            {/* HEADER */}
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-red-500 mb-2">
                  <Heart
                    className="fill-current animate-pulse-slow"
                    size={24}
                  />
                  <span className="font-bold text-xs uppercase tracking-[0.2em]">
                    Elementi Salvati
                  </span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-black leading-[0.85]">
                  I Tuoi <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
                    Grail.
                  </span>
                </h1>
              </div>

              {/* STATS BADGE */}
              {!isLoading && wishlistListings.length > 0 && (
                <div className="bg-white border border-gray-200 shadow-xl shadow-gray-100/50 px-6 py-4 rounded-2xl flex flex-col items-center min-w-[140px]">
                  <span className="text-4xl font-black">
                    {wishlistListings.length}
                  </span>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    Prodotti
                  </span>
                </div>
              )}
            </header>

            {/* CONTENT AREA */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-black" size={48} />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
                  Caricamento...
                </p>
              </div>
            ) : wishlistListings.length === 0 ? (
              /* EMPTY STATE PREMIUM */
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12 relative overflow-hidden group">
                {/* Decorative Background Icon */}
                <Heart className="absolute text-gray-50 opacity-50 scale-[5] -rotate-12 group-hover:scale-[6] group-hover:rotate-0 transition-transform duration-700 ease-out" />

                <div className="relative z-10 bg-gray-50 p-6 rounded-full text-gray-300 mb-4">
                  <ShoppingBag size={48} />
                </div>

                <div className="relative z-10 max-w-md space-y-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tight text-gray-900">
                    La tua rotation è vuota
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Non hai ancora salvato nessun prodotto. Esplora il nostro catalogo e salva i kicks che desideri copiare in futuro.
                  </p>
                </div>

                <Link href="/shop" className="relative z-10">
                  <button className="group flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/20">
                    Vai allo Shop
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </Link>
              </div>
            ) : (
              /* GRID LAYOUT CON ANIMAZIONE DI ENTRATA */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {wishlistListings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard listing={listing} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SignedIn>
    </>
  );
}
