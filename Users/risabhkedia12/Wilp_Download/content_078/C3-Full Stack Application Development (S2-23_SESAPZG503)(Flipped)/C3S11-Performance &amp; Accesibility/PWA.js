INDEX.HTML
=========

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA Example</title>
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/icon.png">
    <meta name="theme-color" content="#ffffff">
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a simple Progressive Web App example.</p>

    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered: ', registration);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed: ', error);
                    });
            });
        }
    </script>
</body>
</html>

manifest.json
==============
{
  "name": "PWA Example",
  "short_name": "PWA",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    {
      "src": "/icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}

sw.js (Service Worker):
===========================

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('cache-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

