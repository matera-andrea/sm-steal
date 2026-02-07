/*
  Warnings:

  - You are about to drop the column `stock` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_isActive_idx";

-- AlterTable
ALTER TABLE "public"."listings" DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "isActive",
DROP COLUMN "isVerified",
DROP COLUMN "passwordHash",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "public"."users"("clerkId");
