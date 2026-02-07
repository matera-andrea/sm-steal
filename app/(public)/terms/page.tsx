/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  Gavel,
  ShoppingBag,
  Truck,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            Termini & <span className="text-amber-400">Condizioni.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl">
            Le regole del gioco. Leggi attentamente le condizioni che regolano
            l'acquisto dei nostri prodotti.
          </p>
          <p className="text-gray-500 text-sm mt-4 font-mono">
            Ultimo aggiornamento: {currentDate}
          </p>
        </div>
      </section>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-6 relative z-20 -mt-20 space-y-8">
        {/* INTRO CARD */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Scale size={24} />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Premessa
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed font-medium">
            Il sito <strong>SM.STEAL</strong> è di proprietà di{" "}
            <strong>Samuele Matera</strong> (di seguito "Venditore"). L'accesso
            e l'uso del sito, così come l'acquisto dei prodotti, presuppongono
            la lettura, la conoscenza e l'accettazione di queste Condizioni
            Generali di Vendita.
          </p>
        </div>

        {/* ARTICLES SECTION */}
        <div className="space-y-8">
          {/* ART 1: VENDITORE */}
          <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">
              1. Identificazione del Venditore
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-gray-700 text-sm space-y-2 font-mono">
              <p>
                <strong>Ditta / Titolare:</strong> Samuele Matera
              </p>
              <p>
                <strong>Sede Legale:</strong> Via Saffo 1, Andria (BT)
              </p>
              <p>
                <strong>P.IVA:</strong> [INSERISCI P.IVA]
              </p>
              <p>
                <strong>Email:</strong> info@smsteal.com
              </p>
            </div>
          </section>

          {/* ART 2: PRODOTTI */}
          <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-amber-500" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                2. Prodotti e Autenticità
              </h3>
            </div>
            <ul className="list-disc pl-5 space-y-3 text-gray-600 font-medium">
              <li>
                <strong>Autenticità:</strong> SM.STEAL garantisce che tutti i
                prodotti venduti sono 100% originali e autentici. Ogni articolo
                viene sottoposto a rigorosi controlli (Legit Check) prima della
                vendita.
              </li>
              <li>
                <strong>Stato d'uso:</strong> I prodotti possono essere "Nuovi"
                (Deadstock) o "Usati" (Pre-Loved). Lo stato di conservazione è
                chiaramente indicato nella scheda prodotto.
              </li>
              <li>
                <strong>Immagini:</strong> Le immagini dei prodotti usati sono
                reali e rappresentative dello stato attuale. Per i prodotti
                nuovi, potrebbero essere utilizzate immagini di repertorio.
              </li>
            </ul>
          </section>

          {/* ART 3: PROCEDURA */}
          <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="text-amber-500" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                3. Procedura di Acquisto
              </h3>
            </div>
            <div className="prose prose-p:text-gray-600 prose-p:font-medium max-w-none">
              <p>
                Il sito funge da catalogo online. La finalizzazione del
                contratto di vendita avviene tramite contatto diretto (WhatsApp
                o Email).
              </p>
              <ol>
                <li>
                  Il Cliente visualizza il prodotto e clicca su "Acquista su
                  WhatsApp".
                </li>
                <li>
                  Il Cliente conferma la disponibilità e il prezzo con il
                  Venditore in chat.
                </li>
                <li>
                  Il contratto si intende concluso nel momento in cui il
                  Venditore riceve il pagamento del prezzo concordato.
                </li>
              </ol>
            </div>
          </section>

          {/* ART 4: PREZZI E PAGAMENTI */}
          <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">
              4. Prezzi e Pagamenti
            </h3>
            <p className="text-gray-600 font-medium mb-4">
              I prezzi indicati sul sito sono espressi in Euro (€) e si
              intendono comprensivi di IVA (se applicabile in base al regime
              fiscale, es. Regime del Margine per beni usati). I costi di
              spedizione non sono inclusi nel prezzo del prodotto salvo diversa
              indicazione.
            </p>
            <p className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">
              Metodi accettati:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm font-bold">
                Bonifico Bancario
              </li>
              <li className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm font-bold">
                PayPal (Beni e Servizi)
              </li>
              <li className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm font-bold">
                Carte (via Stripe Link)
              </li>
            </ul>
          </section>

          {/* ART 5: SPEDIZIONI */}
          <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="text-amber-500" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                5. Spedizioni
              </h3>
            </div>
            <p className="text-gray-600 font-medium leading-relaxed">
              Le spedizioni vengono effettuate tramite corriere espresso (DHL,
              UPS, Bartolini). I tempi di consegna sono indicativamente di 24-48
              ore lavorative dalla spedizione. Il Venditore non è responsabile
              per ritardi dovuti al corriere o cause di forza maggiore, tuttavia
              forniamo assistenza completa in caso di smarrimento del pacco
              (spedizioni assicurate su richiesta).
            </p>
          </section>

          {/* ART 6: RESI E RIMBORSI (Critico) */}
          <section className="bg-amber-50 p-8 md:p-10 rounded-[2rem] border-2 border-amber-200/50">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-600" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-amber-900">
                6. Diritto di Recesso e Resi
              </h3>
            </div>
            <div className="text-gray-800 font-medium space-y-4 text-sm leading-relaxed">
              <p>
                Data la natura dei beni (prodotti da collezione, edizioni
                limitate e beni usati "visti e piaciuti"),
                <strong>
                  {" "}
                  SM.STEAL accetta richieste di reso esclusivamente nelle
                  seguenti circostanze:
                </strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Il prodotto ricevuto non corrisponde alla descrizione (es.
                  taglia errata, modello errato).
                </li>
                <li>
                  Il prodotto presenta difetti gravi non segnalati nelle foto o
                  nella descrizione (autenticità fallita).
                </li>
              </ul>
              <p>
                Non si accettano resi per "ripensamento" o "taglia errata
                ordinata dal cliente" una volta che il prodotto è stato spedito,
                salvo diversi accordi presi esplicitamente in fase di trattativa
                su WhatsApp.
                <br />
                <br />
                Eventuali resi autorizzati devono essere rispediti nelle
                medesime condizioni: box originale intatto, accessori inclusi.
              </p>
            </div>
          </section>

          {/* ART 7: LEGGE APPLICABILE */}
          <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="text-gray-400" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                7. Legge Applicabile e Foro
              </h3>
            </div>
            <p className="text-gray-600 font-medium">
              Le presenti Condizioni Generali di Vendita sono regolate dalla
              legge Italiana. Per qualsiasi controversia relativa alla validità,
              interpretazione o esecuzione del contratto, la competenza
              territoriale è del giudice del luogo di residenza o di domicilio
              del Consumatore, se ubicati nel territorio dello Stato.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
