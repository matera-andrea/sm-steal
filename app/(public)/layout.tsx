import type { Metadata } from "next";
import NavBar from "../components/common/NavBar";

export const metadata: Metadata = {
  title: "sm.steal",
  description: "Find here your grail",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
