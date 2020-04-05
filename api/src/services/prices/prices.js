import { db } from 'src/lib/db'
import fetch from 'node-fetch'

export const savePrices = (symbol_exchange, prices) => {
  console.log("Saving new price data for " + symbol_exchange)
  prices.forEach(price => {
    db.price.create ({data: {
      symbol_exchange: symbol_exchange,
      date: new Date(price.date),
      value:  Math.trunc(Number(price.adjusted_close*100))
    }})
      .then((r) => console.log(r))
      .catch((error) => true) //TODO prevent duplicates
  });
  // console.log(prices)
}

export const updatePrices = (symbols_exchanges) => {

  //https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call?rq=1

  // `delay` returns a promise
  return new Promise(function(resolve, reject) {
      console.log("UPDATING")

      console.log(symbols_exchanges)
      symbols_exchanges.forEach(symbol => {

      //   db.prices.findOne()
      //   .then((r) => console.log(r))
      // .catch((error) => true) //TODO prevent duplicates

        //TODO: Replace Symbol when sure :-)
        //TODO: query from last update

        // fetch("https://eodhistoricaldata.com/api/eod/"+symbol+"?from=2020-01-01&api_token=5e89e1d8bc5662.72708807&period=d&fmt=json")
        // // fetch("https://eodhistoricaldata.com/api/eod/AAPL.US?from=2020-01-01&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&period=d&fmt=json")
        //   .then((response) => response.json())
        //   .then((json) => savePrices(symbol,json))
        //   .catch((error) => console.error(error))

      });

      resolve("Prices Updated"); // After 3 seconds, resolve the promise with value 42
  });
}

export const prices = async (input) => {
  const symbolsPrices = []
  console.log(input.symbols)
  input.symbols.forEach(symbol_exchange => {
    console.log(symbol_exchange)
    symbolsPrices.push({
      symbol_exchange:symbol_exchange,
      prices: db.price.findMany({
        where: { symbol_exchange: symbol_exchange}
      })
    })
  });


  //updatePrices(input.symbols)

  return symbolsPrices
}

export const createPrice = ({ input }) => {
  return db.price.create({ data: input })
}
