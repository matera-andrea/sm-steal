"use client";

import { useListingForm } from "./useListingForm";
import InventoryManager from "../create-listing/InventoryManager";
import MediaGallery from "../create-listing/MediaGallery";
import ProductSyncPreview from "../create-listing/ProductSyncPreview";
import StockXImporter from "../create-listing/StockXImporter";
import StatusAlert from "../create-listing/StatusAlert";
import CatalogItemSelect from "../create-listing/CatalogItemSelect";

export default function ListingForm() {
  const {
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
    items,
    itemsLoading,
    sizings,
    handleFetchData,
    handleConfirmAndSync,
    removePhoto,
    handlePhotoUpload,
    handleReorder,
    addVariant,
    removeVariant,
    handleSubmitFinal,
  } = useListingForm();

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
            previewUrls={previewUrls}
            isDownloadingImage={isDownloadingImage}
            onSync={handleConfirmAndSync}
            isSyncing={isSubmitting}
          />
        )}
      </header>

      {status && <StatusAlert type={status.type} msg={status.msg} />}

      <form
        onSubmit={handleSubmitFinal}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        <div className="lg:col-span-7 space-y-10">
          <MediaGallery
            previewUrls={previewUrls}
            onRemove={removePhoto}
            onUpload={handlePhotoUpload}
            onReorder={handleReorder}
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
              className="w-full h-40 p-6 bg-gray-50 rounded-4xl font-medium outline-none focus:ring-2 ring-black"
              placeholder="Detailed description..."
            />
          </section>
        </div>

        <div className="lg:col-span-5 space-y-10">
          {!tempProductData && (
            <CatalogItemSelect
              items={items}
              isLoading={itemsLoading}
              value={formData.itemId}
              onChange={(id) => setFormData({ ...formData, itemId: id })}
            />
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
