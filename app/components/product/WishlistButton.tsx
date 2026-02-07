"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  listingId: string;
  className?: string;
  size?: number;
}

export default function WishlistButton({
  listingId,
  className = "", // Default stringa vuota per evitare "undefined" nel DOM
  size = 20,
}: WishlistButtonProps) {
  const { isInWishlist, handleToggle } = useWishlist();
  const isLiked = isInWishlist(listingId);

  return (
    <button
      onClick={(e) => handleToggle(e, listingId)}
      // Combiniamo le classi base con quelle passate via props usando i backtick
      className={`p-2 rounded-full transition-all active:scale-90 hover:bg-gray-100 ${className}`}
    >
      <Heart
        size={size}
        // Logica condizionale per il colore (pieno/vuoto)
        className={`transition-colors duration-300 ${
          isLiked ? "fill-red-500 text-red-500" : "text-gray-900"
        }`}
      />
    </button>
  );
}
