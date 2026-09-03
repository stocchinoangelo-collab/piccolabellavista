/* ============================================================
   Piccolabellavista — service worker di DISINSTALLAZIONE
   ============================================================

   Perché questo file esiste.

   Il 2 settembre 2026 è finito su questo sito, per errore, il service
   worker della guida-ospiti (un altro progetto). Questo sito non ne ha
   mai avuto uno e non ne ha bisogno: è un sito vetrina, non una app
   offline.

   Il problema è che un service worker, una volta installato, resta nel
   browser di chi ha visitato il sito anche dopo che il file è stato
   cancellato dal server: continua a servire dalla propria cache la
   pagina sbagliata, e l'utente non ha modo di accorgersene.
   Cancellare il file non basta.

   Questo file lo disinstalla: si installa al posto del precedente,
   svuota tutte le cache, si cancella da solo e ricarica le finestre
   aperte, che a quel punto prendono la pagina vera dalla rete.

   Va lasciato online qualche settimana, il tempo che tutti i visitatori
   di settembre tornino almeno una volta. Poi si può eliminare.
   ============================================================ */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    /* 1. Via tutte le cache lasciate dal service worker sbagliato. */
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));

    /* 2. Il service worker si cancella da solo. */
    await self.registration.unregister();

    /* 3. Le pagine già aperte vengono ricaricate, così l'utente vede
          subito il sito vero invece della copia in cache. */
    const windows = await self.clients.matchAll({ type: "window" });
    windows.forEach(client => client.navigate(client.url));
  })());
});

/* Nessun gestore "fetch": ogni richiesta va direttamente in rete,
   come su un sito senza service worker. */
