(() => {
  const fallbackPath = "assets/foto/booking/panoramica-allogio.jpg";
  const heroPath = "assets/foto/booking/vista-verso-poetto-mare-hero.jpg";
  const setHeroImage = (imagePath) => {
    document.documentElement.style.setProperty("--hero-image", `url("${imagePath}")`);
  };
  const image = new Image();
  image.onload = () => setHeroImage(heroPath);
  image.onerror = () => setHeroImage(fallbackPath);
  image.src = heroPath;
  setHeroImage(fallbackPath);
})();

(() => {
  const script = document.createElement("script");
  script.src = "gallery-injector.js";
  script.async = false;
  document.head.appendChild(script);
})();
