/* ============================================================================
 * PK Khmer Type — Production Progressive Web App (PWA) Service Worker
 *
 * Capabilities:
 * 1. Pre-caching of all core application shell assets (HTML, CSS, JS, Fonts, Icons)
 * 2. Stale-While-Revalidate caching strategy for Google Fonts stylesheets & woff2 web fonts
 * 3. Network-First navigation with instant offline fallback to cached index.html
 * 4. Transparent bypass for real-time cloud sync APIs (Supabase)
 * 5. Instant activation with cache versioning and stale cache pruning
 *
 * Strict Zero-Emoji Policy: 100% SVG vector icons only.
 * ============================================================================ */

var CACHE_VERSION = "pk-khmer-type-v87";
var FONT_CACHE = "pk-khmer-type-fonts-v1";

var PRECACHE_ASSETS = [
  "./",
  "index.html",
  "welcome.html",
  "404.html",
  "dashboard.html",
  "motion-graphic.html",
  "manifest.json",
  "logo.svg",
  "icon-16.png",
  "icon-32.png",
  "icon-48.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "css/base.css",
  "css/keyboard.css",
  "css/typing.css",
  "css/lessons.css",
  "css/responsive.css",
  "css/settings.css",
  "css/tutorial.css",
  "css/custom-lessons.css",
  "css/welcome.css",
  "js/icons.js",
  "js/vendor/supabase.js",
  "js/supabase-config.js",
  "js/cloud-sync.js",
  "js/storage.js",
  "js/offline-bridge.js",
  "data/curriculum-data.js",
  "data/adaptive-vocab.js",
  "data/keyboard.json",
  "js/typing.js",
  "js/keyboard.js",
  "js/tracker.js",
  "js/progress.js",
  "js/review.js",
  "js/cursor-inspector.js",
  "js/smooth-cursor.js",
  "js/feedback.js",
  "js/achievements.js",
  "js/adaptive.js",
  "js/lessons.js",
  "js/custom-lessons.js",
  "js/test-lab.js",
  "js/race.js",
  "js/statistics.js",
  "js/settings.js",
  "js/shortcuts.js",
  "js/quick_guide.js",
  "js/tutorial.js",
  "js/app.js"
];

/* ---------- Install Event: Precache Application Shell ---------- */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // Use map with catch to ensure a single missing optional asset doesn't abort the entire install
      var cachePromises = PRECACHE_ASSETS.map(function (url) {
        return fetch(url, { cache: "no-cache" })
          .then(function (response) {
            if (response.ok) {
              return cache.put(url, response);
            }
          })
          .catch(function (_err) {
            // Silently allow non-critical asset fetch failure during offline development
          });
      });
      return Promise.all(cachePromises);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ---------- Activate Event: Prune Outdated Caches ---------- */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_VERSION && key !== FONT_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ---------- Fetch Event: Offline-First Strategy ---------- */
self.addEventListener("fetch", function (event) {
  var request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  var url = new URL(request.url);

  // 1. Bypass Supabase and external API endpoints (handled by local-first sync queue)
  if (url.hostname.includes("supabase.co") || url.pathname.includes("/rest/v1/") || url.pathname.includes("/auth/v1/")) {
    return;
  }

  // 2. Google Fonts & Font Assets (Stale-While-Revalidate in dedicated font cache)
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONT_CACHE).then(function (fontCache) {
        return fontCache.match(request).then(function (cached) {
          var fetchPromise = fetch(request).then(function (networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
              fontCache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(function () {
            return cached;
          });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Navigation Requests (HTML Pages: Network-First with instant cached fallback)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(function (networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          var clone = networkResponse.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return networkResponse;
      }).catch(function () {
        return caches.match(request).then(function (cachedPage) {
          if (cachedPage) return cachedPage;
          return caches.match("index.html");
        });
      })
    );
    return;
  }

  // 4. Static Application Shell Assets (Cache-First with Network Fallback)
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(function (cachedResponse) {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate for local assets)
        fetch(request).then(function (fresh) {
          if (fresh && fresh.status === 200) {
            caches.open(CACHE_VERSION).then(function (cache) {
              cache.put(request, fresh);
            });
          }
        }).catch(function () {});
        return cachedResponse;
      }

      return fetch(request).then(function (networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          var clone = networkResponse.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return networkResponse;
      }).catch(function () {
        // Fallback for image requests if offline
        if (request.destination === "image") {
          return caches.match("logo.svg");
        }
      });
    })
  );
});
