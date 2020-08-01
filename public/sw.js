importScripts('vendor/pollyfills/cache-polyfills.js');
let uniqid = (a = "", b = false) => {
    const c = Date.now() / 1000;
    let d = c.toString(16).split(".").join("");
    while (d.length < 14) d += "0";
    let e = "";
    if (b) {
        e = ".";
        e += Math.round(Math.random() * 100000000);
    }
    return a + d + e;
};
const assets = [
  "vendor/bootstrap/dist/css/bootstrap.lite.css",

  "vendor/bootstrap/dist/css/bootstrap-grid.min.css",
  "vendor/bootstrap/dist/css/bootstrap-grid.min.css.map",

  "vendor/bootstrap/dist/css/bootstrap-utilities.min.css",
  "vendor/bootstrap/dist/css/bootstrap-utilities.min.css.map",

  "vendor/mat-icons/material-icons.css",
  "vendor/jquery/jquery.js",
  "vendor/compiled/main.css",
  "vendor/fuse/fuse.basic.min.js",
  "vendor/bootstrap/dist/js/bootstrap.min.js",
  "vendor/autoresize/auto-resize.min.js",

  "vendor/pollyfills/localStorage.js",
  "vendor/pollyfills/cache-polyfills.js",
  "vendor/kabeers/pulltorefresh/pulltorefresh.umd.min.js",
  "vendor/mdc/material-components-web.min.js",
  "vendor/kabeers/protectjs/protect.min.js",
  "vendor/kabeers/smartcompose/SmartComposeTextarea.min.js",


  "assets/favicons/apple-touch-icon-57x57.png",
  "assets/favicons/apple-touch-icon-60x60.png",
  "assets/favicons/apple-touch-icon-72x72.png",
  "assets/favicons/apple-touch-icon-76x76.png",
  "assets/favicons/apple-touch-icon-114x114.png",
  "assets/favicons/apple-touch-icon-120x120.png",
  "assets/favicons/apple-touch-icon-144x144.png",
  "assets/favicons/apple-touch-icon-152x152.png",
  "assets/favicons/favicon-32x32.png",
  "assets/favicons/favicon-16x16.png",
  "assets/favicons/safari-pinned-tab.svg",
  "assets/favicons/favicon.ico",



  "assets/sounds/notification.mp3",
  "assets/sounds/notification.ogg",


  "assets/opensource/autosize.txt",
  "assets/opensource/cachepollyfills.txt",
  "assets/opensource/jquery.txt",
  "assets/opensource/material-web.txt",

  "modules/smartcompose.js",

  " ",
  "/",
  "style.css",
  "app.js",
  "manifest.json",
  "assets/icons/ic_launcher.png",
  "assets/favicons/browserconfig.xml",
  "favicon.ico",
  "opensource.html",
  "legal.html",
];
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('notes->'+'k').then(function(cache) {
   	 console.log('Cache Added');
     return cache.addAll(assets);
   })
 );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
        console.log('Cache Served');
     	return response || fetch(event.request);
      })
  );
});
self.addEventListener('sync', function(event) {
  if (event.tag === 'bg-sync') {
    event.waitUntil(()=>{
        console.log('Sync_now() Called!')
    });
  }
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
addEventListener('activate', event => {
  event.waitUntil(async function() {
    // Feature-detect
    if (self.registration.navigationPreload) {
      // Enable navigation preloads!
      await self.registration.navigationPreload.enable();
    }
  }());
});
