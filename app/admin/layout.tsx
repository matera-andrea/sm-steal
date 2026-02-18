import type { Metadata } from "next";
import AdminShell from "../components/admin/AdminShell";

export const metadata: Metadata = {
  title: "ADMIN | sm.steal",
  description: "Management Console",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
