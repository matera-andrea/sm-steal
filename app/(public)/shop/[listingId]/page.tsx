import type { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import ProductPage from "@/app/components/product/ProductPage";

interface PageProps {
  params: Promise<{ listingId: string }>;
}

async function getListing(listingId: string) {
  return prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      item: {
        include: {
          sneakerModel: { include: { Brand: true } },
        },
      },
      photos: { orderBy: { order: "asc" } },
      sizings: {
        include: { sizing: true },
        orderBy: { sizing: { size: "asc" } },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { listingId } = await params;
  const listing = await getListing(listingId);

  if (!listing) {
    return { title: "Product Not Found | sm.steal" };
  }

  const brandName = listing.item?.sneakerModel?.Brand?.name || "";
  const modelName = listing.item?.sneakerModel?.name || "Unknown Model";
  const prices = listing.sizings.map((s) => s.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const mainPhoto = listing.photos.find((p) => p.isMain) || listing.photos[0];

  return {
    title: `${brandName} ${modelName} | sm.steal`,
    description: `Buy ${brandName} ${modelName} starting from €${minPrice}. Verified authentic sneakers.`,
    openGraph: {
      title: `${brandName} ${modelName}`,
      description: listing.description || `Starting from €${minPrice}`,
      images: mainPhoto ? [{ url: mainPhoto.url }] : [],
    },
  };
}

export default async function ProductPageRoute({ params }: PageProps) {
  const { listingId } = await params;
  const listing = await getListing(listingId);

  if (!listing) {
    notFound();
  }

  return <ProductPage listing={listing} />;
}
