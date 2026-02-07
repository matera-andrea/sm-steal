import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import QueryProvider from "../providers/QueryProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEV | sm.steal",
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
        <html lang="en">
          <head></head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen font-sans`}
          >
            <NavBar />

            {/* Usiamo 'flex-1' per far sì che questo div occupi tutto lo spazio 
                disponibile, spingendo il footer verso il basso.
                Rimuoviamo le altezze fisse (h-[...]) 
            */}
            <main className="flex-1 w-full flex flex-col items-center">
              <div className="w-full">{children}</div>
            </main>

            <Footer />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
