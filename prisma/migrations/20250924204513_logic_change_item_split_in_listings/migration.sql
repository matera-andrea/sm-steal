/*
  Warnings:

  - You are about to drop the column `condition` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `prices` table. All the data in the column will be lost.
  - You are about to drop the column `hidden` on the `prices` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `prices` table. All the data in the column will be lost.
  - You are about to alter the column `basePrice` on the `prices` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `salePrice` on the `prices` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `wishlist_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,itemId]` on the table `wishlist_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,listingId]` on the table `wishlist_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingId` to the `photos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingId` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ListingCondition" AS ENUM ('NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE', 'POOR');

-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."photos" DROP CONSTRAINT "photos_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."prices" DROP CONSTRAINT "prices_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."wishlist_items" DROP CONSTRAINT "wishlist_items_productId_fkey";

-- DropIndex
DROP INDEX "public"."prices_productId_key";

-- DropIndex
DROP INDEX "public"."wishlist_items_userId_productId_key";

-- AlterTable
ALTER TABLE "public"."brands" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "condition",
DROP COLUMN "isFeatured",
DROP COLUMN "sizeId",
DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "public"."photos" DROP COLUMN "productId",
ADD COLUMN     "listingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."prices" DROP COLUMN "currency",
DROP COLUMN "hidden",
DROP COLUMN "productId",
ADD COLUMN     "listingId" TEXT NOT NULL,
ALTER COLUMN "basePrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "salePrice" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."sizings" ADD COLUMN     "numericSize" DOUBLE PRECISION,
ALTER COLUMN "size" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "phone",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "public"."wishlist_items" DROP COLUMN "productId",
ADD COLUMN     "itemId" TEXT,
ADD COLUMN     "listingId" TEXT;

-- CreateTable
CREATE TABLE "public"."listings" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "condition" "public"."ListingCondition" NOT NULL DEFAULT 'NEW',
    "stock" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listing_sizings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,
    "sizingId" TEXT NOT NULL,

    CONSTRAINT "listing_sizings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listings_itemId_idx" ON "public"."listings"("itemId");

-- CreateIndex
CREATE INDEX "listings_isActive_idx" ON "public"."listings"("isActive");

-- CreateIndex
CREATE INDEX "listings_isFeatured_idx" ON "public"."listings"("isFeatured");

-- CreateIndex
CREATE INDEX "listings_startDate_idx" ON "public"."listings"("startDate");

-- CreateIndex
CREATE INDEX "listings_endDate_idx" ON "public"."listings"("endDate");

-- CreateIndex
CREATE INDEX "listings_condition_idx" ON "public"."listings"("condition");

-- CreateIndex
CREATE INDEX "listings_isActive_isFeatured_idx" ON "public"."listings"("isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "listings_itemId_isActive_idx" ON "public"."listings"("itemId", "isActive");

-- CreateIndex
CREATE INDEX "listing_sizings_listingId_idx" ON "public"."listing_sizings"("listingId");

-- CreateIndex
CREATE INDEX "listing_sizings_sizingId_idx" ON "public"."listing_sizings"("sizingId");

-- CreateIndex
CREATE UNIQUE INDEX "listing_sizings_listingId_sizingId_key" ON "public"."listing_sizings"("listingId", "sizingId");

-- CreateIndex
CREATE INDEX "brands_name_idx" ON "public"."brands"("name");

-- CreateIndex
CREATE INDEX "brands_isActive_idx" ON "public"."brands"("isActive");

-- CreateIndex
CREATE INDEX "items_category_idx" ON "public"."items"("category");

-- CreateIndex
CREATE INDEX "items_gender_idx" ON "public"."items"("gender");

-- CreateIndex
CREATE INDEX "items_brandId_idx" ON "public"."items"("brandId");

-- CreateIndex
CREATE INDEX "items_isActive_idx" ON "public"."items"("isActive");

-- CreateIndex
CREATE INDEX "items_name_idx" ON "public"."items"("name");

-- CreateIndex
CREATE INDEX "items_category_gender_idx" ON "public"."items"("category", "gender");

-- CreateIndex
CREATE INDEX "photos_listingId_idx" ON "public"."photos"("listingId");

-- CreateIndex
CREATE INDEX "photos_isMain_idx" ON "public"."photos"("isMain");

-- CreateIndex
CREATE UNIQUE INDEX "prices_listingId_key" ON "public"."prices"("listingId");

-- CreateIndex
CREATE INDEX "prices_validFrom_idx" ON "public"."prices"("validFrom");

-- CreateIndex
CREATE INDEX "prices_validUntil_idx" ON "public"."prices"("validUntil");

-- CreateIndex
CREATE INDEX "sizings_type_idx" ON "public"."sizings"("type");

-- CreateIndex
CREATE INDEX "sizings_numericSize_idx" ON "public"."sizings"("numericSize");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "public"."users"("isActive");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "wishlist_items_userId_idx" ON "public"."wishlist_items"("userId");

-- CreateIndex
CREATE INDEX "wishlist_items_itemId_idx" ON "public"."wishlist_items"("itemId");

-- CreateIndex
CREATE INDEX "wishlist_items_listingId_idx" ON "public"."wishlist_items"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_itemId_key" ON "public"."wishlist_items"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_listingId_key" ON "public"."wishlist_items"("userId", "listingId");

-- AddForeignKey
ALTER TABLE "public"."photos" ADD CONSTRAINT "photos_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listings" ADD CONSTRAINT "listings_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listing_sizings" ADD CONSTRAINT "listing_sizings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listing_sizings" ADD CONSTRAINT "listing_sizings_sizingId_fkey" FOREIGN KEY ("sizingId") REFERENCES "public"."sizings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
