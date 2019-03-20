function buildMap(mapData){

var myMap = L.map("map-div", {
  center: [37.0902, -95.7129],
  zoom: 4,
});

var baseMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  minZoom: 4,
  id: "mapbox.streets",
  accessToken: 'pk.eyJ1IjoiYmhhbGJ1ciIsImEiOiJjanN3bG45aHMwNjdrNDNwZmltcmhyMTU5In0.4fWTF1uFox70N-HNCUejHQ'
}).addTo(myMap);

var marker_group = L.markerClusterGroup()

var markers = mapData.forEach(row => {
if (row.lat && row.lng){
  var marker = L.marker([parseFloat(row.lat), parseFloat(row.lng)])
  marker_group.addLayer(marker).bindPopup(`${row['Security']} (${row['Symbol']} <hr> ${row['GICS Sector']}`)
  }
});

myMap.addLayer(marker_group);


buildMap()