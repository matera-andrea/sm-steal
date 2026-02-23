"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const INTERVAL = 5000;
  const TICK = 50;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setProgress(0);
    },
    [],
  );

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % slides.length);
  }, [currentIndex, slides.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, slides.length, goTo]);

  // Auto-advance with progress tracking
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + TICK >= INTERVAL) {
          setCurrentIndex((i) => (i + 1) % slides.length);
          return 0;
        }
        return prev + TICK;
      });
    }, TICK);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const slide = slides[currentIndex];

  return (
    <section
      className="group relative h-[85vh] w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image layers */}
      {slides.map((s, index) => (
        <div
          key={s.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.url}
            alt={s.title || "Hero Slide"}
            fill
            className="object-cover opacity-80 scale-[1.02]"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient overlay — editorial angle from bottom-left */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/40 to-black/10" />

      {/* Content — bottom-left aligned, editorial layout */}
      <div className="absolute inset-0 flex flex-col justify-end text-white px-6 md:px-16 pb-20 md:pb-24 z-20">
        <div className="max-w-3xl space-y-4">
          {/* Title */}
          {slide?.title && (
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.95]">
              {slide.title}
            </h1>
          )}

          {/* Subtitle */}
          {slide?.subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-white/70 font-light max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>
          )}

          {/* Accent bar */}
          <div className="h-1 w-16 bg-amber-400 mt-2" />
        </div>
      </div>

      {/* Navigation arrows — visible on hover (desktop) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Slide precedente"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
              w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm
              flex items-center justify-center text-white/80 hover:text-white
              hover:bg-black/50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={goNext}
            aria-label="Slide successiva"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
              w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm
              flex items-center justify-center text-white/80 hover:text-white
              hover:bg-black/50 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dot indicators with progress bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 md:bottom-10 right-6 md:right-16 z-30 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Vai alla slide ${index + 1}`}
              className="relative h-0.5 rounded-full overflow-hidden cursor-pointer transition-all duration-300"
              style={{ width: index === currentIndex ? 32 : 16 }}
            >
              {/* Track */}
              <span className="absolute inset-0 bg-white/30" />
              {/* Fill — animated progress on active, static on inactive visited */}
              {index === currentIndex ? (
                <span
                  className="absolute inset-y-0 left-0 bg-white rounded-full transition-[width] duration-75 ease-linear"
                  style={{ width: `${(progress / INTERVAL) * 100}%` }}
                />
              ) : index < currentIndex ? (
                <span className="absolute inset-0 bg-white/60 rounded-full" />
              ) : null}
            </button>
          ))}
        </div>
      )}
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
