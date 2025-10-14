/*
  Warnings:

  - You are about to drop the column `brandId` on the `items` table. All the data in the column will be lost.
  - Added the required column `sneakerModelId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_brandId_fkey";

-- DropIndex
DROP INDEX "public"."items_brandId_idx";

-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "brandId",
ADD COLUMN     "sneakerModelId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."sneaker_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemsCount" INTEGER NOT NULL DEFAULT 0,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "sneaker_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sneaker_models_name_key" ON "public"."sneaker_models"("name");

-- CreateIndex
CREATE INDEX "sneaker_models_name_idx" ON "public"."sneaker_models"("name");

-- CreateIndex
CREATE INDEX "sneaker_models_isActive_idx" ON "public"."sneaker_models"("isActive");

-- AddForeignKey
ALTER TABLE "public"."sneaker_models" ADD CONSTRAINT "sneaker_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_sneakerModelId_fkey" FOREIGN KEY ("sneakerModelId") REFERENCES "public"."sneaker_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
