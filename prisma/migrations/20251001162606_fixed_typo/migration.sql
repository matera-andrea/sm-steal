/*
  Warnings:

  - You are about to drop the column `itemsConut` on the `brands` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."brands" DROP COLUMN "itemsConut",
ADD COLUMN     "itemsCount" INTEGER NOT NULL DEFAULT 0;
