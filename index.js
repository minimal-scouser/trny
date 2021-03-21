const engine = require('./engine');

engine.getTransactionInfo(
  "Your SB A/c **12345 is Debited for Rs.100 on 01-01-2021 12:30:50 by Transfer. Avl Bal Rs:12345.30-Union Bank of India DOWNLOAD U MB HTTP://ONELINK.TO/BUYHR7",
);

module.exports = {
  getAccount: engine.getAccount,
  getBalance: engine.getBalance,
  getMoneySpent: engine.getMoneySpent,
  getTransactionInfo: engine.getTransactionInfo,
};
