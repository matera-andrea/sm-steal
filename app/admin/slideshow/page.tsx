"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Image as ImageIcon } from "lucide-react";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSlideItem } from "@/app/components/admin/SortableSlideItem";

type SlideTarget = "all" | "desktop" | "mobile";

interface Slide {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
  order: number;
  target: SlideTarget;
}

const TARGET_OPTIONS: { value: SlideTarget; label: string }[] = [
  { value: "all", label: "Tutti i Dispositivi" },
  { value: "desktop", label: "Solo Desktop" },
  { value: "mobile", label: "Solo Mobile" },
];

export default function SlideshowManager() {
  const queryClient = useQueryClient();

  // STATO LOCALE PER LE SLIDES (necessario per DnD fluido)
  const [localSlides, setLocalSlides] = useState<Slide[]>([]);

  // Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [target, setTarget] = useState<SlideTarget>("all");

  // Sensori per DnD (Pointer per mouse/touch, Keyboard per accessibilità)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 1. Fetch Slides
  const { data: serverSlides = [], isLoading } = useQuery<Slide[]>({
    queryKey: ["admin-slides"],
    queryFn: async () => {
      const res = await fetch("/api/slideshow");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  // Sincronizza lo stato locale quando arrivano dati dal server
  useEffect(() => {
    if (serverSlides.length > 0) {
      setLocalSlides(serverSlides);
    }
  }, [serverSlides]);

  // --- HANDLER: Drag End (Riordino) ---
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalSlides((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        // 1. Calcola il nuovo array
        const newItems = arrayMove(items, oldIndex, newIndex);

        // 2. Prepara il payload per l'API (id + nuovo ordine basato sull'indice)
        const reorderedPayload = newItems.map((item, index) => ({
          id: item.id,
          order: index,
        }));

        // 3. Chiamata API (Fire and Forget o await, qui usiamo fire and forget per fluidità)
        fetch("/api/slideshow/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: reorderedPayload }),
        }).catch((err) => {
          console.error("Errore salvataggio ordine", err);
          // In caso di errore reale, potresti voler fare refetch per ripristinare
          queryClient.invalidateQueries({ queryKey: ["admin-slides"] });
        });

        return newItems;
      });
    }
  };

  // ... (handleUpload e handleDelete rimangono uguali, ma usa localSlides per il rendering)
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsSubmitting(true);
    // ... Logica FormData ...
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("target", target);
      await fetch("/api/slideshow", { method: "POST", body: formData });

      // Reset e Refetch
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setSubtitle("");
      setTarget("all");
      queryClient.invalidateQueries({ queryKey: ["admin-slides"] });
    } catch (e) {
      console.error("Errore caricamento slide", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare slide?")) return;
    await fetch(`/api/slideshow/${id}`, { method: "DELETE" });
    // Ottimisticamente rimuovi dalla lista locale
    setLocalSlides((prev) => prev.filter((s) => s.id !== id));
    queryClient.invalidateQueries({ queryKey: ["admin-slides"] });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* ... Header ... */}
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-10">
        Manage Homepage <span className="text-amber-500">Slideshow.</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LISTA SLIDES (Sortable) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Active Slides (Drag to Reorder)
          </h2>

          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localSlides.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {localSlides.map((slide) => (
                    <SortableSlideItem
                      key={slide.id}
                      slide={slide}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* ... Form Upload ... (Codice invariato) */}
        <div className="lg:col-span-5">
          {/* ... Incolla qui il form che hai già ... */}
          <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 sticky top-10">
            {/* ... codice form ... */}
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
              Add New Slide
            </h2>
            <form onSubmit={handleUpload} className="space-y-6">
              {/* ... Box Immagine ... */}
              <div className="relative aspect-video bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-black transition-colors overflow-hidden group">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <ImageIcon className="text-gray-300 mb-2" size={32} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Click to Upload
                    </span>
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFile(f);
                          setPreviewUrl(URL.createObjectURL(f));
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              {/* Inputs */}
              <div className="space-y-3">
                <input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 bg-white rounded-xl text-sm font-bold outline-none"
                />
                <input
                  placeholder="Subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-4 bg-white rounded-xl text-sm font-medium outline-none"
                />
              </div>

              {/* Target Device */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Dispositivo
                </p>
                <div className="flex gap-2">
                  {TARGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTarget(opt.value)}
                      className={`flex-1 py-2.5 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                        target === opt.value
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || isSubmitting}
                className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-amber-400 hover:text-black transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Add Slide"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
