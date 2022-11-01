# A Node.js Coinspot API Script
A Node.js script to update an investment portfolio on google sheets using the Coinspot API.

The script will grab a list of watched coins from a google spreadsheet and then query the Coinspot API to recieve balances and prices of said coins.

Some required files are missing, as they pose a security threat. To use this script yourself you would need to do the following things;
- Create a project on the Google Cloud Platform and request access to Google Sheets API for use with Node.js
- Generate API access to your coinspot account. Details of the Coinspot API can be found here - https://www.coinspot.com.au/my/api. You will need full access to the account in order to access the balances of your coins.
- Once Coinspot API access is obtained a json file with the following details will need to be created;
```
{
  "key": "#####", //Coinspot API Key
  "secret": "#####", //Coinspot API Secret
  "cell_range": "#####", //Google Spreadsheets range for the coin watchlist
  "sheet_id": "#####" //Google Spreadsheets sheed_id for the coin portfolio
}
```

- A Node.js server or device to run the script on your local network. I have deployed mine on a low powered Raspberry Pi Zero W and have port forwarded the appropriate port so that communication can be established.
- With the Node.js server running, add the contents of the gscript.g file to the Google Spreadsheets Apps Script, making sure to change the URL of the node.js server.

TO-DO
- Node.js logging, save each output/request as a seperate file to ease debugging
- Collecting and organizing Order History for better % gain/loss, can be done with V2 of CoinSpot API
- Cleanup of Code/Optimization
