function preciousMetalUpdater() {
  var url = "https://data-asg.goldprice.org/dbXRates/USD";

  var options =
      {
        "method"  : "GET",
        "followRedirects" : true,
        "muteHttpExceptions":true
      };
  var result = UrlFetchApp.fetch(url, options);
  
  var data = JSON.parse(result.getContentText());
  
  var goldPrice = data['items'][0]['xauPrice'];
  var silverPrice = data['items'][0]['xagPrice'];
  
  SpreadsheetApp.getActiveSheet().getRange('Precious Metals!E5').setValue(goldPrice);
  SpreadsheetApp.getActiveSheet().getRange('Precious Metals!E6').setValue(silverPrice);
  
  var userTimeZone = CalendarApp.getDefaultCalendar().getTimeZone();
  var date = Utilities.formatDate(new Date(), userTimeZone, 'HH:mm a, dd/MM/yy');
  SpreadsheetApp.getActiveSheet().getRange('Precious Metals!E8').setValue(date);
}

function cryptoUpdater() {

  var val_strt = 4;
  var val_end = 41;
  var coin_col_val = 'P';
  var value_col_val = 'Q';

  var bal_strt = 4;
  var bal_end = 38;
  var coin_col_bal = 'P';
  var value_col_bal = 'E';

  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  var url = sheet.getRange('Cryptocurrency!A1').getValue();

  Logger.log(url);

  try {
    var result = UrlFetchApp.fetch(url);
    Logger.log("Success!");
  }
  catch(err) {
    Logger.log("Failed Fetch: %s", err);
    throw new Error("Webserver not available");
  }

  var data = JSON.parse(result.getContentText());

  for(let i = val_strt; i < (val_end - 1); i++) {
    var coin = sheet.getRange('Cryptocurrency!' + coin_col_val + i).getValue();
    if(coin) {
      var coinValue = data['coins'][0][coin][0];
      sheet.getRange('Cryptocurrency!' + value_col_val + i).setValue(coinValue);
      Logger.log("Updating %s price: $%s", coin, coinValue);
    }

  }

    for(let i = bal_strt; i < (bal_end + 1); i++) {
    var coin = sheet.getRange('Cryptocurrency!' + coin_col_bal + i).getValue();
    if(!coin) {
    } else {
      var coinBalance = data['coins'][0][coin][1];
      sheet.getRange('Cryptocurrency!' + value_col_bal + i).setValue(coinBalance);
      Logger.log("Updating %s balance: %s", coin, coinBalance);
    }
  }
  Logger.log("Done!");
}