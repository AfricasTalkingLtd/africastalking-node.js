# API Reference

The official Rest API Reference is [available here](http://docs.africastalking.com).

## Note

- All methods are asynchronous.
- All phone numbers use the international format. e.g. `+234xxxxxxxx`.

## Initialize the AfricasTalking Client

You need your app username and your API key to create a new AfricasTalking Client, both of which you can get from the [dashboard](https://account/africastalking.com).

> You can use this SDK for either production or sandbox apps. For sandbox, the app username is **ALWAYS** `sandbox`

```javascript
import { Client } from 'africastalking'; // const { Client } = require('africastalking');

const client = new Client({
    apiKey: 'YOUR_API_KEY', // use your sandbox app API key for development in the test environment
    username: 'YOUR_USERNAME', // use 'sandbox' for development in the test environment
});
```

## Methods

- Airtime Operations
  - [sendAirtimeRequest](#sendAirtimeRequest)

- Application Operations
  - [fetchApplicationData](#fetchApplicationData)

- Payments Operations
  - [topupStash](#topupStash)
  - [walletTransfer](#walletTransfer)
  
  bank
  - [bankCheckoutCharge](#bankCheckoutCharge)
  - [bankCheckoutValidate](#bankCheckoutValidate)
  - [bankTransfer](#bankTransfer)
  
  card
  - [cardCheckoutCharge](#cardCheckoutCharge)
  - [cardCheckoutValidate](#cardCheckoutValidate)
  
  mobile
  - [mobileB2B](#mobileB2B)
  - [mobileB2C](#mobileB2C)
  - [mobileCheckout](#mobileCheckout)
  - [mobileData](#mobileData)
  
  query
  - [fetchProductTransactions](#fetchProductTransactions)
  - [fetchWalletBalance](#fetchWalletBalance)
  - [fetchWalletTransactions](#fetchWalletTransactions)
  - [findTransaction](#findTransaction)

- SMS Operations
  - [fetchMessages](#fetchMessages)
  - [sendSms](#sendSms)
  - [sendBulk](#sendBulk)
  - [sendPremium](#sendPremium)
  
  premium subscriptions
  - [createSubscription](#createSubscription)
  - [deleteSubscription](#deleteSubscription)
  - [fetchSubscription](#fetchSubscription)

- Token Operations
  - [createCheckoutToken](#createCheckoutToken)
  - [generateAuthToken](#generateAuthToken)

- Voice Operations
  - [getNumQueuedCalls](#getNumQueuedCalls)
  - [makeCall](#makeCall)
  - [uploadMediaFile](#uploadMediaFile)

## a) Airtime Operations

- ### sendAirtimeRequest({ recipients })

Send airtime to a bunch of phone numbers.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| recipients | _array, REQUIRED_ | An array of objects containing the recipients. |

Each _recipient_ in the array is of the format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| phoneNumber | _string, REQUIRED_ | The recipient's phone number. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to charge. |

For more information, please read [http://docs.africastalking.com/airtime/sending](http://docs.africastalking.com/airtime/sending).

#### Example

```ts
const result = client.sendAirtimeRequest({
  recipients: [
    {
      phoneNumber: '+254711XXXYYY',
      currencyCode: 'KES',
      amount: 10,
    },
  ],
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

## b) Application Operations

- ### fetchApplicationData()

Get app information. e.g. balance.

For more information, please read [http://docs.africastalking.com/userdata/balance](http://docs.africastalking.com/userdata/balance).

#### Example

```ts
const result = client.fetchApplicationData()
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

## c) Payments Operations

- ### topupStash({ productName, currencyCode, amount, metadata })

Move money from a Payment Product to an app's stash.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to transfer. |
| metadata | _object_ | Additional info to go with the transfer. |

#### Example

```ts
const result = client.walletTransfer({
  productName: 'TestProduct',
  currencyCode: 'KES',
  amount: 50,
  metadata: {
    id: '088930432excvmklevdf',
    name: 'John Doe',
  },
});
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### walletTransfer({ productName, targetProductCode, currencyCode, amount, metadata })

Move money form one payment product to another.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| targetProductCode | _string, REQUIRED_ | ID of recipient payment product on Africa's Talking. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to transfer. |
| metadata | _object_ | Additional info to go with the transfer. |

#### Example

```ts
const result = client.walletTransfer({
  productName: 'TestProduct',
  targetProductCode: 3323,
  currencyCode: 'KES',
  amount: 50,
  metadata: {
    id: '088930432excvmklevdf',
    name: 'John Doe',
  },
});
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

### bank

- ### bankCheckoutCharge({ productName, bankAccount, currencyCode, amount, narration, metadata })

Initiate a bank checkout.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| bankAccount | _object, REQUIRED_ | Bank account to charge. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to transfer. |
| narration | _string, REQUIRED_ | Checkout description. |
| metadata | _object_ | Additional info to go with the transfer. |

#### Example

```ts
import { CONSTANTS } from 'africastalking';

const result = client.bankCheckoutCharge({
  productName: 'TestProduct',
  bankAccount: {
    accountName: 'Test Bank Account',
    accountNumber: '1234567890',
    bankCode: CONSTANTS.BANK.FCMB_NG,
  },
  currencyCode: 'KES',
  amount: 50,
  narration: 'Test Payment',
  metadata: {
    id: '088930432excvmklevdf',
    name: 'John Doe',
  },
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### bankCheckoutValidate()

- ### bankTransfer()

### card

- ### cardCheckoutCharge()

- ### cardCheckoutValidate()

### mobile

- ### mobileB2B()

- ### mobileB2C()

- ### mobileCheckout()

- ### mobileData()

### query

- ### fetchProductTransactions()

- ### fetchWalletBalance()

- ### fetchWalletTransactions()

- ### findTransaction()
