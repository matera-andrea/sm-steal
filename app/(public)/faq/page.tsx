// app/faq/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  MessageCircleQuestion,
} from "lucide-react";

// --- TIPI ---
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  icon: React.ReactNode;
  items: FaqItem[];
}

// --- DATI FAQ ---
const faqCategories: FaqCategory[] = [
  {
    title: "Ritiro a Mano (Local Pickup)",
    icon: <MapPin className="text-amber-500" size={24} />,
    items: [
      {
        question: "Come funziona il ritiro a mano?",
        answer:
          "Se ti trovi nelle zone di Bari, BAT o Foggia, possiamo organizzare uno scambio a mano. Durante l'acquisto su WhatsApp, specifica che sei di zona. Concorderemo insieme un luogo e un orario comodo per entrambi. Questo ti permette di risparmiare le spese di spedizione e vedere il prodotto dal vivo prima del ritiro finale.",
      },
      {
        question: "Devo pagare prima del ritiro?",
        answer:
          "Generalmente preferiamo ricevere il pagamento (o un acconto) digitalmente per bloccare il prodotto ed evitare appuntamenti a vuoto. Tuttavia, possiamo valutare il pagamento in contanti al momento dello scambio. Scrivici per concordare i dettagli.",
      },
    ],
  },
  {
    title: "Spedizioni, Resi e Rimborsi",
    icon: <Truck className="text-amber-500" size={24} />,
    items: [
      {
        question: "Quanto costa e quanto impiega la spedizione?",
        answer:
          "Spediamo in tutta Italia tramite corriere espresso tracciato (DHL, UPS o Bartolini). La consegna avviene solitamente in 24/48 ore lavorative dal momento della spedizione. Il costo standard è di 10€, ma è spesso gratuito per ordini superiori a una certa cifra o durante promozioni speciali.",
      },
      {
        question: "Posso effettuare un reso?",
        answer:
          "Trattando articoli da collezione e limitati (spesso in conto vendita), accettiamo resi solo in caso di errore nostro (es. taglia inviata sbagliata) o se il prodotto presenta difetti non segnalati. Non accettiamo resi per 'cambio idea' o 'taglia errata ordinata dal cliente'. Ti consigliamo di chiederci tutte le misure in cm su WhatsApp prima di acquistare.",
      },
      {
        question: "Cosa succede se il pacco viene smarrito?",
        answer:
          "Tutte le nostre spedizioni sono tracciate. Nel raro caso di smarrimento da parte del corriere, ci occuperemo noi di aprire la pratica di reclamo e garantiremo il rimborso o la sostituzione dell'articolo (se disponibile).",
      },
    ],
  },
  {
    title: "Pagamenti",
    icon: <CreditCard className="text-amber-500" size={24} />,
    items: [
      {
        question: "Quali metodi di pagamento accettate?",
        answer:
          "Accettiamo Bonifico Bancario Istantaneo e PayPal. Per PayPal, consigliamo l'opzione 'Beni e Servizi' che offre la protezione acquisti al cliente (con una piccola commissione a carico dell'acquirente). Accettiamo anche carte tramite link di pagamento sicuro Stripe se richiesto.",
      },
      {
        question: "È possibile pagare a rate?",
        answer:
          "Al momento non offriamo piani rateali diretti (come Klarna) tramite la vendita WhatsApp. Stiamo lavorando per integrare queste soluzioni nel prossimo futuro.",
      },
    ],
  },
  {
    title: "Autenticità e Prodotti",
    icon: <ShieldCheck className="text-amber-500" size={24} />,
    items: [
      {
        question: "Le scarpe sono originali?",
        answer:
          "Assolutamente sì. 100% Legit. Ogni singolo paio viene ispezionato manualmente dal nostro team di esperti prima di essere messo in vendita. Controlliamo cuciture, materiali, etichette, box e odore. Non trattiamo repliche, factory flaws non segnalati o prodotti dubbi. La tua sicurezza è il nostro business.",
      },
      {
        question: "Le scarpe sono nuove o usate?",
        answer:
          "Vendiamo sia prodotti 'Deadstock' (Nuovi, mai indossati, con box originale) che 'Pre-Loved' (Usati). Lo stato è sempre chiaramente indicato nell'annuncio: NEW, LIKE NEW, VERY GOOD, etc. Per i prodotti usati, forniamo foto dettagliate di ogni imperfezione su richiesta.",
      },
    ],
  },
];

// --- COMPONENTE ACCORDION ITEM ---
function AccordionItem({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-lg font-bold group-hover:text-amber-600 transition-colors pr-8">
          {item.question}
        </span>
        <div
          className={`p-2 rounded-full transition-colors ${
            isOpen
              ? "bg-black text-white"
              : "bg-gray-50 text-black group-hover:bg-amber-100"
          }`}
        >
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-500 font-medium leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="bg-white min-h-screen text-black pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-black text-white pt-32 pb-24 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        {/* Background noise/texture opzionale */}
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
            Domande <br />
            <span className="text-amber-400">Frequenti.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-xl mx-auto mt-6">
            Tutto quello che devi sapere su spedizioni, ritiri e autenticità.
            Trasparenza totale, zero sorprese.
          </p>
        </div>
      </section>

      {/* --- FAQ LIST --- */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-20">
        {faqCategories.map((category, index) => (
          <div
            key={index}
            className="animate-in fade-in slide-in-from-bottom-8 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                {category.icon}
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                {category.title}
              </h2>
            </div>

            {/* Questions Accordion */}
            <div className="bg-white rounded-[2rem] border-2 border-gray-50 px-8 shadow-sm">
              {category.items.map((item, i) => (
                <AccordionItem key={i} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- STILL HAVE QUESTIONS CTA --- */}
      <section className="max-w-3xl mx-auto px-6 text-center">
        <div className="bg-amber-50 rounded-[3rem] p-12 border border-amber-100">
          <MessageCircleQuestion
            size={48}
            className="mx-auto text-amber-500 mb-6"
          />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
            Non hai trovato la risposta?
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Nessun problema. Il nostro team è disponibile su WhatsApp per
            chiarire ogni dubbio.
          </p>
          <Link href="/contact-us">
            <button className="bg-black text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-400 hover:text-black transition-all shadow-xl hover:shadow-2xl">
              Contattaci Ora
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
