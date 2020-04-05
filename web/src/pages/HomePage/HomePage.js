import {Line as LineChart} from 'react-chartjs-2';

import React, { useEffect, useState } from 'react';

const HomePage = () => {

  const defaultChartData = {}
  const [isLoading, setLoading] = useState(true);
  const [chartData, setData] = useState(defaultChartData);
  function generateChartData(json) {
    var myData = json['Time Series (Daily)']
    console.log(myData)
    var dates = Object.keys(myData).map(function(d) {
      return new Date(d)
    })
    console.log(dates)
    var min = new Date(Math.min( ...dates ))
    var minDate = min.getFullYear().toString() + "-" +
                  (min.getMonth() +1).toString() + "-" +
                  min.getDate().toString()
    console.log(minDate)
    var firstClose = Number(myData[minDate]["4. close"])
    console.log(firstClose)

    var time = []
    for(var day in myData) {
      time.push({
        x: new Date(day),
        y: Number(myData[day]["4. close"])/firstClose
      })
    }
    var chartData = {
      //labels: labels,
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
      ],
    }
    console.log(chartData)
    return chartData
  }

  const options = {
      scales: {
        xAxes: [{
          type: 'time'
        }]
      }
  }

  useEffect(() => {
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=XX64LMA248QI0L6B')
      .then((response) => response.json())
      .then((json) => setData(generateChartData(json)))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  },[]);

  return (
    <div>
      <LineChart data={chartData} options={options}/>
    </div>
  )
}

export default HomePage
