"use client";

import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";
import { useState, useEffect, Suspense } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Heart, Menu, Search, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "How it works", href: "/how-it-works" },
  { name: "About", href: "/about" },
];

function NavBarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const { openSignIn } = useClerk();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchTerm(query);
    } else {
      setSearchTerm("");
    }
  }, [searchParams]);

  const handleLoginClick = () => {
    openSignIn();
    return;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (
    e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent,
  ) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();

    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
      const target = e.target as HTMLInputElement;
      target.blur();
    }
  };

  return (
    <Disclosure
      as="nav"
      className={`bg-white border-b border-gray-100 sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* MODIFICA ALTEZZA: h-24 per ospitare il logo grande */}
            <div className="flex h-24 items-center justify-between gap-4">
              {/* Bottone Mobile (a sinistra su mobile) */}
              <div className="flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-full p-2 text-black hover:bg-gray-100 focus:outline-none">
                  {open ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>

              {/* 1. LOGO (Posizionato PRIMA della search bar) */}
              <div className="flex shrink-0 items-center">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={250}
                    height={150}
                    className="h-14 sm:h-20 w-auto object-contain"
                    priority
                  />
                </Link>
              </div>

              {/* 2. BARRA DI RICERCA (Posizionata DOPO il logo) */}
              <div className="hidden sm:flex flex-1 max-w-xs ml-4">
                <div className="relative group w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search drops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    className="block w-full border-b border-transparent bg-gray-50 py-2 pl-10 pr-3 text-sm focus:bg-white focus:border-black outline-none transition-all rounded-full"
                  />
                </div>
              </div>

              {/* ICONE DESTRA (Mantenute alla fine) */}
              <div className="flex flex-1 items-center justify-end gap-2 md:gap-5">
                <SignedIn>
                  <Link href={"/wishlist"}>
                    <button className="p-2 text-black hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
                      <Heart className="h-5 w-5 hover:fill-red-500 hover:text-red-500 cursor-pointer" />
                    </button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <div onClick={handleLoginClick}>
                    <button className="p-2 text-black hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
                      <Heart className="h-5 w-5 hover:fill-red-500 hover:text-red-500 cursor-pointer" />
                    </button>
                  </div>
                </SignedOut>
                <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                <SignedIn>
                  <UserButton />
                </SignedIn>

                <SignedOut>
                  <div
                    onClick={handleLoginClick}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-colors"
                  >
                    <User className="h-5 w-5 md:h-4 md:w-4" />
                    <span className="hidden md:block">Login</span>
                  </div>
                </SignedOut>
              </div>
            </div>

            {/* NAVIGAZIONE DESKTOP */}
            <div className="hidden sm:flex justify-center border-t border-gray-50">
              <div className="flex space-x-10 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-xs font-black uppercase tracking-[0.2em] transition-all relative py-1 group ${
                        isActive
                          ? "text-black"
                          : "text-gray-400 hover:text-black"
                      }`}
                    >
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MENU MOBILE */}
          <DisclosurePanel className="sm:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
            <div className="space-y-1 px-4 pb-6 pt-4">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="block w-full bg-gray-50 py-3 pl-10 pr-3 text-sm rounded-xl focus:ring-2 ring-black outline-none"
                />
              </div>

              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`block px-3 py-4 text-xl font-black uppercase italic tracking-tighter ${
                    pathname === item.href ? "text-amber-500" : "text-black"
                  }`}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

export default function NavBar() {
  return (
    <Suspense
      fallback={
        // MODIFICA ALTEZZA FALLBACK: h-24
        <div className="h-24 bg-white border-b border-gray-100 sticky top-0 z-50" />
      }
    >
      <NavBarContent />
    </Suspense>
  );
}
