/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect                 = require('chai').expect;

const getOneStockPriceInfo = require('./getOneStockPriceInfoController'); 
const getTwoStockPriceInfo = require('./getTwoStockPriceInfoController'); 


module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const stockSymbol   = req.query.stock;
      const stockLike     = req.query.like == 'true';
      const stockLikeBoth = req.query.likeBoth == 'true';
    
      // Get client request ip address
      let ip      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      let ipArray = ip.split(",");
      
      if ( !Array.isArray(stockSymbol) ) {
        let newStockPrice = {
          symbol: stockSymbol, 
          ip:     ipArray,
          likes:  stockLike ? 1 : 0
        };
        getOneStockPriceInfo( stockSymbol, stockLike, newStockPrice, ip, res );
      }
      else{
        let newStockPriceOne = {
          symbol: stockSymbol[0], 
          ip:     ipArray,
          likes:  stockLikeBoth ? 1 : 0
        }, 
        newStockPriceTwo = {
          symbol: stockSymbol[1], 
          ip:     ipArray,
          likes:  stockLikeBoth ? 1 : 0
        };
        getTwoStockPriceInfo( stockSymbol, stockLikeBoth, newStockPriceOne, newStockPriceTwo, ip, res );
      }
        
         
    });
    
};
