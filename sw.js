const CACHE_NAME = "amao-elijah-portfolio-v3";

const APP_SHELL = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/css/style.css",
  "/js/theme.js",
  "/js/projects.js",
  "/js/main.js",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
  }
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const path = new URL(request.url).pathname;
    if (path === "/" || path === "/index.html") return caches.match("/index.html");

    return caches.match("/offline.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.destination === "document") return caches.match("/offline.html");
    throw error;
  }
}
