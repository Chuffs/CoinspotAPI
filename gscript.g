function cryptoUpdater() {

  try {
    var result = UrlFetchApp.fetch(<nodejs address>);
  }
  catch {
    var result = UrlFetchApp.fetch(<nodejs address>);
  }

  var val_strt = 4;
  var val_end = 41;
  var coin_col_val = 'P';
  var value_col_val = 'Q';

  var bal_strt = 4;
  var bal_end = 38;
  var coin_col_bal = 'P';
  var value_col_bal = 'E';

  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  var data = JSON.parse(result.getContentText());

  Logger.log(data['coins'][0]['BTC'][0]);
  Logger.log(data['coins'][0]['BTC'][1]);

  for(let i = val_strt; i < (val_end + 1); i++) {
    var coin = sheet.getRange('Cryptocurrency!' + coin_col_val + i).getValue();
    var coinValue = data['coins'][0][coin];
    sheet.getRange('Cryptocurrency!' + value_col_val + i).setValue(coinValue);
  }

    for(let i = bal_strt; i < (bal_end + 1); i++) {
    var coin = sheet.getRange('Cryptocurrency!' + coin_col_bal + i).getValue();
    if(!coin) {
    } else {
      var coinBalance = data['coins'][0][coin][1];
      sheet.getRange('Cryptocurrency!' + value_col_bal + i).setValue(coinBalance);
    }
  }
}
