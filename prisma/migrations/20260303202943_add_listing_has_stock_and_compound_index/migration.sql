-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "hasStock" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "listings_isActive_isFeatured_hasStock_createdAt_idx" ON "listings"("isActive", "isFeatured", "hasStock", "createdAt");
