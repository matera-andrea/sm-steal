"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import FeaturedGrid from "../components/product/FeaturedGrid";

// Tipo per le slide provenienti dall'API
interface Slide {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // FETCH SLIDES: Inserisci qui la tua route API
  const { data: slides = [], isLoading } = useQuery<Slide[]>({
    queryKey: ["home-slides"],
    queryFn: async () => {
      const res = await fetch("/api/slideshow");
      if (!res.ok) throw new Error("Failed to fetch slides");
      return res.json();
    },
  });

  // Autoplay logic
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);

  if (isLoading)
    return <div className="h-screen w-full bg-gray-900 animate-pulse" />;

  return (
    <main className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title || "Hero Slide"}
              className="h-full w-full object-cover opacity-60 scale-105"
            />
          </div>
        ))}

        {/* Overlay con Gradiente per leggibilità testo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Contenuto Centrale */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-20">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 italic">
            {slides[currentIndex]?.title || "Finally, real sneakers"}
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 max-w-2xl text-gray-200">
            {slides[currentIndex]?.subtitle ||
              "No drama, just authentic grails delivered to your door."}
          </p>

          <Link href="/shop">
            <button className="group flex items-center gap-3 bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl">
              SHOP NOW{" "}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Navigazione Hero */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-30 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Indicatori Lineari (stile moderno) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 transition-all duration-500 rounded-full ${
                index === currentIndex ? "w-12 bg-amber-400" : "w-6 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* --- SEZIONE FEATURED --- */}
      <section className="container mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tight">
              New Arrivals
            </h2>
            <div className="h-1.5 w-20 bg-amber-400 mt-2" />
          </div>
          <Link
            href="/shop"
            className="text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Griglia Prodotti (qui userai il tuo ProductCard) */}
        <FeaturedGrid limit={4} showPagination={false} />
      </section>
    </main>
  );
}
