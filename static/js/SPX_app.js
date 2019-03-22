

function basicInfo(info){

  output = ''

  Object.entries(info[0]).forEach(([x,y]) => {
    output += `<b>${x}</b>: ${y}<br>`
  })

  d3.select("#ticker-name").text(`Ticker Details: ${info[0]['Symbol']} `)
  d3.select("#ticker-details").html(output)
}


function fetchMap(defaultTicker){
  d3.json(`/allData/${defaultTicker}`).then(buildMap)
}

function buildMap(jsonData){



defaultTicker = jsonData.defaultTicker;
mapData = jsonData['data'];

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

var sectorNames = {
  'Industrials':[],
  'HealthCare': [],
  'InformationTechnology': [],
  'CommunicationServices': [],
  'ConsumerDiscretionary': [],
  'Utilities': [],
  'Financials': [],
  'Materials': [],
  'RealEstate': [],
  'ConsumerStaples': [],
  'Energy': []
}

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
  if (row.Symbol == defaultTicker){
    shownSector = row['GICS Sector'].split(' ').join('')
    console.log(shownSector)
  }
  sectorNames[GICScolor(row['GICS Sector'])[1]].push(marker)
  marker.bindPopup(`${row['Security']} (${row['Symbol']}) <hr> ${row['GICS Sector']}`)

  }
});

console.log(defaultTicker)


IndusLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.Industrials));
HCLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.HealthCare));
ITLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.InformationTechnology));
ComLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.CommunicationServices));
DiscretLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.ConsumerDiscretionary));
UtilLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.Utilities));
FinLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.Financials));
MatLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.Materials));
RealLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.RealEstate));
StapleLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.ConsumerStaples));
EnergLayer = L.markerClusterGroup().addLayer(L.layerGroup(sectorNames.Energy));


var baseLayers = {
  'Base Map': baseMap
};

var overlays = {
  'Industrials': IndusLayer,
  'HealthCare': HCLayer,
  'InformationTechnology': ITLayer,
  'CommunicationServices': ComLayer,
  'ConsumerDiscretionary': DiscretLayer,
  'Utilities': UtilLayer,
  'Financials': FinLayer,
  'Materials': MatLayer,
  'RealEstate': RealLayer,
  'ConsumerStaples': StapleLayer,
  'Energy': EnergLayer
  };

myMap.addLayer(overlays[shownSector])

L.control.layers(baseLayers,overlays).addTo(myMap);

}
//END OF MAP FUNCTION


//This funciton used to allocate each company to an industry and color based on GICS industry code
function GICScolor(sector) {
  switch (sector) {
    case 'Industrials':
      return ['red', 'Industrials'];
    case 'Health Care':
      return ['orange-dark', 'HealthCare'];
    case 'Information Technology':
      return ['orange', 'InformationTechnology'];
    case 'Communication Services':
      return ['yellow', 'CommunicationServices'];
    case 'Consumer Discretionary':
      return ['green', 'ConsumerDiscretionary'];
    case 'Utilities':
      return ['cyan', 'Utilities'];
    case 'Financials':
      return ['blue', 'Financials'];
    case 'Materials':
      return ['blue-dark', 'Materials'];
    case 'Real Estate':
      return ['purple', 'RealEstate'];
    case 'Consumer Staples':
      return ['violet', 'ConsumerStaples'];
    case 'Energy':
      return ['pink','Energy'];
  }
}



function refreshData(){
  // build in a button to the page to call the refresh route
  d3.select()

  d3.json('/scrape')
}


var defaultTicker;

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#tickerSelector");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((tickerList) => {

    var defaultTicker = tickerList[Math.floor(Math.random() * tickerList.length)];
    tickerList.forEach((ticker) => {
      if (ticker == defaultTicker) {
        selector
        .append("option")
        .text(ticker)
        .property("value", ticker)
        .property("selected", "selected");
      }
      else {
      selector
        .append("option")
        .text(ticker)
        .property("value", ticker);
      }
    });

    // Use the first sample from the list to build the initial plots

    fetchMap(defaultTicker)
    console.log(defaultTicker);
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
