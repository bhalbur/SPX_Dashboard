function buildCandleStick(data) {

var trace1 = {

  x: data.map(row => row.date),

  close: data.map(row => row.close),

  decreasing: {line: {color: '#7F7F7F'}},

  high: data.map(row => row.high),

  increasing: {line: {color: '#17BECF'}},

  line: {color: 'rgba(31,119,180,1)'},

  low: data.map(row => row.low),

  open: data.map(row => row.open),

  type: 'candlestick',
  xaxis: 'x',
  yaxis: 'y'
};

var data1 = [trace1];

console.log(data1);

var layout = {
  dragmode: 'zoom',
  margin: {
    r: 10,
    t: 25,
    b: 40,
    l: 60
  },
  showlegend: false,
  xaxis: {
    autorange: true,
    domain: [0, 1],
    range: ['2018-03-18 12:00', '2019-03-15 12:00'],
    rangeslider: {range: ['2018-03-18 12:00', '2019-03-15 12:00']},
    title: 'Date',
    type: 'date'
  },
  yaxis: {
    autorange: true,
    domain: [0, 1],
    range: [0, 1500],
    type: 'linear'
  }
};

Plotly.newPlot('chart-div', data1, layout);

};
