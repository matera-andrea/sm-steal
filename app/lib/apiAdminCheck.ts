import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definiamo i ruoli permessi (preparazione al futuro)
const ADMIN_IDS = [process.env.ADMIN_ID, process.env.DEV_ID].filter(Boolean);

export async function checkAdmin() {
  const { userId } = await auth();

  if (!userId || !ADMIN_IDS.includes(userId)) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "Accesso negato. Privilegi insufficienti.",
      },
      { status: 403 }
    );
  }

  return null; // Null significa "Tutto OK"
}

// Helper per Server Actions (dove non puoi ritornare NextResponse JSON)
export async function requireAdminAction() {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    throw new Error("Unauthorized");
  }
}
