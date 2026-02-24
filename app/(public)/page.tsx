import { Suspense } from "react";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import HeroSlideshow from "../components/home/HeroSlideshow";
import FeaturedGrid from "../components/product/FeaturedGrid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <HeroSlideshow slides={slides} />

      <section className="container mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tight">
              Nuovi Arrivi
            </h2>
            <div className="h-1.5 w-20 bg-amber-400 mt-2" />
          </div>
          <Link
            href="/shop"
            className="text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors"
          >
            Vedi Tutto →
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="aspect-square bg-gray-100 rounded-3xl" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-6 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          }
        >
          <FeaturedGrid limit={4} />
        </Suspense>
      </section>
    </main>
  );
}
