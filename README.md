**FreeCodeCamp**- Information Security and Quality Assurance
------

User Stories
- [x] Set the content security policies to only allow loading of scripts and css from your server.
- [x] I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.
- [x] In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
- [x] I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
- [x] If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference between the likes on both) on both.
- [x] A good way to receive current price is the following external API(replacing 'GOOG' with your stock): https://finance.google.com/finance/info?q=NASDAQ%3aGOOG
- [x] All 5 functional tests are complete and passing.