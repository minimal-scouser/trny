const balanceKeywords = [
  'avbl bal',
  'available balance',
  'a/c bal',
  'available bal',
  'avl bal',
];
const trnKeywords = ['debited', 'credited', 'payment', 'spent'];

function getTypeOfTransaction(message) {
  const creditPattern = /(?:credited|credit)/gi;
  const debitPattern = /(?:debited|debit)/gi
  const miscPattern = /(?:payment|spent)/gi;

  if (typeof message !== 'string') {
    message = message.join(' ');
  }

  if (debitPattern.test(message)) {
    return 'debited';
  } else if (creditPattern.test(message)) {
    return 'credited';
  } else if (miscPattern.test(message)) {
    return 'debited';
  }

  return '';
}

function getCard(message) {
  if (typeof message === 'string') {
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

function extractBondedAccountNo(accountNo) {
  const strippedAccountNo = accountNo.replace('ac', '');

  if (isNaN(Number(strippedAccountNo))) {
    return '';
  } else {
    return strippedAccountNo;
  }
}

function getAccount(message) {
  if (typeof message === 'string') {
    message = processMessage(message);
  }

  let accountIndex = -1;
  let account = {
    type: '',
    no: '',
  };

  for (const [index, word] of message.entries()) {
    if (word === 'ac') {
      if (index + 1 < message.length) {
        const accountNo = trimLeadingAndTrailingChars(message[index + 1]);

        if (isNaN(Number(accountNo))) {
          // continue searching for a valid account number
          continue;
        } else {
          accountIndex = index;
          account.type = 'account';
          account.no = accountNo;
          return account;
        }
      } else {
        // continue searching for a valid account number
        continue;
      }
    } else if (word.includes('ac')) {
      const extractedAccountNo = extractBondedAccountNo(word);

      if (extractedAccountNo === '') {
        continue;
      } else {
        accountIndex = index;
        account.type = 'account';
        account.no = extractedAccountNo;
        return account;
      }
    }
  }

  // No occurence of the word "ac". Check for "card"
  if (accountIndex === -1) {
    return getCard(message);
  }
}

function trimLeadingAndTrailingChars(str) {
  const [first, last] = [str[0], str[str.length - 1]];

  if (isNaN(Number(last))) {
    str = str.slice(0, -1);
  }
  if (isNaN(Number(first))) {
    str = str.slice(1);
  }

  return str;
}

function extractBalance(index, message, length) {
  let balance = '';
  let saw_number = false;
  let invalid_char_count = 0;
  let char = '';

  while (index < length) {
    char = message[index];

    if ('0' <= char && char <= '9') {
      saw_number = true;
      // is_start = false;
      balance += char;
    } else {
      if (saw_number === false) {
      } else {
        if (char === '.') {
          if (invalid_char_count === 1) {
            break;
          } else {
            balance += char;
            invalid_char_count += 1;
          }
        } else if (char !== ",") {
          break;
        }
      }
    }

    ++index;
  };

  return balance;
}

function getBalance(message) {
  if (typeof message !== 'string') {
    return '';
  }

  message = processMessage(message).join(' ');
  let index_of_keyword = -1;
  let balance = '';

  for (const word of balanceKeywords) {
    index_of_keyword = message.indexOf(word);

    if (index_of_keyword !== -1) {
      index_of_keyword += word.length;
      break;
    } else {
      continue;
    }
  }

  // found the index of keyword, moving on to finding 'rs.' occuring after index_of_keyword
  let index = index_of_keyword;
  let index_of_rs = -1;
  let nextThreeChars = message.substr(index, 3);

  index += 3;

  while (index < message.length) {
    // discard first char
    nextThreeChars = nextThreeChars.slice(1);
    // add the current char at the end
    nextThreeChars += message[index];

    if (nextThreeChars === 'rs.') {
      index_of_rs = index + 2;
      break;
    }

    ++index;
  }

  // no occurence of 'rs.'
  if (index_of_rs === -1) {
    return '';
  }

  balance = extractBalance(index_of_rs, message, message.length);

  return balance;
}

function getMoneySpent(message) {
  if (typeof message === 'string') {
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
  let trn = '';
  const isValid =
    [balance, money, account.no].filter((x) => x !== '').length >= 2;

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
