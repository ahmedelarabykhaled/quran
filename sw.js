var CACHE_NAME = 'mushaf-pwa-v1';
var STATIC_ASSETS = [
  '/quran/',
  '/quran/index.php',
  '/quran/light.php',
  '/quran/manifest.json',
  '/quran/icons/icon.svg',
  '/quran/assets/app.css',
  '/quran/assets/app.js',
  '/quran/assets/app-light.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(STATIC_ASSETS.map(function (url) {
        return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
      }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k !== CACHE_NAME;
      }).map(function (k) {
        return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

function getShellUrl(pathname) {
  var base = self.location.origin + '/quran';
  if (pathname.indexOf('light') !== -1) return base + '/light.php';
  return base + '/index.php';
}

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  var isJsDelivr = url.origin === 'https://cdn.jsdelivr.net' && (url.pathname.indexOf('/gh/QuranHub/quran-pages-images') === 0 || url.pathname.indexOf('/gh/tarekeldeeb/madina_images') === 0);
  var isSameOriginQuran = url.origin === self.location.origin && (url.pathname === '/quran/' || url.pathname.indexOf('/quran/') === 0);
  if (!isJsDelivr && !isSameOriginQuran) return;

  var isNavigate = e.request.mode === 'navigate';

  if (isNavigate && isSameOriginQuran) {
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        if (cached) return cached;
        return caches.match(getShellUrl(url.pathname)).then(function (shell) {
          if (shell) return shell;
          return fetch(e.request).then(function (res) {
            if (res && res.status === 200 && res.type === 'basic') {
              var clone = res.clone();
              caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, clone); });
            }
            return res;
          }).catch(function () {
            return caches.match(getShellUrl(url.pathname)).then(function (r) {
              return r || caches.match(self.location.origin + '/quran/light.php');
            });
          });
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (res) {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(e.request, clone);
        });
        return res;
      }).catch(function () {
        return caches.match(e.request);
      });
    })
  );
});
