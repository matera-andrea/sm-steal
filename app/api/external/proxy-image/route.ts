import { checkAdmin } from "@/app/lib/apiAdminCheck";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authError = await checkAdmin();
  if (authError) return authError;
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "URL missing" }, { status: 400 });
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
