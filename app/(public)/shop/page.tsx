// /app/shop/page.tsx

import ProductGrid from "@/app/components/ProductGrid"; // Importa il nuovo Client Component

// La pagina ora è un Server Component semplice e veloce
export default function Shop() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Discover Our Collection
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          The best sneakers, accessories, and collectibles, all in one place.
        </p>

        <div className="mt-10">
          {/* Renderizza il componente che si occuperà del fetching */}
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
