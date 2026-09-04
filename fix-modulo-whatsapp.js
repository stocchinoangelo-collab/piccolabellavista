/* ============================================================
   CORREZIONE MODULO PRENOTAZIONE
   ------------------------------------------------------------
   IL PROBLEMA
   Il modulo del sito manda i dati a /api/bookings, che esiste
   solo dentro app.py, cioe' solo sul tuo PC quando lanci Python.
   Su GitHub Pages girano solo file statici: Python non parte mai.
   Risultato: l'ospite compila tutto, preme Invia e vede un
   errore. La richiesta non arriva a nessuno, e tu non sai
   nemmeno che qualcuno ha provato.

   LA SOLUZIONE
   Questo file intercetta l'invio del modulo e apre WhatsApp con
   il messaggio gia' compilato: nome, telefono, email, date,
   ospiti e note. E' esattamente quello che il testo del sito
   promette già ("si aprirà WhatsApp con la richiesta già
   pronta"), e funziona su un sito statico senza server.

   PERCHE' FUNZIONA ANCHE SE IL CODICE VECCHIO E' ANCORA LI'
   L'ascolto e' registrato in "fase di cattura" sul documento:
   il browser lo esegue PRIMA di quello del modulo, e con
   stopImmediatePropagation il vecchio non parte mai. Quindi non
   serve modificare script-original.js: basta aggiungere questo.

   COME SI INSTALLA
   1. Salva questo file nella cartella del progetto, accanto a
      index.html, col nome  fix-modulo-whatsapp.js
   2. In index.html cerca questa riga (verso il fondo):
         <script src="script.js"></script>
      e SUBITO DOPO aggiungi:
         <script src="fix-modulo-whatsapp.js"></script>
   3. Salva e ricarica con Ctrl+F5

   ============================================================ */

(() => {
  "use strict";

  // Il tuo numero, come gia' presente altrove nel sito.
  // Formato senza + e senza spazi: prefisso 39 e poi il numero.
  const NUMERO_WHATSAPP = "393931104422";

  // Etichette del messaggio, nelle due lingue del sito.
  const TESTI = {
    it: {
      intestazione: "Richiesta di disponibilita - Piccolabellavista",
      nome: "Nome",
      telefono: "Telefono",
      email: "Email",
      arrivo: "Arrivo",
      partenza: "Partenza",
      ospiti: "Ospiti",
      note: "Note",
      conferma: "Si apre WhatsApp con la richiesta pronta: premi invio per inviarla.",
      erroreCampi: "Compila nome, telefono, email e le due date.",
      erroreDate: "La data di partenza deve essere dopo quella di arrivo.",
      errorePassato: "La data di arrivo non puo' essere nel passato.",
    },
    en: {
      intestazione: "Availability request - Piccolabellavista",
      nome: "Name",
      telefono: "Phone",
      email: "Email",
      arrivo: "Arrival",
      partenza: "Departure",
      ospiti: "Guests",
      note: "Notes",
      conferma: "WhatsApp will open with your request ready: just press send.",
      erroreCampi: "Please fill in name, phone, email and both dates.",
      erroreDate: "The departure date must be after the arrival date.",
      errorePassato: "The arrival date cannot be in the past.",
    },
  };

  function linguaAttiva() {
    const bottone = document.querySelector(".lang-button.active");
    const lingua = bottone?.dataset.lang || document.documentElement.lang || "it";
    return TESTI[lingua] ? lingua : "it";
  }

  // Trasforma 2026-09-15 in 15/09/2026: piu' leggibile in un
  // messaggio WhatsApp che il formato tecnico con i trattini.
  function dataLeggibile(valore) {
    if (!valore) return "";
    const parti = valore.split("-");
    if (parti.length !== 3) return valore;
    return `${parti[2]}/${parti[1]}/${parti[0]}`;
  }

  function mostraMessaggio(testo, tipo) {
    const box = document.querySelector("#bookingMessage");
    if (!box) return;
    box.textContent = testo;
    box.className = "form-message" + (tipo ? " " + tipo : "");
  }

  function gestisciInvio(evento) {
    const modulo = evento.target;

    // Agisce solo sul modulo prenotazioni, non su altri form
    if (!modulo || modulo.id !== "bookingForm") return;

    // Blocca sia l'invio normale sia il vecchio codice che
    // manda i dati a /api/bookings
    evento.preventDefault();
    evento.stopImmediatePropagation();

    const t = TESTI[linguaAttiva()];
    const dati = Object.fromEntries(new FormData(modulo).entries());

    const nome = (dati.fullName || "").trim();
    const telefono = (dati.phone || "").trim();
    const email = (dati.email || "").trim();
    const arrivo = (dati.arrival || "").trim();
    const partenza = (dati.departure || "").trim();
    const ospiti = (dati.guests || "").trim();
    const note = (dati.notes || "").trim();

    // Controlli minimi, fatti qui perche' il server non c'e' piu'
    if (!nome || !telefono || !email || !arrivo || !partenza) {
      mostraMessaggio(t.erroreCampi, "error");
      return;
    }

    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    if (new Date(arrivo) < oggi) {
      mostraMessaggio(t.errorePassato, "error");
      return;
    }

    if (new Date(partenza) <= new Date(arrivo)) {
      mostraMessaggio(t.erroreDate, "error");
      return;
    }

    // Compongo il messaggio. Una riga per informazione, cosi'
    // e' leggibile anche dal telefono e facile da archiviare.
    const righe = [
      t.intestazione,
      "",
      `${t.nome}: ${nome}`,
      `${t.telefono}: ${telefono}`,
      `${t.email}: ${email}`,
      `${t.arrivo}: ${dataLeggibile(arrivo)}`,
      `${t.partenza}: ${dataLeggibile(partenza)}`,
      `${t.ospiti}: ${ospiti || "-"}`,
    ];

    if (note) {
      righe.push(`${t.note}: ${note}`);
    }

    const messaggio = encodeURIComponent(righe.join("\n"));
    const indirizzo = `https://wa.me/${NUMERO_WHATSAPP}?text=${messaggio}`;

    mostraMessaggio(t.conferma, "success");

    // Apro in una nuova scheda: cosi' l'ospite non perde il sito
    window.open(indirizzo, "_blank", "noopener");
  }

  // Fase di cattura (il terzo parametro true): il browser esegue
  // questo ascolto prima di quello registrato sul modulo, quindi
  // il vecchio codice non parte. Funziona indipendentemente
  // dall'ordine di caricamento dei file.
  document.addEventListener("submit", gestisciInvio, true);
})();
