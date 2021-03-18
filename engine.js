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
}

function getCard(message) {
  const cardIndex = message.indexOf("card");
  let card = { type: "", no: "" };

  // Search for "card" and if not found return empty obj
  if (cardIndex !== -1) {
    card.no = message[cardIndex + 1];
    card.type = "card";

    // If the data is false positive
    // return empty obj
    // Else return the card info
    if (isNaN(Number(card.no))) {
      return {
        type: "",
        no: ""
      };
    } else {
      return card;
    }
  } else {
    return { type: "", no: "" };
  }
}

function getAccount(message) {
  const accountIndex = message.indexOf("ac");
  let account = {
    type: "",
    no: ""
  };

  // No occurence of the word "ac". Check for "card"
  if (accountIndex !== -1) {
    // find index of ac
    account.no = message[accountIndex + 1];
    account.type = "account";

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

function getBalance(message) {
  for (const word of balanceKeywords) {
    if (message.includes(word)) {
      const words = message.split(' ');
      const keyWordWords = word.split(' ');
      const index = words.indexOf(keyWordWords[0]);
      let balance = words[index + keyWordWords.length];

      if (balance === 'rs.') {
        balance = words[index + keyWordWords.length + 1];
        return balance;
      } else {
        // loop until you find rs.
        for (const [index, word] of words.entries()) {
          if (word === 'rs.') {
            return words[index + 1];
          }
        }
      }
    }
  }
}

function getMoney(message) {
  const index = message.indexOf('rs.');
  let money = message[index + 1];
  money = money.replace(/,/, '');

  if (!Number(money)) {
    money = message[index + 2];
    money = money.replace(/,/, '');

    if (!Number(money)) {
      return 'could not extract money';
    } else {
      return money;
    }
  }
  return money;
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
  console.log(message);
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

module.exports = function getTransactionInfo(message) {
  if (!message || typeof message !== 'string') {
    return {};
  }

  const processedMessage = processMessage(message);
  const account = getAccount(processedMessage);
  const balance = getBalance(processedMessage.join(' '));
  const money = getMoney(processedMessage);
  const trn = getTypeOfTransaction(processedMessage);

  return {
    accountNo: account,
    balance,
    money: money,
    typeOfTransaction: trn,
  };
};
