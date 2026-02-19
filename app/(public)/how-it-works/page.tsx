"use client";

import Link from "next/link";
import {
  Search,
  Truck,
  CreditCard,
  PackageCheck,
  MapPin,
  ArrowRight,
} from "lucide-react";

// --- CUSTOM ICONS ---
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

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Scegli il Grail.",
      desc: "Naviga nel nostro catalogo. Seleziona il modello, la tua taglia e la condizione (Nuovo o Usato).",
      icon: <Search className="w-8 h-8 text-black" />,
    },
    {
      num: "02",
      title: "Chatta con Noi.",
      // MODIFICA QUI: Convertito in JSX per includere il Link
      desc: (
        <>
          Clicca su 'Acquista su WhatsApp'. Verrai reindirizzato direttamente in
          chat con il founder.
          <br className="mb-2" />
          <span className="text-xs text-gray-400 font-bold">
            Problemi col link? Trovi i recapiti nella pagina{" "}
            <Link
              href="/contact-us"
              className="underline decoration-amber-400 decoration-2 text-black hover:text-amber-500 transition-colors"
            >
              Contatti
            </Link>
            .
          </span>
        </>
      ),
      icon: <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />,
    },
    {
      num: "03",
      title: "Spedizione & Dati.",
      desc: "Scegli tra spedizione Standard o Express (24h). Forniscici i dati per la consegna direttamente in chat.",
      icon: <Truck className="w-8 h-8 text-black" />,
    },
    {
      num: "04",
      title: "Pagamento Sicuro.",
      desc: "Completa l'acquisto tramite Bonifico Bancario istantaneo o PayPal (Beni e Servizi per la tua tutela).",
      icon: <CreditCard className="w-8 h-8 text-black" />,
    },
    {
      num: "05",
      title: "Relax & Unbox.",
      desc: "Riceverai il tracking number entro poche ore. Mettiti comodo, le tue nuove sneakers stanno arrivando.",
      icon: <PackageCheck className="w-8 h-8 text-black" />,
    },
  ];

  return (
    <main className="bg-white min-h-screen text-black pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-black text-white pt-32 pb-20 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-400 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
            Come <span className="text-amber-400">Funziona.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-xl mx-auto mt-6">
            Niente carrelli complicati o checkout infiniti. Abbiamo reso
            l'acquisto di sneakers semplice, diretto e umano.
          </p>
        </div>
      </section>

      {/* --- STEPS GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-[2rem] border-2 border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 font-black text-8xl text-gray-400 group-hover:text-amber-400 transition-colors select-none">
                {step.num}
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3">
                  {step.title}
                </h3>
                {/* Renderizziamo desc come nodo React (gestisce sia stringhe che JSX) */}
                <div className="text-gray-500 font-medium leading-relaxed">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}

          {/* CARD SPECIALE: LOCAL PICKUP */}
          <div className="bg-amber-50 p-8 rounded-[2rem] border-2 border-amber-400/30 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-400 text-black rounded-lg">
                  <MapPin size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                  Ritiro a Mano
                </span>
              </div>

              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                Sei di zona? <br />
                <span className="text-amber-500">Risparmia la spedizione.</span>
              </h3>

              <p className="text-gray-600 text-sm font-bold mb-2">
                📍 Bari / BAT / Foggia
              </p>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Se ti trovi in queste zone, offriamo il servizio di consegna a
                mano o ritiro in sede. Specificalo in chat per annullare i costi
                di spedizione.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-amber-600 transition-colors"
              ></Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="max-w-4xl mx-auto px-6 text-center pb-12">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
          Tutto chiaro?
        </h2>
        <Link href="/shop">
          <button className="bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl flex items-center gap-3 mx-auto hover:bg-amber-400 hover:text-black">
            Inizia lo Shopping <ArrowRight size={18} />
          </button>
        </Link>
      </section>
    </main>
  );
}
