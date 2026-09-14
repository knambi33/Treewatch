// Register TreeView PWA Service Worker
export function registerServiceWorker(onUpdate?: (registration: ServiceWorkerRegistration) => void) {
  if (
    'serviceWorker' in navigator &&
    (window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[TreeView PWA] ServiceWorker registered with scope:', registration.scope);

          // Check for worker updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[TreeView PWA] New version ready.');
                  if (onUpdate) onUpdate(registration);
                } else {
                  console.log('[TreeView PWA] Offline cache activated.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('[TreeView PWA] ServiceWorker registration error:', error);
        });
    });
  }
}
