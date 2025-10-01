-- AlterTable
ALTER TABLE "public"."brands" ADD COLUMN     "itemsConut" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."items" ADD COLUMN     "listingCount" INTEGER NOT NULL DEFAULT 0;
