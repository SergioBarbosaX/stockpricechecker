'use strict';

const MongoClient               = require('mongodb');
const axios                     = require('axios');
const stockApiCall              = require('./stockApiCall');

const MONGODB_CONNECTION_STRING = process.env.DB;

module.exports = ( stockSymbol, stockLike, newStockPrice, ip, res ) => {
         stockApiCall( stockSymbol )
         .then( stockData => {
              if (stockLike === true) {
                MongoClient.connect(MONGODB_CONNECTION_STRING)
                           .then( db => {
                              let dbo = db.db('stockPriceChecker');
                              dbo.collection('stockPrice').findOne( { symbol: stockSymbol } )
                                                          .then( stockPrice => {
                                                             if ( stockPrice === null ) 
                                                               dbo.collection( 'stockPrice' ).insertOne( newStockPrice );
                                                             else{
                                                               if( !stockPrice.ip.includes(ip) )
                                                                 dbo.collection( 'stockPrice' ).findOneAndUpdate( { symbol: stockSymbol }, { $push: { ip: ip}, $inc: { likes: 1 } }, { returnOriginal: false } );
                                                             }
                                                             dbo.collection('stockPrice').findOne( { symbol: stockSymbol } )
                                                                                         .then( stockPrice => 
                                                                                            res.json( { 'symbol': stockData.data.symbol, 'price': stockData.data.latestPrice, 'likes': stockPrice.likes } ) )
                                                         
                                                          })
                           })
                           .catch( err => console.log( err ) );
              }
              else {
                MongoClient.connect(MONGODB_CONNECTION_STRING)
                           .then( db => {
                              let dbo = db.db('stockPriceChecker');
                              dbo.collection('stockPrice').findOne( { symbol: stockSymbol.toLowerCase() } )
                                                          .then( stockPrice => stockPrice === null ? 
                                                            res.json( { 'symbol': stockData.data.symbol, 'price': stockData.data.latestPrice, 'likes': 0 } ) : 
                                                            res.json( { 'symbol': stockData.data.symbol, 'price': stockData.data.latestPrice, 'likes': stockPrice.likes } ) )
                           })
                           .catch( err => console.log( err ) );
             }
          })
          .catch(error => {
            console.log(error);
          });
  }