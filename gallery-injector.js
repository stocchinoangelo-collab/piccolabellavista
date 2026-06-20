(() => {
  const originalScript = document.createElement("script");
  originalScript.src = "script-original.js";
  originalScript.async = false;
  document.head.appendChild(originalScript);

  const copy = {
    it: {
      nav: "Foto",
      kicker: "Gli spazi",
      title: "Guarda Piccola Bellavista.",
      intro: "Foto reali dell'alloggio: zona giorno, letto matrimoniale, bagno e spazio pranzo con le dotazioni disponibili.",
      panorama: "Panoramica dell'alloggio",
      kitchen: "Angolo cucina e zona giorno",
      bedroom: "Letto matrimoniale",
      bathroom: "Bagno privato",
      dining: "Zona pranzo e dotazioni",
      viewBalcony: "Vista dal balcone al tramonto",
      viewLagoon: "Verso la laguna e i monti",
      viewDusk: "Vista al crepuscolo",
      viewDistrict: "Il quartiere verso la laguna",
      viewRooftops: "Tetti e laguna all'orizzonte",
      viewKicker: "La vista",
      viewTitle: "Vista verso Poetto e mare",
      viewText: "Dal balcone lo sguardo si apre verso lo stagno, il Poetto e il mare di Cagliari. Non è una struttura fronte mare, ma offre una vista ampia e luminosa che rende piacevole il soggiorno.",
      hospitalTitle: "Comoda per ospedali e trasferte",
      hospitalText: "La posizione è utile anche per chi deve raggiungere Brotzu, Oncologico e Microcitemico. Una soluzione pratica per accompagnatori, visite, brevi permanenze o trasferte a Cagliari.",
      panoramaAlt: "Panoramica della zona giorno con cucina, frigorifero, tavolo e televisore",
      kitchenAlt: "Angolo cucina con lavello, piano cottura, cappa, frigorifero, pensili e tavola apparecchiata",
      bedroomAlt: "Letto matrimoniale preparato con biancheria bianca e cuscini verdi",
      bathroomAlt: "Bagno privato con lavabo, WC, bidet e doccia",
      diningAlt: "Zona pranzo con tavolo, sedie, microonde, friggitrice ad aria e armadio",
      viewBalconyAlt: "Vista dal balcone verso il quartiere di Pirri e la laguna nella luce del tramonto",
      viewLagoonAlt: "Vista panoramica verso la laguna di Cagliari e i monti all'orizzonte",
      viewDuskAlt: "Vista al crepuscolo con il cielo viola sopra il quartiere e la laguna",
      viewDistrictAlt: "Vista del quartiere di Pirri che si apre verso la laguna e il mare",
      viewRooftopsAlt: "Vista sui tetti del quartiere con la laguna e i monti sullo sfondo"
    },
    en: {
      nav: "Photos",
      kicker: "The space",
      title: "Take a look inside Piccola Bellavista.",
      intro: "Real photos of the accommodation: living area, double bed, private bathroom and dining area with the available appliances.",
      panorama: "Accommodation overview",
      kitchen: "Kitchenette and living area",
      bedroom: "Double bed",
      bathroom: "Private bathroom",
      dining: "Dining area and appliances",
      viewBalcony: "Balcony view at sunset",
      viewLagoon: "Toward the lagoon and the hills",
      viewDusk: "View at dusk",
      viewDistrict: "The neighbourhood toward the lagoon",
      viewRooftops: "Rooftops and lagoon on the horizon",
      viewKicker: "The view",
      viewTitle: "View toward Poetto and the sea",
      viewText: "From the balcony, the view opens toward the lagoon, Poetto and the sea of Cagliari. It is not a beachfront property, but it offers a wide and bright view that makes the stay more pleasant.",
      hospitalTitle: "Convenient for hospitals and work trips",
      hospitalText: "The location is also useful for guests who need to reach Brotzu, Oncologico and Microcitemico hospitals. A practical base for companions, appointments, short stays or work trips in Cagliari.",
      panoramaAlt: "Overview of the living area with kitchen, refrigerator, table and television",
      kitchenAlt: "Kitchenette with sink, hob, hood, refrigerator, cabinets and a set table",
      bedroomAlt: "Double bed prepared with white linen and green cushions",
      bathroomAlt: "Private bathroom with washbasin, toilet, bidet and shower",
      diningAlt: "Dining area with table, chairs, microwave, air fryer and wardrobe",
      viewBalconyAlt: "Balcony view over the Pirri neighbourhood and the lagoon in the sunset light",
      viewLagoonAlt: "Panoramic view toward the Cagliari lagoon and the hills on the horizon",
      viewDuskAlt: "View at dusk with a purple sky over the neighbourhood and the lagoon",
      viewDistrictAlt: "View of the Pirri neighbourhood opening toward the lagoon and the sea",
      viewRooftopsAlt: "View over the neighbourhood rooftops with the lagoon and hills in the background"
    }
  };

  function addStyles() {
    if (document.getElementById("photo-gallery-styles")) return;
    const style = document.createElement("style");
    style.id = "photo-gallery-styles";
    style.textContent = `
      .photo-gallery .section-lead, .view-section .section-lead { max-width: 760px; }
      .view-section {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(260px, 420px);
        gap: clamp(20px, 4vw, 44px);
        align-items: stretch;
      }
      .view-card {
        border-radius: 24px;
        padding: clamp(22px, 4vw, 34px);
        background: #fff;
        box-shadow: 0 14px 34px rgba(48, 33, 27, 0.12);
      }
      .view-card h3 { margin-top: 0; }
      .view-card p { margin-bottom: 0; color: var(--muted); }
      @media (max-width: 820px) {
        .view-section { grid-template-columns: 1fr; }
      }
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
    const fallbackPath = "assets/foto/booking/panoramica-alloggio.jpg";
    const heroPath = "assets/foto/booking/vista-verso-poetto-mare-hero.jpg";
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const applyImage = (imagePath) => {
      if (ogImage) ogImage.setAttribute("content", imagePath);
      if (twitterImage) twitterImage.setAttribute("content", imagePath);
    };
    const image = new Image();
    image.onload = () => applyImage(heroPath);
    image.onerror = () => applyImage(fallbackPath);
    image.src = heroPath;
    applyImage(fallbackPath);
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
            <img src="assets/foto/booking/panoramica-alloggio.jpg" data-photo-alt="panoramaAlt" alt="Panoramica della zona giorno con cucina, frigorifero, tavolo e televisore" loading="lazy">
          </a>
          <figcaption data-photo-copy="panorama">Panoramica dell'alloggio</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/cucina-zona-giorno.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/cucina-zona-giorno.jpg" data-photo-alt="kitchenAlt" alt="Angolo cucina con lavello, piano cottura, cappa, frigorifero, pensili e tavola apparecchiata" loading="lazy">
          </a>
          <figcaption data-photo-copy="kitchen">Angolo cucina e zona giorno</figcaption>
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
        <figure class="photo-card">
          <a href="assets/foto/booking/vista-balcone-tramonto.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/vista-balcone-tramonto.jpg" data-photo-alt="viewBalconyAlt" alt="Vista dal balcone verso il quartiere di Pirri e la laguna nella luce del tramonto" loading="lazy">
          </a>
          <figcaption data-photo-copy="viewBalcony">Vista dal balcone al tramonto</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/vista-laguna-monti.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/vista-laguna-monti.jpg" data-photo-alt="viewLagoonAlt" alt="Vista panoramica verso la laguna di Cagliari e i monti all'orizzonte" loading="lazy">
          </a>
          <figcaption data-photo-copy="viewLagoon">Verso la laguna e i monti</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/vista-crepuscolo.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/vista-crepuscolo.jpg" data-photo-alt="viewDuskAlt" alt="Vista al crepuscolo con il cielo viola sopra il quartiere e la laguna" loading="lazy">
          </a>
          <figcaption data-photo-copy="viewDusk">Vista al crepuscolo</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/vista-quartiere-laguna.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/vista-quartiere-laguna.jpg" data-photo-alt="viewDistrictAlt" alt="Vista del quartiere di Pirri che si apre verso la laguna e il mare" loading="lazy">
          </a>
          <figcaption data-photo-copy="viewDistrict">Il quartiere verso la laguna</figcaption>
        </figure>
        <figure class="photo-card">
          <a href="assets/foto/booking/vista-tetti-laguna.jpg" target="_blank" rel="noreferrer">
            <img src="assets/foto/booking/vista-tetti-laguna.jpg" data-photo-alt="viewRooftopsAlt" alt="Vista sui tetti del quartiere con la laguna e i monti sullo sfondo" loading="lazy">
          </a>
          <figcaption data-photo-copy="viewRooftops">Tetti e laguna all'orizzonte</figcaption>
        </figure>
      </div>
    `;
    houseSection.insertAdjacentElement("afterend", section);

    const viewSection = document.createElement("section");
    viewSection.id = "vista-poetto";
    viewSection.className = "section view-section warm-section";
    viewSection.setAttribute("aria-labelledby", "vista-poetto-title");
    viewSection.innerHTML = `
      <div>
        <p class="eyebrow" data-photo-copy="viewKicker">La vista</p>
        <h2 id="vista-poetto-title" data-photo-copy="viewTitle">Vista verso Poetto e mare</h2>
        <p class="section-lead" data-photo-copy="viewText">Dal balcone lo sguardo si apre verso lo stagno, il Poetto e il mare di Cagliari. Non è una struttura fronte mare, ma offre una vista ampia e luminosa che rende piacevole il soggiorno.</p>
      </div>
      <article class="view-card">
        <h3 data-photo-copy="hospitalTitle">Comoda per ospedali e trasferte</h3>
        <p data-photo-copy="hospitalText">La posizione è utile anche per chi deve raggiungere Brotzu, Oncologico e Microcitemico. Una soluzione pratica per accompagnatori, visite, brevi permanenze o trasferte a Cagliari.</p>
      </article>
    `;
    section.insertAdjacentElement("afterend", viewSection);

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
