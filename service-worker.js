/**
 * Created by saadna on 11/01/2017.
 */

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
        'app.js',
        'https://fonts.googleapis.com/css?family=Bungee+Shade',
        'https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo'
];





self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('caching files');
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('activate', function(event) {
    console.log("[ServiceWorker] activated");
    var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log("[ServiceWorker] Removing cached files from",cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});




self.addEventListener('fetch', function(event) {

    console.log("[ServiceWorker] Activated");

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    console.log("[ServiceWorker] Found in cache",response);
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();
             //   console.log('REQUEST : ',fetchRequest);

                return fetch(fetchRequest)
                    .then(
                            function(response) {
                                // Check if we received a valid response
                                if(!response || response.status !== 200 || response.type !== 'basic') {
                                    return response;
                                }

                                // IMPORTANT: Clone the response. A response is a stream
                                // and because we want the browser to consume the response
                                // as well as the cache consuming the response, we need
                                // to clone it so we have two streams.
                                var responseToCache = response.clone();

                                caches.open(CACHE_NAME)
                                    .then(function(cache) {
                                         cache.put(event.request, responseToCache);
                                    });

                                return response;
                            }

                     )
                    .catch(function(err){
                           console.log("[ServiceWorker] Error fetching & caching")
                    })
            })
    );
});


/* eslint-disable max-len */

var applicationServerPublicKey = 'BBrm10zUdMNDKHWp5UnCLm0dKbTyhWY9yQuta-ULKIajqc3ndP_Fahdtb3Y_cJtn0pCODpkx2RIBAdH2TvtY8AI';

/* eslint-enable max-len */

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log('[Service Worker] Push had this data:'+ event.data.text());

    const title = 'Push Codelab';
    var options = {
        body: event.data.text(),
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/')
    );
});

self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function(newSubscription) {
                // TODO: Send to application server
                console.log('[Service Worker] New subscription: ', newSubscription);
            })
    );
});