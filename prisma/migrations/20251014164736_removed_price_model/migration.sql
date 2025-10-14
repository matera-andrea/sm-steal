/*
  Warnings:

  - You are about to drop the `prices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."prices" DROP CONSTRAINT "prices_listingId_fkey";

-- AlterTable
ALTER TABLE "public"."listings" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- DropTable
DROP TABLE "public"."prices";
