# Piccola Bellavista

Sito leggero per la casa vacanza Piccola Bellavista, a Pirri, Cagliari.

## Avvio in locale

Dalla cartella del progetto avvia il server con:

```bash
python app.py
```

Poi apri il sito all'indirizzo:

```text
http://127.0.0.1:8080
```

La pagina admin e disponibile su:

```text
http://127.0.0.1:8080/admin.html
```

## Area admin

Le API admin sono protette con autenticazione Basic tramite variabili ambiente.
Prima di avviare il server configura `PB_ADMIN_USER` e `PB_ADMIN_PASSWORD` nel tuo terminale.

Esempio PowerShell:

```powershell
$env:PB_ADMIN_USER="admin"
$env:PB_ADMIN_PASSWORD="valore-locale-da-scegliere"
python app.py
```

Non inserire credenziali reali nel codice e non caricare file `.env` su GitHub.
Se le variabili admin non sono configurate, la pagina admin mostra un messaggio di configurazione mancante.

## Prenotazioni e dati locali

Il modulo salva le richieste in `data/bookings.json`.
Gli stati disponibili sono `richiesta`, `confermata` e `cancellata`.
Le prenotazioni in stato `richiesta` o `confermata` bloccano le date nel calendario.

`data/bookings.json` contiene dati locali reali, viene generato automaticamente dal server ed e escluso da Git tramite `.gitignore`.
Per mantenere un esempio vuoto nel repository si usa `data/bookings.example.json`.

La notifica email viene inviata solo se sono configurate le variabili SMTP previste in `app.py`.

## Test

La suite automatizzata copre la validazione delle prenotazioni e le API principali di `app.py`.
Per eseguirla:

```bash
python -m unittest discover -s tests
```

## Struttura

- `index.html` - pagina principale del sito.
- `styles.css` - grafica e layout.
- `script.js` - traduzioni, calendario disponibilita e validazione frontend del modulo.
- `app.py` - server locale, API prenotazioni e salvataggio dati.
- `admin.html` - gestione prenotazioni.
- `admin.js` - logica pagina admin.
- `tests/` - test automatizzati per il server e la validazione.
- `.github/workflows/ci.yml` - workflow CI minimo per eseguire i test.
- `data/bookings.example.json` - esempio vuoto dei dati prenotazioni.
- `data/bookings.json` - archivio prenotazioni locale generato automaticamente, escluso da Git.
- `assets/` - loghi e immagini.

## Traduzione

Il sito include un selettore lingua `IT/EN` nella testata.
La lingua scelta viene ricordata dal browser per le visite successive.
