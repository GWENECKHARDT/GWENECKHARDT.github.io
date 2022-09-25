//Eigener Button für Karte, da Karte schon besteht und keine Neue erstellt werden soll
//let bigMapDiv = document.querySelector('.bigmap');
let locations = new Array();
let marker = new Array();

fetch('http://localhost:3000/posts')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log('Fetch Show Locations');
        console.log('data1: ', data);
        /*        console.log('longitude: ', data[11]["longitude"]);
                console.log('latitude: ', data[11]["latitude"]);*/
        for(let i=0; i<data.length; i++)
        {
            /*            parseFloat(data[i]["longitude"]);
                        parseFloat(data[i]["latitude"]);*/
            locations[i] = [parseFloat(data[i]["longitude"]), parseFloat(data[i]["latitude"])]
        }
        /*        console.log('Data-Länge', data.length)
                locations[0]=[10, 20]
                locations[1]=[20, 30]
                locations[2]=[data[11]["longitude"], data[11]["latitude"]]*/
        console.log('Berlin: ', locations[11]);
        console.log('Array: ',locations);
        showLocations();
    })
    .catch( (err) => {
        //locations[0]=[13.4105300, 52.5243700];
        //locations[1]=[9.993682, 53.551086];
        data=[13.4105300, 52.5243700];
        if('indexedDB' in window) {
            readAllData('posts')
                .then( data => {
                    console.log('From cache: ', data);
                    console.log("Beispieldaten: ", locations);
                })
        }
    
    });

function createMarker()
{
    console.log('Create Marker')

    /*marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([13.3777, 52.5162]))
    })*/

    console.log('Marker: ', marker)

    return marker;
}

function showLocations()
{
    console.log('Show Locations')

    //bigMapDiv.style.display = 'block';

    const bigmap = new ol.Map({
        target: 'bigmap',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([13.3777, 52.5162]),
            zoom: 6
        })
    });


    for(let i=0; i<locations.length; i++) {
        const layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    /*new ol.Feature({
                          geometry: new ol.geom.Point(ol.proj.fromLonLat([13.3777, 52.5162]))*/
                    new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat(locations[i])),
                        /*color: 'red'*/
                    }),

                ]
            })
        });

        //console.log('Layer: ', layer)

        bigmap.addLayer(layer);

    }
    console.log('bigmap', bigmap)

    //sharedBigMapArea.appendChild(bigmap);

    /*    fetch('http://localhost:3000/posts/map')
            .then(
                response => {
                    console.log(response);
                    return response.json();
                }
            )
            .then(
                data => {
                    console.log(data)
                }
            )*/
}

// locationmapButton.addEventListener('click', showLocations());

