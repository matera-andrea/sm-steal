"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ProductDetails({
  description,
}: {
  description?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (!description) return null;

  return (
    <div className="pt-8 border-t border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group"
      >
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-amber-500 transition-colors">
          Descrizione e Dettagli
        </h3>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-gray-600 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
