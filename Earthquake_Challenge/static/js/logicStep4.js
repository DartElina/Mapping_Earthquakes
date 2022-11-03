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
// create map object 
let map = L.map('map', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});
// create the baselayer that holds the tilelayers
let basemaps = {
    "Streets": streets,
    "Satellite Streets": satelliteStreets
};
// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();
// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    Earthquakes: earthquakes
  };

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(basemaps, overlays).addTo(map);
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
         // This function determines the color of the circle based on the magnitude of the earthquake.
         function getColor(magnitude) {
            if (magnitude > 5) {
                return "#ea2c2c";
            }
            if (magnitude > 4) {
                return "#ea822c";
            }
            if (magnitude > 3) {
                return "#ee9c00";
            }
            if (magnitude > 2) {
                return "#eecc00";
            }
            if (magnitude > 1) {
                return "#d4ee00";
            }
            return "#98ee00";
        };

        // This function returns the style data for each of the earthquakes we plot on
        // the map. We pass the magnitude of the earthquake into two separate functions
        // to calculate the color and radius.
        function styleInfo(feature) {
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(feature.properties.mag),
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
            // We create a popup for each circleMarker to display the magnitude and
            //  location of the earthquake after the marker has been created and styled.
            onEachFeature: function (feature, layer) {
                layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
            }
        }).addTo(earthquakes)
        // Then we add the earthquake layer to our map.
        earthquakes.addTo(map);
    });