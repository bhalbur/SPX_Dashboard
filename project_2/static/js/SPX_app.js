function historicAPI(){
}

function currentAPI(apiOutput){
  d3.select('#pxHtml').html(`Last Price: $${apiOutput}`)
}

function basicInfo(currpx){
  d3.select('api-div')
  d3.html(currpx)
}


function fetchMap(){
  d3.json('/allData').then(buildMap)
}

function buildMap(mapData){

var myMap = L.map("map-div", {
  center: [37.0902, -95.7129],
  zoom: 4,
});

var baseMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  minZoom: 4,
  id: "mapbox.streets",
  accessToken: 'pk.eyJ1IjoiYmhhbGJ1ciIsImEiOiJjanN3bG45aHMwNjdrNDNwZmltcmhyMTU5In0.4fWTF1uFox70N-HNCUejHQ'
}).addTo(myMap);

var marker_group = L.markerClusterGroup()

var markers = mapData.forEach(row => {
if (row.lat && row.lng){
  var marker = L.marker([parseFloat(row.lat), parseFloat(row.lng)], {
    title: row.Security,
    icon: L.ExtraMarkers.icon({
        color: 'black',
        shape: 'square',
      })
  })
  marker.bindPopup(`${row['Security']} (${row['Symbol']}) <hr> ${row['GICS Sector']}`)
  marker_group.addLayer(marker)
  }
});

myMap.addLayer(marker_group);
}

function GICScolor(sector) {
  switch (sector) {
    case 'Industrials':
      return 'red';
    case 'Health Care': 
      return 'orange-dark';
    case 'Information Technology':
      return 'orange';
    case 'Communication Services':
      return 'yellow';
    case 'Consumer Discretionary':
      return 'green';
    case 'Utilities':
      return 'cyan'
    case 'Financials': 
      return 'blue';
    case 'Materials': 
      return 'blue-dark';
    case 'Real Estate': 
      return 'purple';
    case 'Consumer Staples': 
      return 'violet';
    case 'Energy':
      return 'pink';
  }
}



function refreshData(){
  // build in a button to the page to call the refresh route
  d3.select()



  d3.json('/scrape')
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#tickerSelector");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((tickerList) => {
    
    tickerList.forEach((ticker) => {
      selector
        .append("option")
        .text(ticker)
        .property("value", ticker);
    });

    // Use the first sample from the list to build the initial plots
    var defaultTicker = tickerList[Math.floor(Math.random() * tickerList.length)];
    console.log(defaultTicker);
    fetchMap()
  });
}


function optionChanged(dropdown_value) {
  d3.json(`/basicinfo/${dropdown_value}`).then(basicInfo);  
  d3.json(`/currentprice/${dropdown_value}`).then(currentAPI);  
  d3.json(`/historicprice/${dropdown_value}`).then(historicAPI);  
}

init()