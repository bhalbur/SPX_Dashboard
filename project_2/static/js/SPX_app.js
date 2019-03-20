

function basicInfo(info){

  output = ''

  Object.entries(info[0]).forEach(([x,y]) => {
    output += `<b>${x}</b>: ${y}<br>`
  })

  d3.select("#ticker-details").html(output)
}


function fetchMap(){
  d3.json('/allData').then(buildMap)
}

function buildMap(mapData){

var myMap = L.map("map-div", {
  center: [38.0902, -97.7129],
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

var Industrials;
var HealthCare;
var InformationTechnology;
var CommunicationServices;
var ConsumerDiscretionary;
var Utilities;
var Financials;
var Materials;
var RealEstate;
var ConsumerStaples;
var Energy;

var markers = mapData.forEach(row => {
if (row.lat && row.lng){
  var marker = L.marker([parseFloat(row.lat), parseFloat(row.lng)], {
    title: row.Security,
    icon: L.ExtraMarkers.icon({
        icon: 'fa-building',
        prefix: 'fa',
        markerColor: GICScolor(row['GICS Sector'])[0],
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
      return 'cyan';
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

    var defaultTicker = tickerList[Math.floor(Math.random() * tickerList.length)];
    tickerList.forEach((ticker) => {
      selector
        .append("option")
        .text(ticker)
        .property("value", ticker);
    });

    // Use the first sample from the list to build the initial plots

    console.log(defaultTicker);
    fetchMap()
    optionChanged(defaultTicker)
  });
}






function optionChanged(dropdown_value, data) {
  d3.json(`/ticker_info/${dropdown_value}`).then(function (data) {
    console.log(data)
    buildCandleStick(data)
    d3.select('#pxHtml').html(`Last Price: $${data[0]['current_price']}`)
  })
  d3.json(`/basic/${dropdown_value}`).then(basicInfo)
};
d3.select('chart-div')


init()
