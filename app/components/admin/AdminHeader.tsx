"use client";

import { LayoutDashboard, Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="h-20 flex items-center justify-between px-6 md:px-8 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* HAMBURGER MENU (Visible only on mobile) */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2">
          <LayoutDashboard size={18} className="text-black hidden sm:block" />
          <h2 className="text-xs font-black uppercase tracking-widest text-black">
            Control Panel
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase text-gray-400 hidden sm:block">
          System Live
        </span>
      </div>
    </header>
  );
}
