/*
  Warnings:

  - You are about to drop the column `wishlistItemsCount` on the `items` table. All the data in the column will be lost.
  - You are about to drop the `wishlist_items` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `sneaker_models` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_itemId_fkey";

-- DropForeignKey
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_listingId_fkey";

-- DropForeignKey
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_userId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "wishlistItemsCount";

-- AlterTable
ALTER TABLE "sneaker_models" ADD COLUMN     "slug" TEXT;

-- DropTable
DROP TABLE "wishlist_items";

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_userId_listingId_key" ON "WishlistItem"("userId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "sneaker_models_slug_key" ON "sneaker_models"("slug");

-- CreateIndex
CREATE INDEX "sneaker_models_slug_idx" ON "sneaker_models"("slug");

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
