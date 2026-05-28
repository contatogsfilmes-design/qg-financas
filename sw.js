const SHARE_CACHE = 'julius-share-v1';

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const CHUNK = 512;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + CHUNK, bytes.length)));
  }
  return btoa(binary);
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'POST') return;

  event.respondWith((async () => {
    try {
      const formData = await event.request.formData();
      const file = formData.get('file');

      if (file && file.size > 0) {
        const ab = await file.arrayBuffer();
        const b64 = arrayBufferToBase64(ab);
        const payload = JSON.stringify({
          dataUrl: `data:${file.type};base64,${b64}`,
          name: file.name,
          type: file.type,
          timestamp: Date.now()
        });

        // Guarda no cache pra app pegar quando abrir
        const cache = await caches.open(SHARE_CACHE);
        await cache.put('/__pending_share__', new Response(payload, {
          headers: { 'Content-Type': 'application/json' }
        }));

        // Notifica janelas abertas imediatamente
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
          client.postMessage({
            type: 'julius-share',
            dataUrl: `data:${file.type};base64,${b64}`,
            name: file.name
          });
        }
      }
    } catch (e) {
      console.error('[SW Julius] Erro no share target:', e);
    }

    return Response.redirect('./', 303);
  })());
});
