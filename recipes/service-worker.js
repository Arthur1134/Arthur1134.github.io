// Family Recipe Book v2.3 — offline support. Bump CACHE when app files change.
// The text reader (Tesseract, ~7 MB) is kept in its own cache so app updates do not re-download it.
const CACHE = 'recipe-book-v2.3';
const OCR_CACHE = 'recipe-book-ocr-v7.0.0';
const ASSETS = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon.ico'];
const OCR_ASSETS = ['./vendor/tesseract/tesseract.min.js', './vendor/tesseract/worker.min.js', './vendor/tesseract/lang/eng.traineddata.gz'];

self.addEventListener('install', (event) => {
  event.waitUntil(Promise.all([
    caches.open(CACHE).then((c) => Promise.all(ASSETS.map((u) => c.add(u).catch(() => null)))),
    caches.open(OCR_CACHE).then((c) => Promise.all(OCR_ASSETS.map((u) => c.match(u).then((hit) => hit || c.add(u)).catch(() => null))))
  ]).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('recipe-book-') && k !== CACHE && k !== OCR_CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL('./', self.location).pathname)) return;   // stay out of other apps (e.g. /grocery/)
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html'))));
    return;
  }
  const isOcr = url.pathname.includes('/vendor/tesseract/');   // the wasm core picked at run time is cached on first use
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(isOcr ? OCR_CACHE : CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
