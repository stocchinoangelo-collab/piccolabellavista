# Candidata alla verifica finale — sito commerciale

Data: 9 settembre 2026. Repository: `stocchinoangelo-collab/piccolabellavista`.
Branch esclusivo: `evoluzione-sito-commerciale-v1`.
Baseline verificata: `6e511a153cd955fff7953b5055177b6535288cf1`.

## Esito

**Candidata alla verifica finale di Angelo e Viviana.** Non è una dichiarazione di conformità legale né di pubblicazione. Nessun merge, nessuna modifica a Cloudflare/DNS, nessuna modifica al repository Concierge e nessun messaggio inviato.

Il sito mantiene stile, palette, loghi e fotografie esistenti. La homepage ora presenta l'alloggio, gli host e il Concierge, quindi conduce alla richiesta diretta.

## Interventi

- Ordine: hero → casa e fotografie → Angelo e Viviana → Concierge → cinque spiagge → quattro esperienze cittadine → servizi vicini → posizione → recensioni → disponibilità → FAQ → contatti.
- Casa: circa 33 m², due ospiti, dotazioni, animali non ammessi e terzo piano senza ascensore espliciti anche prima del modulo.
- Cinque spiagge: Poetto, Calamosca, Cala Fighera, Margine Rosso, Geremeas. Quattro esperienze: Castello e Bastione, Marina, Molentargius, Sella del Diavolo.
- Sette categorie di servizi con ricerche Maps riferite a Via Bellavista 14, Pirri. Nessun elenco di attività non verificate.
- Un dizionario IT/EN/DE; un solo handler del modulo. Rimossi `site-fixes.js`, `fix-modulo-whatsapp.js` e `gallery-injector.js`.
- Foto, testi, limitazioni e sezioni nell'HTML reale. Nessun MutationObserver per correggere il brand.
- Nome, arrivo, partenza, 1–2 ospiti, note facoltative. Nessun telefono o email obbligatorio. WhatsApp prepara una richiesta, non conferma il soggiorno. Senza JavaScript il modulo resta disabilitato ed è disponibile il contatto diretto.
- Date locali senza conversione UTC che sposti il giorno, partenza successiva all'arrivo, no date passate, numero intero di ospiti, conservazione dei campi dopo errori.
- Font esistenti ospitati localmente con licenze OFL; mappa incorporata rimossa. Nessuna richiesta a terze parti al caricamento nelle prove browser. Nessun nuovo tracking.
- Rimosso `meta keywords`, aggiornato LodgingBusiness, ripulita sitemap.
- Corretto overflow del menu su mobile e previsto spazio per la testata quando si raggiungono le sezioni tramite ancora.

## Eliminato o ritirato

Eliminati dalla home gite di mare, movida dettagliata, attrazioni eccedenti, rating aggregato e tariffario amministrativo non riverificato. Nessuna recensione inventata.

`guida.html` è un teaser evergreen del Concierge. `consigli.html`, `ospiti (1).html` e `blocco-recensioni.html` mantengono una pagina di orientamento per i vecchi URL, senza eventi scaduti, vecchi consigli o voti condivisi. Sono esclusi dalla sitemap e marcati noindex. Noindex riguarda l'indicizzazione: **la riservatezza deriva dall'assenza di contenuti privati**, non da robots.txt.

## Ruolo del Concierge

Spiagge complete, ristoranti, itinerari, mobilità e informazioni operative sono presentati come contenuti del Concierge riservato. Non sono stati copiati o migrati nel repository privato: nessun intervento su quell'altro progetto era autorizzato in questo incarico. La home ne spiega il valore, con Angelo e Viviana come riferimento personale.

## Prove riproducibili

```sh
python -m unittest discover -s tests -p '*_test.py'
node --test tests/booking_test.cjs
TZ=Europe/Rome node --test tests/booking_test.cjs
TZ=America/Los_Angeles node --test tests/booking_test.cjs
node --check script.js
node --check i18n.js
git diff --check
```

- 4 controlli di sorgente: traduzioni complete e risorse locali, assenza di patch/private URL, ordine e quantità delle sezioni, campi del modulo.
- 19 casi sul vero handler JS: invio unico in IT/EN/DE, caratteri speciali, 0/3/1.5/valori non validi, date mancanti/invertite/uguali/passate/impossibili, nome vuoto, storage non disponibile, data odierna e cambio lingua ripetuto. Eseguiti anche nei due fusi indicati.
- Browser Chromium 152, Playwright 1.62.1: 390×900, 768×900, 1440×900, ciascuno in IT/EN/DE. Nessun overflow della pagina, errore JavaScript, immagine mancante o richiesta esterna iniziale. Verificati anche teaser, vecchi URL ritirati e pagina dati nelle tre lingue.
- Form nel browser: 3, 0 e 1.5 ospiti e partenza uguale all'arrivo bloccati; una navigazione WhatsApp valida per lingua, intercettata prima di uscire dal test. Nessun invio all'host.
- JavaScript disabilitato: contenuti principali e dieci foto disponibili nel documento.
- URL Maps: verificati struttura, query, destinazioni e origine. Non certificati traffico, orari delle attività, funzionamento della app Maps su un telefono reale o risposta di ciascun servizio esterno.

Per riprodurre il browser test, installare Playwright 1.62.1 e Chromium nel proprio ambiente, avviare il server HTTP locale e lanciare `node tests/browser_test.cjs`. `PBV_TEST_URL`, `PBV_CHROMIUM` e `PBV_QA_DIR` permettono di indicare URL locale, eseguibile e cartella delle prove. Il browser del collaudo è uno strumento temporaneo, non una dipendenza del sito.

## Verifiche umane prima della produzione

1. **Informazioni operative:** confermare orari di check-in/check-out. La candidata rimanda alla proposta prima della conferma, senza inventare orari. Confermare inoltre contatti, CIN e condizioni: sono ereditati dalle sorgenti, non riverificati con documenti amministrativi.
2. **Dati personali:** `privacy.html` descrive il comportamento tecnico osservato, ma non costituisce una completa informativa validata. Dati del titolare, conservazione dei messaggi e testo definitivo vanno completati/verificati con la gestione prima della pubblicazione. Il testo della richiesta viene passato a WhatsApp nell'URL quando si prosegue, prima dell'invio della chat.
3. **Foto e servizio:** fotografie preesistenti conservate senza nuove acquisizioni; il diritto di pubblicazione non è stato documentato in questo repository. Confermare il materiale e la disponibilità effettiva dell'accesso ospiti al Concierge IT/EN/DE.
4. **Telefono reale:** prove eseguite su browser con viewport mobile/tablet, non su un Samsung/iPhone fisico. Rimane il passaggio umano WhatsApp → chat corretta e lettura finale delle traduzioni, soprattutto DE, da parte di un parlante competente.

Questi punti sono circoscritti; non richiedono un nuovo redesign.

## File

Modificati: `index.html`, `i18n.js`, `script.js`, `styles.css`, `guida.html`, `consigli.html`, `ospiti (1).html`, `blocco-recensioni.html`, `sitemap.xml`, `README.md`.

Aggiunti: `privacy.html`, font e licenze in `assets/fonts/`, `tests/content_test.py`, `tests/booking_test.cjs`, `tests/browser_test.cjs`, questo report e prove selezionate in `qa/`.

Eliminati: `fix-modulo-whatsapp.js`, `site-fixes.js`, `gallery-injector.js`.

## Evidenze visive selezionate

- [Hero mobile IT](qa/390-it-hero.png)
- [Modulo mobile DE](qa/390-de-form.png)
- [Hero desktop IT](qa/1440-it-hero.png)
- [Modulo desktop DE](qa/1440-de-form.png)
- [Risultati browser](qa/results.json)

Le schermate del modulo nascondono la testata sticky durante la sola acquisizione del ritaglio, per evitare che copra il contenuto nel file. Il test della pagina usa la testata reale.
