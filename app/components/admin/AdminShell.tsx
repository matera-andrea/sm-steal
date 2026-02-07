"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* SIDEBAR (Responsive) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden relative">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
