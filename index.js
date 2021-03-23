const engine = require('./engine');

module.exports = {
  getAccount: engine.getAccount,
  getBalance: engine.getBalance,
  getMoneySpent: engine.getMoneySpent,
  getTransactionInfo: engine.getTransactionInfo,
};
