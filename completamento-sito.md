# Completamento sito Piccolabellavista

Tutto quello che resta, in ordine di ritorno reale.
Aggiornato al 03/09/2026.

---

# PARTE 1 — I dodici tempi da differenziare

## Il problema

Nel codice ci sono dodici schede che dicono tutte "circa 15-20 min in auto".
Ripetuto dodici volte, il dato smette di essere un'informazione e diventa
rumore: il lettore capisce che nessuno ha misurato niente e comincia a
dubitare anche del resto.

C'e' anche una contraddizione interna: nelle spiagge il Poetto e' "15-20 min",
nelle FAQ "circa 15 minuti".

## Attendibilita' di questi numeri

**[STIMA]** — calcolati su distanza stradale reale da Via Bellavista 14
(coordinate verificate: 39.2395 / 9.1272) e tipo di percorso, non su dati
di traffico in tempo reale. Sono molto piu' credibili dell'attuale valore
unico, ma prima di pubblicarli vale la pena controllarne due o tre in
Google Maps in un orario tipico.

## I valori

| Scheda nel sito | Sostituisci con |
|---|---|
| Molentargius | circa 10 min in auto |
| Villanova | circa 15 min in auto |
| Palazzo Doglio | circa 15 min in auto |
| Marina | circa 15 min in auto |
| Piazza Yenne | circa 15 min in auto |
| Bastione di Saint Remy | circa 15 min in auto |
| Castello | circa 15-20 min in auto |
| Cattedrale di Santa Maria | circa 15-20 min in auto |
| Torre dell'Elefante | circa 15-20 min in auto |
| Poetto | circa 20 min in auto |
| Calamosca | circa 20-25 min in auto |

## Come si fa la sostituzione

Su GitHub, apri index.html, clicca la matita, e usa la ricerca dentro
l'editor (Ctrl + F) per trovare "15-20". Le occorrenze vanno cambiate una
per una, guardando ogni volta a quale scheda appartengono.

Non usare "sostituisci tutto": cambierebbe anche quelle che devono
restare 15-20.

## Il vero miglioramento non e' il numero

Cambiare 15-20 in 15 sposta poco. Quello che sposta davvero e'
l'informazione che l'ospite non trova altrove. Tre esempi pronti,
nello stile che il sito usa gia':

**Poetto**
> La spiaggia lunga di Cagliari. Consiglio nostro: arrivate la mattina,
> i parcheggi si riempiono in fretta, e portate un ombrellone da fissare
> bene perche' qui il vento e' di casa.

**Calamosca**
> Piccola cala tra gli scogli, acqua limpida e parcheggio comodo.
> Portate le scarpette: il fondale in alcuni punti e' sassoso.

**Molentargius**
> Il parco dei fenicotteri, il posto piu' vicino a casa. Si gira a piedi
> o in bicicletta, ed e' bello all'alba e al tramonto quando gli uccelli
> si spostano.

Su Molentargius vale la pena insistere: e' a dieci minuti, cioe' meno di
tutto il resto, ed e' l'unica scheda in cui la tua posizione a Pirri
diventa un vantaggio invece che un compromesso. Oggi e' annegata tra
altre undici schede tutte uguali.

---

# PARTE 2 — Traduzioni inglesi per il blocco recensioni

Serve solo se aggiungi la sezione recensioni e vuoi che i titoli cambino
anche in inglese. Le recensioni in se' NON si traducono: restano nella
lingua dell'ospite, altrimenti perdono autenticita'.

Su GitHub apri `i18n.js`, matita, e aggiungi queste voci.

**Nel blocco "it":**

```
    reviewsKicker: "Recensioni",
    reviewsTitle: "Cosa dicono gli ospiti.",
    reviewsLead: "Valutazione media 9,0 su 10 su Booking.com, su 6 recensioni verificate.",
    reviewsCta: "Leggi tutte le recensioni su Booking",
```

**Nel blocco "en":**

```
    reviewsKicker: "Reviews",
    reviewsTitle: "What our guests say.",
    reviewsLead: "Average rating 9.0 out of 10 on Booking.com, from 6 verified reviews.",
    reviewsCta: "Read all reviews on Booking",
```

Attenzione alle virgole: ogni riga finisce con la virgola, tranne
l'ultima di ciascun blocco. Se ne manca una o ce n'e' una di troppo, il
file smette di funzionare e il sito resta in italiano.

Se salti questo passaggio non si rompe niente: la sezione resta in
italiano anche in inglese. E' esattamente il difetto che il controllore
automatico aveva segnalato sulla pull request di giugno.

---

# PARTE 3 — Risposte alle recensioni su Booking

Questa e' la cosa con il miglior rapporto tra tempo e risultato di tutta
la lista, e non tocca il sito.

## Perche' rispondere

Chi confronta annunci legge le risposte del proprietario piu' di quanto
si immagini. Una risposta fa due cose insieme: spiega il voto piu' basso
a chi legge oggi, e mostra che dietro l'annuncio c'e' qualcuno che segue.

Nel tuo caso c'e' un motivo in piu': i tre 8 avevano tutte le voci a 10
e sono arrivati nel periodo delle impalcature sulla facciata. Chi legge
oggi vede tre 8 senza spiegazione e immagina qualcosa che non va nella
casa. In realta' il cantiere e' finito.

## Regola di stile

Il sito attribuisce sempre i consigli a entrambi i gestori. Le risposte
seguono la stessa linea: si firma al plurale, mai a nome del solo Angelo.

## Risposte pronte

**Per le recensioni da 8 (periodo impalcature)**

> Grazie per le belle parole sull'accoglienza. In quel periodo la facciata
> del palazzo era interessata da lavori condominiali che purtroppo
> limitavano la vista dal balcone, uno dei motivi per cui gli ospiti
> scelgono la casa. I lavori sono ora conclusi e il panorama e' tornato
> quello di sempre. Vi aspettiamo volentieri.

Perche' funziona: riconosce il problema senza scusarsi troppo, ne
spiega la causa esterna e temporanea, e dice chiaramente che oggi non
c'e' piu'.

**Per la recensione di luglio (Viviana, aperitivo in frigo)**

> Grazie di cuore. Ci fa piacere che l'aperitivo sia stato una bella
> sorpresa: sono i piccoli gesti che ci piace curare. Vi aspettiamo per
> il prossimo soggiorno a Cagliari.

**Per le recensioni da 10 di maggio**

> Grazie per le belle parole. La fermata del bus a pochi passi e'
> davvero comoda per raggiungere il centro senza pensieri di
> parcheggio. A presto.

Nella seconda si riprende un dettaglio concreto della recensione (il bus)
invece di ringraziare genericamente: chi legge capisce che le risposte
sono scritte una per una e non copiate.

## Dove si fa

Extranet Booking → Recensioni → accanto a ciascuna recensione trovi
"Rispondi". Le risposte compaiono pubblicamente sotto la recensione.

---

# PARTE 4 — Cose che dipendono da te

## Il punteggio ufficiale

Nel blocco recensioni ho scritto 9,0 su 6 recensioni: e' il calcolo
esatto dei punteggi che mi hai dato (10+10+10+8+8+8 diviso 6).

Se nell'extranet Booking il punteggio ufficiale e' 9,4, allora hai piu'
recensioni di queste sei. Usa il numero ufficiale, e cambialo in DUE
punti: nel testo visibile e nei dati strutturati. Devono coincidere.

Non arrotondare verso l'alto: Google confronta i dati strutturati con le
fonti pubbliche, e una valutazione gonfiata fa perdere le stelline
invece di guadagnarle.

## La foto della vista in apertura

E' la cosa che manca di piu' al sito. Oggi l'apertura mostra una
panoramica dell'interno; la vista, che e' il tuo unico elemento
davvero distintivo, arriva solo piu' in basso nella galleria.

Come scattarla:
- **verticale**, non orizzontale: su un telefono l'orizzontale diventa
  una strisciolina
- **al tramonto o nella prima ora del mattino**: la luce di mezzogiorno
  appiattisce il panorama e brucia il cielo
- includi un pezzo di ringhiera o del balcone in basso: dice all'ospite
  "questa vista e' tua da qui", non e' una cartolina generica
- pulisci l'inquadratura: panni stesi, cavi, condizionatori

Salvala come `assets/foto/booking/vista-verso-poetto-mare-hero.jpg`.

Il nome non e' casuale: sia script.js sia gallery-injector.js cercano gia'
quel file esatto e, se non lo trovano, ripiegano sulla panoramica interna.
Caricandolo con quel nome, l'apertura cambia da sola senza toccare una
riga di codice.

## La verifica del Profilo Google

Ferma da luglio perche' la fotocamera non funziona per il video. Per una
struttura di quartiere il profilo verificato pesa piu' del sito nelle
ricerche tipo "casa vacanza Pirri". Vale la pena sbloccarla, anche
facendo il video con un altro telefono.

---

# PARTE 5 — Pulizie

## Il service worker nel tuo browser

E' il motivo per cui vedevi la guida al posto del sito. Riguarda solo il
tuo dispositivo, ma ora che sei al PC sono due minuti:

1. Apri piccolabellavista.it
2. Premi **F12**
3. Scheda **Application** (o Applicazione)
4. Menu di sinistra: **Service Workers**
5. Accanto a quello elencato clicca **Unregister**
6. Sempre a sinistra: **Storage** → **Clear site data**
7. Chiudi e riapri il browser

## File lasciati in giro nella repository

Sono pubblici e raggiungibili da chiunque:

- `ospiti (1).html` — copia doppia scaricata per sbaglio
- `download` — file senza estensione
- `aftercasa.png`, `aftermenu.png` — screenshot di prove

Non fanno danni, ma un file chiamato "ospiti" in una repository pubblica
merita almeno un'occhiata per capire cosa contiene.

Per rimuoverli: apri il file su GitHub, clicca i tre puntini in alto a
destra, scegli **Delete file**, poi Commit changes. Restano comunque nella
cronologia, quindi non e' una cancellazione definitiva: se dentro ci
fossero dati sensibili, la cancellazione da sola non basta.

## La regola da tenere

I file sul tuo PC sono piu' vecchi di quelli online. Da qui in avanti:

- **GitHub e' la versione vera.** Le modifiche si fanno la', un file per
  volta, dal pulsante di modifica.
- **Il PC serve solo per provare.** Mai come sorgente.
- **Niente caricamenti in blocco** dalla cartella locale: sovrascriverebbero
  il sito buono con la versione arretrata.

---

# Ordine consigliato

1. Risposte alle recensioni su Booking — 10 minuti, nessun rischio
2. Blocco recensioni sul sito — 5 minuti
3. Punteggio ufficiale dall'extranet, da allineare in due punti
4. CSS v2 in fondo a styles.css
5. I dodici tempi
6. Traduzioni in i18n.js
7. La foto della vista
8. Pulizie e verifica Google
