import {Line as LineChart} from 'react-chartjs-2';
import PricesCell from 'src/components/PricesCell';

import React, { useEffect, useState } from 'react';

//TODO find out how to get query parameters from React/Router?
// const query =document.location.search;
// var symbols = []
// if (query) {
//   (query.split("?")[1].split("&")).forEach(function(p) {
//     if (p!="") {
//       var splits = p.split("=")
//       switch (splits[0]) {
//         case 'symbols':
//           symbols = splits[1].split(",")
//           break;
//         default:
//           break;
//       }
//     }
//   })
//   console.log(symbols)
// }

const HomePage = () => {

  return (
    <div>
      <PricesCell />
    </div>
  )
}

export default HomePage
