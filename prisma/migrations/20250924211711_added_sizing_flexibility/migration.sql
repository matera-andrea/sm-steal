/*
  Warnings:

  - You are about to drop the column `numericSize` on the `sizings` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."SizingType" ADD VALUE 'OFA';
ALTER TYPE "public"."SizingType" ADD VALUE 'OTHER';

-- DropIndex
DROP INDEX "public"."sizings_numericSize_idx";

-- AlterTable
ALTER TABLE "public"."sizings" DROP COLUMN "numericSize";
