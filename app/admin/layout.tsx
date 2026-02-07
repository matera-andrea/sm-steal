import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "../providers/QueryProvider";
import { Geist, Geist_Mono } from "next/font/google";
import AdminShell from "../components/admin/AdminShell"; // Importa il wrapper creato
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADMIN | sm.steal",
  description: "Management Console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <head></head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
          >
            {/* L'AdminShell gestisce tutta la struttura visiva e responsive */}
            <AdminShell>{children}</AdminShell>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
