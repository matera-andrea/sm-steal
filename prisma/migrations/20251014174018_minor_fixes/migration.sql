/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_sneakerModelId_fkey";

-- DropIndex
DROP INDEX "public"."listings_condition_idx";

-- DropIndex
DROP INDEX "public"."listings_endDate_idx";

-- DropIndex
DROP INDEX "public"."listings_isActive_isFeatured_idx";

-- DropIndex
DROP INDEX "public"."listings_startDate_idx";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_sneakerModelId_fkey" FOREIGN KEY ("sneakerModelId") REFERENCES "public"."sneaker_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
