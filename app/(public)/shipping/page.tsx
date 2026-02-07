/* eslint-disable react/no-unescaped-entities */
// app/shipping-returns/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Package,
  Clock,
  Globe,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <main className="bg-gray-50 min-h-screen text-black pb-20 font-sans">
      {/* --- HERO HEADER --- */}
      <section className="bg-black text-white pt-32 pb-32 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={12} /> Torna alla Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
            Spedizioni & <span className="text-amber-400">Resi.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl">
            Tutto quello che devi sapere su come il tuo grail arriva a casa tua
            e sulle nostre politiche di restituzione.
          </p>
        </div>
      </section>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-6 relative z-20 -mt-20 space-y-12">
        {/* === SEZIONE SPEDIZIONI === */}
        <section className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
              <Truck size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Spedizioni
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Veloci. Tracciate. Sicure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="text-amber-500 mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-black uppercase text-sm mb-1">
                    Tempi di Evasione
                  </h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    Tutti gli ordini vengono elaborati entro{" "}
                    <strong>24 ore lavorative</strong> dalla ricezione del
                    pagamento. Se ordini entro le 12:00, spesso spediamo in
                    giornata.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="text-amber-500 mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-black uppercase text-sm mb-1">
                    Corrieri Partner
                  </h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    Ci affidiamo esclusivamente ai migliori:{" "}
                    <strong>DHL Express, UPS e Bartolini</strong>. Riceverai il
                    codice di tracciamento via email o WhatsApp appena il pacco
                    parte.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="text-amber-500 mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-black uppercase text-sm mb-1">
                    Costi e Tempi
                  </h3>
                  <ul className="text-gray-600 text-sm font-medium space-y-2">
                    <li className="flex justify-between border-b border-gray-100 pb-1">
                      <span>Italia (24/48h)</span>
                      <strong>€10,00</strong>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-1">
                      <span>Europa (3-5 gg)</span>
                      <strong>€18,00</strong>
                    </li>
                    <li className="flex justify-between text-amber-600">
                      <span>Ritiro a Mano (BT/FG)</span>
                      <strong>Gratis</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-500">
                  <strong className="text-black">Nota sul Double Box:</strong>{" "}
                  Tutte le scarpe vengono spedite in doppia scatola per
                  proteggere il box originale da urti e danni durante il
                  trasporto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* === SEZIONE RESI === */}
        <section className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="p-4 bg-black text-white rounded-2xl">
              <RefreshCw size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Politica di Reso
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Trasparenza prima di tutto
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="prose prose-p:text-gray-600 prose-p:font-medium max-w-none">
              <p>
                A causa della natura esclusiva dei prodotti (Edizioni Limitate,
                Collezionismo, Beni Usati in conto vendita),{" "}
                <strong>
                  SM.STEAL non offre resi o rimborsi per "ripensamento" o
                  "taglia errata ordinata dal cliente"
                </strong>
                , salvo diversi accordi scritti presi esplicitamente prima
                dell'acquisto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QUANDO ACCETTIAMO IL RESO */}
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <h3 className="flex items-center gap-2 font-black uppercase text-green-700 mb-4 text-sm">
                  <CheckCircle2 size={18} /> Reso Accettato Se:
                </h3>
                <ul className="space-y-3 text-sm font-medium text-green-800/80">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                    L'articolo ricevuto è diverso da quello ordinato (errore
                    nostro).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                    L'articolo presenta difetti gravi non segnalati nella
                    descrizione o nelle foto (per l'usato).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                    L'articolo si rivela non autentico (Fake). Garanzia a vita.
                  </li>
                </ul>
              </div>

              {/* QUANDO NON LO ACCETTIAMO */}
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="flex items-center gap-2 font-black uppercase text-red-700 mb-4 text-sm">
                  <AlertTriangle size={18} /> Reso NON Accettato Se:
                </h3>
                <ul className="space-y-3 text-sm font-medium text-red-800/80">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                    Hai ordinato la taglia sbagliata (ti consigliamo di
                    chiederci le misure in cm prima).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                    Hai cambiato idea dopo la spedizione.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                    Il prodotto è stato indossato, o il sigillo di garanzia/tag
                    è stato rimosso.
                  </li>
                </ul>
              </div>
            </div>

            {/* ISTRUZIONI RESO */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-black uppercase text-sm mb-3">
                Procedura di Reso
              </h3>
              <p className="text-gray-600 text-sm font-medium mb-4">
                Se rientri nei casi di reso accettato, hai{" "}
                <strong>14 giorni</strong> dalla ricezione per contattarci.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 font-medium bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <li>
                  Scrivici su WhatsApp o via Email indicando il numero ordine e
                  il problema.
                </li>
                <li>Inviaci foto dettagliate del difetto o dell'errore.</li>
                <li>
                  Attendi la nostra autorizzazione (RMA) e l'etichetta di
                  spedizione prepagata (se errore nostro).
                </li>
                <li>Imballa il prodotto nella doppia scatola originale.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-amber-400 p-8 md:p-12 rounded-[2rem] shadow-lg text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <HelpCircle size={40} className="text-black" />
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
                Dubbi sulla taglia?
              </h2>
              <p className="text-black/80 font-medium max-w-md mx-auto mt-2">
                Prima di acquistare, scrivici. Ti manderemo le misure in cm
                della soletta interna (insole) per evitare errori.
              </p>
            </div>
            <Link href="/contact-us">
              <button className="bg-black text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl">
                Contattaci
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
