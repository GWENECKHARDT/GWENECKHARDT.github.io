importScripts('/src/js/idb.js');
importScripts('/src/js/db.js');

const CACHE_VERSION = 14;
const CURRENT_STATIC_CACHE = 'static-v'+CACHE_VERSION;
const CURRENT_DYNAMIC_CACHE = 'dynamic-v'+CACHE_VERSION;

self.addEventListener('install', event => {
    console.log('service worker --> installing ...', event);
    event.waitUntil(
        caches.open(CURRENT_STATIC_CACHE)
            .then( cache => {
                console.log('Service-Worker-Cache erzeugt und offen');
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/material.min.js',
                    '/src/js/idb.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/pictures/header_picture.jpg',
                    '/src/js/map.js',
                    '/src/css/map.css',
                    '/map/index.html',
                    '/src/css/help.css',
                    '/src/js/help.js',
                    '/help/index.html',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://code.getmdl.io/1.3.0/material.orange-yellow.min.css'
                ]);
            })
    );
})

self.addEventListener('activate', event => {
    console.log('service worker --> activating ...', event);
    event.waitUntil(
        caches.keys()
            .then( keyList => {
                return Promise.all(keyList.map( key => {
                    if(key !== CURRENT_STATIC_CACHE && key !== CURRENT_DYNAMIC_CACHE) {
                        console.log('service worker --> old cache removed :', key);
                        return caches.delete(key);
                    }
                }))
            })
    );
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    // check if request is made by chrome extensions or web page
    // if request is made for web page url must contains http.
    if (!event.request.url.includes('http')) return;        // skip the request. if request is not made with http protocol
    if (event.request.url.includes('myFile.jpg')) return;   // skip the request. see feed.js fetch(imageURI)

    const url = 'http://localhost:3000/posts';
    if(event.request.url.indexOf(url) >= 0) {
        console.log('event.request', event.request)
        event.respondWith(
            fetch(event.request)
                .then ( res => {
                    if(event.request.method === 'GET') {
                        const clonedResponse = res.clone();
                        clearAllData('posts')
                            .then( () => {
                                clonedResponse.json()
                                    .then( data => {
                                        for(let key in data)
                                        {
                                            writeData('posts', data[key]);
                                        }
                                    })
                            })
                    }
                    return res;
                })
        )
    } else {
        event.respondWith(
            caches.match(event.request)
                .then( response => {
                    if(response) {
                        return response;
                    } else {
                        console.log('event.request', event.request)
                        return fetch(event.request)
                            .then( res => {     // nicht erneut response nehmen, haben wir schon
                                return caches.open(CURRENT_DYNAMIC_CACHE)      // neuer, weiterer Cache namens dynamic
                                    .then( cache => {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            });
                    }
                })
        )
    }
})

self.addEventListener('sync', event => {
    console.log('service worker --> background syncing ...', event);
    if(event.tag === 'sync-new-post') {
        console.log('service worker --> syncing new posts ...');
        event.waitUntil(
            readAllData('sync-posts')
                .then( dataArray => {
                    for(let data of dataArray) {
                        console.log('data from IndexedDB', data);
                        // diese Daten an das Backend senden (siehe Fallback)
                        const formData = new FormData();
                        formData.append('title', data.title);
                        formData.append('location', data.location);
                        formData.append('latitude', data.latitude);
                        formData.append('longitude', data.longitude);
                        formData.append('date', data.date);
                        formData.append('notes', data.notes);
                        formData.append('file', data.image_id);

                        console.log('formData', formData)

                        fetch('http://localhost:3000/posts', {
                            method: 'POST',
                            body: formData
                        })
                            .then( response => {
                                console.log('Data sent to backend ...', response);
                                if(response.ok) {
                                    deleteOneData('sync-posts', data.id)
                                }
                            })
                            .catch( err => {
                                console.log('Error while sending data to backend ...', err);
                            })
                    }
                })
        );
    }
})

self.addEventListener('notificationclick', event => {
    let notification = event.notification;
    let action = event.action;

    console.log(notification);

    if(action === 'confirm') {
        console.log('confirm was chosen');
        notification.close();
    } else {
        console.log(action);
    }
});

self.addEventListener('notificationclick', event => {
    let notification = event.notification;
    let action = event.action;

    console.log(notification);

    if(action === 'confirm') {
        console.log('confirm was chosen');
        notification.close();
    } else {
        console.log(action);
        event.waitUntil(
            clients.matchAll()      // clients sind alle Windows (Browser), fuer die der Service Worker verantwortlich ist
                .then( clientsArray => {
                    let client = clientsArray.find( c => {
                        return c.visibilityState === 'visible';
                    });

                    if(client !== undefined) {
                        //client.navigate('http://localhost:8080');
                        client.navigate(notification.data.url);
                        client.focus();
                    } else {
                        //clients.openWindow('http://localhost:8080');
                        clients.openWindow(notification.data.url);
                    }
                    notification.close();
                })
        );
    }
});

self.addEventListener('push', event => {
    console.log('push notification received', event);
    let data = { title: 'Test', content: 'Fallback message', openUrl: '/map'};
    if(event.data) {
        data = JSON.parse(event.data.text());
    }

    let options = {
        body: data.content,
        icon: '/src/pictures/world.png',
        data: {
            url: data.openUrl
        }

    };
    //let options = { body: "Wuhuu"};

    event.waitUntil(
        //self.registration.showNotification("Hello!!", options)
        self.registration.showNotification(data.title, options)
    );

    console.log("Notification wird angezeigt" + options);
});