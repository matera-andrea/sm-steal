"use client";

import Image from "next/image";
import { X, Image as ImageIcon, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortablePhotoItemProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortablePhotoItem({ url, index, onRemove }: SortablePhotoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group shadow-sm ${
        isDragging ? "opacity-50 ring-2 ring-black" : ""
      }`}
    >
      <Image
        src={url}
        alt="Preview"
        fill
        sizes="33vw"
        className="object-cover"
      />

      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="absolute top-2 left-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical size={12} />
      </button>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <X size={12} />
      </button>

      {index === 0 && (
        <span className="absolute bottom-2 left-2 bg-amber-400 text-[8px] font-black px-2 py-0.5 rounded uppercase text-black">
          Main
        </span>
      )}
    </div>
  );
}

interface MediaGalleryProps {
  previewUrls: string[];
  onRemove: (index: number) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
}

export default function MediaGallery({
  previewUrls,
  onRemove,
  onUpload,
  onReorder,
}: MediaGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;

    const oldIndex = previewUrls.indexOf(active.id as string);
    const newIndex = previewUrls.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
        Media Gallery
      </h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={previewUrls} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-4">
            {previewUrls.map((url, i) => (
              <SortablePhotoItem
                key={url}
                url={url}
                index={i}
                onRemove={onRemove}
              />
            ))}

            <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-gray-50/50">
              <ImageIcon className="text-gray-300 mb-2" size={24} />
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Add Media
              </span>
              <input
                type="file"
                multiple
                onChange={onUpload}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
