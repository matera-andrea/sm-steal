/*
  Warnings:

  - You are about to drop the column `condition` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `listings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."listing_sizings" ADD COLUMN     "condition" "public"."ListingCondition" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."listings" DROP COLUMN "condition",
DROP COLUMN "price";
