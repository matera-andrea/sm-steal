import type { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import ProductPage from "@/app/components/product/ProductPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const INCLUDE = {
  item: {
    include: {
      sneakerModel: { include: { Brand: true } },
    },
  },
  photos: { orderBy: { order: "asc" as const } },
  sizings: {
    include: { sizing: true },
    orderBy: { sizing: { size: "asc" as const } },
  },
} as const;

async function getListing(slug: string) {
  // Primary lookup: by sneakerModel slug
  const bySlug = await prisma.listing.findFirst({
    where: { item: { sneakerModel: { slug } } },
    include: INCLUDE,
  });
  if (bySlug) return bySlug;

  // Fallback: by listing ID (handles old / bookmarked URLs)
  return prisma.listing.findUnique({
    where: { id: slug },
    include: INCLUDE,
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) {
    return { title: "Prodotto non trovato | sm.steal" };
  }

  const brandName = listing.item?.sneakerModel?.Brand?.name || "";
  const modelName = listing.item?.sneakerModel?.name || "Modello Sconosciuto";
  const prices = listing.sizings.map((s) => s.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const mainPhoto = listing.photos.find((p) => p.isMain) || listing.photos[0];

  return {
    title: `${brandName} ${modelName} | sm.steal`,
    description: `Acquista ${brandName} ${modelName} a partire da €${minPrice}. Sneakers originali verificate.`,
    openGraph: {
      title: `${brandName} ${modelName}`,
      description: listing.description || `A partire da €${minPrice}`,
      images: mainPhoto ? [{ url: mainPhoto.url }] : [],
    },
  };
}

export default async function ProductPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) {
    notFound();
  }

  return <ProductPage listing={listing} />;
}
