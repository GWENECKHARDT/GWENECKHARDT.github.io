let enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('service worker registriert')
        })
        .catch(
            err => { console.log(err); }
        );
}

function displayConfirmNotification() {
    console.log("Anzeige Push-Nachricht")
    if('serviceWorker' in navigator) {
        let options = { body: 'You successfully subscribed to our Notification service!',
            icon: '/src/pictures/world.png',
            image: '/src/pictures/world.png',
            lang: 'de-DE',
            vibrate: [100, 50, 200],
            badge: '/src/pictures/world.png',
            tag: 'confirm-notification',
            renotify: true,
            actions: [
                { action: 'confirm', title: 'Ok', icon: '/src/pictures/world.png' },
                { action: 'cancel', title: 'Cancel', icon: '/src/pictures/world.png' },
            ]};

        navigator.serviceWorker.ready
            .then( sw => {
                sw.showNotification('Successfully subscribed (from SW)!', options).then(r => console.log("Anzeige Push-Nachricht" + options));
            });
        console.log("Anzeige Push-Nachricht" + options);
    }
}

//https://github.com/GoogleChromeLabs/web-push-codelab/issues/46
function urlBase64ToUint8Array(base64String) {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function configurePushSubscription() {
    if(!('serviceWorker' in navigator)) {
        return
    }

    let swReg;
    navigator.serviceWorker.ready
        .then( sw => {
            swReg = sw;
            return sw.pushManager.getSubscription();
            console.log('swReg=sw');
        })
        .then( sub => {
            if(sub === null) {
                console.log('sub==ull')
                let vapidPublicKey = 'BFBlrf5uFuv7nmZpQD8ubQmoZwR0Qk8RE8f85js5VSYjDrBOOGFr-onJWgq3T_wbWC664LPnUutssKyCM7jGwLc';
                let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
                console.log("swReg: " + swReg);
                console.log(convertedVapidPublicKey);
                return swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidPublicKey,
                });
            } else {
                // already subscribed
            }
            /*            sub.unsubscribe()
                            .then( () => {
                                console.log('unsubscribed()', sub)
                            })*/
        })
        .then( newSub => {
            return fetch('http://localhost:3000/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newSub)
            })
                .then( response => {
                    if(response.ok) {
                        displayConfirmNotification();
                        console.log('displayConfirmNotification')
                    }
                })
        });
}

function askForNotificationPermission() {
    Notification.requestPermission( result => {
        console.log('User choice', result);
        if(result !== 'granted') {
            console.log('No notification permission granted');
        } else {
            console.log("configurPushSubscription");
            alert("Um Push-Benachrichtigungen zu aktivieren, nutze bitte das vollständige Projekt von GitHub.")
            configurePushSubscription();
        }
    });
}

if('Notification' in window && 'serviceWorker' in navigator) {
    for(let button of enableNotificationsButtons) {
        button.style.display = 'inline-block';
        button.addEventListener('click', askForNotificationPermission);
    }
}

