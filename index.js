const express = require('express');
const bodyParser = require("body-parser");
const http = require("http")
const { google } = require("googleapis");
const coinspot = require("coinspot-api");
const delay = require("delay");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const portfolio = express();
portfolio.use(express.json());

const import_variable = fs.readFileSync('./Variables.json')
const parsed_variable = JSON.parse(import_variable);

var key = parsed_variable.key;
var secret = parsed_variable.secret;
var cell_range = parsed_variable.cell_range;
var sheet_id = parsed_variable.sheet_id;

var data;
var coins;

let price = [];
let balance = [];

var txtPath = path.join(__dirname, 'reply.txt');

// Create client for Coinspot API
var client = new coinspot(key, secret);

isArray = function(a) {
  return (!!a) && (a.constructor === Array);
}

const authentication = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();
  const sheets = google.sheets({
    version: 'v4',
    auth: client
  });
  return { sheets }
}

portfolio.listen(3000, () => console.log('Server running on PORT 3000'));

portfolio.get('/', async (req, res) => {
  try {
    // Receive list of coins that need updating
    const { sheets } = await authentication();

    console.log("Incoming Request @ " + moment().format('yyyy-mm-dd:hh:mm:ss'));

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheet_id,
      range: cell_range,
      majorDimension: 'columns',
    })
    // Seperate Data
    data = response.data;
    coins = data['values'][0];

    // Start constructing reply
    var j = 0;
    let reply = '{"coins": [{';

    // Get list of balances from coinspot
    await client.balances(function(e, csbal) {
      var balance_data = JSON.parse(csbal);
      balance = balance_data.balance;
    });

    // Use coinspot api to grab current price
    for(let i = 0; i < coins.length; i++) {
        if(coins[i] == "" || coins[i] == null) {
        } else {
          await delay(500); //limit requests to ~2 per second

          await client.quotesell(coins[i].toString(), 1, "coin", function(e, csapi) {

            var price_data = JSON.parse(csapi);

            if(price_data.status == "ok") {
              price[i] = price_data.rate;

              var coin_balance = balance[coins[i].toString().toLowerCase()];
              if(coin_balance == undefined) {
                coin_balance = 0;
              }

              var prefix = '"';
              var coin = coins[i].toString();
              var coin_price = price[i];
              var reply_line = prefix.concat(coin + '": ["' + coin_price + '", "' + coin_balance + '"]');

              if(i < (coins.length - 1)) {
                reply_line = reply_line.concat(',');
              }

              reply = reply.concat(reply_line);
              reply = reply.replace(/\\/g, '');

            } else if(price_data.status == "error"){
              price = 0;
              console.log("### Error in response for coin: " + coins[i] +" - " + price_data.message);
            }

          });
        }
      }

    await delay(500);
    reply = reply.concat("}]}");
    reply.replace(/\\/g, '');

    fs.writeFile('reply.txt', reply, 'utf8', function (err) {
      if (err) return console.log(err);
    })

    var reply_to_send;
    await fs.readFile('reply.txt', 'utf8', function (err, data) {
      if (err) return console.log(err);

      res.sendFile(txtPath);
    })

    console.log("Completed Request @ " + moment().format('yyyy-mm-dd:hh:mm:ss'))

  } catch(e) {
    console.log(e);
    res.status(500).send();
  }
});
