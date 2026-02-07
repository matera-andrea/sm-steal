"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Settings, Package, X } from "lucide-react";
import AdminNavEl from "./AdminNavEl"; // Assicurati che il percorso sia corretto

// Definizione della navigazione
const NAVIGATION_ITEMS = [
  { text: "Brands", href: "/admin/brands" },
  { text: "Models", href: "/admin/sneakerModels" },
  { text: "Products", href: "/admin/items" },
  { text: "Listings", href: "/admin/listings" },
  { text: "Add Drop", href: "/admin/addListing", highlighted: true },
  { text: "Slideshow", href: "/admin/slideshow" },
  { text: "Featured", href: "/admin/featured" },
  { text: "Wishlist info", href: "/admin/wishlist" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* OVERLAY MOBILE (Sfondo scuro quando il menu è aperto) */}
      <div
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR REALE */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-black flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO AREA */}
        <div className="p-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <Image
              src="/logo_white.png" // Assicurati che il percorso sia valido
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-black uppercase italic tracking-tighter text-white">
              Admin<span className="text-amber-400">.</span>
            </span>
          </Link>

          {/* Tasto Chiudi (Solo Mobile) */}
          <button onClick={onClose} className="text-white md:hidden">
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-grow px-4 space-y-8 mt-4 overflow-y-auto">
          <div>
            <div className="px-4 mb-4 flex items-center gap-2">
              <Package size={14} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                Inventory
              </span>
            </div>
            <div className="space-y-1">
              {NAVIGATION_ITEMS.map((item) => (
                <div key={item.href} onClick={onClose}>
                  <AdminNavEl
                    text={item.text}
                    href={item.href}
                    highlighted={item.highlighted}
                  />
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="p-4 border-t border-white/5 space-y-2 mt-auto">
          <Link
            href="/admin/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors group"
          >
            <Settings
              size={18}
              className="group-hover:rotate-45 transition-transform"
            />
            <span className="text-xs font-bold uppercase tracking-widest">
              Settings
            </span>
          </Link>

          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: "h-8 w-8" },
              }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase truncate w-32">
                Manager Control
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
