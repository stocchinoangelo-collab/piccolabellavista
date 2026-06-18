(() => {
  const originalScript = document.createElement("script");
  originalScript.src = "https://cdn.jsdelivr.net/gh/stocchinoangelo-collab/piccolabellavista@775fe889c339a793dbedc1563bb6139ff9c60818/script.js";
  originalScript.async = false;
  document.head.appendChild(originalScript);

  const copy = {
    it: {
      nav: "Foto",
      kicker: "Gli spazi",
      title: "Guarda Piccola Bellavista.",
      intro: "Foto reali dell'alloggio: zona giorno, letto matrimoniale, bagno e spazio pranzo con le dotazioni disponibili.",
      panorama: "Panoramica dell'alloggio",
      bedroom: "Letto matrimoniale",
      bathroom: "Bagno privato",
      dining: "Zona pranzo e dotazioni",
      panoramaAlt: "Panoramica della zona giorno con cucina, frigorifero, tavolo e televisore",
      bedroomAlt: "Letto matrimoniale preparato con biancheria bianca e cuscini verdi",
      bathroomAlt: "Bagno privato con lavabo, WC, bidet e doccia",
      diningAlt: "Zona pranzo con tavolo, sedie, microonde, friggitrice ad aria e armadio"
    },
    en: {
      nav: "Photos",
      kicker: "The space",
      title: "Take a look inside Piccola Bellavista.",
      intro: "Real photos of the accommodation: living area, double bed, private bathroom and dining area with the available appliances.",
      panorama: "Accommodation overview",
      bedroom: "Double bed",
      bathroom: "Private bathroom",
      dining: "Dining area and appliances",
      panoramaAlt: "Overview of the living area with kitchen, refrigerator, table and television",
      bedroomAlt: "Double bed prepared with white linen and green cushions",
      bathroomAlt: "Private bathroom with washbasin, toilet, bidet and shower",
      diningAlt: "Dining area with table, chairs, microwave, air fryer and wardrobe"
    }
  };

  function addStyles() {
    if (document.getElementById("photo-gallery-styles")) return;
    const style = document.createElement("style");
    style.id = "photo-gallery-styles";
    style.textContent = `
      .photo-gallery .section-lead { max-width: 760px; }
      .photo-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        margin-top: 28px;
      }
      .photo-card {
        margin: 0;
        overflow: hidden;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 14px 34px rgba(48, 33, 27, 0.12);
      }
      .photo-card a { display: block; }
      .photo-card img {
        display: block;
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        transition: transform 180ms ease;
      }
      .photo-card a:hover img,
      .photo-card a:focus-visible img { transform: scale(1.015); }
      .photo-card figcaption {
        padding: 14px 16px 16px;
        font-weight: 700;
      }
      @media (max-width: 720px) {
        .photo-grid { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function setShareImage() {
    const imagePath = "assets/foto/booking/panoramica-alloggio.jpg";
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (ogImage) ogImage.setAttribute("content", imagePath);
    if (twitterImage) twitterImage.setAttribute("content", imagePath);
  }

  function applyLanguage(language) {
    const lang = copy[language] ? language : "it";
    const text = copy[lang];
    const navLink = document.querySelector('a[href="#foto"]');
    if (navLink) navLink.textContent = text.nav;

    document.querySelectorAll("[data-photo-copy]").forEach((element) => {
      const key = element.dataset.photoCopy;
      if (text[key]) element.textContent = text[key];
    });

    document.querySelectorAll("[data-photo-alt]").forEach((image) => {
      const key = image.dataset.photoAlt;
      if (text[key]) image.alt = text[key];
    });
  }

  function injectGallery() {
    if (document.getElementById("foto")) return;
    const houseSection = document.getElementById("casa");
    if (!houseSection) return;

    addStyles();
    setShareImage();

    const section = document.createElement("section");
    section.id = "foto";
    section.className = "section photo-gallery";
    section.setAttribute("aria-labelledby", "foto-title");
    section.innerHTML = `
      <p class="eyebrow" data-photo-copy="kicker">Gli spazi</p>
      <h2 id="foto-title" data-photo-copy="title">Guarda Piccola Bellavista.</h2>
      <p class="section-lead" data-photo-copy="intro">Foto reali dell'alloggio: zona giorno, letto matrimoniale, bagno e spazio pranzo con le dotazioni disponibili.</p>
      <div class="photo-grid">
        <figure class="photo-card">
          <a href="assets/foto/booking/panoramica-alloggio.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/panoramica-alloggio.jpg" data-photo-alt="panoramaAlt" alt="Panoramica della zona giorno con cucina, frigorifero, tavolo e televisore">
          </a>
          <figcaption data-photo-copy="panorama">Panoramica dell'alloggio</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/camera-letto.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/camera-letto.jpg" data-photo-alt="bedroomAlt" alt="Letto matrimoniale preparato con biancheria bianca e cuscini verdi" loading="lazy">
          </a>
          <figcaption data-photo-copy="bedroom">Letto matrimoniale</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/bagno.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/bagno.jpg" data-photo-alt="bathroomAlt" alt="Bagno privato con lavabo, WC, bidet e doccia" loading="lazy">
          </a>
          <figcaption data-photo-copy="bathroom">Bagno privato</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/zona-pranzo.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/zona-pranzo.jpg" data-photo-alt="diningAlt" alt="Zona pranzo con tavolo, sedie, microonde, friggitrice ad aria e armadio" loading="lazy">
          </a>
          <figcaption data-photo-copy="dining">Zona pranzo e dotazioni</figcaption>
        </figure>
      </div>
    `;
    houseSection.insertAdjacentElement("afterend", section);

    const nav = document.querySelector(".site-header nav");
    if (nav && !nav.querySelector('a[href="#foto"]')) {
      const photoLink = document.createElement("a");
      photoLink.href = "#foto";
      photoLink.textContent = "Foto";
      const houseLink = nav.querySelector('a[href="#casa"]');
      if (houseLink) houseLink.insertAdjacentElement("afterend", photoLink);
      else nav.prepend(photoLink);
    }

    const activeButton = document.querySelector(".lang-button.active");
    applyLanguage(activeButton?.dataset.lang || document.documentElement.lang || "it");

    document.querySelectorAll(".lang-button").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.lang));
    });

    new MutationObserver(() => applyLanguage(document.documentElement.lang))
      .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectGallery, { once: true });
  } else {
    injectGallery();
  }
})();
