# API Reference

The official Rest API Reference is [available here](http://docs.africastalking.com).

## Notes/Links

- All methods are asynchronous.
- All phone numbers use the international format. e.g. `+234xxxxxxxx`.
- [What else can I import from the package, apart from `Client`?](#what-else-can-i-import-from-the-package-apart-from-client)

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

## Client Methods

- [Airtime Operations](#a-airtime-operations)
  - sendAirtimeRequest

- [Application Operations](#b-application-operations)
  - fetchApplicationData

- [Payments Operations](#c-payments-operations)
  - topupStash
  - walletTransfer
  
  [bank](#bank)
  - bankCheckoutCharge
  - bankCheckoutValidate
  - bankTransfer
  
  [card](#card)
  - cardCheckoutCharge
  - cardCheckoutValidate
  
  [mobile](#mobile)
  - mobileB2B
  - mobileB2C
  - mobileCheckout
  - mobileData
  
  [query](#query)
  - fetchProductTransactions
  - fetchWalletBalance
  - fetchWalletTransactions
  - findTransaction

- [SMS Operations](#d-sms-operations)
  - fetchMessages
  - sendSms
  - sendBulkSms
  - sendPremiumSms
  
  [premium subscriptions](#premium-subscriptions)
  - createSubscription
  - deleteSubscription
  - fetchSubscription

- [Token Operations](#e-token-operations)
  - createCheckoutToken
  - generateAuthToken

- [Voice Operations](#f-voice-operations)
  - getNumQueuedCalls
  - makeCall
  - uploadMediaFile

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
      phoneNumber: '+254711111111',
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

- ### bankCheckoutValidate({ transactionId, otp })

Validate a bank checkout.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| transactionId | _string, REQUIRED_ | Transaction ID returned on charge request. |
| otp | _string, REQUIRED_ |  A user-provided OTP. |

#### Example

```ts
const result = client.bankCheckoutValidate({
  transactionId: 'ATPid_SampleTxnId1',
  otp: '1234',
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### bankTransfer({ productName, recipients })

Initiate a bank transfer.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| recipients | _array, REQUIRED_ | A list of banks to transfer to. |

Each recipient in the array is of the format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| bankAccount | _object, REQUIRED_ | Bank account to charge. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to transfer. |
| narration | _string, REQUIRED_ | Checkout description. |
| metadata | _object_ | Additional info to go with the transfer. |

The `bankAccount` is of the format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| accountName | _string, REQUIRED_ | The name of the bank account. |
| accountNumber | _string, REQUIRED_ | The bank account number. |
| bankCode | _number, REQUIRED_ | The bank code. |
| dateOfBirth | _string, REQUIRED_ | The date of birth. |

#### Example

```ts
import { CONSTANTS } from 'africastalking';

const result = client.bankTransfer({
  productName: 'TestProduct',
  recipients: [{
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
  }],
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

### card

- ### cardCheckoutCharge({ productName, paymentCard, checkoutToken, currencyCode, amount, narration, metadata })

Initiate a card checkout.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| paymentCard | _object, REQUIRED_ (if `checkoutToken` is not provided) | Card to charge. |
| checkoutToken | _string, REQUIRED_ (if `paymentCard` is not provided) | Token from a previous successful transaction. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to transfer. |
| narration | _string, REQUIRED_ | Checkout description. |
| metadata | _object_ | Additional info to go with the transfer. |

`paymentCard` is of the following format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| number | _string, REQUIRED_ | Payment card number. |
| cvvNumber | _object, REQUIRED_ | 3 or 4 digit payment card verification value. |
| expiryMonth | _number, REQUIRED_ | Expiration month on the payment card. |
| expiryYear | _number, REQUIRED_ | Expiration year on the payment card. |
| countryCode | _string, REQUIRED_ |  2-Digit country code where the payment card was issued. _Only “NG” is currently supported_ |
| authToken | _string, REQUIRED_ | The payment cards ATM PIN.  |

#### Example

```ts
const result = client.cardCheckoutCharge({
  productName: 'TestProduct',
  paymentCard: {
    number: '123456789000',
    cvvNumber: 654,
    expiryMonth: 7,
    expiryYear: 2025,
    authToken: '2345',
    countryCode: 'NG',
  },
  currencyCode: 'NGX',
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

- ### cardCheckoutValidate()

Validate a card checkout.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| transactionId | _string, REQUIRED_ | Transaction ID returned on charge request. |
| otp | _string, REQUIRED_ |  A user-provided OTP. |

#### Example

```ts
const result = client.cardCheckoutValidate({
  transactionId: 'ATPid_SampleTxnId1',
  otp: '1234',
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

### mobile

- ### mobileB2B({ productName, provider, transferType, currencyCode, amount, destinationChannel, destinationAccount, metadata })

Send mobile money to business.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| provider | _string, REQUIRED_ |  Provider used to process request. |
| transferType | _string, REQUIRED_ | Transfer type of the payment. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to transfer. |
| destinationChannel | _string, REQUIRED_ | Name or number of channel to receive payment. |
| destinationAccount | _string, REQUIRED_ | Account name used to receive money. |
| metadata | _object, REQUIRED_ | Additional info to go with the transfer. |

#### Example

```ts
import { CONSTANTS } from 'africastalking';

const result = client.mobileB2B({
  productName: 'TestProduct',
  provider: CONSTANTS.PROVIDER.ATHENA,
  transferType: CONSTANTS.TRANSFER_TYPE.B2B_TRANSFER,
  currencyCode: 'KES',
  amount: 100,
  destinationChannel: '456789',
  destinationAccount: 'octopus',
  metadata: { notes: 'Account top-up for July 2017' },
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### mobileB2C({ productName, recipients })

Send mobile money to consumer.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| recipients | _array, REQUIRED_ | A list of consumers that will receive the money. |

Each _recipient_ in the array is of the format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| name | _string_ | The recipient's name. |
| phoneNumber | _string, REQUIRED_ | The recipient's phone number. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to charge. |
| providerChannel | _string, REQUIRED_ | The channel the payment will be made from e.g a paybill number. |
| reason | _string, REQUIRED_ | Purpose of the payment. |
| metadata | _object, REQUIRED_ | Additional info to go with the transfer. |

#### Example

```ts
import { CONSTANTS } from 'africastalking';

const result = client.mobileB2C({
  productName: 'TestProduct',
  recipients: [
    {
      phoneNumber: '254711111111',
      currencyCode: 'KES',
      reason: CONSTANTS.REASON.SALARY,
      metadata: {
        id: '088930432excvmklevdf',
        name: 'John Doe',
      },
      amount: 234.5,
    },
  ],
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### mobileCheckout({ productName, providerChannel, phoneNumber, currencyCode, amount, metadata })

Initiate mobile checkout.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| providerChannel | _string_ | Provider channel to consider when charging. |
| phoneNumber | _string, REQUIRED_ | The recipient's phone number. |
| currencyCode | _string, REQUIRED_ | 3-digit ISO format currency code. |
| amount | _number, REQUIRED_ | Amount to charge. |
| metadata | _object, REQUIRED_ | Additional info to go with the transfer. |

#### Example

```ts
const result = client.mobileCheckout({
  productName: 'TestProduct',
  phoneNumber: '+254711111111',
  currencyCode: 'KES',
  metadata: {
    id: '088930432excvmklevdf',
    name: 'John Doe',
  },
  amount: 234.5,
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### mobileData({ productName, recipients })

Send mobile data to customers.

#### Parameters

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| recipients | _array, REQUIRED_ | A list of consumers that will receive the money. |

Each _recipient_ in the array is of the format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| phoneNumber | _string, REQUIRED_ | The recipient's phone number. |
| quantity | _number, REQUIRED_ | Mobile data amount. |
| unit | _string, REQUIRED_ | Mobile data unit. Can either be `MB` or `GB`. |
| validity | _string, REQUIRED_ | How long the mobile data is valid for. Must be one of `Day`, `Week` and `Month`. |
| metadata | _object, REQUIRED_ | Additional info to go with the transfer. |

#### Example

```ts
const result = client.mobileData({
  productName: 'TestProduct',
  recipients: [{
    phoneNumber: '+254711223344',
    quantity: 10,
    unit: 'GB',
    validity: 'Month',
    metadata: {
      id: '088930432excvmklevdf',
      name: 'John Doe',
    },
  }],
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

### query

- ### fetchProductTransactions({ productName, filters })

Fetch payment product transactions.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| productName | _string, REQUIRED_ | Your payment product. |
| filters | _object, REQUIRED_ | Query filters. |

_filters_ is of the format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| pageNumber | _string, REQUIRED_ | Page number to fetch results from. Starts from `'1'`. |
| count | _string, REQUIRED_ | Number of results to fetch. |
| startDate | _string_ | Start Date to consider when fetching. |
| endDate | _string_ | End Date to consider when fetching. |
| category | _string_ | Category to consider when fetching. |
| provider | _string_ | Provider to consider when fetching. |
| status | _string_ | Status to consider when fetching. |
| source | _string_ | Source to consider when fetching. |
| destination | _string_ | Destination to consider when fetching. |
| providerChannel | _string_ | Provider channel to consider when fetching. |

#### Example

```ts
const result = client.fetchProductTransactions({
  productName: 'TestProduct',
  filters: {
    pageNumber: '1',
    count: '10',
  },
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### fetchWalletBalance()

Fetch your wallet's balance

#### Example

```ts
const result = client.fetchWalletBalance()
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### fetchWalletTransactions({ filters })

Fetch wallet transactions.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| filters | _object, REQUIRED_ | Query filters. |

_filters_ is of the format:

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| pageNumber | _string, REQUIRED_ | Page number to fetch results from. Starts from `'1'`. |
| count | _string, REQUIRED_ | Number of results to fetch. |
| startDate | _string_ | Start Date to consider when fetching. |
| endDate | _string_ | End Date to consider when fetching. |
| categories | _string_ | Category to consider when fetching. |

#### Example

```ts
const result = client.fetchWalletTransactions({
  filters: {
    pageNumber: '1',
    count: '10',
  },
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### findTransaction({ transactionId })

Find a particular transaction.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| transactionId | _string, REQUIRED_ | Transaction ID returned on charge request. |

#### Example

```ts
const result = client.findTransaction({
  transactionId: 'ATPid_SampleTxnId1',
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

For more information, please read [http://docs.africastalking.com/payments](http://docs.africastalking.com/payments).

## d) SMS Operations

- ### fetchMessages({ lastReceivedId })

Manually retrieve your messages.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| lastReceivedId | _string, REQUIRED_ | This is the id of the message that you last processed. Defaults to `'0'`. |

#### Example

```ts
const result = client.fetchMessages()
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### sendSms({ to, message, from, enqueue })

Send a message.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| to | _string, REQUIRED_ | Recipients phone number. |
| message | _string, REQUIRED_ | SMS content. |
| from | _string_ |Shortcode or alphanumeric ID that is registered with Africa's Talking account. |
| enqueue | _string_ | Set to true if you would like to deliver as many messages to the API without waiting for an acknowledgement from telcos. |

#### Example

```ts
const result = client.sendSms({
  to: '+254711111111',
  message: 'This is a test',
  enqueue: true,
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### sendBulkSms({ to, message, from, enqueue, bulkSMSMode })

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| to | _string, REQUIRED_ | Recipients phone number. |
| message | _string, REQUIRED_ | SMS content. |
| from | _string_ |Shortcode or alphanumeric ID that is registered with Africa's Talking account. |
| enqueue | _string_ | Set to true if you would like to deliver as many messages to the API without waiting for an acknowledgement from telcos. |
| bulkSMSMode | _boolean, REQUIRED_ | The value must be set to `true` for bulk messages. |

#### Example

```ts
const result = client.sendBulkSms({
  to: ['+254711111111', '+254722222222'],
  message: 'This is heavy single test',
  enqueue: true,
  bulkSMSMode: true,
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### sendPremiumSms({ to, message, from, enqueue, keyword, linkId, retryDurationInHours })

Send premium SMS.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| to | _string, REQUIRED_ | Recipients phone number. |
| message | _string, REQUIRED_ | SMS content. |
| from | _string_ |Shortcode or alphanumeric ID that is registered with Africa's Talking account. |
| enqueue | _string_ | Set to true if you would like to deliver as many messages to the API without waiting for an acknowledgement from telcos. |
| keyword | _string_ | Your premium product keyword. |
| linkId | _string_ | We forward the linkId to your application when the user send a message to your service. |
| retryDurationInHours | _string_ | It specifies the number of hours your subscription message should be retried in case it's not delivered to the subscriber. |

#### Example

```ts
const result = client.sendPremiumSms({
  to: '+254718760882',
  from: 'testService',
  message: 'This is premium test',
  keyword: 'test',
  linkId: '76test',
  retryDurationInHours: 1,
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

### premium subscriptions

- ### createSubscription({ shortCode, keyword, phoneNumber, checkoutToken })

Create a premium subscription.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| shortCode | _string, REQUIRED_ | This is the premium short code mapped to your account. |
| keyword | _string, REQUIRED_ | A premium keyword under the above short code and mapped to your account. |
| phoneNumber | _string, REQUIRED_ | The phone number to be subscribed. |
| checkoutToken | _string, REQUIRED_ | This is a token used to validate the subscription request. |

#### Example

```ts
const result = client.createSubscription({
  shortCode: '1234',
  keyword: 'TESTKWD',
  phoneNumber: '+254711111111',
  checkoutToken: '12abvsfdhh63535',
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### deleteSubscription({ shortCode, keyword, phoneNumber })

Deletes a premium subscription.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| shortCode | _string, REQUIRED_ | This is the premium short code mapped to your account. |
| keyword | _string, REQUIRED_ | A premium keyword under the above short code and mapped to your account. |
| phoneNumber | _string, REQUIRED_ | The phone number to be subscribed. |

#### Example

```ts
const result = client.deleteSubscription({
  shortCode: '1234',
  keyword: 'TESTKWD',
  phoneNumber: '+254711111111',
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### fetchSubscription({ shortCode, keyword, lastReceivedId })

Fetches premium subscriptions.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| shortCode | _string, REQUIRED_ | This is the premium short code mapped to your account. |
| keyword | _string, REQUIRED_ | A premium keyword under the above short code and mapped to your account. |
| lastReceivedId | _number_ | ID of the subscription you believe to be your last. Set it to `0` to for the first time. |

#### Example

```ts
const result = client.fetchSubscription({
  shortCode: '1234',
  keyword: 'TESTKWD',
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

For more information, please read:

- SMS service: [http://docs.africastalking.com/sms](http://docs.africastalking.com/sms)
- How to fetch subscriptions: [http://docs.africastalking.com/subscriptions/fetchsubscriptions](http://docs.africastalking.com/subscriptions/fetchsubscriptions)
- How to listen for subscription notifications: [http://docs.africastalking.com/subscriptions/callback](http://docs.africastalking.com/subscriptions/callback)

## e) Token Operations

- ### createCheckoutToken(phoneNumber)

Create a new checkout token.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| shortCode | _string, REQUIRED_ | The phone number you want to create a subscription for. |

#### Example

```ts
const result = client.createCheckoutToken('+254711111111')
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### generateAuthToken()

Generate an auth token to use for authentication instead of an API key.

#### Example

```ts
const result = client.generateAuthToken()
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

## f) Voice Operations

- ### getNumQueuedCalls({ phoneNumbers })

Get queued calls.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| phoneNumbers | _string, REQUIRED_ | Your Africa's Talking issued virtual phone number. |

#### Example

```ts
const result = client.getNumQueuedCalls({
  phoneNumbers: '254711111111'
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### makeCall({ callFrom, callTo, clientRequestId })

Initiate a phone call.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| callFrom | _string, REQUIRED_ | Your Africa's Talking issued virtual phone number. |
| callTo | _string, REQUIRED_ | Phone number to dial. |
| clientRequestId | _string_ | Variable sent to your Events Callback URL that can be used to tag the call. |

#### Example

```ts
const result = client.makeCall({
  callFrom: '+254711111111',
  callTo: ['+254711111111', '+254722222222'],
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

- ### uploadMediaFile({ url })

Upload voice media file.

| Param     | Type | Description |
| :------- | :------------ | :------------ |
| url | _string, REQUIRED_ | The url of the file to upload. Don’t forget to start with `http://`. |

#### Example

```ts
const result = client.uploadMediaFile({
  url: 'http://google.com',
})
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
```

For more information, please read [http://docs.africastalking.com/voice](http://docs.africastalking.com/voice).

## What else can I import from the package, apart from `Client`?

You can import the following functions, classes and Typescript types from the package:

- Client
- expressHandler
- ActionBuilder
- Server
- CONSTANTS
- Types for Typescript e.g. `SmsResponse`, `SendAirtimeResponse`, etc;

```ts
import { Client, expressHandler, ActionBuilder, Server, CONSTANTS, SmsResponse, SendAirtimeResponse } from 'africastalking';

// or
const { Client, expressHandler, ActionBuilder, Server, CONSTANTS, SmsResponse, SendAirtimeResponse } = require('africastalking').
```
