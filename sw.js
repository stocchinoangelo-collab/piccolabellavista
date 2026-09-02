/* Piccolabellavista service worker — V3.2
   Fix rispetto a v3.1:
   - js/data.js (eventi, sagre, prezzi, Wi-Fi...) era servito cache-first
     come css/js statici: un ospite che aveva già visitato la pagina non
     vedeva contenuti aggiornati finché non si bumpava manualmente CACHE.
     Ora data.js usa network-first con fallback su cache, come già avveniva
     per il CSV di Google Docs.
   - Versione cache bumpata (v31 -> v32): NECESSARIO farlo ad ogni release
     che tocca gli ASSETS precaricati, altrimenti i client con la PWA già
     installata continuano a vedere i file vecchi.
*/
const CACHE = "pbv-v32";
const ASSETS = [
  "./index.html",
  "css/style.css",
  "js/i18n.js",
  "js/data.js",
  "js/app.js",
  "manifest.webmanifest",
  "icon.svg"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(ASSETS).catch(err => console.error('Cache install failed:', err))
    )
  );
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(
      ks.filter(k => k !== CACHE && k !== "pbv-csv").map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);

  /* METEO → sempre live */
  if (u.hostname === "api.open-meteo.com") return;

  /* CSV / Google → network first */
  if (u.hostname === "docs.google.com" || u.hostname.endsWith("googleusercontent.com")) {
    e.respondWith(
      fetch(e.request).then(res => {
        try {
          const cp = res.clone();
          caches.open("pbv-csv").then(c => c.put(e.request, cp));
        } catch (_) {}
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  /* DATA.JS → network first: contiene eventi/sagre/prezzi che cambiano
     più spesso di CSS/JS statici. Cache-first li avrebbe tenuti bloccati
     alla versione vista al primo accesso. */
  if (u.origin === location.origin && /\/js\/data\.js$/.test(u.pathname)) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          try {
            const cp = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, cp));
          } catch (_) {}
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  /* STATIC → cache first */
  if (u.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(r =>
        r || fetch(e.request).then(r2 => {
          if (r2.ok) {
            try {
              const cp = r2.clone();
              caches.open(CACHE).then(c => c.put(e.request, cp));
            } catch (_) {}
          }
          return r2;
        })
      )
    );
  }
});
