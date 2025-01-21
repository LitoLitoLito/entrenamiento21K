const CACHE_NAME = "training-cache-v2"; // Usa una versión diferente para evitar problemas con versiones anteriores

const urlsToCache = [
    "./", // Cache the root of the app to cover all resources.
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png", // Ícono pequeño
    "./icon-512.png"  // Ícono grande
];

// Instalación del Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Cache opened");
            return cache.addAll(urlsToCache); // Asegurarse de agregar todos los recursos
        })
    );
});

// Activación del Service Worker (para eliminar cachés antiguas si las hay)
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Elimina cachés antiguas
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes de recursos para servir desde la caché o desde la red
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Si el recurso está en la caché, lo devuelve; si no, hace una solicitud de red
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone()); // Almacena en caché los recursos nuevos
                    return fetchResponse;
                });
            });
        })
    );
});
