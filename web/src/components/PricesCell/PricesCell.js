import {Line as LineChart} from 'react-chartjs-2';
import pricesSymbol from 'src/'

export const QUERY = gql`
  query($symbols: [String!]) {
    prices (symbols: $symbols) {
      symbol_exchange
      prices {
        id
        symbol_exchange
        date
        value
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ prices, symbols }) => {
  console.log(prices)
  const datasets = []

  prices.forEach((price,index) => {
    if (price.prices.length>0) {
      // console.log(price)
      const data = []
      const firstClose = price.prices[0].value

      price.prices.forEach(p => {
        if (p.value >0) {
          data.push({
            x: p.date,
            y: p.value/firstClose
          })
        }
      });
      console.log(index);

      var color = "green"
      switch (index) {
        case 0:
          color="red"
          break;
        case 1:
          color="black"
          break;
        case 2:
          color="blue"
          break
        case 3:
          color="yellow"
          break
        case 3:
          color="orange"
          break
        default:
          break
      }


      datasets.push(
        {
          label: price.symbol_exchange,
          fill: false,
          pointHoverRadius: 5,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
          spanGaps: false,
          borderColor: color
        }

      )
    }
  });

  const chartData = {
    datasets: datasets
  }

  const options = {
          scales: {
            xAxes: [{
              type: 'time'
            }]
          }
      }
  // const pricesDump = JSON.stringify(prices)
  return (
    <div>
      {/* {pricesDump} */}
      <LineChart data={chartData} options={options}/>
    </div>
    )
}
