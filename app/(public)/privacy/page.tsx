/* eslint-disable react/no-unescaped-entities */
// app/privacy/page.tsx
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  FileText,
  Building2,
  Database,
  Server,
  CheckCircle2,
  Heart, // 1. Aggiunta icona Heart
} from "lucide-react";

export default function PrivacyPolicyPage() {
  // Data dinamica
  const currentDate = new Date().toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-gray-50 min-h-screen text-black pb-20 font-sans">
      {/* --- HERO HEADER --- */}
      <section className="bg-black text-white pt-32 pb-32 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Texture di sfondo opzionale */}
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={12} /> Torna alla Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
            Privacy <span className="text-amber-400">Policy.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl">
            La tua fiducia è tutto. Ecco come proteggiamo i tuoi dati in modo
            trasparente e sicuro.
          </p>
          <p className="text-gray-500 text-sm mt-4 font-mono">
            Ultimo aggiornamento: {currentDate}
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-6 relative z-20 -mt-20 space-y-8">
        {/* INTRO CARD */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
          <p className="text-gray-700 text-lg leading-relaxed font-medium">
            Benvenuto su <strong>SM.STEAL</strong>. In questa pagina descriviamo
            in modo chiaro come raccogliamo, utilizziamo e proteggiamo i tuoi
            dati personali in conformità con il Regolamento UE 2016/679 (GDPR).
            Niente legalese complesso, solo chiarezza.
          </p>
        </div>

        {/* SEZIONE 1: TITOLARE */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              1. Titolare del Trattamento
            </h2>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-gray-700 space-y-2">
            <p>
              <strong>Samuele Matera</strong>
            </p>
            <p>Sede legale: Via Saffo 1, Andria (BT)</p>
            <p>
              P.IVA / C.F.:{" "}
              <span className="bg-yellow-100 px-2 py-0.5 rounded">
                [INSERISCI P.IVA QUI]
              </span>
            </p>
            <p>
              Email privacy:{" "}
              <a
                href="mailto:info@smsteal.com"
                className="text-amber-600 hover:underline font-bold"
              >
                info@smsteal.com
              </a>
            </p>
          </div>
        </section>

        {/* SEZIONE 2 & 3: DATI E FINALITÀ (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dati Raccolti */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Database size={24} />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                2. Quali dati raccogliamo
              </h2>
            </div>
            <ul className="space-y-4 text-gray-600 text-sm font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle2
                  className="text-amber-500 shrink-0 mt-0.5"
                  size={18}
                />
                <span>
                  <strong>Navigazione (Anonimi):</strong> Vercel Analytics per
                  performance e velocità. Non identificano l'utente.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2
                  className="text-amber-500 shrink-0 mt-0.5"
                  size={18}
                />
                <span>
                  <strong>Account (Opzionale):</strong> Email, nome e foto
                  profilo se ti registri tramite Clerk.
                </span>
              </li>
              {/* --- UPDATE: WISHLIST --- */}
              <li className="flex items-start gap-3">
                <Heart className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <span>
                  <strong>Wishlist & Preferenze:</strong> Memorizziamo i
                  prodotti che aggiungi ai preferiti collegandoli al tuo ID
                  utente per permetterti di ritrovarli.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2
                  className="text-amber-500 shrink-0 mt-0.5"
                  size={18}
                />
                <span>
                  <strong>Acquisti (WhatsApp):</strong> Dati forniti
                  volontariamente in chat (nome, indirizzo, telefono) per la
                  spedizione.
                </span>
              </li>
            </ul>
          </section>

          {/* Finalità */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <FileText size={24} />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                3. Perché li trattiamo
              </h2>
            </div>
            <ul className="space-y-4 text-gray-600 text-sm font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle2
                  className="text-green-500 shrink-0 mt-0.5"
                  size={18}
                />
                <span>Erogazione del servizio e area personale.</span>
              </li>
              {/* --- UPDATE: WISHLIST --- */}
              <li className="flex items-start gap-3">
                <CheckCircle2
                  className="text-green-500 shrink-0 mt-0.5"
                  size={18}
                />
                <span>
                  Gestione della Wishlist personale e prodotti salvati.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2
                  className="text-green-500 shrink-0 mt-0.5"
                  size={18}
                />
                <span>Gestione ordini, spedizioni e fatturazione legale.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2
                  className="text-green-500 shrink-0 mt-0.5"
                  size={18}
                />
                <span>Assistenza clienti via WhatsApp/Email.</span>
              </li>
              <li className="bg-gray-100 p-3 rounded-lg text-xs text-gray-500">
                <strong>Nota:</strong> Non usiamo la tua email per newsletter
                marketing senza consenso esplicito.
              </li>
            </ul>
          </section>
        </div>

        {/* SEZIONE TECNICA (Base giuridica, terze parti, etc.) */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100 prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:text-lg prose-p:text-gray-600 prose-p:text-sm prose-li:text-sm prose-li:text-gray-600 prose-strong:text-black">
          <div className="flex items-center gap-4 mb-8 not-prose">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Server size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter m-0">
              Dettagli Tecnici e Legali
            </h2>
          </div>

          <h3>4. Base Giuridica</h3>
          <p>
            Trattiamo i tuoi dati per l'
            <strong>esecuzione del contratto</strong> (ordini, registrazione,
            salvataggio preferiti), per <strong>obbligo legale</strong>{" "}
            (fatturazione) e per <strong>legittimo interesse</strong> (sicurezza
            e statistica anonima).
          </p>

          <h3>5. Destinatari (Partner Tecnici)</h3>
          <p>
            Non vendiamo i tuoi dati. Li condividiamo solo con partner necessari
            al servizio:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc. & Clerk:</strong> Hosting, analytics e
              autenticazione (Server UE/USA).
            </li>
            <li>
              <strong>Provider Database (Prisma):</strong> Archiviazione sicura
              dei dati (incluse le Wishlist).
            </li>
            <li>
              <strong>Meta (WhatsApp):</strong> Piattaforma usata per la
              comunicazione di vendita.
            </li>
            <li>
              <strong>Corrieri:</strong> Solo i dati necessari alla consegna.
            </li>
          </ul>

          <h3>6. Trasferimento Extra UE</h3>
          <p>
            Alcuni fornitori (es. Vercel, Clerk) sono negli USA. Il
            trasferimento avviene secondo il <em>Data Privacy Framework</em> o
            Clausole Contrattuali Standard (SCC) approvate dalla UE.
          </p>

          <h3>7. Conservazione</h3>
          <p>
            Dati fiscali per 10 anni (legge). Dati account e wishlist finché
            l'account è attivo. Dati analitici in forma anonima.
          </p>
        </section>

        {/* SEZIONE 8: I TUOI DIRITTI */}
        <section className="bg-amber-50 p-8 md:p-10 rounded-[2rem] border-2 border-amber-200/50 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-400 text-black rounded-xl shadow-sm">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
              8. I tuoi Diritti GDPR
            </h2>
          </div>

          <p className="text-gray-700 mb-6 font-medium">
            Hai il controllo totale sui tuoi dati. Puoi chiedere in qualsiasi
            momento:
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            <li className="bg-white p-4 rounded-xl border border-amber-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <Eye size={20} className="text-amber-500 shrink-0" />
              <span className="text-sm font-bold">
                Accesso e copia dei dati
              </span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-amber-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <FileText size={20} className="text-amber-500 shrink-0" />
              <span className="text-sm font-bold">Rettifica dati errati</span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-amber-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <Shield size={20} className="text-red-500 shrink-0" />
              <span className="text-sm font-bold">Cancellazione (Oblio)</span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-amber-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <Lock size={20} className="text-amber-500 shrink-0" />
              <span className="text-sm font-bold">
                Limitazione al trattamento
              </span>
            </li>
          </ul>
          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-gray-600 mb-2">
              Per esercitare i tuoi diritti, scrivi a:
            </p>
            <a
              href="mailto:info@smsteal.com"
              className="text-lg font-black text-amber-600 hover:underline"
            >
              info@smsteal.com
            </a>
          </div>
        </section>

        {/* COOKIE SHORT INFO */}
        <div className="text-center text-gray-400 text-xs font-medium py-6">
          <p>
            Cookie Policy: Usiamo solo cookie tecnici (Clerk) e analitici
            anonimi (Vercel). Niente profilazione.
          </p>
        </div>
      </div>
    </main>
  );
}
