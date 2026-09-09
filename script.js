/* One language controller and one WhatsApp submit handler. No data is stored. */
(() => {
  'use strict';
  const dictionaries = window.PBV_TRANSLATIONS;
  const form = document.querySelector('#bookingForm');
  const message = document.querySelector('#bookingMessage');
  let language = 'it';
  const copy = {
    it: {invalid:'Controlla nome, date e numero di ospiti (1 o 2). La partenza deve seguire l’arrivo e l’arrivo non può essere nel passato.',ready:'Richiesta preparata. Premi invio su WhatsApp per inviarla ad Angelo e Viviana.',title:'Richiesta di disponibilità — Piccolabellavista',name:'Nome',arrival:'Arrivo',departure:'Partenza',guests:'Ospiti',notes:'Note'},
    en: {invalid:'Check your name, dates and guest count (1 or 2). Departure must follow arrival and arrival cannot be in the past.',ready:'Request prepared. Press send in WhatsApp to send it to Angelo and Viviana.',title:'Availability request — Piccolabellavista',name:'Name',arrival:'Arrival',departure:'Departure',guests:'Guests',notes:'Notes'},
    de: {invalid:'Bitte Name, Reisedaten und Gästezahl (1 oder 2) prüfen. Die Abreise muss nach der Anreise liegen und die Anreise darf nicht in der Vergangenheit liegen.',ready:'Anfrage vorbereitet. Sende sie in WhatsApp an Angelo und Viviana ab.',title:'Verfügbarkeitsanfrage — Piccolabellavista',name:'Name',arrival:'Anreise',departure:'Abreise',guests:'Gäste',notes:'Anmerkungen'}
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
