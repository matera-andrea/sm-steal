import { checkAdmin } from "@/app/lib/apiAdminCheck";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IMAGE_HOSTS = [
  "images.stockx.com",
  "stockx-assets.imgix.net",
  "cdn.kicks.dev",
  "pub-764b2f9992e44491998ffd3f90e860c7.r2.dev",
];

export async function GET(request: NextRequest) {
  const authError = await checkAdmin();
  if (authError) return authError;
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "URL missing" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["https:", "http:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();
    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.headers.get("Content-Type") || "image/jpeg",
    );
    headers.set("Cache-Control", "public, max-age=3600");

    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }
}
