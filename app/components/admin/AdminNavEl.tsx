"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavElProps {
  text: string;
  href: string;
  highlighted?: boolean;
}

export default function AdminNavEl({
  text,
  href,
  highlighted,
}: AdminNavElProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center h-12 px-4 rounded-xl transition-all duration-200 group
        ${
          isActive
            ? "bg-amber-400 text-black shadow-[0_10px_20px_-10px_rgba(251,191,36,0.5)]"
            : highlighted
            ? "bg-white/10 text-amber-400 hover:bg-white/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }
      `}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${
          isActive
            ? "bg-black scale-125"
            : "bg-white/20 group-hover:bg-amber-400"
        }`}
      />

      <span
        className={`text-[11px] uppercase tracking-[0.15em] ${
          isActive ? "font-black" : "font-bold"
        }`}
      >
        {text}
      </span>

      {isActive && (
        <div className="ml-auto">
          <div className="w-1 h-1 rounded-full bg-black" />
        </div>
      )}
    </Link>
  );
}
