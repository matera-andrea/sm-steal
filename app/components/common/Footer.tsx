import Image from "next/image";
import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  );
}

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
                src="/logobw.jpeg"
                alt="heatlab Logo"
                // Aumentata risoluzione
                width={200}
                height={200}
                // Aumentata dimensione visuale: h-20 mobile, h-28 desktop
                className="h-20 md:h-28 w-auto object-contain"
              />
              {/* <span className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                sm<span className="text-amber-400">.steal</span>
              </span> */}
            </Link>

            <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-medium">
              Il punto di riferimento per sneakers autentiche selezionate con
              cura. Originalità garantita e prezzi che parlano chiaro.
            </p>

            <div className="flex space-x-5">
              <a
                href="https://instagram.com/heat.lab_"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <InstagramIcon className="w-5.5 h-5.5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <LinkedinIcon className="w-5.5 h-5.5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                <XIcon className="w-5.5 h-5.5" />
              </a>
            </div>
          </div>

          {/* Colonna Support */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Supporto
            </h3>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-400">
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white transition-colors"
                >
                  Come funziona
                </Link>
              </li>
              <li>
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
                  Contattaci
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna Legal */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Legale
            </h3>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-400">
              <li>
                <a
                  href="https://app.legalblink.it/api/documents/69a736ff3499c800239e01ad/privacy-policy-per-siti-web-o-e-commerce-it"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <a
                  href="https://app.legalblink.it/api/documents/69a736ff3499c800239e01ad/cookie-policy-it"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferiore */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <div>
            © {new Date().getFullYear()} SM.STEAL — Tutti i diritti riservati
          </div>
          <div className="flex gap-6">
            <span>P.IVA: IT09035330720</span>

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
