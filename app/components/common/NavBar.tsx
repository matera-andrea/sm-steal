"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Heart, User, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "How it works", href: "/how-it-works" },
  { name: "About", href: "/about" },
  { name: "Contact us", href: "/contact-us" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Prima riga: Barra di ricerca, Logo, Icone */}
            <div className="flex h-20 items-center justify-between gap-8">
              {/* Barra di ricerca - sinistra */}
              <div className="hidden sm:flex flex-1 max-w-lg">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="search"
                    placeholder="Cerca prodotti..."
                    className="block w-full rounded-md border-0 bg-gray-700 py-2 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-gray-600 focus:text-white focus:ring-2 focus:ring-white sm:text-sm"
                  />
                </div>
              </div>

              {/* Bottone menu mobile - sinistra su mobile */}
              <div className="sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo - centro */}
              <div className="flex flex-shrink-0 items-center">
                <Image
                  src="/logo_white.png"
                  alt="Your Company"
                  width={56}
                  height={56}
                  className="h-14 w-auto"
                />
              </div>

              {/* Icone - destra (solo desktop) */}
              <div className="hidden sm:flex flex-1 items-center justify-end gap-4">
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none"
                >
                  <span className="sr-only">View favorites</span>
                  <Heart className="h-6 w-6" aria-hidden="true" />
                </button>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <Link href="/login">
                    <FaUser color="white" />
                  </Link>
                </SignedOut>
              </div>

              {/* Spazio vuoto a destra su mobile per centrare il logo */}
              <div className="sm:hidden w-10"></div>
            </div>

            {/* Seconda riga: Link di navigazione - solo desktop */}
            <div className="hidden sm:block border-t border-gray-700 mt-4">
              <div className="flex justify-center space-x-8 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-4 py-2 text-base font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Menu mobile */}
          <DisclosurePanel className="sm:hidden">
            <div className="border-t border-gray-700">
              {/* Barra di ricerca mobile */}
              <div className="px-4 py-3">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="search"
                    placeholder="Cerca prodotti..."
                    className="block w-full rounded-md border-0 bg-gray-700 py-2 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-gray-600 focus:text-white focus:ring-2 focus:ring-white sm:text-sm"
                  />
                </div>
              </div>

              {/* Link di navigazione */}
              <div className="space-y-1 px-2 pb-3">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                    >
                      {item.name}
                    </DisclosureButton>
                  );
                })}
              </div>

              {/* Icone e profilo nel menu mobile */}
              <div className="border-t border-gray-700 px-2 pb-3 pt-4">
                <div className="flex items-center justify-around">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-white"
                  >
                    <Link href="whishlist">
                      <Heart className="h-6 w-6" />
                    </Link>
                    <span className="text-xs">Favorites</span>
                  </a>
                  <a
                    href="/my-account"
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-white"
                  >
                    <User className="h-6 w-6" />
                    <span className="text-xs">Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
