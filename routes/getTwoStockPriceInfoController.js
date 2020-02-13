'use strict';

const MongoClient               = require('mongodb');
const axios                     = require('axios');
const stockApiCall              = require('./stockApiCall');

const MONGODB_CONNECTION_STRING = process.env.DB;

const findAndUpdateStockPrice = (stockSymbol, newStockPrice, dbo) => {
                              Promise.all( [ 
                               dbo.collection('stockPrice').findOne( { symbol: stockSymbol } ).then ( stockPrice => stockPrice )
                                                                                              .catch( err => console.log( err ) )
                              ] )
                              .then( stockPrice => { 
                                if ( stockPrice[0] === null ) {  
                                  dbo.collection( 'stockPrice' ).insertOne( newStockPrice );
                                }
                                else {
                                  if( !stockPrice[0].ip.includes( newStockPrice.ip[0] ) ) {
                                    dbo.collection( 'stockPrice' ).findOneAndUpdate( { symbol: newStockPrice.symbol }, { $push: { ip: newStockPrice.ip[0]}, $inc: { likes: 1 } }, { returnOriginal: false } );
                                  }   
                                }
                           })
                           .catch(error => {
                             console.log(error);
                           } );
}

module.exports = ( stockSymbol, stockLikeBoth, newStockPriceOne, newStockPriceTwo, ip, res ) => {
    stockApiCall( stockSymbol )
    .then( stockData => {
      if (stockLikeBoth) { 
        MongoClient.connect(MONGODB_CONNECTION_STRING)
                           .then( db => {
                              let dbo = db.db('stockPriceChecker');
                              findAndUpdateStockPrice( stockSymbol[0], newStockPriceOne, dbo);
                              findAndUpdateStockPrice( stockSymbol[1], newStockPriceTwo, dbo);
                                
                              Promise.all( [ 
                                 dbo.collection('stockPrice').findOne( { symbol: stockSymbol[0] } ).then ( stockPrice => stockPrice )
                                                                                                   .catch( err => console.log( err ) ),
                                 dbo.collection('stockPrice').findOne( { symbol: stockSymbol[1] } ).then ( stockPrice => stockPrice )
                                                                                                   .catch( err => console.log( err ) )
                              ] )
                              .then( updatedStockPrice => {
                                  const likesStockDataOne = updatedStockPrice[0]===null ? 0 : updatedStockPrice[0].likes+1;
                                  const likesStockDataTwo = updatedStockPrice[1]===null ? 0 : updatedStockPrice[1].likes+1;
                                  res.json( {'stockData': [ { 'symbol': stockData[0].symbol, 'price': stockData[0].latestPrice, 'rel_likes': likesStockDataOne - likesStockDataTwo }, 
                                                            { 'symbol': stockData[1].symbol, 'price': stockData[1].latestPrice, 'rel_likes': likesStockDataTwo - likesStockDataOne } ] } )
                                }) 
                                .catch(error => {
                                  console.log(error);
                                } );
                                
                           })
                           .catch(error => {
                                 console.log(error);
                           } );
      }
      else
      {
          MongoClient.connect(MONGODB_CONNECTION_STRING)
                           .then( db => {
                              let dbo = db.db('stockPriceChecker');
                              Promise.all( [ 
                               dbo.collection('stockPrice').findOne( { symbol: stockSymbol[0] } ).then ( stockPrice => stockPrice )
                                                                                                 .catch( err => console.log( err ) ),
                               dbo.collection('stockPrice').findOne( { symbol: stockSymbol[1] } ).then ( stockPrice => stockPrice )
                                                                                                 .catch( err => console.log( err ) )
                              ] )
                              .then( stockPrice => { 
                                if ( stockPrice[0] === null && stockPrice[1] === null)
                                  res.json( {'stockData': [ { 'symbol': stockData[0].symbol, 'price': stockData[0].latestPrice, 'rel_likes': 0 }, 
                                                            { 'symbol': stockData[1].symbol, 'price': stockData[1].latestPrice, 'rel_likes': 0 } ] } )
                                else if ( stockPrice[0] === null && stockPrice[1] !== null)
                                  res.json( {'stockData': [ { 'symbol': stockData[0].symbol, 'price': stockData[0].latestPrice, 'rel_likes': 0 - stockPrice[1].likes }, 
                                                            { 'symbol': stockData[1].symbol, 'price': stockData[1].latestPrice, 'rel_likes': stockPrice[1].likes     } ] } )
                                else if ( stockPrice[0] !== null && stockPrice[1] === null)
                                  res.json( {'stockData': [ { 'symbol': stockData[0].symbol, 'price': stockData[0].latestPrice, 'rel_likes': stockPrice[0].likes }, 
                                                            { 'symbol': stockData[1].symbol, 'price': stockData[1].latestPrice, 'rel_likes': 0 - stockPrice[0].likes } ] } )
                                else
                                  res.json( {'stockData': [ { 'symbol': stockData[0].symbol, 'price': stockData[0].latestPrice, 'rel_likes': stockPrice[0].likes - stockPrice[1].likes }, 
                                                            { 'symbol': stockData[1].symbol, 'price': stockData[1].latestPrice, 'rel_likes': stockPrice[1].likes - stockPrice[0].likes } ] } )
                              } )
                              .catch(error => {
                                 console.log(error);
                              });
                           })
                           .catch(error => {
                                 console.log(error);
                           });
      }
    })
    .catch(error => {
      console.log(error.data);
    });
    
  }