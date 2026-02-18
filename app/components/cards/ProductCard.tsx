import { ListingWithDetails } from "@/app/lib/types/type";
import Link from "next/link";
import Image from "next/image";
import WishlistButton from "../product/WishlistButton";

interface ProductCardProps {
  listing: ListingWithDetails;
}

export default function ProductCard({ listing }: ProductCardProps) {
  const { item, sizings, photos } = listing;

  // Calcolo sicuro del prezzo minimo
  const prices = sizings.map((s) => s.price);
  const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const photoUrl = photos[0]?.url || "/placeholder.png";

  // --- LOGICA ESTRAZIONE NOMI ---
  const brandName = item.sneakerModel.Brand.name;
  const modelName = item.sneakerModel.name;
  const itemName = item.name;

  // Calcolo Extra Name (es. "Panda", "Military Black")
  let extraName = "";
  if (itemName.startsWith(modelName)) {
    extraName = itemName.slice(modelName.length).trim();
  }

  // Titolo principale da visualizzare (Brand + Modello)
  const displayTitle = `${brandName} ${modelName}`;

  return (
    <Link href={`/shop/${listing.id}`}>
      <div className="group flex flex-col h-full relative">
        {" "}
        {/* h-full per allineare le card */}
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-shadow duration-300">
          <Image
            src={photoUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain p-4 w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* INFO CONTAINER */}
        <div className="mt-4 flex flex-col gap-1">
          {/* Titolo Principale (Brand + Modello) */}
          <h3 className="text-sm font-black uppercase italic leading-tight text-black">
            {modelName}
          </h3>

          {/* Sottotitolo (Extra Name) se presente */}
          {extraName && (
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 line-clamp-1">
              {extraName}
            </p>
          )}

          {/* Prezzo */}
          <p className="text-lg font-black mt-1">
            {startingPrice > 0 ? `Da €${startingPrice}` : "Sold Out"}
          </p>
        </div>
      </div>
    </Link>
  );
}
