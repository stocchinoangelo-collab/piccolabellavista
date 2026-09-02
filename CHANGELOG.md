# CHANGELOG — correzioni v3.0/v3.1 → v3.2

Pacchetto pronto per essere copiato nella root del repository GitHub, in sostituzione dei file esistenti. Tutte le correzioni sono state verificate con test automatici (browser headless): login, tutte le 11 sezioni, cambio lingua, filtro ristoranti, dettaglio spiaggia — nessun errore JavaScript residuo.

## Bug bloccanti risolti

- **`js/app.js` — `renderHome()`**: mancava `const c = DATA.casa;`, causava `ReferenceError` ad ogni caricamento della home (la sezione di default dopo il login). Aggiunta la riga mancante.
- **`js/app.js` — `parseHash()`**: non gestiva la `?` nell'hash, quindi i filtri di categoria in "Dove mangiare" (`#mangiare?type=fish` ecc.) rimandavano sempre alla Home invece di filtrare. Ora l'hash viene diviso sia su `/` sia su `?`.
- **`js/app.js` — `init()`/`openApp()`**: `initWeather()` e `renderWhatsApp()` erano definite ma mai chiamate. Il widget meteo restava bloccato su "Caricamento...", il bottone WhatsApp non compariva mai. Ora vengono invocate (il meteo ad ogni render della home, WhatsApp una sola volta dopo il login).
- **`js/app.js` — `renderEventi()`**: le sagre con data nota solo a livello di mese (es. "2026-09") venivano trattate come un singolo istante il giorno 1, e sparivano dalla lista dopo quella data. Ora coprono l'intero mese.

## Sicurezza

- **Password Wi-Fi reale esposta nel codice** (`Sardegna2024!`): il codice ora è pulito e consolidato in un solo `data.js`, ma **la password stessa resta quella già vista pubblicamente**. Va cambiata dall'host il prima possibile (vedi "Azioni manuali" sotto) — nessuna correzione di codice può "disfare" un'esposizione già avvenuta.
- **Gate lato client**: resta, per natura, solo un filtro di cortesia (la password è nel bundle scaricato dal browser). Non è stato snaturato il funzionamento dell'app trasformandolo in autenticazione server-side, perché fuori scopo per questo progetto — ma è bene saperlo e non considerarlo una vera barriera.

## Consolidamento dati

- **Due copie divergenti di `js/data.js`** (una con credenziali di test, una con credenziali reali, un file orfano `8.js` mai referenziato) sono state unite in un solo file, quello effettivamente caricato da `index.html`. Il file orfano non è incluso in questo pacchetto: se esiste ancora nel repository va rimosso a mano (`git rm 8.js`).
- **`casa.mapEmbed`**: l'URL Google Maps embed nella copia "test" era troncato/non valido. Sostituito con un embed semplice (`https://www.google.com/maps?q=lat,lng&output=embed`), che non richiede API key e funziona in modo affidabile.
- **Prezzi/indirizzi ristoranti non verificati**: invece di mostrare agli ospiti il testo `"[DA VERIFICARE]"`, i campi non confermati sono ora `null` nei dati e l'interfaccia (`renderMangiare()`) li nasconde automaticamente finché non vengono compilati.
- **Nota interna sull'Anfiteatro Romano**: il testo `[DA VERIFICARE: ...]` visibile agli ospiti è stato riscritto in un avviso normale ("verificate lo stato aggiornato prima di programmare la visita"), motivato: fonti giornalistiche di settembre 2026 confermano che il sito è stato soggetto a riaperture parziali/contestate — l'avviso è quindi corretto nel merito, solo non doveva restare come appunto di lavoro.

## Traduzioni (`js/i18n.js`)

- `weather`, `whereWeAre`, `openMap`: esistevano solo nel blocco tedesco (in una forma sbagliata, oggetto invece di stringa). Aggiunte come stringhe piatte anche a IT ed EN — verificato che ora "Meteo Cagliari"/"Weather Cagliari" e "Dove siamo"/"Where we are" compaiono correttamente in entrambe le lingue.
- `password`: chiave mancante, usata da `renderCasa()` ma non definita — mostrava il testo grezzo "password" invece di "Password". Aggiunta a IT/EN/DE.
- `phone`: la riga "Telefono" nella scheda casa riusava per errore la chiave `contact` ("Contatti"), duplicando il testo dell'intestazione sopra. Aggiunta una chiave dedicata.

## Service worker (`sw.js`)

- `js/data.js` (eventi, sagre, prezzi, Wi-Fi) era servito *cache-first* come gli asset statici: un ospite che aveva già visitato la pagina non vedeva contenuti aggiornati finché la costante `CACHE` non veniva bumpata a mano. Ora usa *network-first* con fallback su cache, come già avveniva per il CSV di Google Docs. Versione cache bumpata `pbv-v31` → `pbv-v32` (necessario farlo ad ogni release che tocca gli asset precaricati).

## Icone PWA

- Non era mai stato fornito `icon.svg`, e il manifest dichiarava solo quello: nessun PNG di fallback, e SVG come `apple-touch-icon` non è affidabile su iOS/Safari.
- Generato un set completo coerente con lo stile del logo "PBV" già usato nel gate (fondo blu oceano, testo serif bianco): `icon.svg`, `img/icons/icon-192.png`, `img/icons/icon-512.png`, `img/icons/icon-512-maskable.png` (per le icone adattive Android), `img/icons/apple-touch-icon.png` (180×180, full-bleed come richiesto da iOS). **Sono icone placeholder coerenti con il resto del sito**: se l'host ha un logo reale, va sostituito con lo stesso schema di file/nomi.

## Contrasto colori (`css/style.css`)

- `--color-stone-muted` (usato in didascalie, meta delle card, crediti fotografici — tutti a 11-13px) dava un contrasto reale di ~3.2:1 su sfondo `--color-ivory`, sotto la soglia 4.5:1 richiesta da WCAG 2.1 AA per testo normale, nonostante il file dichiarasse conformità AA nell'intestazione. Scurito da `#8a8a88` a `#706e69` (~4.8:1).
- Aggiunte le regole CSS per `.map-card`/`.map-card__link` (sezione "Dove siamo") e `#whatsapp-float`: erano già usate da `app.js` ma non esistevano nel foglio di stile, quindi sarebbero comparse senza stile appena le funzionalità corrispondenti fossero state attivate.

## Altro (`index.html`)

- Il messaggio `<noscript>` (per chi ha JavaScript disattivato) era coperto dal gate a schermo intero, che resta nel markup indipendentemente da JS. Ora ha un `z-index` più alto ed è posizionato per essere sempre visibile in quel caso.
- Aggiunto `<meta name="apple-mobile-web-app-title">` per un nome più corto nella schermata Home di iOS.
- Aggiunti i riferimenti alle nuove icone PNG.

## Foto casa

- Le 4 foto della casa fornite in chat sono state inserite in `img/casa/` con i nomi già attesi da `data.js` (`bagno.jpg`, `letto.jpg`, `panoramica.jpg`, `zona-pranzo.jpg`). In precedenza questi file non erano mai stati condivisi: se il repository reale ha già foto diverse a questi percorsi, questo pacchetto le sovrascrive — controllare prima di copiare se non è quello che si vuole.

---

## Azioni manuali che restano da fare (non risolvibili editando il codice)

1. **Cambiare subito la password Wi-Fi reale** (`Sardegna2024!`): è stata esposta nel repository, va considerata compromessa a prescindere da questo intervento.
2. **Verificare se il repository GitHub è pubblico**, e se sì valutare di renderlo privato o ripulire la cronologia (`git filter-repo` / BFG) dai commit che contengono la password reale.
3. **Rimuovere dal repository l'eventuale file orfano `8.js`**, se presente tra i file tracciati.
4. **Completare i dati mancanti dei ristoranti** (prezzo, indirizzo) in `js/data.js` — sono stati impostati a `null` e restano nascosti nell'app finché non li si compila, ma prima o poi vanno inseriti.
5. **Verificare lo stato reale dell'Anfiteatro Romano** e il prezzo aggiornato di Su Nuraxi Barumini (fondazionebarumini.it) prima di ogni soggiorno — entrambi soggetti a cambiamenti frequenti secondo le fonti consultate.
6. **Sostituire le icone placeholder** con il logo reale della struttura, se diverso dal semplice monogramma "PBV" generato qui.
