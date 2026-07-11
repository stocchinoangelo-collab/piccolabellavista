(() => {
  const BRAND = "Piccolabellavista";
  const copy = {
    it: {
      bookingTitle: "Chiedi disponibilità e invia una richiesta.",
      bookingText: "Compila il modulo: si aprirà WhatsApp con la richiesta già pronta. La prenotazione sarà confermata solo dopo il controllo delle date.",
      calendarTitle: "Chiedi la disponibilità delle date",
      rule2Title: "Orari di silenzio",
      contactsText: "Puoi compilare il modulo e inviare la richiesta tramite WhatsApp, scriverci direttamente o mandare una email.",
      invalidDates: "La data di partenza deve essere successiva alla data di arrivo.",
      tooManyGuests: `${BRAND} può ospitare al massimo 2 persone.`,
      whatsappReady: "Si apre WhatsApp con la richiesta già compilata: premi invio per confermare."
    },
    en: {
      bookingTitle: "Ask about availability and send a request.",
      bookingText: "Complete the form: WhatsApp will open with your request ready to send. The booking is confirmed only after the dates have been checked.",
      calendarTitle: "Ask whether your dates are available",
      rule2Title: "Quiet hours",
      contactsText: "Complete the form and send the request through WhatsApp, message us directly or send an email.",
      invalidDates: "The departure date must be after the arrival date.",
      tooManyGuests: `${BRAND} can accommodate a maximum of 2 guests.`,
      whatsappReady: "WhatsApp is opening with your request ready to send. Press send to confirm."
    }
  };

  const getLanguage = () => document.documentElement.lang === "en" ? "en" : "it";
  const normalizeBrand = (value) => value
    .replaceAll("PICCOLA BELLAVISTA", BRAND)
    .replaceAll("Piccola Bellavista", BRAND)
    .replaceAll("piccola bellavista", BRAND.toLowerCase());

  function normalizeBrandEverywhere(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const next = normalizeBrand(node.nodeValue || "");
      if (next !== node.nodeValue) node.nodeValue = next;
    });

    root.querySelectorAll?.("[aria-label], [alt], [title], [placeholder]").forEach((element) => {
      ["aria-label", "alt", "title", "placeholder"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const current = element.getAttribute(attribute) || "";
        const next = normalizeBrand(current);
        if (next !== current) element.setAttribute(attribute, next);
      });
    });
  }

  function applyCorrectCopy() {
    const dictionary = copy[getLanguage()];
    Object.entries(dictionary).forEach(([key, value]) => {
      if (["invalidDates", "tooManyGuests", "whatsappReady"].includes(key)) return;
      const element = document.querySelector(`[data-i18n="${key}"]`);
      if (element) element.textContent = value;
    });
    normalizeBrandEverywhere();
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
      event.preventDefault();
      event.stopImmediatePropagation();

      const dictionary = copy[getLanguage()];
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const guestCount = Number(payload.guests || 0);
      const datesInvalid = payload.arrival && payload.departure && payload.departure <= payload.arrival;

      if (message) {
        message.textContent = "";
        message.className = "form-message";
      }

      if (guestCount > 2 || datesInvalid) {
        if (message) {
          message.textContent = guestCount > 2 ? dictionary.tooManyGuests : dictionary.invalidDates;
          message.classList.add("error");
        }
        return;
      }

      const lines = [
        `Richiesta prenotazione - ${BRAND}`,
        `Nome: ${payload.fullName || ""}`,
        `Telefono: ${payload.phone || ""}`,
        `Email: ${payload.email || ""}`,
        `Arrivo: ${payload.arrival || ""}`,
        `Partenza: ${payload.departure || ""}`,
        `Ospiti: ${payload.guests || ""}`,
        `Note: ${payload.notes || ""}`
      ];
      const whatsappUrl = `https://wa.me/393931104422?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(whatsappUrl, "_blank", "noopener");

      if (message) {
        message.textContent = dictionary.whatsappReady;
        message.classList.add("success");
      }
      form.reset();
      updateDepartureLimit();
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

  const observer = new MutationObserver(() => normalizeBrandEverywhere());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
