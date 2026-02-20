// app/contact/page.tsx
"use client";

import { Mail, ArrowRight } from "lucide-react";

// --- CONFIGURAZIONE CONTATTI ---
const CONTACT_INFO = {
  whatsapp: "393471700483", // Inserisci il tuo numero
  email: "info@smsteal.com", // Inserisci la tua email
  instagram: "sm.steal", // Il tuo username
  address: "Andria, Italia", // Opzionale
};

// --- ICONE BRAND CUSTOM (SVG) ---
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen text-black pb-20">
      {/* --- HERO HEADER --- */}
      <section className="bg-black text-white pt-32 pb-24 px-6 rounded-b-[3rem] shadow-2xl">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
            Serve <span className="text-amber-400">Aiuto?</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-xl mx-auto">
            Hai domande su una taglia, sulla spedizione o cerchi un modello
            specifico? Siamo qui 24/7.
          </p>
        </div>
      </section>

      {/* --- CONTACT CARDS --- */}
      <section className="max-w-6xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. WHATSAPP (Main CTA) */}
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Ciao! Ho bisogno di informazioni su...`}
            target="_blank"
            rel="noreferrer"
            className="group bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-black shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">
                WhatsApp
              </h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                Risposta Immediata
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              Il modo più veloce per parlare con noi. Info prodotti, foto live e
              ordini veloci.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#25D366] group-hover:text-black transition-colors">
              Chatta Ora <ArrowRight size={14} />
            </div>
          </a>

          {/* 2. INSTAGRAM */}
          <a
            href={`https://instagram.com/${CONTACT_INFO.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="group bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-black shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <InstagramIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">
                Instagram
              </h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                @sm.steal
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              Seguici per i drop giornalieri, restock e sondaggi. Scrivici in DM
              per collaborazioni.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-600 group-hover:text-black transition-colors">
              Vai al Profilo <ArrowRight size={14} />
            </div>
          </a>

          {/* 3. EMAIL */}
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="group bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-black shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Mail size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">
                Email
              </h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                Supporto Clienti
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              Per info su ordini esistenti, resi, rimborsi o richieste
              commerciali formali.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/50 group-hover:text-black transition-colors">
              Scrivi Email <ArrowRight size={14} />
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
