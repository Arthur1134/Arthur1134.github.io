/* My Library service worker: app shell offline (data lives in IndexedDB, never in this cache). */
const CACHE = "mylibrary-shell-v1.0.0";
const SHELL = ["./", "index.html", "styles.css", "app.js", "config.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("mylibrary-") && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.includes("/stub/")) return; // Google APIs: network only
  const scopePath = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scopePath)) return;
  if (req.mode === "navigate") {   // network first (fresh app), fall back to cached shell offline
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put("index.html", cp)); return r; })
      .catch(() => caches.match("index.html", {ignoreSearch: true})));
    return;
  }
  // stale-while-revalidate for the shell files
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(req, {ignoreSearch: true});
    const net = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
