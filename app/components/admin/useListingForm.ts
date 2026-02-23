"use client";

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
import { useItems } from "@/hooks/useItems";
import { useSizings } from "@/hooks/useSizings";
import { useBrands } from "@/hooks/useBrands";
import { useSneakerModels } from "@/hooks/useSneakerModels";
import {
  TempProductData,
  ListingFormData,
  ListingVariantState,
  KicksMultiImageResponse,
  mapStockXGender,
} from "../create-listing/listingShared";

export function useListingForm() {
  const router = useRouter();

  const { items, loading: itemsLoading, refetch: refetchItems } = useItems();
  const { sizings } = useSizings();
  const { refetch: refetchBrands } = useBrands();
  const { refetch: refetchModels } = useSneakerModels();

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
      const proxyUrl = `/api/external/proxy-image?url=${encodeURIComponent(imageUrl)}`;
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

    const slug = stockxUrl.split("/").pop()?.split("?")[0];
    if (!slug) {
      setStatus({ type: "error", msg: "Impossibile estrarre lo slug dall'URL" });
      return;
    }

    setIsImporting(true);
    setStatus(null);
    setPreviewUrls([]);
    setFormData((prev) => ({ ...prev, photos: [] }));

    try {
      // Controllo se lo slug esiste già nel database locale
      const checkRes = await fetch(`/api/items?slug=${slug}`);
      const checkJson = await checkRes.json();

      if (checkJson.data && checkJson.data.length > 0) {
        setStatus({ type: "error", msg: "articolo gia' presente, modifica nella sezione dedicata" });
        setIsImporting(false);
        return;
      }

      const res = await fetch(`/api/external/stockx/${slug}`);
      const json: KicksMultiImageResponse = await res.json();

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

      setFormData((prev) => ({
        ...prev,
        description: p.description
          ? p.description.replace(/<[^>]*>?/gm, "")
          : "",
      }));

            const imageUrls: string[] =
              p.gallery_360 && p.gallery_360.length > 0
                ? p.gallery_360
                : p.gallery && p.gallery.length > 0
                ? p.gallery
                : p.image
                ? [p.image]
                : [];
      if (imageUrls.length > 0) {
        setIsDownloadingImage(true);
        const downloadResults = await Promise.all(
          imageUrls.map((imgUrl, idx) =>
            convertUrlToFile(
              imgUrl,
              `${p.slug}-${idx === 0 ? "main" : idx}.jpg`,
            ),
          ),
        );
        const validFiles = downloadResults.filter(
          (f): f is File => f !== null,
        );
        if (validFiles.length > 0) {
          setFormData((prev) => ({ ...prev, photos: validFiles }));
          setPreviewUrls(validFiles.map((f) => URL.createObjectURL(f)));
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

  // --- 2. SINCRONIZZA ---
  const handleConfirmAndSync = async () => {
    if (!tempProductData) return;
    setStatus({
      type: "success",
      msg: "Dati confermati. Completa le varianti e pubblica.",
    });
  };

  // --- MEDIA HANDLERS ---
  const removePhoto = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    setPreviewUrls((prev) => arrayMove(prev, oldIndex, newIndex));
    setFormData((prev) => ({
      ...prev,
      photos: arrayMove(prev.photos, oldIndex, newIndex),
    }));
  };

  // --- VARIANT HANDLERS ---
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

  // --- SUBMIT FINALE ---
  const handleSubmitFinal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.variants.length === 0) {
      setStatus({ type: "error", msg: "Aggiungi almeno una taglia/prezzo." });
      return;
    }

    setIsSubmitting(true);

    try {
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

        payloadData = {
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

      payloadData = {
        ...payloadData,
        description: formData.description,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        variants: formData.variants,
      };

      const submissionData = new FormData();
      submissionData.append("data", JSON.stringify(payloadData));
      formData.photos.forEach((file) => {
        submissionData.append("photos", file);
      });

      const res = await fetch("/api/listings/bulk", {
        method: "POST",
        body: submissionData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la pubblicazione");
      }

      setStatus({ type: "success", msg: "Listing pubblicato con successo!" });

      await Promise.all([refetchItems(), refetchBrands(), refetchModels()]);

      setTimeout(() => router.push("/admin/listings"), 1500);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Errore finale salvataggio";
      setStatus({ type: "error", msg: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    stockxUrl,
    setStockxUrl,
    isImporting,
    isDownloadingImage,
    tempProductData,
    setTempProductData,
    formData,
    setFormData,
    currentVariant,
    setCurrentVariant,
    previewUrls,
    isSubmitting,
    status,
    // Data from hooks
    items,
    itemsLoading,
    sizings,
    // Handlers
    handleFetchData,
    handleConfirmAndSync,
    removePhoto,
    handlePhotoUpload,
    handleReorder,
    addVariant,
    removeVariant,
    handleSubmitFinal,
  };
}
