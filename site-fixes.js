(() => {
  const copy = {
    it: {
      bookingTitle: "Chiedi disponibilità e invia una richiesta.",
      bookingText: "Compila il modulo: si aprirà WhatsApp con la richiesta già pronta. La prenotazione sarà confermata solo dopo il controllo delle date.",
      calendarTitle: "Chiedi la disponibilità delle date",
      rule2Title: "Orari di silenzio",
      contactsText: "Puoi compilare il modulo e inviare la richiesta tramite WhatsApp, scriverci direttamente o mandare una email.",
      invalidDates: "La data di partenza deve essere successiva alla data di arrivo.",
      tooManyGuests: "Piccola Bellavista può ospitare al massimo 2 persone."
    },
    en: {
      bookingTitle: "Ask about availability and send a request.",
      bookingText: "Complete the form: WhatsApp will open with your request ready to send. The booking is confirmed only after the dates have been checked.",
      calendarTitle: "Ask whether your dates are available",
      rule2Title: "Quiet hours",
      contactsText: "Complete the form and send the request through WhatsApp, message us directly or send an email.",
      invalidDates: "The departure date must be after the arrival date.",
      tooManyGuests: "Piccola Bellavista can accommodate a maximum of 2 guests."
    }
  };

  const getLanguage = () => document.documentElement.lang === "en" ? "en" : "it";

  function applyCorrectCopy() {
    const dictionary = copy[getLanguage()];
    Object.entries(dictionary).forEach(([key, value]) => {
      if (key === "invalidDates" || key === "tooManyGuests") return;
      const element = document.querySelector(`[data-i18n="${key}"]`);
      if (element) element.textContent = value;
    });
  }

  function configureBookingForm() {
    const form = document.querySelector("#bookingForm");
    if (!form || form.dataset.capacityConfigured === "true") return;

    const guests = form.elements.guests;
    const arrival = form.elements.arrival;
    const departure = form.elements.departure;
    const message = document.querySelector("#bookingMessage");

    if (guests) {
      guests.max = "2";
      guests.setAttribute("aria-label", "Numero ospiti, massimo 2");
      if (Number(guests.value) > 2) guests.value = "2";
    }

    const updateDepartureLimit = () => {
      if (!arrival?.value || !departure) return;
      const start = new Date(`${arrival.value}T00:00:00`);
      start.setDate(start.getDate() + 1);
      const minimum = start.toISOString().slice(0, 10);
      departure.min = minimum;
      if (departure.value && departure.value < minimum) departure.value = "";
    };

    arrival?.addEventListener("change", updateDepartureLimit);
    updateDepartureLimit();

    form.addEventListener("submit", (event) => {
      const dictionary = copy[getLanguage()];
      const guestCount = Number(guests?.value || 0);
      const datesInvalid = arrival?.value && departure?.value && departure.value <= arrival.value;

      if (guestCount > 2 || datesInvalid) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (message) {
          message.textContent = guestCount > 2 ? dictionary.tooManyGuests : dictionary.invalidDates;
          message.className = "form-message error";
        }
      }
    }, true);

    form.dataset.capacityConfigured = "true";
  }

  function applyFixes() {
    applyCorrectCopy();
    configureBookingForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFixes, { once: true });
  } else {
    applyFixes();
  }

  window.addEventListener("load", () => setTimeout(applyFixes, 0), { once: true });
  document.addEventListener("click", (event) => {
    if (event.target.closest(".lang-button")) setTimeout(applyCorrectCopy, 0);
  });
})();
