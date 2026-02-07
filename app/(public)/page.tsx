"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, memo } from "react"; // Aggiungi memo
import { useQuery } from "@tanstack/react-query";
import FeaturedGrid from "../components/product/FeaturedGrid";

// Tipo per le slide provenienti dall'API
interface Slide {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
}

// 1. Memorizza FeaturedGrid per evitare che il timer dello slider
// causi il re-render della griglia prodotti ogni 5 secondi.
const MemoizedFeaturedGrid = memo(FeaturedGrid);

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // FETCH SLIDES
  const { data: slides = [], isLoading } = useQuery<Slide[]>({
    queryKey: ["home-slides"],
    queryFn: async () => {
      const res = await fetch("/api/slideshow");
      if (!res.ok) {
        // Se è un 429, lanciamo un errore specifico o gestiamo
        if (res.status === 429) throw new Error("Rate limit exceeded");
        throw new Error("Failed to fetch slides");
      }
      return res.json();
    },
    // --- CONFIGURAZIONE IMPORTANTE ANTI-LOOP ---
    staleTime: 1000 * 60 * 15, // 15 minuti: I dati sono considerati freschi per 15 min
    gcTime: 1000 * 60 * 30, // 30 minuti: Mantiene la cache anche se smonti il componente
    refetchOnWindowFocus: false, // Non rifare fetch se l'utente cambia tab e torna
    retry: (failureCount, error) => {
      // Non riprovare se abbiamo superato il rate limit (429)
      if (error.message === "Rate limit exceeded") return false;
      // Altrimenti riprova massimo 2 volte
      return failureCount < 2;
    },
  });

  // Autoplay logic
  useEffect(() => {
    // Aggiungi controllo !isLoading per non far partire il timer se stai caricando
    if (isLoading || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isLoading]);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);

  if (isLoading)
    return <div className="h-screen w-full bg-gray-900 animate-pulse" />;

  return (
    <main className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-black">
        {/* ... (Tutto il codice della UI rimane uguale) ... */}
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

        {/* Overlay e Contenuto Hero (omesso per brevità, mantieni il tuo codice qui) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-20">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 italic">
            {slides[currentIndex]?.title || "Finally, real sneakers"}
          </h1>
          {/* ... resto dei bottoni ... */}
        </div>
        {/* ... indicatori e frecce ... */}
      </section>

      {/* --- SEZIONE FEATURED --- */}
      <section className="container mx-auto py-20 px-4">
        {/* ... Header New Arrivals ... */}

        {/* 
            IMPORTANTE: Usa la versione Memoizzata.
            Se FeaturedGrid fa delle fetch al suo interno, il re-render continuo
            della Home (causato dallo slider) faceva rieseguire la logica di FeaturedGrid.
        */}
        <MemoizedFeaturedGrid limit={4} showPagination={false} />
      </section>
    </main>
  );
}
