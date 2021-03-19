# trny
A javascript package that extracts transactional info from a string

## Installation

```bash
npm install trny
```

## Usage

```javascript
import engine from "trny";

const message = "Your a/c XX0413 is debited on 15/12/2020 by INR 3,211.00 towards purchase. Avl Bal: INR 5,603.54.";

const info = engine.getTransactionInfo(message);
 
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
