-- CreateEnum
CREATE TYPE "public"."CategoryItem" AS ENUM ('SNEAKER', 'SHOE', 'COLLECTIBLE', 'CLOTHING', 'ACCESSORY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SizingType" AS ENUM ('UK', 'US', 'IT');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MEN', 'WOMEN', 'UNISEX', 'KIDS');

-- CreateTable
CREATE TABLE "public"."brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prices" (
    "id" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sizings" (
    "id" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "type" "public"."SizingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sizings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."selling_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."CategoryItem" NOT NULL,
    "condition" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "gender" "public"."Gender" NOT NULL DEFAULT 'MEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brandId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,

    CONSTRAINT "selling_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."photos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wishlist_items" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "public"."brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "prices_productId_key" ON "public"."prices"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "sizings_size_type_key" ON "public"."sizings"("size", "type");

-- CreateIndex
CREATE UNIQUE INDEX "selling_items_sku_key" ON "public"."selling_items"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_productId_key" ON "public"."wishlist_items"("userId", "productId");

-- AddForeignKey
ALTER TABLE "public"."prices" ADD CONSTRAINT "prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."selling_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."selling_items" ADD CONSTRAINT "selling_items_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."selling_items" ADD CONSTRAINT "selling_items_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."sizings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."photos" ADD CONSTRAINT "photos_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."selling_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."selling_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
