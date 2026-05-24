const CACHE = 'kuran-ezber-v3';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-512.png',
  './icon-192.png'
];

// Kurulum: shell dosyalarını önbelleğe al
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL.filter(u => {
      // PNG ikonlar henüz yoksa hata vermesin
      try { return true; } catch { return false; }
    }))).then(() => self.skipWaiting())
  );
});

// Etkinleştirme: eski önbellekleri temizle
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: ses dosyaları ağdan, geri kalanı önbellekten
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Ses dosyaları: sadece ağdan (büyük dosyalar, önbelleğe alınmaz)
  if (url.includes('.mp3') || url.includes('everyayah') || url.includes('mp3quran') || url.includes('islamic.network')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
    return;
  }

  // Google Fonts: ağdan dene, yoksa geç
  if (url.includes('fonts.google') || url.includes('fonts.gstatic')) {
    e.respondWith(
      caches.open(CACHE).then(c =>
        c.match(e.request).then(r => r || fetch(e.request).then(res => {
          c.put(e.request, res.clone());
          return res;
        }).catch(() => new Response('', {status: 503})))
      )
    );
    return;
  }

  // Diğer her şey: önce önbellek, yoksa ağdan
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
