// app/about/page.tsx

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, PackageCheck, Zap, ArrowRight } from "lucide-react";

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

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen text-black">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[60vh] bg-black overflow-hidden flex items-center justify-center">
        {/* Immagine di sfondo scura/sfumata */}
        <div className="absolute inset-0 opacity-40">
          {/* Placeholder img */}
          <Image
            src="/about-hero.jpg"
            alt="Sneaker Wall"
            fill
            className="object-cover grayscale"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">
            More Than <br />
            <span className="text-amber-400">Just Hype.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Siamo nati dalla passione per la cultura sneaker. La nostra missione
            è portare i grail più esclusivi ai piedi di chi li apprezza davvero.
          </p>
        </div>
      </section>

      {/* --- LA NOSTRA STORIA --- */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              La Nostra Storia
            </h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
              Dal garage al <br />
              mondo intero.
            </h3>
            <div className="space-y-4 text-gray-600 font-medium leading-relaxed">
              <p>
                Tutto è iniziato nel 2018. Eravamo stanchi di vedere marketplace
                impersonali, costi nascosti e dubbi sull&apos;autenticità. Volevamo
                creare un posto dove comprare sneakers fosse sicuro, veloce ed
                emozionante.
              </p>
              <p>
                Quello che è partito come un piccolo progetto di reselling tra
                amici è diventato
                <strong> SM.STEAL</strong>. Oggi gestiamo migliaia di paia, ma
                la filosofia rimane la stessa: trattiamo ogni cliente come se
                fosse uno di noi.
              </p>
            </div>

            <div className="pt-4">
              <Image
                src="/signature.png" // Facoltativo: firma del founder
                alt="Founder Signature"
                width={150}
                height={50}
                className="opacity-50"
              />
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100">
            <Image
              src="/team-working.jpg" // Sostituisci con foto del team
              alt="Our Team"
              fill
              className="object-cover"
            />
            {/* Badge flottante */}
            <div className="absolute bottom-8 left-8 bg-white p-6 rounded-3xl shadow-2xl max-w-xs">
              <p className="text-4xl font-black text-amber-500">10k+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                Paia vendute in tutto il mondo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- I NOSTRI VALORI --- */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Valore 1 */}
            <div className="space-y-4">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-black uppercase italic tracking-tight">
                100% Legit Check.
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Niente fake, niente repliche. Ogni singolo paio passa attraverso
                un rigoroso processo di autenticazione a mano da parte del
                nostro team di esperti.
              </p>
            </div>

            {/* Valore 2 */}
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center mb-6">
                <PackageCheck size={32} />
              </div>
              <h4 className="text-xl font-black uppercase italic tracking-tight">
                Deadstock Condition.
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Garantiamo che ogni prodotto venduto come &quot;Nuovo&quot; sia intonso,
                mai indossato e completo di box originale e accessori. La
                perfezione è il nostro standard.
              </p>
            </div>

            {/* Valore 3 */}
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white border-2 border-black text-black rounded-2xl flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h4 className="text-xl font-black uppercase italic tracking-tight">
                Spedizioni Flash.
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Odiamo aspettare quanto te. Il 90% dei nostri ordini viene evaso
                entro 24 ore lavorative con spedizione tracciata express in
                tutta Europa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL HUB --- */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">
            Community
          </h2>
          <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Join the Movement.
          </h3>
          <p className="text-gray-500 max-w-xl mx-auto">
            Seguici per drop esclusivi, restock a sorpresa e contenuti
            behind-the-scenes. Siamo più attivi su Instagram che via mail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Instagram Card */}
          <a
            href="https://instagram.com/sm.steal"
            target="_blank"
            rel="noreferrer"
            className="group p-8 rounded-[2rem] border-2 border-gray-100 hover:border-black transition-all hover:bg-black hover:text-white flex flex-col items-center gap-6"
          >
            <div className="p-4 bg-gray-50 rounded-full group-hover:bg-white/10 transition-colors">
              <InstagramIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="font-black uppercase text-xl italic">Instagram</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                @sm.steal
              </p>
            </div>
            <div className="w-full py-3 rounded-full border border-gray-200 group-hover:border-white/20 text-xs font-black uppercase tracking-widest mt-auto">
              Follow Us
            </div>
          </a>

          {/* X (Twitter) Card */}
          <a
            href="https://x.com/sm.steal"
            target="_blank"
            rel="noreferrer"
            className="group p-8 rounded-[2rem] border-2 border-gray-100 hover:border-black transition-all hover:bg-black hover:text-white flex flex-col items-center gap-6"
          >
            <div className="p-4 bg-gray-50 rounded-full group-hover:bg-white/10 transition-colors">
              <XIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="font-black uppercase text-xl italic">X / Twitter</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                Updates & Leaks
              </p>
            </div>
            <div className="w-full py-3 rounded-full border border-gray-200 group-hover:border-white/20 text-xs font-black uppercase tracking-widest mt-auto">
              Follow Us
            </div>
          </a>

          {/* Youtube Card */}
          <a
            href="https://youtube.com/@sm.steal"
            target="_blank"
            rel="noreferrer"
            className="group p-8 rounded-[2rem] border-2 border-gray-100 hover:border-black transition-all hover:bg-black hover:text-white flex flex-col items-center gap-6"
          >
            <div className="p-4 bg-gray-50 rounded-full group-hover:bg-white/10 transition-colors">
              <YoutubeIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="font-black uppercase text-xl italic">YouTube</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                Reviews & Unboxing
              </p>
            </div>
            <div className="w-full py-3 rounded-full border border-gray-200 group-hover:border-white/20 text-xs font-black uppercase tracking-widest mt-auto">
              Subscribe
            </div>
          </a>
        </div>
      </section>

      {/* --- CTA FINALE --- */}
      <section className="bg-amber-400 py-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-black mb-8">
            Pronto a coppare?
          </h2>
          <Link href="/shop">
            <button className="bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl flex items-center gap-3 mx-auto">
              Vai allo Shop <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
