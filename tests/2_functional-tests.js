/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai     = require('chai');
var assert   = chai.assert;
var server   = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      this.timeout(5000); 
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'msft'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.deepPropertyVal(res.body, 'symbol', 'MSFT');
          assert.property(res.body, 'price');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'msft', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.deepPropertyVal(res.body, 'symbol', 'MSFT');
          assert.property(res.body, 'price');
          assert.deepPropertyVal(res.body, 'likes', 1);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server) 
        .get('/api/stock-prices')
        .query({stock: 'msft', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.deepPropertyVal(res.body, 'symbol', 'MSFT');
          assert.property(res.body, 'price');
          assert.deepPropertyVal(res.body, 'likes', 1);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft'] })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepPropertyVal(res.body.stockData[0], 'symbol', 'GOOG');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.deepPropertyVal(res.body.stockData[1], 'symbol', 'MSFT');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          done();
        });
      }); 
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft'], likeBoth: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.deepPropertyVal(res.body.stockData[0], 'symbol', 'GOOG');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.deepPropertyVal(res.body.stockData[1], 'symbol', 'MSFT');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          done();
        });
      });
      
    }); 

});
