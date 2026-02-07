// app/cookie-policy/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  ShieldCheck,
  BarChart3,
  XCircle,
  Settings,
  Info,
  Heart, // Aggiunta icona Heart
} from "lucide-react";

export default function CookiePolicyPage() {
  // Come per i Termini, usiamo una data statica per indicare la versione legale del documento.
  const lastUpdateDate = "7 Gennaio 2026";

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
            Cookie <span className="text-amber-400">Policy.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl">
            Trasparenza totale sui piccoli file che ci aiutano a far funzionare
            SM.STEAL.
          </p>
          <p className="text-gray-500 text-sm mt-4 font-mono">
            Ultimo aggiornamento: {lastUpdateDate}
          </p>
        </div>
      </section>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-6 relative z-20 -mt-20 space-y-8">
        {/* INTRO CARD */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Cookie size={24} />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Cosa sono i Cookie?
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed font-medium">
            I cookie sono piccoli file di testo che i siti visitati inviano al
            tuo terminale (computer, tablet, smartphone), dove vengono
            memorizzati per essere poi ritrasmessi agli stessi siti alla visita
            successiva. Servono per autenticarti, ricordare le tue preferenze
            (come la <strong>Wishlist</strong>) e monitorare le sessioni.
          </p>
        </div>

        {/* CATEGORIE DI COOKIE */}
        <div className="grid grid-cols-1 gap-6">
          {/* 1. TECNICI (NECESSARI) */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[4rem] -mr-4 -mt-4"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  Cookie Tecnici (Necessari)
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded">
                  Sempre Attivi
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-4">
              Questi cookie sono indispensabili per il corretto funzionamento
              del sito. Senza di essi, non potresti effettuare il login,{" "}
              <strong>gestire la tua Wishlist</strong> o navigare in modo
              sicuro. Non richiedono il tuo consenso.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <ul className="space-y-2 text-xs font-bold text-gray-700">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span>
                    Provider: <strong>Clerk.com</strong>
                  </span>
                  <span className="text-gray-400">
                    Autenticazione & Sicurezza
                  </span>
                </li>
                <li className="flex justify-between pt-1">
                  <span>
                    Provider: <strong>SM.STEAL</strong>
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    Sessione & <Heart size={10} className="fill-gray-400" />{" "}
                    Wishlist
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 2. ANALITICI */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -mr-4 -mt-4"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  Cookie Analitici
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Anonimizzati
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-4">
              Utilizziamo strumenti per capire come gli utenti navigano sul sito
              (pagine più visitate, errori, velocità). Questi dati sono raccolti
              in forma <strong>aggregata e anonima</strong>. Non possiamo
              identificarti personalmente tramite questi cookie.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <ul className="space-y-2 text-xs font-bold text-gray-700">
                <li className="flex justify-between">
                  <span>
                    Provider: <strong>Vercel Analytics</strong>
                  </span>
                  <span className="text-gray-400">
                    Performance & Statistiche
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. PROFILAZIONE (NON USATI) */}
          <section className="bg-gray-100 p-8 rounded-[2rem] border-2 border-dashed border-gray-300 opacity-80">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-200 text-gray-500 rounded-xl">
                <XCircle size={24} />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-500">
                Cookie di Profilazione
              </h3>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              <strong>Non utilizziamo</strong> cookie di profilazione
              pubblicitaria o di marketing di terze parti (come Facebook Pixel o
              Google Ads) per tracciare il tuo comportamento al di fuori di
              questo sito. La tua navigazione qui rimane privata.
            </p>
          </section>
        </div>

        {/* GESTIONE COOKIE */}
        <section className="bg-amber-50 p-8 md:p-10 rounded-[2rem] border-2 border-amber-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-400 text-black rounded-xl shadow-sm">
              <Settings size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
              Come gestire i Cookie
            </h2>
          </div>

          <p className="text-gray-700 mb-6 font-medium">
            Puoi disattivare i cookie direttamente dalle impostazioni del tuo
            browser. Tuttavia, disabilitando i cookie tecnici (Clerk), non sarai
            in grado di effettuare il login, accedere all&apos;area riservata o{" "}
            <strong>salvare prodotti nella Wishlist</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-4 rounded-xl text-sm font-bold border border-amber-100 hover:border-black transition-colors flex justify-between items-center"
            >
              Google Chrome <Settings size={14} />
            </a>
            <a
              href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-4 rounded-xl text-sm font-bold border border-amber-100 hover:border-black transition-colors flex justify-between items-center"
            >
              Apple Safari <Settings size={14} />
            </a>
            <a
              href="https://support.mozilla.org/it/kb/gestione-cookie"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-4 rounded-xl text-sm font-bold border border-amber-100 hover:border-black transition-colors flex justify-between items-center"
            >
              Mozilla Firefox <Settings size={14} />
            </a>
          </div>
        </section>

        {/* FOOTER INFO */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm font-medium mb-4">
            Per maggiori informazioni sul trattamento dei dati personali,
            consulta la nostra:
          </p>
          <Link href="/privacy">
            <button className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all">
              Privacy Policy <Info size={14} />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
