# Piccolabellavista

Sito commerciale statico a Pirri, Cagliari. Ospitalità di Angelo e Viviana, massimo 2 ospiti, terzo piano senza ascensore.

## Avvio locale

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Aprire http://127.0.0.1:8765. Non occorrono backend, CMS o credenziali.

- `index.html`: contenuti e fotografie presenti nell'HTML, anche senza JavaScript.
- `i18n.js`: unico dizionario IT / EN / DE.
- `script.js`: lingua e unico handler per richiesta WhatsApp. Nessuna prenotazione automatica.
- `styles.css`: stile esistente e stili della galleria consolidati.
- `guida.html`: teaser pubblico del Concierge, senza contenuti o credenziali privati, escluso dall'indicizzazione.
- `consigli.html`, `ospiti (1).html`, `blocco-recensioni.html`: vecchi URL ritirati, con pagina di orientamento senza contenuti obsoleti e `noindex`.
- `privacy.html`: descrizione del trattamento tecnico dei dati e dei servizi esterni; vedere limiti editoriali nel report QA.
- `sw.js`: disinstallazione del vecchio service worker erroneamente distribuito; nessuna nuova registrazione.

Le richieste vengono preparate nel browser e aperte su WhatsApp. L'ospite deve premere invio nell'app. Non vengono registrate in un database e non confermano una prenotazione.

## Verifica

Consultare `QA_COMMERCIALE.md` e i test in `tests/`. La versione commerciale consolidata è stata chiusa il 9 settembre 2026 tramite PR #5.
