self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("training-cache").then(cache => {
            return cache.addAll([
                "./index.html",
                "./styles.css",
                "./script.js",
                "./manifest.json",
                "./icon-192.png", // Ícono pequeño
                "./icon-512.png"  // Ícono grande
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Devuelve el recurso de la caché o lo obtiene de la red si no está almacenado.
            return response || fetch(event.request);
        })
    );
});
