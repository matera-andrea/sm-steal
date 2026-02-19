import ProductGrid from "@/app/components/ProductGrid";
import { Suspense } from "react";

export default function Shop() {
  return (
    <div className="bg-white min-h-screen">
      <header className="pt-20 pb-12 border-b border-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
            Shop<span className="text-amber-400">.</span>
          </h1>
          <p className="mt-4 text-gray-500 font-medium max-w-xl text-lg uppercase tracking-tight">
            Selezione curata dei grail più ricercati sul mercato.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="p-10 text-center">Caricamento filtri...</div>
          }
        >
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
