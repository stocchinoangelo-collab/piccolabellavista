# Refresh grafico — cosa è cambiato

Solo `css/style.css` è stato toccato (nessuna modifica a `js/app.js`, quindi tutte le correzioni funzionali fatte prima restano intatte — verificato di nuovo con test automatici, zero errori). L'identità "mediterranea editoriale" (Fraunces + Inter, ocean/forest/terracotta) resta la stessa: questo è un affinamento, non un cambio di stile.

**Colori e stile**
- Il bianco delle card era un bianco puro (`#ffffff`) che "staccava" leggermente dal fondo ivory: scaldato in `#fffdfa`.
- Ombre più morbide e ampie ovunque (card, bottoni, sheet): danno più profondità senza sembrare pesanti.
- Aggiunto un piccolo trattino color terracotta prima di ogni occhiello di sezione ("— OGGI DOVE ANDARE?", "— IL VOSTRO RIFUGIO A PIRRI"...): una firma visiva ripetuta in ogni pagina.
- L'overlay scuro sulle foto hero (home e spiagge) ora sfuma anche verso una punta di terracotta, non solo blu oceano — richiama il tramonto.
- Focus da tastiera (Tab) ora visibile con un anello color terracotta, invece del contorno di sistema generico.

**Layout e componenti**
- Le icone della griglia "Scopri di più" in home ora ruotano su tre sfondi colorati tenui (oceano/foresta/terracotta) invece di essere tutte uguali: più leggibilità a colpo d'occhio, e compaiono una dopo l'altra con un piccolo effetto a cascata invece che tutte insieme.
- Bordo sottile aggiunto a card, card spiagge ed eventi/archeologia (prima ce l'avevano solo alcuni componenti, non tutti): più coerenza e definizione contro il fondo chiaro.
- Le card delle spiagge ora si sollevano leggermente al passaggio del mouse, come già facevano le altre card — prima erano ferme.
- I chip attivi (filtri spiagge/eventi/ristoranti) mostrano un segno di spunta ✓.
- Il pulsante WhatsApp flottante ha un leggero effetto "pulse" per farsi notare senza essere invadente.
- Il menu laterale ha righe più "morbide" (angoli arrotondati, tinta terracotta tenue sulla voce attiva) invece di un semplice bordo a sinistra.
- Bottone primario con un filo di sfumatura invece di un colore piatto; barra in alto con una leggera ombra quando si scorre la pagina.

Le foto di spiagge/Cagliari nei tuoi screenshot potrebbero risultare rotte: è solo perché l'ambiente in cui ho testato non ha accesso a Internet libero (Unsplash/Wikimedia bloccati), non è un problema del sito — una volta online su GitHub Pages caricheranno normalmente, come già facevano prima. Le foto della casa (locali, incluse nel pacchetto) infatti si vedono già correttamente negli screenshot.
