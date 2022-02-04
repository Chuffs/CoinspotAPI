function cryptoUpdater() {

  var val_strt = 4;
  var val_end = 41;
  var coin_col_val = 'P';
  var value_col_val = 'Q';

  var bal_strt = 4;
  var bal_end = 38;
  var coin_col_bal = 'P';
  var value_col_bal = 'E';

  var flag;

  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  try {
    var result = UrlFetchApp.fetch("#####");
    Logger.log("Success!");
    flag = 0;
  }
  catch(err) {
    Logger.log("Failed Fetch: %s", err);
    flag = 1;
  }

  if(flag){
    try {
      var result = UrlFetchApp.fetch("#####");
      Logger.log("Backup IP Available. Success!")
    } catch(err) {
      Logger.log("Failed fetch: %s\nNo IPs avaialble")
      return;
    }
  }

  var data = JSON.parse(result.getContentText());

  for(let i = val_strt; i < (val_end - 1); i++) {
    var coin = sheet.getRange('Cryptocurrency!' + coin_col_val + i).getValue();
    var coinValue = data['coins'][0][coin][0];
    sheet.getRange('Cryptocurrency!' + value_col_val + i).setValue(coinValue);
    if(coin){
      Logger.log("Updating %s price: $%s", coin, coinValue);
    }
  }

    for(let i = bal_strt; i < (bal_end - 1); i++) {
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
