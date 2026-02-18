"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, ArrowLeft, Share2, Heart } from "lucide-react";

import { useAuth, useClerk } from "@clerk/nextjs";

import { ProductImageGallery } from "@/app/components/product/ProductImageGallery";
import { ProductInfo } from "@/app/components/product/ProductInfo";
import { ProductDetails } from "@/app/components/product/ProductDetails";
import type { ListingWithDetails, SizingVariant } from "@/app/lib/types/type";
import { useWishlist } from "@/hooks/useWishlist";

const PHONE_NUMBER = "393511579485";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function ProductPage({
  listing,
}: {
  listing: ListingWithDetails;
}) {
  const listingId = listing.id;

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const [selectedVariant, setSelectedVariant] = useState<SizingVariant | null>(
    null,
  );

  const { isInWishlist, handleToggle } = useWishlist();
  const isWishlisted = isInWishlist(listingId);

  const brandName = listing.item?.sneakerModel?.Brand?.name || "";
  const modelName = listing.item?.sneakerModel?.name || "Unknown Model";
  const itemName = listing.item?.name || "Unknown Item";

  let extraName = "";
  if (itemName.startsWith(modelName)) {
    extraName = itemName.slice(modelName.length).trim();
  }

  const fullName = `${brandName} ${modelName}`;
  const prices = listing.sizings.map((s) => s.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const soldOut = listing.sizings.every((s) => s.stock < 1);

  // 3. AGGIORNA LOGICA WHATSAPP
  const handleWhatsAppClick = () => {
    // A. Controllo Auth
    if (!isSignedIn) {
      openSignIn(); // Apre il modale di login
      return;
    }

    // B. Controllo Selezione Variante
    if (!selectedVariant) return;

    const productDisplayName = extraName
      ? `${modelName} ${extraName}`
      : modelName;

    const message = `Ciao!
Sono interessato a queste sneakers:

- *${productDisplayName}*
- Taglia: *${selectedVariant.sizing.size} (${selectedVariant.sizing.type})*
- Condizione: *${selectedVariant.condition}*
- Prezzo: *€${selectedVariant.price}*
- SKU: ${listing.item.sku || "N/A"}

Sono ancora disponibili? Grazie!`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white min-h-screen pb-20 text-black">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft
            size={12}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Shop
        </Link>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Share2 size={18} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
          <div className="lg:col-span-7">
            <ProductImageGallery
              photos={listing.photos}
              productName={fullName}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <header className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                    {listing.item.category}
                  </span>
                  {listing.isFeatured && (
                    <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black">
                      {modelName}
                    </span>
                  </h1>
                  {extraName && (
                    <p className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-gray-400 mt-1 leading-none">
                      {extraName}
                    </p>
                  )}
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  SKU: {listing.item.sku || "N/A"}
                </p>
                {!soldOut && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">
                      {selectedVariant ? "Selected Price" : "Starting from"}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black tracking-tight">
                        €
                        {selectedVariant
                          ? selectedVariant.price.toLocaleString()
                          : minPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </header>

              {
                <ProductInfo
                  listing={listing}
                  onVariantChange={setSelectedVariant}
                  selectedVariantId={selectedVariant?.id}
                />
              }

              <div className="space-y-3 pt-2">
                {!soldOut && (
                  <button
                    onClick={handleWhatsAppClick}
                    disabled={!selectedVariant}
                    className="w-full bg-black text-white h-16 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-[#25D366] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:shadow-none"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    {selectedVariant
                      ? "Acquista su WhatsApp"
                      : "Select Size to Buy"}
                  </button>
                )}

                <button
                  onClick={(e) => listingId && handleToggle(e, listingId)}
                  className={`w-full border-2 h-14 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group ${
                    isWishlisted
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-100 text-black hover:border-black"
                  }`}
                >
                  <Heart
                    size={18}
                    className={`transition-colors ${
                      isWishlisted ? "fill-red-500" : "fill-transparent"
                    }`}
                  />
                  {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100/50">
                <div className="flex flex-col gap-1">
                  <ShieldCheck className="text-amber-500 mb-1" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    100% Verified
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium leading-tight">
                    Every item is manually checked by experts.
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <Truck className="text-amber-500 mb-1" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Express Ship
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium leading-tight">
                    Fast worldwide delivery with tracking.
                  </span>
                </div>
              </div>

              <ProductDetails description={listing.description} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
