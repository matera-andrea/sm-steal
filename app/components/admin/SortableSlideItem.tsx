"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import Image from "next/image";

const TARGET_LABELS: Record<string, string> = {
  all: "Tutti",
  desktop: "Desktop",
  mobile: "Mobile",
};

interface Slide {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
  target?: string;
}

interface Props {
  slide: Slide;
  onDelete: (id: string) => void;
}

export function SortableSlideItem({ slide, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1, // Porta in primo piano l'elemento trascinato
    opacity: isDragging ? 0.5 : 1, // Effetto trasparenza mentre trascini
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white border border-gray-100 rounded-2xl p-2 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow touch-none"
    >
      {/* Maniglia per trascinare (Drag Handle) */}
      <button
        {...attributes}
        {...listeners}
        className="p-2 text-gray-300 hover:text-black cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={20} />
      </button>

      {/* Thumbnail */}
      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 select-none">
        <Image src={slide.url} alt="slide" fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 select-none">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-bold text-sm truncate">
            {slide.title || "No Title"}
          </h3>
          {slide.target && slide.target !== "all" && (
            <span className="shrink-0 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400 text-black">
              {TARGET_LABELS[slide.target] ?? slide.target}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">
          {slide.subtitle || "No Subtitle"}
        </p>
      </div>

      {/* Actions */}
      <button
        onClick={() => onDelete(slide.id)}
        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
