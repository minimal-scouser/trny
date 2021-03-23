# trny

A javascript package that extracts transactional info like account number, money spent, balance and type of transaction from a string

Demo [here](https://minimal-scouser.github.io/trny-demo)

## Installation

```bash
npm install trny
```

## Usage

```javascript
import { getTransactionInfo } from "trny";

const message = "Your a/c XX0413 is debited on 15/12/2020 by INR 3,211.00 towards purchase. Avl Bal: INR 5,603.54.";

const info = getTransactionInfo(message);
 
/* 
info = {     
   account: {
    type: "account",
    no: "0413"
   },
   balance: 5603.54,
   money: 3211.00,
   typeOfTransaction: "debited" 
}
*/

```

## Methods

1. [getTransactionInfo](#gettransactioninfo)
2. [getAccount](#getaccount)
3. [getMoneySpent](#getmoneyspent)
4. [getBalance](#getbalance)

#### `getTransactionInfo`

```typescript 
import { getTransactionInfo } from "trny";

const message = "Dear Customer, Rs.248,759.00 is debited from A/c XXXX6791 for BillPay/Credit Card payment via Example Bank NetBanking. Call XXXXXXXX161XXX if txn not done by you";

const info = getTransactionInfo(string: string)
/*
{
    account: {type: "account", no: "6791"},
    balance: "",
    money: "248759.00",
    typeOfTransaction: "debited"
}, 
*/
```

#### `getAccount`

```javascript 

import { getAccount } from "trny";

const message = "INR Rs. 399 debited from A/c no. 098900 on Avl Bal-INR Rs. 57575";

const account = getAccount(message);
// "098900"
```

#### `getMoneySpent`

```javascript

import { getMoneySpent } from "trny";

const message = "Your sb a/c XXX00981 is debited for rs.80 on 22-02-2021 by transfer avl bal rs:6802.04";

const money = getMoneySpent(message);
// "00981"

```

#### `getBalance`

```javascript

import { getBalance } from "trny";

const message = "Avbl Bal for A/c XXXX0377  as on 30-06-2019 is INR 21719.25. Combined Avbl Bal is INR 21719.25. Use Mobile Banking App to track A/c (app.kotak.com)";

const balance = getBalance(message);
// "21719.25"

```

## Contribute

Please submit a PR

## Visitors

![visitor badge](https://visitor-badge.glitch.me/badge?page_id=minimal-scouser.visitor-badge)
