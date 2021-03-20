const balanceKeywords = [
  'avbl bal',
  'available balance',
  'a/c bal',
  'available bal',
  'avl bal',
];
const trnKeywords = ['debited', 'credited', 'payment', 'spent'];

function getTypeOfTransaction(message) {
  for (let keyword of trnKeywords) {
    if (message.includes(keyword)) {
      return keyword;
    }
  }

  return "";
}

function getCard(message) {
  if (typeof message === "string") {
    message = processMessage(message);
  }

  const cardIndex = message.indexOf('card');
  let card = { type: '', no: '' };

  // Search for "card" and if not found return empty obj
  if (cardIndex !== -1) {
    card.no = message[cardIndex + 1];
    card.type = 'card';

    // If the data is false positive
    // return empty obj
    // Else return the card info
    if (isNaN(Number(card.no))) {
      return {
        type: '',
        no: '',
      };
    } else {
      return card;
    }
  } else {
    return { type: '', no: '' };
  }
}

function getAccount(message) {
  if (typeof message === "string") {
    message = processMessage(message);
  }

  const accountIndex = message.indexOf('ac');
  let account = {
    type: '',
    no: '',
  };

  // No occurence of the word "ac". Check for "card"
  if (accountIndex !== -1) {
    // find index of ac
    account.no = message[accountIndex + 1];
    account.type = 'account';

    // If wrong data is found or if it is a false positive
    // Search fot "card"
    // Else return the account data
    if (isNaN(Number(account.no))) {
      return getCard(message);
    } else {
      return account;
    }
  } else {
    return getCard(message);
  }
}

function trimLeadingAndTrailingChars(str) {
  const strLength = str.length;

  if (strLength < 3) {
    return str;
  } else {
    const [first, last] = [str[0], str[strLength - 1]];

    if (isNaN(Number(last))) {
      str = str.slice(0, -1);
    }
    if (isNaN(Number(first))) {
      str = str.slice(1);
    }

    return str;
  }
}

function getBalance(message) {
  if (typeof message !== "string") {
    return "";
  }

  message = processMessage(message).join(" ");

  for (const word of balanceKeywords) {
    if (message.includes(word)) {
      const words = message.split(' ');
      const keyWordWords = word.split(' ');
      let index = words.indexOf(keyWordWords[0]);

      if (index === -1) {
        return '';
      } else {
        let balance = words[index + keyWordWords.length];

        if (balance === 'rs.') {
          const balanceIndex = index + keyWordWords.length + 1;

          if (balanceIndex >= words.length) {
            return '';
          } else {
            balance = trimLeadingAndTrailingChars(words[balanceIndex]);
            balance = balance.replace(/,/g, '');

            if (isNaN(Number(balance))) {
              return '';
            }

            return balance;
          }
        } else {
          // loop until you find rs.
          while (index < words.length) {
            if (words[index] === 'rs.') {
              if (index + 1 < words.length) {
                balance = words.length;
                balance = trimLeadingAndTrailingChars(words[index + 1]);
                balance = balance.replace(/,/g, '');
                
                return balance;
              } else {
                return '';
              }
            }
            ++index;
          }

          return '';
        }
      }
    }
  }

  return "";
}

function getMoneySpent(message) {
  if (typeof message === "string") {
    message = processMessage(message);
  }

  const index = message.indexOf('rs.');

  // If "rs." does not exist
  // Return ""
  if (index === -1) {
    return '';
  } else {
    let money = message[index + 1];

    money = money.replace(/,/g, '');

    // If data is false positive
    // Look ahead one index and check for valid money
    // Else return the found money
    if (isNaN(Number(money))) {
      money = message[index + 2];
      money = money.replace(/,/g, '');

      // If this is also false positive, return ""
      // Else return the found money
      if (isNaN(Number(money))) {
        return '';
      } else {
        return money;
      }
    } else {
      return money;
    }
  }
}

function processMessage(message) {
  // convert to lower case
  message = message.toLowerCase();
  // remove '-'
  message = message.replace(/-/g, '');
  // remove ':'
  message = message.replace(/:/g, '');
  // remove '/'
  message = message.replace(/\//g, '');
  // remove 'ending'
  message = message.replace(/ending /g, '');
  // replace 'x'
  message = message.replace(/x|[*]/g, '');
  // // remove 'is' 'with'
  // message = message.replace(/\bis\b|\bwith\b/g, '');
  // replace 'is'
  message = message.replace(/is /g, '');
  // replace 'with'
  message = message.replace(/with /g, '');
  // remove 'no.'
  message = message.replace(/no. /g, '');
  // replace all ac, acct, account with ac
  message = message.replace(/\bac\b|\bacct\b|\baccount\b/g, 'ac');
  // replace all 'rs' with 'rs. '
  message = message.replace(/rs(?=\w)/g, 'rs. ');
  // replace all 'rs ' with 'rs. '
  message = message.replace(/rs /g, 'rs. ');
  // replace all inr with rs.
  message = message.replace(/inr(?=\w)/g, 'rs. ');
  //
  message = message.replace(/inr /g, 'rs. ');
  // replace all 'rs. ' with 'rs.'
  message = message.replace(/rs. /g, 'rs.');
  // replace all 'rs.' with 'rs. '
  message = message.replace(/rs.(?=\w)/g, 'rs. ');
  // split message into words
  message = message.split(' ');
  // remove '' from array
  message = removeItemAll(message, '');

  return message;
}

function removeItemAll(arr, value) {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function getTransactionInfo(message) {
  if (!message || typeof message !== 'string') {
    return {};
  }

  const processedMessage = processMessage(message);
  const account = getAccount(processedMessage);
  const balance = getBalance(processedMessage.join(' '));
  const money = getMoneySpent(processedMessage);
  let trn = "";
  const isValid = [balance, money, account.no].filter(x => x !== "").length >= 2

  if (isValid) {
    trn = getTypeOfTransaction(processedMessage);
  }

  return {
    account,
    balance,
    money,
    typeOfTransaction: trn,
  };
}

module.exports = {
  getTransactionInfo,
  getAccount,
  getBalance,
  getCard,
  getMoneySpent,
  getTypeOfTransaction,
  processMessage,
  removeItemAll,
};
