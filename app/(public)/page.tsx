"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../components/cards/ProductCard";

const images = [
  "/home-photos/unsplash-1.jpg",
  "/home-photos/unsplash-2.jpg",
  "/home-photos/unsplash-3.jpg",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // cambia immagine ogni 3 secondi

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <>
      {/* Immagini */}
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
                ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Overlay dimming */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none"></div>

      {/* Testo centrato */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 px-4">
        <h1 className="text-6xl sm:text-md font-bold mb-4">
          Finally, real sneakers without the drama
        </h1>
        <Link href="/shop">
          <div className="w-max-3xl bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-6 rounded transition-colors">
            Find out
          </div>
        </Link>
      </div>

      {/* Frecce */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 z-10"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 z-10"
      >
        ▶
      </button>
      {/* Indicatori */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors
                  ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
          ></span>
        ))}
      </div>
    </>
  );
}
