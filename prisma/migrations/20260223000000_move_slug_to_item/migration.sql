-- AlterTable: add slug to items with empty string default
ALTER TABLE "items" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "items_slug_idx" ON "items"("slug");

-- AlterTable: remove slug from sneaker_models
DROP INDEX IF EXISTS "sneaker_models_slug_idx";
DROP INDEX IF EXISTS "sneaker_models_slug_key";
ALTER TABLE "sneaker_models" DROP COLUMN "slug";
