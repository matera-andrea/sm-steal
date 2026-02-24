import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./providers/QueryProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "block",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "block",
});

export const metadata: Metadata = {
  title: "HeatLab",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Analytics />
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
          <body className="antialiased font-sans">
            {children}
            <Toaster position="bottom-right" />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
