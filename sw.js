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

var SHELL_URLS = ['/quran/light.php', '/quran/index.php', '/quran/'];

function matchAnyCache(requestOrUrlList) {
  var list = Array.isArray(requestOrUrlList) ? requestOrUrlList : [requestOrUrlList];
  var origin = self.location.origin;
  return caches.open(CACHE_NAME).then(function (cache) {
    function tryNext(i) {
      if (i >= list.length) return Promise.resolve(undefined);
      var key = list[i];
      if (typeof key === 'string' && key.indexOf('/') === 0) key = origin + key;
      return caches.match(key).then(function (res) {
        if (res) return res;
        return tryNext(i + 1);
      });
    }
    return tryNext(0);
  });
}

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  var isJsDelivr = url.origin === 'https://cdn.jsdelivr.net' && (url.pathname.indexOf('/gh/QuranHub/quran-pages-images') === 0 || url.pathname.indexOf('/gh/tarekeldeeb/madina_images') === 0);
  var isSameOriginQuran = url.origin === self.location.origin && (url.pathname === '/quran/' || url.pathname.indexOf('/quran/') === 0);
  if (!isJsDelivr && !isSameOriginQuran) return;

  var isNavigate = e.request.mode === 'navigate';

  if (isNavigate && isSameOriginQuran) {
    e.respondWith(
      matchAnyCache([e.request, url.origin + url.pathname, '/quran/light.php', '/quran/index.php', '/quran/']).then(function (cached) {
        if (cached) return cached;
        return fetch(e.request).then(function (res) {
          if (res && res.status === 200 && res.type === 'basic') {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, clone); });
          }
          return res;
        }).catch(function () {
          return matchAnyCache([e.request, url.origin + url.pathname, '/quran/light.php', '/quran/index.php', '/quran/']);
        });
      }).then(function (response) {
        if (response) return response;
        return new Response(
          '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مصحف</title></head><body style="font-family:sans-serif;padding:1rem;text-align:center"><p>أنت غير متصل. افتح التطبيق عند الاتصال مرة واحدة لتمكين القراءة بدون نت.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
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
