// Career Automation System Service Worker
// Enables offline functionality and caches resources

const CACHE_NAME = 'career-automation-v1.2';
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './styles.css',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Cache failed', error);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // If network fails, try to serve offline fallback
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for data when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-data') {
    event.waitUntil(syncData());
  }
});

// Sync data when back online
function syncData() {
  return new Promise((resolve) => {
    // Check if there's pending data to sync
    const pendingData = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    
    if (pendingData.length > 0) {
      console.log('Service Worker: Syncing pending data');
      // Here you would normally send data to server
      // For now, just clear the pending sync data
      localStorage.removeItem('pendingSync');
    }
    
    resolve();
  });
}