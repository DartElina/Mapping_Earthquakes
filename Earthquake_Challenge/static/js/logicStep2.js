// Add console.log to check to see if our code is working.
console.log("working");

// We create the streets/light tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
// create the dark tile layer 
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
// create the baselayer that holds the tilelayers
let basemaps = {
    "Streets": streets,
    "Satellite Streets": satelliteStreets
};
// create map object 
let map = L.map('map', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});
// pass map layers into into our layer control
L.control.layers(basemaps).addTo(map);

// access raw data file
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// grab the json raw data + add too map
d3.json(earthquakeData).then(
    function (data) {
        console.log(data);
        // This function determines the radius of the earthquake marker based on its magnitude.
        // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
        function getRadius(magnitude) {
            if (magnitude === 0) {
                return 1;
            }
            return magnitude * 4;
        };

        // This function returns the style data for each of the earthquakes we plot on
        // the map. We pass the magnitude of the earthquake into two separate functions
        // to calculate the color and radius.
        function styleInfo(feature) {
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: "#ffae42",
                color: "#000000",
                radius: getRadius(feature.properties.mag),
                stroke: true,
                weight: 0.5
            };
        };
       
        // Creating a GeoJSON layer with the retrieved data.
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                console.log(data);
                return L.circleMarker(latlng);
            },
            // We set the style for each circleMarker using our styleInfo function.
            style: styleInfo,
        }).addTo(map)
    });