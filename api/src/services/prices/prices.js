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

export const updatePrices = (symbol_exchange) => {

  //https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call?rq=1

  // `delay` returns a promise
  return new Promise(function(resolve, reject) {
      console.log("UPDATING " + symbol_exchange)

      console.log("Checking for available dates")
      db.price.findMany({
        select: {date: true},
        where: { symbol_exchange: symbol_exchange}
      }).then((result) => {
        var lastDate = new Date (Math.max.apply(null, result.map((e)=> e.date)))
        if(isNaN(lastDate)) {
          lastDate = new Date(2020,1,1);
        }
        console.log(symbol_exchange + ", last update: " + lastDate)

        var today = new Date();
        var timeDiff = Math.abs(today.getTime() - lastDate.getTime());
        var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        console.log("Days since last update " + diffDays)
        var updateNeeded = false;
        switch (today.getDay()) {
          case 0: // on Sundays we need 2 days difference
            if (diffDays > 2) {
              updateNeeded = true
            }
            break
          case 1: // on Mondays we need 3 days difference
            if (diffDays > 3) {
              updateNeeded = true
            }
            break
          default:
            if (diffDays > 1) {
              updateNeeded = true
            }
            break
        }

        console.log("Update needed? " + updateNeeded)

        if (updateNeeded) {
          console.log("Update started")
          var from = lastDate.getFullYear() + "-" + (lastDate.getMonth()+1) + "-" + lastDate.getDate()
          console.log("From " + from)
          // fetch("https://eodhistoricaldata.com/api/eod/"+symbol_exchange+"?from="+from+"&api_token=5e89e1d8bc5662.72708807&period=d&fmt=json")
          fetch("https://eodhistoricaldata.com/api/eod/AAPL.US?from="+from+"-1&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&period=d&fmt=json")
            .then((response) => response.json())
            .then((json) => savePrices(symbol_exchange,json))
            .catch((error) => console.error(error))
        }

      })

      resolve("Prices Updated");
  });
}

export const prices = (input) => {
  const symbolsPrices = []
  console.log(input.symbols)
  input.symbols.forEach(symbol_exchange => {
    console.log(symbol_exchange)
    const values = db.price.findMany({
      where: { symbol_exchange: symbol_exchange}
    })

    updatePrices(symbol_exchange)

    symbolsPrices.push({
      symbol_exchange:symbol_exchange,
      prices: values
    })
  });

  return symbolsPrices
}

export const createPrice = ({ input }) => {
  return db.price.create({ data: input })
}
