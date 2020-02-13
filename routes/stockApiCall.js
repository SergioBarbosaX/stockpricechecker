'use strict';

const axios             = require('axios');

module.exports = ( stockSymbol ) => {
  if ( !Array.isArray(stockSymbol) ) 
    return axios.get(`https://repeated-alpaca.glitch.me/v1/stock/${stockSymbol}/quote`).then( stockData => stockData )
                                                                                       .catch( err => console.log( err ) );
  else {
    return Promise.all( [
      axios.get(`https://repeated-alpaca.glitch.me/v1/stock/${stockSymbol[0]}/quote`).then( stock => stock.data )
                                                                                     .catch( err => console.log( err ) ), 
      axios.get(`https://repeated-alpaca.glitch.me/v1/stock/${stockSymbol[1]}/quote`).then( stock => stock.data )
                                                                                     .catch( err => console.log( err ) )
    ])
  }
}