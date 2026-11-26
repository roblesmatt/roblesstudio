// Aumente a versão a cada atualização dos arquivos (v1 -> v2 ...)
const CACHE = 'robles-v2';
const FILES = [
  './', './index.html', './style.css', './manifest.webmanifest',
  './1-core-bridge.js', './2-ui-personas.js', './3-ui-toolbars.js',
  './4-ui-drawers.js', './5-viewport-engine.js',
  './js/vetor/01-move.js', './js/vetor/02-artboard.js', './js/vetor/03-corner.js',
  './js/vetor/04-contour.js', './js/vetor/vetor.js',
  './pixel.js', './video.js', './3d.js',
  './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(FILES.map((f) => c.add(f).catch(() => {}))) // um arquivo ausente não derruba a instalação
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro (pega atualizações); se estiver offline, usa o cache
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html')))
  );
});
