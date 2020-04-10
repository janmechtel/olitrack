import { db } from 'src/lib/db'
import fetch from 'node-fetch'

export const savePrices = (symbol_exchange, prices) => {
  console.log("Saving new price data for " + symbol_exchange)
  prices.forEach(price => {
    try {
      var price = await db.price.create ({data: {
        symbol_exchange: symbol_exchange,
        date: new Date(price.date),
        value:  Math.trunc(Number(price.adjusted_close*100))
      }})
      console.log(price)

    } catch(error) {
        console.log(error)
    }
  });
  // console.log(prices)
  return {result:"Success"}
}

exports.handler = async (event, context) => {
  const symbol_exchange = event.queryStringParameters.symbol;
  const from = event.queryStringParameters.from;
  console.log(from + symbol_exchange)

  const url = "https://eodhistoricaldata.com/api/eod/AAPL.US?from="+from+"-1&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&period=d&fmt=json"
  // const url = "https://eodhistoricaldata.com/api/eod/"+symbol_exchange+"?from="+event.queryStringParameters.from+"&api_token=5e89e1d8bc5662.72708807&period=d&fmt=json"

  console.log(url)
  var response = await fetch(url)
  console.log(response)
  var json = await response.json()
  console.log(savePrices(symbol_exchange,json))

  db.disconnect()
  return {
    statusCode: 200,
    // body: JSON.stringify(event),
  }

}

