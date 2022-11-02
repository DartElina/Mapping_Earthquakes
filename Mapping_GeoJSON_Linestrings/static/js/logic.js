// Add console.log to check to see if our code is working.
console.log("working");
// Create a style for the lines.
let myStyle = {
    color: "yellow",
    weight: 2 
}
// We create the streets/light tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
// create the dark tile layer 
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
// create the baselayer that holds the tilelayers
let basemaps = {
    Streets: streets,
    Dark: dark
};
// create map object 
let map = L.map('map', {
    center: [44.0, -80.0],
    zoom: 2,
    layers: [dark]
})
// pass map layers into into our layer control
L.control.layers(basemaps).addTo(map);

// access raw data file
let torontoData = "https://raw.githubusercontent.com/DartElina/Mapping_Earthquakes/Mapping_GeoJSON_Linestrings/torontoRoutes.json";

// grab the json raw data + add too map
d3.json(torontoData).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {
    style: myStyle,
    onEachFeature: function(feature, layer){
        layer.bindPopup("<h3Airline: "+feature.properties.airline + "</h3> <hr><h3>Destination: "+ feature.properties.dst + "</h3>");
    }
  }).addTo(map);
});

