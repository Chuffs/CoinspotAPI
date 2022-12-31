// Set up enviroment, i.e modules
const express = require('express');

const coinspot = require('./coinspot.js');

const { google } = require("googleapis");

const moment = require("moment");

const app = express();
const PORT = 3000;

app.use(express.json());

// Get local variables
const variables = require('./Variables.json');

// Create client for Coinspot API
var cs_client = new coinspot(variables.key, variables.secret);

function returnCoinBalance(coin) {
  return new Promise((resolve, reject) => {
    cs_client.singlebalance(coin, function(e, data) {
      return resolve(data);
    });
  })
}

function returnCoinPrice(coin) {
  return new Promise((resolve, reject) => {
    cs_client.sellNowQuote(coin, 1, "coin", function(e, data) {
      return resolve(data);
    });
  })
}

// Google Sheets API
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

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server Listening on PORT: ", PORT);
});

app.get('/', async (request, response) => {
    const { sheets } = await authentication();

    var start = moment();
    console.log("\x1b[32mIncoming Request @ %s\x1b[0m", moment().format('yyyy-mm-dd:hh:mm:ss'));

    // Receive list of coins that need updating
    const gs_response = await sheets.spreadsheets.values.get({
      spreadsheetId: variables.sheet_id,
      range: variables.cell_range,
      majorDimension: 'COLUMNS',
    });

    const payload = {
      "coins" : []
    };
    const coins = [], balance = [], price = [];

    // Seperate wanted data from google sheets API and enter them into an array filtering the blanks
    for(let i = 0; i < gs_response.data.values[0].length; i++){
      if(gs_response.data.values[0][i] != "") coins.push(gs_response.data.values[0][i]);  
    }

    console.log("\x1b[32m    Obtaining coin balances...\x1b[0m");

    // Construct array with balances of each coin.
    for (let i = 0; i < coins.length; i++) {
      var temp = JSON.parse(await returnCoinBalance(coins[i]));
      // if no balance, API will return but with empty balance array - check if this exists
      temp.balance[coins[i]] === void(0) ? balance.push(0) : balance.push(temp.balance[coins[i]].balance);
    }

    console.log("\x1b[32m    Obtaining coin prices...\x1b[0m");

    // Construct array with price of each coin
    for (let i = 0; i < coins.length; i++) {
      var temp = JSON.parse(await returnCoinPrice(coins[i]));
      price.push(temp.rate);
    }

    console.log("\x1b[32m    Generating Payload...\x1b[0m");

    // Construct Payload
    // Schema (Key : Value): "BTC": ["24387.61", "0.00545058"]
    for (let i = 0; i < coins.length; i++) {
      payload["coins"].push({[coins[i]] : [balance[i], price[i]]});
    }

    response.send(payload);

    console.log("Done in: %s ms", moment().diff(start, 0, true), ", payload is: ", payload);
});