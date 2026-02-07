"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useItems } from "@/hooks/useItems";
import { useSizings } from "@/hooks/useSizings";
import { useBrands } from "@/hooks/useBrands"; // Serve per il refetch se necessario
import { useSneakerModels } from "@/hooks/useSneakerModels"; // Serve per il refetch

import {
  KicksProductResponse,
  ListingVariantState,
} from "@/app/lib/types/type";
import InventoryManager from "../create-listing/InventoryManager";
import {
  TempProductData,
  ListingFormData,
  mapStockXGender,
} from "../create-listing/listingShared";
import MediaGallery from "../create-listing/MediaGallery";
import ProductSyncPreview from "../create-listing/ProductSyncPreview";
import StockXImporter from "../create-listing/stockXImporter";

export default function ListingForm() {
  const router = useRouter();

  // --- HOOKS ---
  const { items, loading: itemsLoading, refetch: refetchItems } = useItems();
  const { sizings } = useSizings();
  const { refetch: refetchBrands } = useBrands();
  const { refetch: refetchModels } = useSneakerModels();

  // --- STATI ---
  const [stockxUrl, setStockxUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  const [tempProductData, setTempProductData] =
    useState<TempProductData | null>(null);

  const [formData, setFormData] = useState<ListingFormData>({
    itemId: "",
    description: "",
    isActive: true,
    isFeatured: false,
    variants: [],
    photos: [],
  });

  const [currentVariant, setCurrentVariant] = useState<ListingVariantState>({
    sizingId: "",
    price: 0,
    condition: "NEW",
    stock: 1,
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

  // --- HELPER: Convert URL to File ---
  const convertUrlToFile = async (
    imageUrl: string,
    fileName: string,
  ): Promise<File | null> => {
    try {
      const proxyUrl = `/api/external/proxy-image?url=${encodeURIComponent(
        imageUrl,
      )}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Failed to download image");

      const blob = await res.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (e) {
      console.error("Image conversion failed", e);
      return null;
    }
  };

  // --- 1. FETCH DATA DA STOCKX ---
  const handleFetchData = async () => {
    if (!stockxUrl.includes("stockx.com/")) {
      setStatus({ type: "error", msg: "URL StockX non valido" });
      return;
    }

    setIsImporting(true);
    setStatus(null);
    setPreviewUrls([]);
    setFormData((prev) => ({ ...prev, photos: [] }));

    try {
      const slug = stockxUrl.split("/").pop()?.split("?")[0];
      const res = await fetch(`/api/external/stockx/${slug}`);
      const json: KicksProductResponse = await res.json();

      if (!json.data) throw new Error("Prodotto non trovato su StockX");
      const p = json.data;

      setTempProductData({
        brand: p.brand,
        model: p.model,
        title: p.title,
        sku: p.sku,
        rawDescription: p.description
          ? p.description.replace(/<[^>]*>?/gm, "")
          : "",
        gender: mapStockXGender(p.gender),
        category: "SNEAKER",
      });

      // Pre-compila la descrizione nel form
      setFormData((prev) => ({
        ...prev,
        description: p.description
          ? p.description.replace(/<[^>]*>?/gm, "")
          : "",
      }));

      if (p.image) {
        setIsDownloadingImage(true);
        const fileName = `${p.slug}-main.jpg`;
        const file = await convertUrlToFile(p.image, fileName);

        if (file) {
          setFormData((prev) => ({ ...prev, photos: [file] }));
          setPreviewUrls([URL.createObjectURL(file)]);
        }
        setIsDownloadingImage(false);
      }

      setStatus({
        type: "success",
        msg: "Dati recuperati! Verifica le info qui sopra.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        msg: String(err) || "Errore API o Prodotto non trovato",
      });
      setIsDownloadingImage(false);
    } finally {
      setIsImporting(false);
    }
  };

  // --- 2. SINCRONIZZA (Opzionale con Bulk API, ma utile per feedback visivo) ---
  // Nota: Con la Bulk API, questa funzione serve solo a confermare i dati a video,
  // la creazione reale avverrà al submit finale.
  const handleConfirmAndSync = async () => {
    if (!tempProductData) return;
    // Qui potremmo semplicemente dire "Dati pronti per la pubblicazione"
    // Ma se vuoi mantenere la logica di creazione Item anticipata, puoi lasciarlo.
    // Per ottimizzare, saltiamo la creazione DB qui e lasciamo fare tutto alla Bulk API.
    setStatus({
      type: "success",
      msg: "Dati confermati. Completa le varianti e pubblica.",
    });
  };

  // --- HANDLERS UI ---
  const removePhoto = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const addVariant = () => {
    if (!currentVariant.sizingId || currentVariant.price <= 0) return;
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, currentVariant],
    }));
    setCurrentVariant((prev) => ({
      ...prev,
      sizingId: "",
      price: 0,
      stock: 1,
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // --- SUBMIT FINALE (AGGIORNATO ALLA BULK API) ---
  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validazione base
    if (formData.variants.length === 0) {
      setStatus({ type: "error", msg: "Aggiungi almeno una taglia/prezzo." });
      return;
    }

    setIsSubmitting(true);

    try {
      // PREPARAZIONE DATI PER BULK API
      // Dobbiamo capire se stiamo usando dati importati (tempProductData)
      // o un item selezionato dal DB (formData.itemId).

      let payloadData = {};

      if (tempProductData) {
        payloadData = {
          brandName: tempProductData.brand,
          modelName: tempProductData.model,
          itemName: tempProductData.title,
          sku: tempProductData.sku,
          category: tempProductData.category,
          gender: tempProductData.gender,
        };
      } else if (formData.itemId) {
        const selectedItem = items.find((i) => i.id === formData.itemId);
        if (!selectedItem) throw new Error("Item selezionato non valido");
        console.log("Selected Item for Listing:", selectedItem);

        // Per sicurezza, passiamo lo SKU e i nomi. Se l'item esiste, l'API userà quello.
        payloadData = {
          // Fallback values se useItems non ha le relazioni popolate
          brandName: selectedItem.name || "Generic Brand",
          modelName: selectedItem.name || "Generic Model",
          itemName: selectedItem.name,
          sku: selectedItem.sku,
          category: selectedItem.category,
          gender: selectedItem.gender,
        };
      } else {
        throw new Error(
          "Devi importare un prodotto o selezionarne uno esistente.",
        );
      }

      // Aggiungiamo i dati del Listing e Varianti
      payloadData = {
        ...payloadData,
        description: formData.description,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        variants: formData.variants,
      };

      // COSTRUZIONE FORMDATA (JSON + FILES)
      const submissionData = new FormData();
      submissionData.append("data", JSON.stringify(payloadData));

      // Append delle foto
      formData.photos.forEach((file) => {
        submissionData.append("photos", file);
      });

      // CHIAMATA API BULK
      const res = await fetch("/api/listings/bulk", {
        method: "POST",
        body: submissionData, // Content-Type è automatico
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la pubblicazione");
      }

      // Successo!
      setStatus({ type: "success", msg: "Listing pubblicato con successo!" });

      // Aggiorniamo le cache locali per vedere subito le modifiche nelle tabelle
      await Promise.all([refetchItems(), refetchBrands(), refetchModels()]);

      setTimeout(() => router.push("/admin/listings"), 1500);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Errore finale salvataggio";
      setStatus({
        type: "error",
        msg: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          Add Listing<span className="text-amber-500">.</span>
        </h1>

        <StockXImporter
          url={stockxUrl}
          setUrl={setStockxUrl}
          onFetch={handleFetchData}
          isLoading={isImporting}
        />

        {tempProductData && (
          <ProductSyncPreview
            data={tempProductData}
            setData={setTempProductData}
            previewUrl={previewUrls[0]}
            isDownloadingImage={isDownloadingImage}
            onSync={handleConfirmAndSync}
            isSyncing={isSubmitting}
          />
        )}
      </header>

      {status && (
        <div
          className={`mb-8 p-4 rounded-2xl font-bold text-sm border ${
            status.type === "error"
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-green-50 text-green-600 border-green-100"
          }`}
        >
          {status.msg}
        </div>
      )}

      <form
        onSubmit={handleSubmitFinal}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        <div className="lg:col-span-7 space-y-10">
          <MediaGallery
            previewUrls={previewUrls}
            onRemove={removePhoto}
            onUpload={handlePhotoUpload}
          />

          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              Description
            </h2>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full h-40 p-6 bg-gray-50 rounded-[2rem] font-medium outline-none focus:ring-2 ring-black"
              placeholder="Detailed description..."
            />
          </section>
        </div>

        <div className="lg:col-span-5 space-y-10">
          {/* Mostra il selettore manuale SOLO se non abbiamo importato dati da StockX */}
          {!tempProductData && (
            <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                Catalog Item
              </h2>
              <select
                required
                value={formData.itemId}
                onChange={(e) =>
                  setFormData({ ...formData, itemId: e.target.value })
                }
                className="w-full p-4 bg-black text-white rounded-xl font-black uppercase text-xs outline-none"
              >
                <option value="">
                  {itemsLoading ? "Loading..." : "Select Item"}
                </option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku})
                  </option>
                ))}
              </select>
            </section>
          )}

          <InventoryManager
            variants={formData.variants}
            currentVariant={currentVariant}
            setCurrentVariant={setCurrentVariant}
            onAdd={addVariant}
            onRemove={removeVariant}
            sizings={sizings}
          />

          <button
            type="submit"
            disabled={isSubmitting || (!formData.itemId && !tempProductData)}
            className="w-full py-6 bg-black text-white font-black uppercase tracking-[0.4em] text-xs rounded-full shadow-2xl hover:bg-amber-500 hover:text-black transition-all disabled:opacity-30"
          >
            {isSubmitting ? "Publishing..." : "Publish Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
