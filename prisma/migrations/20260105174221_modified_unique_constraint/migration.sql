/*
  Warnings:

  - A unique constraint covering the columns `[listingId,sizingId,condition]` on the table `listing_sizings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."listing_sizings_listingId_sizingId_key";

-- CreateIndex
CREATE UNIQUE INDEX "listing_sizings_listingId_sizingId_condition_key" ON "public"."listing_sizings"("listingId", "sizingId", "condition");
