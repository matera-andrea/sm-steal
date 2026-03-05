/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  ShieldCheck,
  Info,
  Settings,
  Chrome,
  Globe,
  Compass,
  Layout,
  FileText,
  Lock,
  Eye,
  Scale,
  Shield,
  Building2,
} from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <main className="bg-gray-50 min-h-screen text-black pb-20 font-sans">
      {/* --- HERO HEADER --- */}
      <section className="bg-black text-white pt-32 pb-32 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={12} /> Torna alla Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">
            Informativa estesa sull&apos;uso dei <span className="text-amber-400">cookie.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl">
            Gestiamo i tuoi dati tecnici con la massima trasparenza e sicurezza.
          </p>
        </div>
      </section>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto px-6 relative z-20 -mt-20 space-y-8">
        
        {/* PREMESSA */}
        <section className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Premessa
            </h2>
          </div>
          <div className="text-gray-700 space-y-4 leading-relaxed font-medium">
            <p>
              La presente cookie policy è resa per il sito{" "}
              <a href="https://www.heatlab.it" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                www.heatlab.it
              </a>{" "}
              (Sito). Il documento è stato redatto tenendo conto di quanto indicato dal Regolamento europeo 679/2016 in materia di protezione dei dati personali (GDPR), dal Codice della Privacy (D. Lgs. 30 giugno 2003 n. 196) e delle Linee Guida del Garante Privacy (sopratutto le Linee Guida sull&apos;uso dei cookie emesse il 10 luglio 2021).
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <p><strong>Titolare del Trattamento:</strong> Samuele Francesco Matera</p>
            </div>
          </div>
        </section>

        {/* INFORMAZIONI GENERALI */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Info size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Informazioni Generali
            </h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="text-amber-500" size={20} />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  Che cosa sono i cookie e a cosa servono
                </h3>
              </div>
              <div className="text-gray-600 text-sm font-medium leading-relaxed space-y-4">
                <p>
                  Un cookie è un file di testo che un sito web visitato dall’utente invia al suo terminale (computer, dispositivo mobile quale smartphone o tablet), dove viene memorizzato per essere poi ritrasmesso a tale sito in occasione di una visita successiva al sito medesimo. <strong>Ai fini della presente informativa, il termine &quot;cookie&quot; include anche tecnologie e strumenti traccianti similari (come Local Storage, Session Storage e meccanismi di caching locale) utilizzati per memorizzare o recuperare informazioni sul dispositivo dell&apos;utente.</strong>
                </p>
                <p>I cookie vengono tra loro distinti:</p>
                <ul className="space-y-3 list-none">
                  <li className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>in base al soggetto che li installa, a seconda che si tratti dello stesso gestore del sito visitato (c.d. &quot;cookie di prima parte&quot;) ovvero di un soggetto diverso (c.d. &quot;cookie di terza parte&quot;);</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>in base alla finalità di ciascun cookie: alcuni cookie permettono una migliore navigazione, memorizzando alcune scelte dell&apos;utente, ad esempio la lingua (c.d. &quot;cookie tecnici&quot;), altri cookie consentono di monitorare la navigazione dell&apos;utente anche allo scopo di inviare pubblicità e/od offrire servizi in linea con sue preferenze (c.d. &quot;cookie di profilazione&quot;).</span>
                  </li>
                </ul>
                <p>Solo i cookie di profilazione richiedono il consenso preventivo dell&apos;utente al loro utilizzo.</p>
                <p>Il Titolare del Trattamento è responsabile esclusivamente dei cookie di prima parte dallo stesso installati sul Sito.</p>
                <p>Alla sezione &quot;Cookie tecnici di prima parte&quot; Lei può visionare le tipologie di cookie tecnici di prima parte rilasciati dal Sito.</p>
                <p>La gestione dei cookie di profilazione è descritta alla sezione &quot;Cookie di profilazione di terza parte&quot;.</p>
              </div>
            </div>

            {/* BROWSER SETTINGS */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-gray-500" size={20} />
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  Gestione tramite Browser
                </h3>
              </div>
              <p className="text-gray-600 text-xs font-bold mb-6 uppercase tracking-widest">
                Ad ogni modo, Lei può abilitare/disabilitare i cookie anche attraverso le opzioni del Suo browser:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* IE */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Globe size={16} />
                    <span className="font-black uppercase italic text-sm">Internet Explorer</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Accedere al menu Strumenti, quindi a Opzioni Internet.<br />
                    Cliccare su Privacy, quindi su Avanzate.<br />
                    Nella finestra Cookie, selezionare le proprie preferenze.
                  </p>
                </div>

                {/* CHROME */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <Chrome size={16} />
                    <span className="font-black uppercase italic text-sm">Google Chrome</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Cliccare sul menu di Chrome, corrispondente al pulsante in alto a destra.<br />
                    Selezionare Impostazioni, quindi cliccare su Avanzate.<br />
                    Nella sezione Privacy e sicurezza, cliccare sul pulsante Impostazioni contenuti.<br />
                    Selezionare le opzioni preferite nella sezione Cookie.
                  </p>
                </div>

                {/* FIREFOX */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Layout size={16} />
                    <span className="font-black uppercase italic text-sm">Firefox</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Cliccare su Strumenti, quindi sul menu Opzioni.<br />
                    Cliccare sulle impostazioni Privacy e sicurezza.<br />
                    Selezionare Utilizza impostazioni personalizzate per la cronologia.<br />
                    Selezionare le opzioni preferite nella sezione Accetta cookie e dati dai siti web.
                  </p>
                </div>

                {/* SAFARI */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-cyan-600">
                    <Compass size={16} />
                    <span className="font-black uppercase italic text-sm">Safari</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Cliccare su Safari, quindi su Preferenze.<br />
                    Cliccare sulla sezione Privacy e sicurezza.<br />
                    Andare su Blocca cookie e selezionare le opzioni preferite.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COOKIE TECNICI */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Cookie di prima parte e tecnici
            </h2>
          </div>
          <div className="text-gray-600 text-sm font-medium leading-relaxed space-y-4">
            <p>
              Il Sito utilizza cookie di prima parte e tecnici necessari per il suo corretto funzionamento <strong>e per l&apos;erogazione sicura dei servizi richiesti (come l&apos;autenticazione). Rientrano in questa categoria i cookie per il salvataggio delle Sue preferenze di consenso (es. cookie &quot;lb_cs&quot; di LegalBlink), nonché i cookie e i dati salvati nel Local Storage dal provider tecnico di autenticazione Clerk (es. &quot;__session&quot;, &quot;__client_uat&quot;, &quot;_clerk_db_store&quot;), che risultano indispensabili per mantenere attiva e protetta la sessione dell&apos;utente registrato e memorizzarne lo stato di accesso.</strong> Non è possibile negare il rilascio di questi cookie <strong>(o strumenti analoghi di memorizzazione locale), in quanto strettamente necessari all&apos;operatività del Sito.</strong>
            </p>
          </div>
        </section>

        {/* DIRITTI */}
        <section className="bg-amber-50 p-8 md:p-10 rounded-[2rem] border-2 border-amber-200/50 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-400 text-black rounded-xl shadow-sm">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
              I Suoi diritti
            </h2>
          </div>

          <p className="text-gray-700 mb-6 font-medium">
            Ai sensi dell’art. 13 del GDPR, il Titolare del Trattamento La informa che Lei ha diritto di:
          </p>

          <ul className="space-y-4 not-prose">
            <li className="bg-white p-5 rounded-xl border border-amber-100 flex items-start gap-4 shadow-sm">
              <Eye size={20} className="text-amber-500 shrink-0 mt-1" />
              <span className="text-sm font-bold text-gray-800">
                chiedere al Titolare del Trattamento l&apos;accesso ai Suoi dati personali e la rettifica o la cancellazione degli stessi o la limitazione del trattamento che La riguardano o di opporsi al loro trattamento, oltre al diritto alla portabilità dei dati
              </span>
            </li>
            <li className="bg-white p-5 rounded-xl border border-amber-100 flex items-start gap-4 shadow-sm">
              <Lock size={20} className="text-amber-500 shrink-0 mt-1" />
              <span className="text-sm font-bold text-gray-800">
                revocare il consenso in qualsiasi momento senza pregiudicare la liceità del trattamento basata sul consenso prestato prima della revoca
              </span>
            </li>
            <li className="bg-white p-5 rounded-xl border border-amber-100 flex items-start gap-4 shadow-sm">
              <Scale size={20} className="text-amber-500 shrink-0 mt-1" />
              <span className="text-sm font-bold text-gray-800">
                proporre reclamo a un&apos;autorità di controllo (es.: il Garante per la protezione dei dati personali).
              </span>
            </li>
          </ul>
          
          <div className="mt-8 bg-white/50 p-6 rounded-2xl text-center">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Esercizio dei diritti</p>
            <p className="text-sm font-medium text-gray-700">
              I diritti di cui sopra potranno essere esercitati con richiesta rivolta senza formalità ai contatti indicati in Premessa.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4 py-10 border-t border-gray-200">
          <Link href="/privacy">
            <button className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all shadow-lg">
              Privacy Policy <FileText size={14} />
            </button>
          </Link>
          <Link href="/terms">
            <button className="inline-flex items-center gap-2 bg-white text-black border border-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
              Termini di Servizio <Scale size={14} />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
