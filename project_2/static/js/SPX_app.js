

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#tickerSelector");

  // Use the list of sample names to populate the select options
  d3.json("/scrape").then((tickerList) => {
    
    tickerList.forEach((ticker) => {
      selector
        .append("option")
        .text(ticker)

        .property("value", ticker);
    });

    // Use the first sample from the list to build the initial plots
    var defaultTicker = tickerList[Math.random(0,tickerList.length)];
    console.log(defaultTicker);
  });
}

init()