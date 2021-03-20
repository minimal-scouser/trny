const engine = require('./engine');

engine.getTransactionInfo("Avbl Bal for A/c XXXX0377  as on 30-06-2019 is INR 21719.25. Combined Avbl Bal is INR 21719.25. Use Mobile Banking App to track A/c (app.kotak.com)");

module.exports = {
  getAccount: engine.getAccount,
  getBalance: engine.getBalance,
  getMoneySpent: engine.getMoneySpent,
  getTransactionInfo: engine.getTransactionInfo,
};
