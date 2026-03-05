/* eslint-disable react/no-unescaped-entities */
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
  Heart,
  User,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Megaphone,
  Target,
  Share2,
  MapPin,
  FileUser,
  Calendar,
  Camera,
  Ban,
  Send,
  Scale,
  Info,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdateDate = "4 marzo 2026";

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
            Informativa sul trattamento dei <span className="text-amber-400">dati personali.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-2xl">
            La trasparenza al centro della nostra relazione con te.
          </p>
          <p className="text-gray-500 text-sm mt-4 font-mono">
            In vigore dal {lastUpdateDate}
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT CONTAINER --- */}
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
              La presente informativa tiene conto di quanto indicato dal Regolamento (UE) 2016/679 del Parlamento europeo e del Consiglio del 27 aprile 2016 (GDPR) e dal Codice della Privacy (D. Lgs 30 giugno 2003 n. 196). Il documento è stato redatto anche in base alle Linee Guida del Garante Privacy (soprattutto le Linee Guida di contrasto allo spam emesse dal Garante Privacy il 4 luglio 2013).
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2">
              <p><strong>Titolare del Trattamento:</strong> Samuele Francesco Matera</p>
              <p>
                <strong>Sito al quale si riferisce la presente privacy policy:</strong>{" "}
                <a href="https://www.heatlab.it" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  www.heatlab.it
                </a> (Sito).
              </p>
            </div>
            <p>
              Il Titolare del Trattamento non ha nominato un DPO (Data Protection Officer). Pertanto, Lei può inviare qualsiasi richiesta di informazioni direttamente al Titolare del Trattamento.
            </p>
          </div>
        </section>

        {/* INFORMAZIONI GENERALI INTRO */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Info size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Informazioni Generali
            </h2>
          </div>
          <div className="text-gray-600 space-y-4 text-sm font-medium leading-relaxed">
            <p>
              Il presente documento descrive come il Titolare del Trattamento tratta i Suoi dati personali conferiti sul Sito.
            </p>
            <p>
              Di seguito vengono descritti i principali trattamenti dei Suoi dati personali. Viene in particolare spiegata la base giuridica del trattamento, se il conferimento è obbligatorio e le conseguenze del mancato conferimento di dati personali. Per descrivere al meglio i Suoi diritti, qualora necessario, abbiamo specificato se e quando un determinato trattamento di dati personali non viene effettuato.
            </p>
          </div>
        </section>

        {/* REGISTRAZIONE */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <User size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Registrazione sul Sito
            </h3>
          </div>
          <div className="text-gray-600 text-sm font-medium leading-relaxed space-y-4">
            <p>
              Le informazioni e i dati richiesti in caso di registrazione verranno utilizzati per consentirLe sia di accedere all&apos;area riservata del Sito, sia di usufruire dei servizi on line offerti dal Titolare del Trattamento agli utenti registrati. La base giuridica del trattamento è la necessità del Titolare del Trattamento di eseguire misure precontrattuali adottate su richiesta dell&apos;interessato. Il conferimento dei dati è facoltativo. Tuttavia, il Suo eventuale rifiuto di conferire i dati comporterà l&apos;impossibilità di registrarsi sul Sito. <strong>La gestione tecnica dell&apos;identità, delle sessioni e dell&apos;autenticazione è demandata a un fornitore di servizi esterno specializzato (Clerk), che raccoglie e sincronizza i Suoi dati di accesso (come email e nome) per garantire un accesso sicuro.</strong> Sul Sito è possibile registrarsi utilizzando anche i servizi esterni. In questo caso i Suoi dati di registrazione saranno condivisi con le aziende di questi servizi esterni al solo fine di permettere la registrazione sul Sito. La base giuridica di questo trattamento è il legittimo interesse del Titolare del Trattamento a permettere la registrazione al Sito tramite servizi esterni. Il conferimento dei dati personali per questa finalità è meramente facoltativo. Il mancato assenso al trattamento dei dati comporterà però l&apos;impossibilità di registrarsi tramite servizi esterni. <strong>Si precisa che, a tutela dei diritti dell&apos;interessato, la cancellazione del proprio account comporta l&apos;immediata eliminazione automatizzata dei dati identificativi e delle preferenze salvate nei database del Sito.</strong>
            </p>
          </div>
        </section>

        {/* ACQUISTI */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Acquisti sul Sito
            </h3>
          </div>
          <div className="text-gray-600 text-sm font-medium leading-relaxed space-y-4">
            <p>
              <strong>Il Sito opera principalmente come catalogo B2C. Pertanto,</strong> i Suoi dati personali verranno trattati per permetterLe di <strong>inizializzare</strong> acquisti sul Sito. Nel caso di effettuazione di un ordine di acquisto online, <strong>si precisa che le transazioni non prevedono un pagamento diretto sul Sito, ma vengono finalizzate esternamente tramite il servizio di messaggistica WhatsApp.</strong> Per consentire la conclusione del contratto di acquisto e la corretta esecuzione delle operazioni connesse al medesimo (e, qualora necessario in base alla normativa di settore, per assolvere agli obblighi fiscali), <strong>i dati da Lei volontariamente comunicati in tale sede (es. nome completo, indirizzo di spedizione, numero di telefono) saranno trattati dal Titolare.</strong> Questo trattamento dei dati personali comprende anche la possibilità di inviare comunicazioni (es.: tracking, informazioni sull&apos;ordine e richiesta di rilascio di una recensione) tramite strumenti automatizzati quali email e/o sms e/o WhatsApp. La base giuridica del trattamento è l&apos;obbligo del Titolare del Trattamento di eseguire il contratto con l&apos;interessato oppure di adempiere ad obblighi di legge.
            </p>
            <p className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <strong>Per agevolare l&apos;esperienza di navigazione, il Sito tratta altresì i dati relativi alle Sue preferenze commerciali tramite la funzione &quot;Wishlist&quot;, associando gli articoli di Suo interesse al Suo profilo utente. La base giuridica di questo trattamento è la prestazione del servizio richiesto dall&apos;utente registrato.</strong>
            </p>
            <p>
              A prescindere da quanto sopra (e quindi dal Suo consenso), il Titolare del Trattamento potrà trattare i suoi dati finalità di c.d. &quot;soft-spam&quot;, disciplinato dall&apos;art. 130 del Codice della Privacy. Questo significa che limitatamente alla email da Lei fornita nel contesto di un acquisto tramite il Sito, il Titolare del Trattamento tratterà l&apos;email per consentire l&apos;offerta diretta da parte di prodotti/servizi analoghi, sempre che Lei non si opponga a tale trattamento nelle modalità previste dalla presente informativa. La base giuridica del trattamento è il legittimo interesse del Titolare del Trattamento ad inviare questo tipo di comunicazioni. Questo legittimo interesse può ritenersi equivalente all&apos;interesse dell&apos;interessato a ricevere comunicazioni di &quot;soft-spam&quot;. Il Titolare del Trattamento non tratta i dati dell&apos;utente per inviare email di &quot;reminder&quot; di acquisto di prodotti e/o servizi del Titolare stesso. Il Titolare non offre prodotti o servizi vietati ai minori di 18 anni. Di conseguenza, non è previsto alcun sistema specifico di verifica dell&apos;età, non essendovi contenuti soggetti a limitazioni di legge.
            </p>
          </div>
        </section>

        {/* RISPONDERE RICHIESTE */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Rispondere alle Sue richieste
            </h3>
          </div>
          <div className="text-gray-600 text-sm font-medium leading-relaxed space-y-4">
            <p>
              I Suoi dati verranno trattati per rispondere alle Sue richieste di informazioni. Il conferimento è facoltativo, ma il Suo rifiuto comporterà l&apos;impossibilità per il Titolare del Trattamento di rispondere alle Sue domande. La base giuridica del trattamento è il legittimo interesse del Titolare del Trattamento a dare seguito alle richieste dell&apos;utente. Questo legittimo interesse è equivalente all&apos;interesse dell&apos;utente a ricevere risposta alle comunicazioni inviate al Titolare del Trattamento. Se compili l&apos;apposito form presente sul Sito, il Titolare del Trattamento potrà utilizzare i dati personali per gestire la richiesta di preventivo e/o intervento. Il conferimento dei dati è facoltativo, ma in assenza di essi il Titolare non potrà evadere la richiesta. La base giuridica del trattamento è il legittimo interesse del Titolare del Trattamento a rispondere alle richieste inviate dagli utenti, un interesse che corrisponde a quello dell&apos;utente a ricevere una risposta. Il Titolare potrà inoltre trattare i dati personali per finalità di gestione delle richieste di assistenza (ticket). Anche in questo caso, la base giuridica è il legittimo interesse del Titolare a fornire riscontro, in linea con l&apos;interesse dell&apos;utente a ricevere supporto.
            </p>
          </div>
        </section>

        {/* SICUREZZA */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              Sicurezza, prevenzione frodi e funzionamento tecnico
            </h3>
          </div>
          <div className="text-gray-600 text-sm font-medium leading-relaxed space-y-4">
            <p>
              <strong>Al fine di garantire la sicurezza dell&apos;infrastruttura di rete, prevenire abusi informatici (es. attacchi DDoS) e gestire il limite di richieste contemporanee al server (rate-limiting), il Titolare tratta automaticamente alcuni dati tecnici di navigazione, tra cui l&apos;Indirizzo IP dell&apos;utente e i metadati della richiesta. Tali dati vengono analizzati ed elaborati temporaneamente tramite fornitori di servizi cloud specializzati. La base giuridica di questo trattamento è il legittimo interesse del Titolare del Trattamento alla tutela e alla sicurezza dei propri sistemi informatici, ritenuto prevalente in quanto necessario a garantire la disponibilità e l&apos;integrità del servizio offerto agli utenti.</strong>
            </p>
          </div>
        </section>

        {/* ALTRE FINALITÀ GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MARKETING */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                <Megaphone size={20} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Marketing generico</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              Il Titolare del Trattamento non Le invierà materiale pubblicitario e/o newsletter relativo a prodotti propri o di terzi.
            </p>
          </section>

          {/* PROFILAZIONE */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Profilazione</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              Il Titolare del Trattamento non effettua &quot;profilazione&quot; con i Suoi dati personali. Pertanto, non Le invierà materiale pubblicitario e/o newsletter relativi a prodotti propri o di terzi di Suo specifico interesse.
            </p>
          </section>

          {/* CESSIONE */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Share2 size={20} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Cessione dei dati</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              Per l&apos;invio di comunicazioni promozionali, previo Suo esplicito consenso, i Suoi dati personali potranno essere ceduti a &quot;terzi&quot;. La base giuridica del trattamento è il Suo consenso. Il conferimento dei dati personali per questa finalità è meramente facoltativo. Il mancato assenso alla cessione comporterà l&apos;impossibilità di cedere i Suoi dati personali a terzi per finalità di pubblicità.
            </p>
          </section>

          {/* GEOLOCALIZZAZIONE */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Geolocalizzazione</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              Il Sito non implementa strumenti di geolocalizzazione dell&apos;indirizzo IP dell&apos;utente.
            </p>
          </section>

          {/* CV */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <FileUser size={20} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Curriculum Vitae</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              Tramite il Sito non è possibile inviare curriculum vitae. Pertanto, i Suoi dati non verranno trattati per queste finalità.
            </p>
          </section>

          {/* PRENOTAZIONE */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Prenotazione appuntamenti</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              Sul Sito non sono attivi sistemi terzi di prenotazione di appuntamenti con il Titolare del Trattamento. Pertanto, i Suoi dati non verranno trattati per questa finalità. Ad ogni modo, Lei può sempre contattare il Titolare del Trattamento ai contatti indicati in epigrafe.
            </p>
          </section>

          {/* FOTO E VIDEO */}
          <section className="bg-white p-8 rounded-[2rem] shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <Camera size={20} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Fotografie e video</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium leading-relaxed">
              Il Titolare del Trattamento non chiede la pubblicazione di fotografie e/o video Lei ritraenti. Pertanto, i Suoi dati non verranno trattati per queste finalità.
            </p>
          </section>
        </div>

        {/* WEB SCRAPING */}
        <section className="bg-gray-900 text-white p-8 md:p-10 rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-500 text-white rounded-xl">
              <Ban size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Web scraping</h3>
          </div>
          <div className="text-gray-400 text-sm font-medium leading-relaxed space-y-4">
            <p>
              L&apos;uso di qualsiasi processo automatizzato o sistema per accedere, acquisire, copiare o monitorare qualsiasi parte del nostro sito web, incluse, ma non limitate a, tecniche di web scraping, crawling, o spidering, è espressamente vietato. Il Titolare del Trattamento si riserva di adottare tutte le misure necessarie, comprese azioni legali, per prevenire e perseguire qualsiasi attività di scraping non autorizzata. Utilizzando il Sito, l&apos;utente o qualsiasi terzo si impegna a non: (i) utilizzare sistemi automatizzati, come bot, scraper, o spider, per accedere o interagire con il Sito; (ii) raccogliere contenuti, dati o altre informazioni presenti sul Sito senza esplicita autorizzazione scritta; (iii) distribuire, visualizzare, pubblicare, o utilizzare in altro modo i contenuti acquisiti attraverso tecniche di scraping senza consenso. Qualsiasi violazione di questa clausola sarà considerata una violazione sostanziale dei termini di utilizzo del Sito e comporterà l&apos;adozione di provvedimenti appropriati, compresa la possibile sospensione dell&apos;accesso al sito e l&apos;avvio di azioni legali per tutelare gli interessi del Titolare del Trattamento.
            </p>
          </div>
        </section>

        {/* COMUNICAZIONE DATI */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Send size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Comunicazione dei dati personali</h3>
          </div>
          <div className="text-gray-600 text-sm font-medium leading-relaxed space-y-4">
            <p>
              Nell&apos;ambito della propria ordinaria attività, il Titolare del Trattamento può comunicare i Suoi dati personali a determinate categorie di soggetti. All&apos;articolo 2 Lei può trovare l&apos;elenco dei soggetti ai quali il Titolare del Trattamento comunica i Suoi dati personali. Per agevolare la tutela dei Suoi diritti, l&apos;articolo 2 può specificare in alcuni casi quando i Suoi dati non vengono comunicati a terzi.
            </p>
            <p>
              La &quot;comunicazione&quot; a terzi del dato personale è diversa dalla &quot;cessione&quot; (disciplinata al punto che precede). Infatti, nella comunicazione il terzo al quale è trasmesso il dato può usarlo solo per le specifiche finalità descritte nel rapporto con il Titolare del Trattamento. Nella cessione, invece, il terzo diventa Titolare del Trattamento autonomo del dato personale. Inoltre, per cedere i Suoi dati personali a terzi è sempre richiesto il Suo consenso.
            </p>
            <p>
              Fermo quanto precede, resta inteso che il Titolare del Trattamento potrà comunque utilizzare i Suoi dati personali per dare corretto adempimento agli obblighi previsti dalle leggi in vigore.
            </p>
          </div>
        </section>

        {/* INFORMATIVA SPECIFICA */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100 prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:text-lg prose-p:text-gray-600 prose-p:text-sm prose-li:text-sm prose-li:text-gray-600 prose-strong:text-black">
          <div className="flex items-center gap-4 mb-8 not-prose">
            <div className="p-3 bg-black text-white rounded-xl">
              <Scale size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter m-0">Informativa Privacy Specifica</h2>
          </div>

          <h3>Art. 1 Modalità di trattamento</h3>
          <p>
            1.1 Il trattamento dei Suoi dati personali sarà principalmente effettuato con l&apos;ausilio di mezzi elettronici o comunque automatizzati, secondo le modalità e con gli strumenti idonei a garantirne la sicurezza e la riservatezza dei dati personali.
          </p>
          <p>
            1.2 Le informazioni acquisite e le modalità del trattamento saranno pertinenti e non eccedenti rispetto alla tipologia dei servizi resi. I Suoi dati saranno altresì gestiti e protetti in ambienti informatici sicuri e adeguati alle circostanze.
          </p>
          <p>
            1.3 Tramite il Sito non vengono trattati &quot;dati particolari&quot;. I dati particolari sono quelli che possono rivelare l&apos;origine razziale ed etnica, le convinzioni religiose, filosofiche o di altro genere, le opinioni politiche, l&apos;adesione a partiti, sindacati, associazioni od organizzazioni a carattere religioso, filosofico, politico o sindacale, lo stato di salute e la vita sessuale.
          </p>
          <p>
            1.4 Tramite il Sito non vengono trattati dati giudiziari.
          </p>

          <h3>Art. 2 Comunicazione dei dati personali</h3>
          <p>
            Il Titolare del Trattamento può comunicare i Suoi dati personali a categorie determinate di soggetti. Di seguito vengono indicati i soggetti ai quali il Titolare del Trattamento si riserva di comunicare i Suoi dati:
          </p>
          <ul>
            <li>
              Il Titolare del Trattamento può comunicare i Suoi dati personali a tutti quei soggetti (ivi incluse le Pubbliche Autorità) che hanno accesso ai dati personali in forza di provvedimenti normativi o amministrativi.
            </li>
            <li>
              I Suoi dati personali possono essere comunicati anche a tutti quei soggetti pubblici e/o privati, persone fisiche e/o giuridiche (studi di consulenza legale, amministrativa e fiscale, Uffici Giudiziari, Camere di Commercio, Camere ed Uffici del Lavoro, ecc.), qualora la comunicazione risulti necessaria o funzionale al corretto adempimento degli obblighi derivanti dalla legge.
            </li>
            <li>
              Il Titolare del Trattamento si avvale di dipendenti e/o collaboratori a qualsiasi titolo. Per il corretto funzionamento del Sito il Titolare del Trattamento può comunicare i Suoi dati personali a questi dipendenti e/o collaboratori.
            </li>
            <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <strong>Il Titolare del Trattamento si avvale di società esterne per la fornitura dell&apos;infrastruttura tecnologica e software necessaria al funzionamento del Sito. I Suoi dati personali possono essere comunicati a tali responsabili del trattamento per finalità strettamente tecniche, quali: hosting (Vercel), gestione delle identità e accessi (Clerk), servizi database (Neon/Prisma), archiviazione di immagini in cloud (Cloudflare R2) e servizi di sicurezza e rate-limiting (Upstash). Inoltre, per la gestione delle comunicazioni e il perfezionamento degli ordini, i dati comunicati in via diretta sono trattati tramite l&apos;ecosistema di messaggistica Meta (WhatsApp).</strong>
            </li>
            <li>
              Il Titolare del Trattamento non si avvale di piattaforme CRM (società che svolgono in particolare l&apos;attività di inviare comunicazioni automatizzate agli utenti). Pertanto, i Suoi dati personali non vengono comunicati a queste società.
            </li>
            <li>
              Il Titolare del Trattamento non si avvale di società esterne per prestare il servizio di customer care.
            </li>
            <li>
              Il Titolare del Trattamento non si avvale di istituti bancari e società che gestiscono i circuiti di pagamento nazionali e internazionali per i pagamenti online e quindi non tratta i dati per queste finalità.
            </li>
            <li>
              I dati personali dell&apos;acquirente possono essere comunicati a uffici postali, corrieri o spedizionieri incaricati della consegna dei Prodotti acquistati tramite il Sito.
            </li>
            <li>
              I dati personali degli acquirenti non sono comunicati a fornitori di tecnologia basata su intelligenza artificiale generativa.
            </li>
          </ul>
          <p>
            Il Titolare si riserva la facoltà di modificare il sopra indicato elenco in base alla propria ordinaria operatività. Pertanto, Lei è invitato ad accedere con regolarità alla presente informativa per controllare a quali soggetti il Titolare del Trattamento comunica i Suoi dati personali.
          </p>

          <h3>Art. 3 Conservazione dei dati personali</h3>
          <p>
            3.1 Il presente articolo descrive per quanto tempo il Titolare del Trattamento si riserva il diritto di conservare i Suoi dati personali.
          </p>
          <ul>
            <li>
              I Suoi dati personali saranno conservati per il solo tempo necessario a garantire la corretta prestazione dei servizi offerti tramite il Sito.
            </li>
            <li>
              Tramite il Sito (o comunque facendo richiesta al Titolare del Trattamento) è possibile cancellare l&apos;account dell&apos;utente. In questo caso tutti i dati personali conservati verranno cancellati <strong>(in modo automatizzato anche dalle tabelle relative alle preferenze come le Wishlist)</strong> e non saranno conservati da parte del Titolare del Trattamento per nessuna finalità.
            </li>
          </ul>
          <p>
            3.2 Fermo quanto previsto all&apos;articolo 3.1, il Titolare del Trattamento può conservare i Suoi dati personali per il tempo richiesto da normative specifiche, come di volta in volta modificate.
          </p>

          <h3>Art. 4 Trasferimento dei dati personali</h3>
          <p>
            4.1 Il Titolare del Trattamento ha sede presso un Paese che presenta un adeguato livello di sicurezza dal punto di vista normativo. Qualora il trasferimento dei Suoi dati personali avvenga in un Paese extra-UE e per il quale la Commissione europea ha espresso un giudizio di adeguatezza, il trasferimento si ritiene in ogni caso sicuro dal punto di vista normativo. Il presente articolo 4.1 indica di volta in volta i Paesi nei quali i Suoi dati personali possono essere eventualmente trasferiti e dove la Commissione europea ha espresso un giudizio di adeguatezza.
          </p>
          <ul>
            <li className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              I Suoi dati personali possono essere trasferiti in USA in base a quanto stabilito dalla decisione di adeguatezza della Commissione europea. Con questa decisione la Commissione europea ha deciso che gli USA offrono una tutela dei dati personali assimilabile a quella offerta dall&apos;Unione Europea. <strong>Nello specifico, in virtù dell&apos;infrastruttura tecnologica adottata, i Suoi dati personali potrebbero essere trattati negli Stati Uniti (o in data center a distribuzione globale) da fornitori terzi quali Clerk (autenticazione), Vercel (hosting), Cloudflare (storage oggetti), Upstash (sicurezza) e Meta (comunicazioni). Il Titolare garantisce che tali trasferimenti avvengano nel rispetto del Regolamento Europeo, verificando l&apos;adesione dei fornitori al Data Privacy Framework (DPF) o la sottoscrizione di Clausole Contrattuali Standard (SCC) approvate dalla Commissione Europea.</strong>
            </li>
          </ul>
          <p>
            4.2 Fermo quanto indicato all&apos;articolo 4.1, i Suoi dati possono essere trasferiti anche in Paesi extra-UE e per i quali la Commissione europea non ha espresso un giudizio di adeguatezza. Lei è pertanto invitato a visionare con regolarità il presente articolo 4.2 per appurare in quali di questi Paesi i Suoi dati sono eventualmente trasferiti.
          </p>
          <p>
            4.3 In questo articolo il Titolare del Trattamento indica i Paesi presso i quali eventualmente dirige in modo specifico la propria attività. Questa circostanza può implicare l&apos;applicazione della normativa del Paese di riferimento, unitamente a quella che disciplina il rapporto con l&apos;utente in base a quanto indicato in Premessa.
          </p>
        </section>

        {/* DIRITTI DELL'INTERESSATO */}
        <section className="bg-amber-50 p-8 md:p-10 rounded-[2rem] border-2 border-amber-200/50 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-400 text-black rounded-xl shadow-sm">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
              Art. 5. Diritti dell&apos;interessato
            </h2>
          </div>

          <p className="text-gray-700 mb-6 font-medium">
            Il Titolare del Trattamento La informa che Lei ha diritto di:
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
                proporre reclamo a un&apos;autorità di controllo.
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

        {/* MODIFICHE */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-md border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
              <FileText size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Art. 6. Modifiche e Miscellanea
            </h2>
          </div>
          <p className="text-gray-600 text-sm font-medium leading-relaxed">
            Il Titolare del Trattamento si riserva il diritto di apportare modifiche alla presente informativa in qualsiasi momento, dandone idonea pubblicità agli utenti del Sito e garantendo in ogni caso una adeguata ed analoga protezione dei dati personali. Al fine di visionare eventuali modifiche, Lei è invitato a consultare con regolarità la presente informativa. In caso di modifiche sostanziali alla presente informativa privacy, il Titolare del Trattamento ne potrà dare comunicazione anche tramite email.
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-4 py-10 border-t border-gray-200">
          <Link href="/cookies">
            <button className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all shadow-lg">
              Cookie Policy <Info size={14} />
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
