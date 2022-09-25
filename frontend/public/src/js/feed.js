let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let sharedBigMapArea = document.querySelector('#shared-bigmap');
let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let locationInput = document.querySelector('#location');
let dateInput = document.querySelector('#date');
let notesInput = document.querySelector('#notes');
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let imagePicker = document.querySelector('#image-picker');
let imagePickerArea = document.querySelector('#pick-image');
let file = null;
let titleValue = '';
let locationValue = '';
let imageURI = '';
let dateValue= '';
let notesValue= '';
let locationButton = document.querySelector('#location-btn');
let locationmapButton = document.querySelector('#locationmap-btn');
//Eigener Button für Karte, da Karte schon besteht und keine Neue erstellt werden soll
let locationLoader = document.querySelector('#location-loader');
let fetchedLocation;
let mapDiv = document.querySelector('.map');
//let bigMapDiv = document.querySelector('.bigmap');
let imageButton = document.querySelector('#image-btn');
let moreInfosArea = document.querySelector('#show-info');
let cardInfoCardWrapper = document.createElement('div');
let cardWrapper = document.createElement('div');
//let deleteButton = document.querySelector('#delete-btn');

//Button zum automatischen Hinzufügen des Ortes
locationButton.addEventListener('click', event => {
    if(!('geolocation' in navigator)) {
        return;
    }

    locationButton.style.display = 'none';
    locationLoader.style.display = 'block';

    navigator.geolocation.getCurrentPosition( position => {
        locationButton.style.display = 'inline';
        locationLoader.style.display = 'none';
        fetchedLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        console.log('Aktuelle Position: ', fetchedLocation);

        let nominatimURL = 'https://nominatim.openstreetmap.org/reverse';
        nominatimURL += '?format=jsonv2';   // format=[xml|json|jsonv2|geojson|geocodejson]
        nominatimURL += '&lat=' + fetchedLocation.latitude;
        nominatimURL += '&lon=' + fetchedLocation.longitude;

        fetch(nominatimURL)
            .then((res) => {
                console.log('nominatim res ...', res);
                return res.json();
            })
            .then((data) => {
                console.log('nominatim res.json() ...', data);
                locationInput.value = data.display_name;
                return data;
            })
            .then( d => {
                locationButton.style.display = 'none';
                locationLoader.style.display = 'none';
                mapDiv.style.display = 'block';

                const map = new ol.Map({
                    target: 'map',
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM()
                        })
                    ],
                    //Zentrum der Kartenansicht ist der aktuelle Standort
                    view: new ol.View({
                        center: ol.proj.fromLonLat([fetchedLocation.longitude, fetchedLocation.latitude]),
                        zoom: 12
                    })
                });

                //Form (blauer Kreis) wird mit den Koordinaten erstellt und in layer gespeichert
                const layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [
                            new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([fetchedLocation.longitude, fetchedLocation.latitude]))
                            })
                        ]
                    })
                });

                //layer wird der Karte hinzugefügt
                map.addLayer(layer);

                console.log('map', map)
            })
            //Abfangen und Konsolenausgabe eines Möglichen Errors und setzen eines festen Wertes für locationInput.value
            .catch( (err) => {
                console.error('err', err)
                locationInput.value = 'Irgendwo im Nirgendwo';
            })
        //Ausgabe eines Errors und Setzen von leeren Werten für die Koordinaten
        .catch((err) => {
            console.error('err', err)
            fetchedLocation.latitude = '';
            fetchedLocation.longitude = '';
        });

        document.querySelector('#manual-location').classList.add('is-focused');

    }, err => {
        console.log(err);
        locationButton.style.display = 'inline';
        locationLoader.style.display = 'none';
        //Bei manueller Eingabe, setzen von leeren Werten für die Koordinaten.
        alert('Aktueller Standort konnte nicht ermittelt werden. Bitte manuell eingeben.');
        fetchedLocation = { latitude: '', longitude: '' }
    }, { timeout: 5000});
});



function initializeLocation() {
    if(!('geolocation' in navigator)) {
        locationButton.style.display = 'none';
    }
}

function initializeMedia() {
    if(!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }

    if(!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if(!getUserMedia) {
                return Promise.reject(new Error('getUserMedia ist nicht verfügbar'));
            }

            return new Promise( (resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            })
        }
    }

    navigator.mediaDevices.getUserMedia({video: true})
        .then( stream => {
            videoPlayer.srcObject = stream;
            videoPlayer.style.display = 'block';
        })
        .catch( err => {
            imagePickerArea.style.display = 'block';
        });
}

//Funktion zum Öffnen des Formulares.
function openCreatePostModal() {
    setTimeout( () => {
        createPostArea.style.transform = 'translateY(0)';
    }, 1);
    initializeMedia();
    initializeLocation();
}

//Funktion zum Schließen des Formulares.
function closeCreatePostModal() {
    imagePickerArea.style.display = 'none';
    videoPlayer.style.display = 'none';
    canvasElement.style.display = 'none';
    locationButton.style.display = 'inline';
    locationLoader.style.display = 'none';
    if(videoPlayer.srcObject) {
        videoPlayer.srcObject.getVideoTracks().forEach( track => track.stop());
    }
    setTimeout( () => {
        createPostArea.style.transform = 'translateY(100vH)';
    }, 1);
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

//Funktion zum Anzeigen weiterer Infos in der Karte
function moreInfos(card)
{
    console.log('More Infos');
    setTimeout( () => {
        moreInfosArea.style.transform = 'translateY(0)';
    }, 1);
    let cardInfo=document.createElement('div')
    let cardInfoTitle=document.createElement('h2')
    cardInfoTitle.className = 'mdl-card__title-text';
    cardInfoTitle.textContent=card.title;
    cardInfo.appendChild(cardInfoTitle);
    console.log(card.title);
    console.log(cardInfo);
    let cardInfoDate=document.createElement('h4')
    cardInfoDate.textContent=card.date;
    cardInfo.appendChild(cardInfoDate);
    let cardInfoNotes=document.createElement('h4')
    cardInfoNotes.textContent=card.notes;
    cardInfo.appendChild(cardInfoNotes);
    //Id zum Testen
    /*let cardInfoId=document.createElement('h4');
    cardInfoId.textContent=card._id;
    cardInfo.appendChild(cardInfoId);*/
    //Image-Id zum Testen
    /*let cardImageInfoId=document.createElement('h4');
    cardImageInfoId.textContent=card.image_id;
    cardInfo.appendChild(cardImageInfoId);*/
    let backToImageButton = document.createElement('button');
    backToImageButton.innerText="Zurück zum Bild";
    backToImageButton.id='backToImage-btn'
    backToImageButton.addEventListener('click', () => {
        location.reload(); //Umgehungslösung: Ganze Website lädt neu
    })
    //Delete funktioniert nicht, da die Objekt-ID nciht aus der Datenbank genutzt wird,
    //sondern die Funktion auf eine andere (sich ändernde) ID zurückgreift
    /*let deleteButton = document.createElement('button');
    deleteButton.innerText="Bild löschen";
    console.log("ID aus MoreInfos-Funktion:" + card._id);
    deleteButton.addEventListener('click', () => {
        deleteOneCard(card)
    })*/
    cardInfoCardWrapper = document.createElement('div');
    cardInfoCardWrapper.appendChild(cardInfo);
    cardInfoCardWrapper.appendChild(backToImageButton);
    //cardInfoCardWrapper.appendChild(deleteButton);

    console.log(cardInfoCardWrapper);
    return cardInfoCardWrapper;
}

//Anlegen einer Karte
function createCard(card) {
    cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    let cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    let image = new Image();
    image.src = card.image_id;
    cardTitle.style.backgroundImage = 'url('+ image.src +')';
    cardTitle.style.backgroundSize = 'cover';
    cardWrapper.appendChild(cardTitle);
    let cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = card.title;
    //console.log(card.title);
    cardTitleTextElement.classList.add('greyTitle');
    //Aus Bildbereich herausgenommen, da man es keine Farbe gibt, die man auf allen Bildern definitiv sehen kann
    //cardTitle.appendChild(cardTitleTextElement);
    cardWrapper.appendChild(cardTitleTextElement);
    let cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = card.location;
    cardSupportingText.style.textAlign = 'center';
    cardWrapper.appendChild(cardSupportingText);
    let moreInfosButton = document.createElement('button');
    moreInfosButton.innerText="Weitere Informationen";
    moreInfosButton.id='moreInfos-btn'
    moreInfosButton.addEventListener('click', () => {
        console.log("ID aus CreateCard-Funktion: " + card._id);
        cardTitle.style.backgroundImage = 'None';
        moreInfosButton.style.display = 'None';
        cardTitleTextElement.style.display = 'None';
        //cardTitle.display = 'None';
        moreInfos(card);
        cardTitle.appendChild(cardInfoCardWrapper);
    })
    cardWrapper.appendChild(moreInfosButton);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);

}

//Auslesen der Daten für die Karten aus der Datenbank
fetch('http://localhost:3000/posts')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log('From backend ...', data);
        updateUI(data);
        // showLocations();
    })
    .catch( (err) => {
        //Wenn nicht auf die Datenbank zugegriffen werden kann, werden die Daten
        //aus indexedDB geholt
        if('indexedDB' in window) {
            readAllData('posts')
                .then( data => {
                    data=[{title: 'Hamburg', location: 'Hamburg', latitude: '52.5243700', longitude: '13.4105300', image_id: '', notes: 'Das ist eine Testnotiz.', _id: '1', date: '25.09.2022'}, {title: 'Berlin', location: 'Berlin', latitude: '53.551086', longitude: '9.993682', image_id: '', notes: 'Das ist eine weitere Testnotiz. Diese Notiz ist für Berlin.', _id: '2', date: '24.09.2022'}];
                    console.log('Beispieldaten: ', data);
                    updateUI(data);
                })
        }
    });


//Für jeden Datensatz wird eine Karte angelegt
function updateUI(data) {
    for(let card of data)
    {
        createCard(card);
    }
}

//Funktion zum Löschen einer Karte
//(Funktioniert leider nicht, da die ObjectID nicht aus MongoDB ausgelesen wird)
function deleteOneCard(card) {
    /*fetch('http://localhost:3000/posts', {
        method: 'GET',
        //body: formData
    })
        .then(response => {
            console.log('DB-Inhalt: ', response);
            console.log(card);
            return response.json();
        })*/

    let id=card._id.toString();
    //let cardid=card.ObjectId.toString();

    console.log(card);
    console.log(card._id);
    console.log(id);
    fetch('http://localhost:3000/posts/' +id, {
        method: 'DELETE',
    })
        .then( response => {
            console.log('Data deleted: ', response);
            return response.json();
        })
}

//Daten werden an das Backend gesandt
function sendDataToBackend() {
    //Speichern der angegebenen Daten im formData
    const formData = new FormData();
    formData.append('title', titleValue);
    formData.append('location', locationValue);
    formData.append('latitude', fetchedLocation.latitude);
    formData.append('longitude', fetchedLocation.longitude);
    formData.append('date', dateValue);
    formData.append('notes', notesValue);
    formData.append('file', file);

    console.log('formData', formData)

    //body, mit den Daten für die Datenbank, wird mit formData befüllt
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: formData
    })
        .then( response => {
            console.log('Daten werden an Backend gesendet:', response);
            return response.json();
        })
        .then( data => {
            console.log('data:', data);
            //Neue Daten werden in newPost hinterlegt.
            const newPost = {
                title: data.title,
                location: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                date: data.date,
                notes: data.notes,
                image_id: imageURI
            }
            //Erstellen einer neuen Karte mit den hinzugekommenen Daten, die in newPost hinterlegt sind.
            updateUI([newPost]);
        });
}

form.addEventListener('submit', event => {
    event.preventDefault(); // nicht absenden und neu laden

    //Wenn kein Foto aufgenommen oder hochgeladen wurden, kommt eine Fehlermeldung.
    if (file == null) {
        alert('Erst Foto aufnehmen!')
        return;
    }
    if (titleInput.value.trim() === '') {
        alert('Bitte Titel angeben!')
        return;
    }
    if (locationInput.value.trim() === '') {
        alert('Bitte Location angegeben!')
        return;
    }
    //Wenn die Koordinaten nicht über den Locationbutton abgefragt wurden, bleiben sie leer.
    if (fetchedLocation === undefined) {
        fetchedLocation = { latitude: '', longitude: '' }
        return fetchedLocation;
    }

    //Nachdem auf Speichern geklickt wurde und die Eingaben auf Vollständigkeit geprüft wurden,
    //wird das Formular geschlossen.
    closeCreatePostModal();

    titleValue = titleInput.value;
    locationValue = locationInput.value;
    dateValue = dateInput.value;
    notesValue = notesInput.value;
    console.log('titleInput', titleValue)
    console.log('locationInput', locationValue)
    console.log('latitude', fetchedLocation.latitude)
    console.log('longitude', fetchedLocation.longitude)
    console.log('date', dateValue)
    console.log('notes', notesValue)
    console.log('file', file)

    //Speichern der Eingaben zur Synchronisierung, wenn Serviceworker und Syncmanager zur Verüfung stehen.
    if('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
            .then( sw => {
                //Daten werden in post hinterlegt.
                let post = {
                    id: new Date().toISOString(), //ID setzt sich aus Datum und Uhrzeit zusammen.
                    title: titleValue,
                    location: locationValue,
                    latitude: fetchedLocation.latitude,
                    longitude: fetchedLocation.longitude,
                    date: dateValue,
                    notes: notesValue,
                    image_id: file      // file durch den Foto-Button belegt
                }
                writeData('sync-posts', post)
                    .then( () => {
                        sw.sync.register('sync-new-post');
                    })
                    .then( () => {
                        //Anzeige der Meldung am unteresn Bildschirmrand.
                        let snackbarContainer = new MaterialSnackbar(document.querySelector('#confirmation-toast'));
                        let data = { message: 'Eingaben zur Synchronisation gespeichert!', timeout: 2000};
                        snackbarContainer.showSnackbar(data);
                    });
            });
    }

    //Sonst Daten direkt an Backend senden.
    else {
        sendDataToBackend();
    }
});

//Button zur Aufnahme eines Fotos.
captureButton.addEventListener('click', event => {
    event.preventDefault(); // nicht absenden und neu laden
    canvasElement.style.display = 'block';
    videoPlayer.style.display = 'none';
    captureButton.style.display = 'none';
    let context = canvasElement.getContext('2d');
    context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
    videoPlayer.srcObject.getVideoTracks().forEach( track => {
        track.stop();
    })
    imageURI = canvas.toDataURL("image/jpg");
    // console.log('imageURI', imageURI)       // base64-String des Bildes

    fetch(imageURI)
        .then(res => {
            return res.blob()
        })
        .then(blob => {
            //file mit em Bild wird erstellt
            file = new File([blob], "myFile.jpg", { type: "image/jpg" })
            console.log('file', file)
        })
});

//Button zum Hochladen eine Bildes.
imagePicker.addEventListener('change', event => {
    //file beinhaltet hochgeladenes Bild.
    file = event.target.files[0];
});

