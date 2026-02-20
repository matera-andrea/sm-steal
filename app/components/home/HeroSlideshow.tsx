"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  id: string;
  url: string;
  title?: string | null;
  subtitle?: string | null;
  target?: string | null;
}

function HeroPlaceholder() {
  return (
    <section className="relative h-[85vh] w-full bg-black flex flex-col items-center justify-center text-white select-none">
      <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">
        Heat Lab<span className="text-amber-400">.</span>
      </h1>
    </section>
  );
}

function SlideshowPlayer({ slides }: { slides: Slide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.url}
            alt={slide.title || "Hero Slide"}
            fill
            className="object-cover opacity-60 scale-105"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-20">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 italic">
          {slides[currentIndex]?.title || "Finally, real sneakers"}
        </h1>
      </div>
    </section>
  );
}

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const desktopSlides = slides.filter(
    (s) => !s.target || s.target === "all" || s.target === "desktop",
  );
  const mobileSlides = slides.filter(
    (s) => !s.target || s.target === "all" || s.target === "mobile",
  );

  return (
    <>
      {/* Desktop (md e superiori) */}
      <div className="hidden md:block">
        {desktopSlides.length > 0 ? (
          <SlideshowPlayer slides={desktopSlides} />
        ) : (
          <HeroPlaceholder />
        )}
      </div>

      {/* Mobile (sotto md) */}
      <div className="block md:hidden">
        {mobileSlides.length > 0 ? (
          <SlideshowPlayer slides={mobileSlides} />
        ) : (
          <HeroPlaceholder />
        )}
      </div>
    </>
  );
}
