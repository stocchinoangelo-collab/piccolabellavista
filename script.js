/* One language controller and one WhatsApp submit handler. No data is stored. */
(() => {
  'use strict';
  const dictionaries = window.PBV_TRANSLATIONS;

  // Final copy pass: keep Angelo and Viviana as the human signature of the site,
  // without repeating their names in every operational sentence.
  const copyOverrides = {
    it: {
      heroAlt: 'Accoglienza personale e un Concierge digitale riservato agli ospiti per vivere meglio Cagliari.',
      service1Text: 'Prima del soggiorno ricevi indicazioni chiare per raggiungere la casa e organizzare l’arrivo.',
      service3Text: 'Per una domanda o un consiglio, siamo il tuo riferimento prima e durante il soggiorno.',
      beachesText: 'Dal Poetto alle baie della costa verso Villasimius: un assaggio del territorio. Nel Concierge trovi i nostri consigli per organizzare la giornata.',
      bookingText: 'Compila il modulo: WhatsApp si aprirà con la richiesta pronta. Premi invio su WhatsApp per trasmetterla direttamente.',
      contactsTitle: 'Parla direttamente con noi.',
      conciergeText: 'Abbiamo raccolto e verificato consigli per aiutarti a vivere Cagliari. Il Concierge digitale incluso nel soggiorno organizza spiagge, ristoranti, luoghi da vedere, mobilità e informazioni pratiche.',
      conciergeHuman: 'La tecnologia organizza le informazioni. Noi restiamo il riferimento dell’ospite.',
      cityMore: 'Nel Concierge trovi la nostra selezione completa, riservata agli ospiti.',
      nearText: 'Abbiamo raccolto le cose essenziali che possono servire durante il soggiorno. Apri la ricerca sulla mappa per controllare sedi, orari e percorsi aggiornati.',
      step1: 'Verifichiamo le date e inviamo una proposta.',
      privacyShort: 'I dati inseriti vengono preparati sul tuo dispositivo e trasmessi tramite WhatsApp solo quando li invii dall’app. Usali esclusivamente per la richiesta di soggiorno.',
      faqA4: 'Gli orari vengono indicati nella proposta prima della conferma e l’arrivo viene organizzato con te.',
      faqA6: 'La richiesta non conferma il soggiorno. Riceverai disponibilità, prezzo, acconto, condizioni di cancellazione ed eventuale imposta di soggiorno nella proposta da accettare.',
      teaserIntro: 'I consigli per il soggiorno sono nel Concierge riservato agli ospiti. Ricevi le informazioni di accesso prima dell’arrivo.',
      privacyForm: 'Il modulo prepara sul dispositivo nome, date, numero di ospiti ed eventuali note. Questo sito statico non registra la richiesta in un archivio prenotazioni. Quando prosegui, il testo viene incluso nel collegamento WhatsApp; l’invio avviene quando premi invio nell’app. Puoi contattarci anche via email a piccolabellavista1@gmail.com.',
      privacyExternal: 'WhatsApp, Google Maps e Booking.com si aprono solo quando scegli i relativi collegamenti. Questi servizi gestiscono i dati secondo le proprie informative. Per informazioni sui dati della tua richiesta, scrivici.'
    },
    en: {
      heroAlt: 'Personal hospitality and a private digital Concierge to help you enjoy Cagliari.',
      service1Text: 'Before your stay, you receive clear directions and practical arrival information.',
      service3Text: 'For questions or local advice, we are here before and during your stay.',
      beachesText: 'From Poetto to the bays along the coast towards Villasimius: a taste of the area. The Concierge includes our advice to help plan your day.',
      bookingText: 'Complete the form and WhatsApp will open with your request ready. Press send in WhatsApp to send it directly.',
      contactsTitle: 'Talk to us directly.',
      conciergeText: 'We have collected and checked practical recommendations to help you enjoy Cagliari. The digital Concierge included with your stay organises beaches, restaurants, places to visit, transport and useful information.',
      conciergeHuman: 'Technology organises the information. We remain your human point of contact.',
      cityMore: 'The Concierge contains our full selection, reserved for guests.',
      nearText: 'We have gathered the essentials you may need during your stay. Open the map search to check current locations, opening times and routes.',
      step1: 'We check the dates and send you a proposal.',
      privacyShort: 'The information you enter is prepared on your device and sent through WhatsApp only when you send it from the app. Use it only for your stay request.',
      faqA4: 'Arrival and departure times are stated in the proposal before confirmation, and your arrival is organised with you.',
      faqA6: 'The request does not confirm the stay. You will receive availability, price, deposit, cancellation terms and any tourist tax in the proposal to accept.',
      teaserIntro: 'Stay recommendations are in the private guest Concierge. You receive access information before arrival.',
      privacyForm: 'The form prepares your name, dates, number of guests and optional notes on your device. This static site does not store the request in a booking database. When you continue, the text is included in the WhatsApp link; it is sent only when you press send in the app. You can also contact us at piccolabellavista1@gmail.com.',
      privacyExternal: 'WhatsApp, Google Maps and Booking.com open only when you choose their links. Those services process data under their own privacy policies. For questions about your request data, contact us.'
    },
    de: {
      heroAlt: 'Persönliche Gastfreundschaft und ein privater digitaler Concierge für deinen Aufenthalt in Cagliari.',
      service1Text: 'Vor dem Aufenthalt erhältst du klare Wegbeschreibungen und praktische Informationen zur Anreise.',
      service3Text: 'Bei Fragen oder für lokale Tipps sind wir vor und während des Aufenthalts für dich da.',
      beachesText: 'Vom Poetto bis zu den Buchten an der Küste Richtung Villasimius: ein erster Eindruck der Umgebung. Im Concierge findest du unsere Tipps für die Tagesplanung.',
      bookingText: 'Fülle das Formular aus: WhatsApp öffnet sich mit der vorbereiteten Anfrage. Sende sie dort direkt ab.',
      contactsTitle: 'Sprich direkt mit uns.',
      conciergeText: 'Wir haben praktische Empfehlungen gesammelt und geprüft, damit du Cagliari besser erleben kannst. Der digitale Concierge für Gäste ordnet Strände, Restaurants, Sehenswürdigkeiten, Mobilität und nützliche Informationen.',
      conciergeHuman: 'Die Technik ordnet die Informationen. Wir bleiben deine persönlichen Ansprechpartner.',
      cityMore: 'Im Concierge findest du unsere vollständige Auswahl, exklusiv für Gäste.',
      nearText: 'Wir haben die wichtigsten Dinge für deinen Aufenthalt zusammengestellt. Öffne die Kartensuche, um aktuelle Standorte, Öffnungszeiten und Wege zu prüfen.',
      step1: 'Wir prüfen die Reisedaten und senden dir ein Angebot.',
      privacyShort: 'Die eingegebenen Daten werden auf deinem Gerät vorbereitet und erst über WhatsApp übertragen, wenn du sie in der App sendest. Nutze sie nur für deine Aufenthaltsanfrage.',
      faqA4: 'An- und Abreisezeiten stehen vor der Bestätigung im Angebot; die Anreise wird mit dir abgestimmt.',
      faqA6: 'Die Anfrage bestätigt den Aufenthalt noch nicht. Verfügbarkeit, Preis, Anzahlung, Stornobedingungen und gegebenenfalls die Kurtaxe erhältst du im Angebot zur Annahme.',
      teaserIntro: 'Die Empfehlungen für den Aufenthalt findest du im privaten Concierge für Gäste. Die Zugangsinformationen erhältst du vor der Anreise.',
      privacyForm: 'Das Formular bereitet Name, Reisedaten, Gästezahl und optionale Hinweise auf deinem Gerät vor. Diese statische Website speichert die Anfrage nicht in einer Buchungsdatenbank. Wenn du fortfährst, wird der Text in den WhatsApp-Link eingefügt; gesendet wird er erst, wenn du ihn in der App abschickst. Du kannst uns auch per E-Mail an piccolabellavista1@gmail.com kontaktieren.',
      privacyExternal: 'WhatsApp, Google Maps und Booking.com öffnen sich nur, wenn du die entsprechenden Links auswählst. Diese Dienste verarbeiten Daten nach ihren eigenen Datenschutzbestimmungen. Bei Fragen zu den Daten deiner Anfrage kannst du uns schreiben.'
    }
  };
  Object.entries(copyOverrides).forEach(([lang, values]) => Object.assign(dictionaries[lang], values));

  const conciergeAccessLabels = {
    it: 'Area ospiti · Accedi al Concierge',
    en: 'Guest area · Open the Concierge',
    de: 'Gästebereich · Concierge öffnen'
  };
  const conciergeContainer = document.querySelector('#concierge > div');
  let conciergeAccess = null;
  if (conciergeContainer) {
    const wrap = document.createElement('p');
    wrap.className = 'concierge-access';
    conciergeAccess = document.createElement('a');
    conciergeAccess.className = 'button primary';
    conciergeAccess.href = 'https://piccolabellavista-guida-ospiti.pages.dev/';
    conciergeAccess.target = '_blank';
    conciergeAccess.rel = 'noreferrer';
    wrap.append(conciergeAccess);
    conciergeContainer.append(wrap);
  }

  const form = document.querySelector('#bookingForm');
  const message = document.querySelector('#bookingMessage');
  let language = 'it';
  const copy = {
    it: {invalid:'Controlla nome, date e numero di ospiti (1 o 2). La partenza deve seguire l’arrivo e l’arrivo non può essere nel passato.',ready:'Richiesta preparata. Premi invio su WhatsApp per inviarla.',title:'Richiesta di disponibilità — Piccolabellavista',name:'Nome',arrival:'Arrivo',departure:'Partenza',guests:'Ospiti',notes:'Note'},
    en: {invalid:'Check your name, dates and guest count (1 or 2). Departure must follow arrival and arrival cannot be in the past.',ready:'Request prepared. Press send in WhatsApp to send it.',title:'Availability request — Piccolabellavista',name:'Name',arrival:'Arrival',departure:'Departure',guests:'Guests',notes:'Notes'},
    de: {invalid:'Bitte Name, Reisedaten und Gästezahl (1 oder 2) prüfen. Die Abreise muss nach der Anreise liegen und die Anreise darf nicht in der Vergangenheit liegen.',ready:'Anfrage vorbereitet. Sende sie in WhatsApp ab.',title:'Verfügbarkeitsanfrage — Piccolabellavista',name:'Name',arrival:'Anreise',departure:'Abreise',guests:'Gäste',notes:'Anmerkungen'}
  };
  function applyLanguage(lang) {
    language = Object.hasOwn(dictionaries, lang) ? lang : 'it';
    document.documentElement.lang = language;
    const dictionary = dictionaries[language];
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = dictionary[el.dataset.i18n]; });
    for (const attribute of ['placeholder', 'alt', 'aria-label']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(el => {
        el.setAttribute(attribute, dictionary[el.getAttribute(`data-i18n-${attribute}`)]);
      });
    }
    if (conciergeAccess) conciergeAccess.textContent = conciergeAccessLabels[language];
    document.querySelectorAll('[data-lang]').forEach(button => {
      const active = button.dataset.lang === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (message) message.textContent = '';
    try { localStorage.setItem('pbv-lingua', language); } catch { /* Storage is optional. */ }
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
  let saved;
  try { saved = localStorage.getItem('pbv-lingua'); } catch { /* Storage is optional. */ }
  applyLanguage(saved || 'it');
  if (!form) return;
  // Calendar dates use the guest's local day; UTC conversion can shift it.
  function calendarDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00`);
    return !Number.isNaN(date.getTime()) && calendarDate(date) === value;
  }
  function updateLimits() {
    form.elements.arrival.min = calendarDate(new Date());
    const arrival = form.elements.arrival.value;
    const next = validDate(arrival) ? new Date(`${arrival}T12:00:00`) : new Date();
    next.setDate(next.getDate() + 1);
    form.elements.departure.min = calendarDate(next);
  }
  form.elements.arrival.addEventListener('change', updateLimits);
  window.addEventListener('pageshow', updateLimits);
  updateLimits();
  form.addEventListener('submit', event => {
    event.preventDefault();
    updateLimits();
    const values = Object.fromEntries(new FormData(form));
    const text = copy[language];
    const guests = Number(values.guests);
    const valid = values.fullName.trim() && validDate(values.arrival) && validDate(values.departure)
      && values.arrival >= calendarDate(new Date()) && values.departure > values.arrival
      && Number.isInteger(guests) && guests >= 1 && guests <= 2;
    if (!valid || !form.checkValidity()) {
      message.textContent = text.invalid;
      message.className = 'form-message error';
      form.reportValidity();
      return;
    }
    const lines = [text.title, `${text.name}: ${values.fullName.trim()}`, `${text.arrival}: ${values.arrival}`, `${text.departure}: ${values.departure}`, `${text.guests}: ${guests}`];
    if (values.notes.trim()) lines.push(`${text.notes}: ${values.notes.trim()}`);
    message.textContent = text.ready;
    message.className = 'form-message success';
    // Same-tab navigation works without relying on a popup being allowed.
    window.location.assign(`https://wa.me/393931104422?text=${encodeURIComponent(lines.join('\n'))}`);
  });
  form.querySelector('[type="submit"]').disabled = false;
})();