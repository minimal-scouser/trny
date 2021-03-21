const engine = require('../engine');

// test('type of invalid transactions', () => {
//   const messages = ['', undefined, null, {}, [], 0, 99, '99'];

//   messages.forEach((message) => {
//     expect(engine.getTypeOfTransaction(message)).toBe('');
//   });
// });

test('type of incomplete transactions', () => {
  const messages = ['debited', "credited", "", "debited credited", "ac rs. 300 credited avbl bal 200"];

  messages.forEach((message) => {
    const processedMessage = engine.processMessage(message);
    const [account, money, balance] = [
      engine.getAccount(processedMessage),
      engine.getMoneySpent(processedMessage),
      engine.getBalance(processedMessage.join(' ')),
    ];

    if (account.no && money && balance) {
      expect(engine.getTypeOfTransaction(message)).toBe('');
    }
  });
});

test("valid transaction", () => {
  const messages = [
    "Your a/c XX0413 is debited on 15/12/2020 by INR 3,211.00 towards purchase. Avl Bal: INR 5,603.54.",
    "Dear Customer, Rs.248,759.00 is debited from A/c XXXX6791 for BillPay/Credit Card payment via Example Bank NetBanking. Call XXXXXXXX161XXX if txn not done by you",
    "UPDATE: Your A/c XX6791 credited with INR 15,160.00 on 20-11-2020 by A/c linked to mobile no XX79XX(IMPS Ref No. XX114XXXXX393) Available bal: INR 2,088,505.04",
    "Dear Customer, You have made a payment of Rs. 46000 using NEFT via IMPS from your Account XXXXXXXX0126 with reference number XXX387XXX on November 20, 2020 at 14:15.",
    "Acct XX126 debited with INR 46,000.00 on 20-Nov-2020 & Acct XX791 credited. IMPS: XXX410XX. Call XX0026XX for dispute or SMS BLOCK 126 to XXX5676XXX",
    "Dear bank cardmember, Payment of Rs 248759 was credited to your card ending 12344 on 20/Nov/2020.",
    "Alert: You've spent INR 555.00 on your Delhi Exapmle Bank card **91XXX at BD JIO MONEY on 20/11/2020 at 11:07AM IST. Please call XXX041XXX if this was not made by you.",
    "Thank you for making a payment of Rs. 3499.00 towards your Example Bank Card. This payment will be reflected as a credit on your Card account within 2 working days. Your payment reference number is XXX741270XXX. For any details you may log on to bankexample.com or our mobile app",
    "Your Debit card annual fee of Rs. 399.00 has been debited from your account.",
    "Dear Customer, Min payment Rs.175.00/total payment Rs.3499.00 for Hyderabad Example Card **********91000 is due by 27-11-2020. Please ignore if already paid.",
    "Dear Customer, your new savings bank account with no. 7491283023456444 has been opened. -Ahmedabad Sahakari Bank Ltd.",
    "INR Rs. 399 debited from A/c no. 098900 on Avl Bal-INR Rs. 57575",
    "Avbl Bal for A/c XXXX0377  as on 30-06-2019 is INR 21719.25. Combined Avbl Bal is INR 21719.25. Use Mobile Banking App to track A/c (app.kotak.com)",
    "Your sb a/c **00981 is debited for rs.80 on 22-02-2021 by transfer avl bal rs:6802.04",
    "Rs49.0 debited@SBI UPI frm A/cX12345 on 18Dec20 RefNo 1212121212. If not done by u, fwd this SMS to 9223008333/Call 1800111109 or 09449112211 to block UPI",
    "Your SB A/c **12345 is Debited for Rs.100 on 01-01-2021 12:30:50 by Transfer. Avl Bal Rs:12345.30-Union Bank of India DOWNLOAD U MB HTTP://ONELINK.TO/BUYHR7"
  ];

  const results = [
    {
      account: {type: "account", no: "0413"},
      balance: "5603.54",
      money: "3211.00",
      typeOfTransaction: "debited"
    },
    {
      account: {type: "account", no: "6791"},
      balance: "",
      money: "248759.00",
      typeOfTransaction: "debited"
    },
    {
      account: {type: "account", no: "6791"},
      balance: "2088505.04",
      money: "15160.00",
      typeOfTransaction: "credited"
    },
    {
      account: {type: "account", no: "0126"},
      balance: "",
      money: "46000",
      typeOfTransaction: "payment"
    },
    {
      account: {type: "account", no: "126"},
      balance: "",
      money: "46000.00",
      typeOfTransaction: "debited"
    },
    {
      account: {type: "card", no: "12344"},
      balance: "",
      money: "248759",
      typeOfTransaction: "credited"
    },
    {
      account: {type: "card", no: "91"},
      balance: "",
      money: "555.00",
      typeOfTransaction: "spent"
    },
    {
      account: {type: "", no: ""},
      balance: "",
      money: "3499.00",
      typeOfTransaction: ""
    },
    {
      account: {type: "", no: ""},
      balance: "",
      money: "399.00",
      typeOfTransaction: ""
    },
    {
      account: {type: "card", no: "91000"},
      balance: "",
      money: "",
      typeOfTransaction: ""
    },
    {
      account: {type: "account", no: "7491283023456444"},
      balance: "",
      money: "",
      typeOfTransaction: ""
    },
    {
      account: {type: "account", no: "098900"},
      balance: "57575",
      money: "399",
      typeOfTransaction: "debited"
    },
    {
      account: {type: "account", no: "0377"},
      balance: "21719.25",
      money: "",
      typeOfTransaction: ""
    },
    {
      account: {type: "account", no: "00981"},
      balance: "6802.04",
      money: "80",
      typeOfTransaction: "debited"
    },
    {
      account: {type: "account", no: "3006"},
      balance: "",
      money: "49.0",
      typeOfTransaction: "debited"
    },
    {
      account: {type: "account", no: "12345"},
      balance: "12345.30",
      money: "100",
      typeOfTransaction: "debited"
    }
  ];

  messages.forEach((message, index) => {
    expect(engine.getTransactionInfo(message)).toStrictEqual(results[index]);
  });
})
