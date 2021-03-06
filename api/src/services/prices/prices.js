import { db } from 'src/lib/db'
import fetch from 'node-fetch'

export const updatePrices = (symbol_exchange) => {

  //https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call?rq=1

  // `delay` returns a promise
  return new Promise(async function(resolve, reject) {
      console.log("UPDATING " + symbol_exchange)

      console.log("Checking for available dates")
      db.price.findMany({
        select: {date: true},
        where: { symbol_exchange: symbol_exchange}
      }).then((result) => {
        var lastDate = new Date (Math.max.apply(null, result.map((e)=> e.date)))
        console.log(symbol_exchange + ", last update: " + lastDate)
        if(isNaN(lastDate)) {
          lastDate = new Date(2019,12,31);
        }
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

        lastDate = new Date(lastDate.setTime( lastDate.getTime() + 1 * 86400000 ));
        if (updateNeeded) {
          console.log("Update started")
          var from = lastDate.getFullYear() + "-" + (lastDate.getMonth()+1) + "-" + lastDate.getDate()
          console.log("From " + from)
          if (process.env.OLITRACK_ENVIRONMENT == "dev") {
            fetch('http://localhost:8910/.netlify/functions/updatePricesForSymbol?symbol='+symbol_exchange+'&from='+from)
          } else {
            fetch('https://olitrack.netlify.com/.netlify/functions/updatePricesForSymbol?symbol='+symbol_exchange+'&from='+from)
          }
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
