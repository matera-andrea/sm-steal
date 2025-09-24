/*
  Warnings:

  - You are about to drop the `selling_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."photos" DROP CONSTRAINT "photos_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."prices" DROP CONSTRAINT "prices_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."selling_items" DROP CONSTRAINT "selling_items_brandId_fkey";

-- DropForeignKey
ALTER TABLE "public"."selling_items" DROP CONSTRAINT "selling_items_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."wishlist_items" DROP CONSTRAINT "wishlist_items_productId_fkey";

-- DropTable
DROP TABLE "public"."selling_items";

-- CreateTable
CREATE TABLE "public"."items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."CategoryItem" NOT NULL,
    "condition" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "gender" "public"."Gender" NOT NULL DEFAULT 'MEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brandId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_sku_key" ON "public"."items"("sku");

-- AddForeignKey
ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."sizings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."photos" ADD CONSTRAINT "photos_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
