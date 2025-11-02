"use client";

import { useState, useEffect } from "react";
import { useItems } from "@/hooks/useItems";
import { useSizings } from "@/hooks/useSizings";
import { ListingCondition } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ListingFormData {
  itemId: string;
  description: string;
  condition: ListingCondition;
  stock: number;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  sizingIds: string[];
  photos: File[];
}

export default function CreateListingForm() {
  const router = useRouter();
  const { items, loading: itemsLoading } = useItems();
  const { sizings, loading: sizingsLoading } = useSizings();

  const [formData, setFormData] = useState<ListingFormData>({
    itemId: "",
    description: "",
    condition: "NEW",
    stock: 1,
    price: 0,
    isActive: true,
    isFeatured: false,
    sizingIds: [],
    photos: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // Gestione input standard
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gestione selezione taglie
  const handleSizingToggle = (sizingId: string) => {
    setFormData((prev) => ({
      ...prev,
      sizingIds: prev.sizingIds.includes(sizingId)
        ? prev.sizingIds.filter((id) => id !== sizingId)
        : [...prev.sizingIds, sizingId],
    }));
  };

  // Gestione upload immagini
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + formData.photos.length > 5) {
      setError("Puoi caricare massimo 5 foto");
      return;
    }

    // Validazione dimensione file (max 5MB per foto)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = files.filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      setError("Alcune foto superano i 5MB. Riduci le dimensioni.");
      return;
    }

    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));

    // Crea preview
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Rimuovi foto
  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));

    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload foto su R2 usando la tua API esistente
  const uploadPhotos = async (listingId: string): Promise<void> => {
    for (let i = 0; i < formData.photos.length; i++) {
      const file = formData.photos[i];

      setUploadProgress(
        `Caricamento foto ${i + 1} di ${formData.photos.length}...`
      );

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      // Campi richiesti dal createPhotoSchema
      // name: string obbligatorio
      formDataUpload.append("name", file.name);

      // order: convertito automaticamente in number dal schema (.coerce.number())
      formDataUpload.append("order", i.toString());

      // isMain: stringa "true"/"false" trasformata in boolean dal schema
      formDataUpload.append("isMain", i === 0 ? "true" : "false");
      formDataUpload.append("altText", file.name);

      // altText: opzionale, puoi aggiungere una descrizione personalizzata
      // formDataUpload.append("altText", `Foto ${i + 1} del prodotto`);

      const response = await fetch(`/api/listings/${listingId}/photos`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Errore upload foto ${i + 1}`);
      }
    }

    setUploadProgress("");
  };

  // Submit del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validazione base
      if (!formData.itemId) {
        throw new Error("Seleziona un articolo");
      }
      if (formData.price <= 0) {
        throw new Error("Il prezzo deve essere maggiore di 0");
      }
      if (formData.sizingIds.length === 0) {
        throw new Error("Seleziona almeno una taglia");
      }
      if (formData.photos.length === 0) {
        throw new Error("Carica almeno una foto");
      }

      // 1. Crea il listing
      setUploadProgress("Creazione listing...");
      const listingResponse = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: formData.itemId,
          description: formData.description || "",
          condition: formData.condition,
          stock: formData.stock,
          price: formData.price,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          sizingIds: formData.sizingIds,
        }),
      });

      if (!listingResponse.ok) {
        const errorData = await listingResponse.json();
        throw new Error(
          errorData.message || "Errore nella creazione del listing"
        );
      }

      const newListing = await listingResponse.json();

      // 2. Upload delle foto
      await uploadPhotos(newListing.id);

      setSuccess(true);
      setUploadProgress("✓ Completato!");

      // Reset form
      setFormData({
        itemId: "",
        description: "",
        condition: "NEW",
        stock: 1,
        price: 0,
        isActive: true,
        isFeatured: false,
        sizingIds: [],
        photos: [],
      });
      setPreviewUrls([]);

      // Redirect alla pagina del listing dopo 2 secondi
      setTimeout(() => {
        router.push(`/shop/${newListing.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setUploadProgress("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  if (itemsLoading || sizingsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Crea Nuovo Annuncio
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          ✓ Listing creato con successo! Reindirizzamento in corso...
        </div>
      )}

      {uploadProgress && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
          {uploadProgress}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleziona Item */}
        <div>
          <label
            htmlFor="itemId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Articolo *
          </label>
          <select
            id="itemId"
            name="itemId"
            value={formData.itemId}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 "
          >
            <option value="">Seleziona un articolo</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prezzo e Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Prezzo (€) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 "
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quantità disponibile *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 "
            />
          </div>
        </div>

        {/* Condizione */}
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Condizione *
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 "
          >
            <option value="NEW">Nuovo</option>
            <option value="LIKE_NEW">Usato - Come nuovo</option>
            <option value="VERY_GOOD">Usato - Ottime condizioni</option>
            <option value="GOOD">Usato - Buone condizioni</option>
            <option value="ACCEPTABLE">Usato - Condizioni accettabili</option>
            <option value="POOR">Usato - Condizioni povere</option>
          </select>
        </div>

        {/* Descrizione */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700  mb-2"
          >
            Descrizione
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Aggiungi dettagli sul prodotto..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 resize-none"
          />
        </div>

        {/* Taglie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taglie disponibili *
          </label>
          <div className="flex flex-wrap gap-2">
            {sizings.map((sizing) => (
              <button
                key={sizing.id}
                type="button"
                onClick={() => handleSizingToggle(sizing.id)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  formData.sizingIds.includes(sizing.id)
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                }`}
              >
                {sizing.size}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto (massimo 5, max 5MB per foto) *
          </label>

          <div className="flex flex-wrap gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-32 h-32">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded">
                    Principale
                  </span>
                )}
              </div>
            ))}
          </div>

          {formData.photos.length < 5 && (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm text-gray-500 ">
                  Clicca per caricare foto
                </p>
                <p className="text-xs text-gray-400  mt-1">
                  JPG, PNG, WEBP (max 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Checkbox */}
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 ">Annuncio attivo</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 ">
              Prodotto in evidenza
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creazione in corso...
              </span>
            ) : (
              "Crea Annuncio"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
