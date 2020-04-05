import {Line as LineChart} from 'react-chartjs-2';

import React, { useEffect, useState } from 'react';

//TODO find out how to get query parameters from React/Router?
const query =document.location.search;
var symbols = []
if (query) {
  (query.split("?")[1].split("&")).forEach(function(p) {
    if (p!="") {
      var splits = p.split("=")
      switch (splits[0]) {
        case 'symbols':
          symbols = splits[1].split(",")
          break;
        default:
          break;
      }
    }
  })
  console.log(symbols)
}

const HomePage = () => {

  const defaultChartData = {}
  const [isLoading, setLoading] = useState(true);
  const [chartData, setData] = useState({});
  function generateChartData(d, json) {
    console.log("Entry")
    console.log(d.datasets)
    console.log(json)
    var myData = json['Time Series (Daily)']
    var dates = Object.keys(myData).map(function(d) {
      return new Date(d)
    })
    var min = new Date(Math.min( ...dates ))
    var minDate = min.getFullYear().toString() + "-" +
                  (min.getMonth() +1).toString() + "-" +
                  min.getDate().toString()
    var firstClose = Number(myData[minDate]["4. close"])

    var time = []
    var time2 = []
    for(var day in myData) {
      time.push({
        x: new Date(day),
        y: Number(myData[day]["4. close"])/firstClose*100
      })
      time.push({
        x: new Date(day),
        y: 100
      })
    }
    var chartData = {
      datasets: [
        {
          label: json['Meta Data']['2. Symbol'],
          fill: false,
          pointHoverRadius: 5,
          pointRadius: 1,
          pointHitRadius: 10,
          data: time,
          spanGaps: false,
        }
      ]
    }

    d.datasets.push(
      {
        label: json['Meta Data']['2. Symbol'],
        fill: false,
        pointHoverRadius: 5,
        pointRadius: 1,
        pointHitRadius: 10,
        data: time,
        spanGaps: false,
      },
      {
        label: json['Meta Data']['2. Symbol'],
        fill: false,
        pointHoverRadius: 5,
        pointRadius: 1,
        pointHitRadius: 10,
        data: time2,
        spanGaps: false,
      }
    )
    delete d["labels"]
    console.log(chartData)
    console.log(d)
    return d
  }

  const options = {
      scales: {
        xAxes: [{
          type: 'time'
        }]
      }
  }

  useEffect(() => {
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbols[0]+'&apikey=XX64LMA248QI0L6B')
      .then((response) => response.json())
      .then((json) => setData(generateChartData(chartData, json)))
      .catch((error) => console.error(error))

  },[]);

  return (
    <div>
      <LineChart data={chartData} options={options}/>
    </div>
  )
}

export default HomePage
