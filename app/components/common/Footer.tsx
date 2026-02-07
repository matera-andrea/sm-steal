// components/layout/Footer.tsx

import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t z-50 border-white/10 relative">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Colonna Brand & Mission (Occupa 2 spazi su 4) */}
          <div className="lg:col-span-2 space-y-6">
            {/* MODIFICA: Logo e Testo molto più grandi */}
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="HeatLab Logo"
                // Aumentata risoluzione
                width={200}
                height={200}
                // Aumentata dimensione visuale: h-20 mobile, h-28 desktop
                className="h-20 md:h-28 w-auto object-contain"
              />
              {/* <span className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                Heat<span className="text-amber-400">Lab</span>
              </span> */}
            </Link>

            <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-medium">
              Il punto di riferimento per il resell autentico. Sneakers,
              collectibles e grails selezionati con cura per veri appassionati.
              No fake, just steals.
            </p>

            <div className="flex space-x-5">
              <a
                href="https://instagram.com/sm.steal"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <FaLinkedin size={22} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <FaTwitter size={22} />
              </a>
            </div>
          </div>

          {/* Colonna Support */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Support
            </h3>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-400">
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna Legal */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Legal
            </h3>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferiore */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <div>© {new Date().getFullYear()} Heat Lab — All Rights Reserved</div>
          <div className="flex gap-6">
            <span>VAT: [INSERISCI P.IVA]</span>

            {/* <Link
              href="/developer"
              className="hover:text-white transition-colors group"
            >
              Designed by{" "}
              <span className="group-hover:text-amber-400 transition-colors underline decoration-amber-400 underline-offset-4">
                Andrea Matera
              </span>
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
