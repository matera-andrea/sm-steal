import { checkAdmin } from "@/app/lib/apiAdminCheck";
import { KicksProductResponse } from "@/app/lib/types/type";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const authError = await checkAdmin();
  if (authError) return authError;
  const apiKey = process.env.KICKS_DB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter missing" },
        { status: 400 },
      );
    }
    const response = await fetch(
      `https://api.kicks.dev/v3/stockx/products/${slug}`,
      {
        headers: { Authorization: apiKey },
      },
    );

    if (!response.ok) throw new Error("Kicks API unreachable");

    const data: KicksProductResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in getting stockx data:", error);
    return NextResponse.json(
      { error: "Failed to fetch StockX data" },
      { status: 500 },
    );
  }
}
