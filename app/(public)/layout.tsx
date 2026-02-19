import type { Metadata } from "next";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";

export const metadata: Metadata = {
  title: "Heat Lab | sm.steal",
  description: "",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
