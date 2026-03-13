import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./providers/QueryProvider";
import { Toaster } from "sonner";
import LegalBlinkBanner from "./components/common/LegalBlinkBanner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";


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
        <html
          lang="it"
          className={`${geistSans.variable} ${geistMono.variable}`}
        >
          <body className="antialiased font-sans">
            {children}
            <Toaster position="bottom-right" />

            {/* <LegalBlinkBanner /> */}
            <LegalBlinkBanner />
            <Analytics />
            <SpeedInsights />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
