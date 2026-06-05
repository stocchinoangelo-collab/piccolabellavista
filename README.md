# Piccola Bellavista

Sito leggero per la casa vacanza Piccola Bellavista, a Pirri, Cagliari.

## Come avviare in locale

Dalla cartella del progetto:

```powershell
python app.py
```

Poi apri:

```text
http://127.0.0.1:8080
```

La pagina admin e disponibile su:

```text
http://127.0.0.1:8080/admin.html
```

## Area admin

Le API admin sono protette con autenticazione Basic tramite variabili ambiente.

Prima di avviare il server, su PowerShell puoi impostare:

```powershell
$env:PB_ADMIN_USER="admin"
$env:PB_ADMIN_PASSWORD="scegli-una-password-locale"
python app.py
```

Non inserire password reali nel codice e non caricare file `.env` su GitHub.

## Struttura

- `index.html` - pagina principale del sito.
- `styles.css` - grafica e layout.
- `script.js` - selettore lingua Italiano/Inglese.
- `app.py` - server locale, API prenotazioni e salvataggio dati.
- `admin.html` - gestione prenotazioni.
- `admin.js` - logica pagina admin.
- `data/bookings.example.json` - esempio vuoto dei dati prenotazioni.
- `data/bookings.json` - archivio prenotazioni locale generato automaticamente, escluso da Git.
- `assets/` - loghi e immagini.

## Traduzione

Il sito include un selettore lingua `IT/EN` nella testata.
La lingua scelta viene ricordata dal browser per le visite successive.

## Prenotazioni

Il modulo salva le richieste in `data/bookings.json`.
Gli stati disponibili sono `richiesta`, `confermata` e `cancellata`.
Le prenotazioni in stato `richiesta` o `confermata` bloccano le date nel calendario.

La notifica email viene inviata solo se sono configurate queste variabili ambiente:

```powershell
$env:PB_SMTP_HOST="smtp.example.com"
$env:PB_SMTP_PORT="587"
$env:PB_SMTP_USER="email@example.com"
$env:PB_SMTP_PASSWORD="password"
$env:PB_NOTIFY_EMAIL="destinatario@example.com"
python app.py
```

## Da completare

- Inserire numero WhatsApp reale.
- Inserire email reale.
- Inserire link Booking.
- Inserire link Google Maps.
- Aggiungere foto reali della casa e della vista.
