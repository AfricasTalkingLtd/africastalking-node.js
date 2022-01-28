# Africa's Talking Node.js SDK

[![NPM](https://nodei.co/npm/africastalking.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/africastalking)

> The wrapper provides convenient access to the Africa's Talking API from applications written for Node.js.

## Documentation

Take a look at the [API docs here](http://docs.africastalking.com).


## Install

You can install the package from [npm](npmjs.com/package/africastalking) by running: 

```bash
$ npm install --save africastalking
```

## Usage

The package needs to be configured with your app username and API key, which you can get from the [dashboard](https://account.africastalking.com).

> You can use this SDK for either production or sandbox apps. For sandbox, the app username is **ALWAYS** `sandbox`

```javascript
const credentials = {
    apiKey: 'YOUR_API_KEY',         // use your sandbox app API key for development in the test environment
    username: 'YOUR_USERNAME',      // use 'sandbox' for development in the test environment
};
const Africastalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = Africastalking.SMS

// Use the service
const options = {
    to: ['+254711XXXYYY', '+254733YYYZZZ'],
    message: "I'm a lumberjack and its ok, I work all night and sleep all day"
}

// Send message and capture the response or error
sms.send(options)
    .then( response => {
        console.log(response);
    })
    .catch( error => {
        console.log(error);
    });
```

See [example](example/) for more usage examples.

## Initialization

Initialize the SDK as a requirement by doing `require('africastalking')(options)`. After initialization, you can get instances of offered services as follows:

- [Application Service](#applicationservice) : `AfricasTalking.APPLICATION`

- [Airtime Service](#airtimeservice) : `AfricasTalking.AIRTIME`

- [SMS Service](#smsservice) : `AfricasTalking.SMS`

- [Payments Service](#paymentservice) : `AfricasTalking.PAYMENTS`

- [Voice Service](#voiceservice) : `AfricasTalking.VOICE`

- [Token Service](#tokenservice) : `AfricasTalking.TOKEN`

- [USSD](#ussd) : USSD API

## Services

All methods are asynchronous

All phone numbers use the international format. e.g. `+234xxxxxxxx`.



### `ApplicationService`

- `fetchApplicationData()`: Get app information. e.g. balance

For more information, please read [http://docs.africastalking.com/userdata/balance](http://docs.africastalking.com/userdata/balance)



### `AirtimeService`

- `airtime.send({ recipients })`: Send airtime to a bunch of phone numbers. `recipients`: An array of objects containing the following keys:
  - `phoneNumber`: Recipient of airtime. `REQUIRED`
  - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`

For more information, please read [http://docs.africastalking.com/airtime/sending](http://docs.africastalking.com/airtime/sending)



### `SmsService`

- `send({ to, from, message, enqueue })`: Send a message

  - `to`: Recipients phone number. `REQUIRED`
  - `from`: Shortcode or alphanumeric ID that is registered with Africa's Talking account
  - `message`: SMS content. `REQUIRED`
  - `enqueue`: Set to true if you would like to deliver as many messages to the API without waiting for an acknowledgement from telcos.


- `sendPremium({ to, from, message, enqueue, keyword, linkId, retryDurationInHours })`: Send premium SMS

  - `send()` parameters plus:
  - `keyword`: You premium product keyword
  - `linkId`: We forward the `linkId` to your application when the user send a message to your service
  - `retryDurationInHours`: It specifies the number of hours your subscription message should be retried in case it's not delivered to the subscriber


- `fetchMessages({ lastReceivedId })`: Manually retrieve your messages

  - `lastReceivedId`: "This is the id of the message that you last processed". Defaults to `0`


- `fetchSubscription({ shortCode, keyword, lastReceivedId })`: Fetch your premium subscription data

  - `shortCode`: This is the premium short code mapped to your account. `REQUIRED`
  - `keyword`: A premium keyword under the above short code and mapped to your account. `REQUIRED`
  - `lastReceivedId`: "This is the id of the message that you last processed". Defaults to `0`


- `createSubscription({ shortCode, keyword, phoneNumber })`: Create a premium subscription

  - `shortCode`: This is the premium short code mapped to your account. `REQUIRED`
  - `keyword`: A premium keyword under the above short code and mapped to your account. `REQUIRED`
  - `phoneNumber`:  The phone number to be subscribed. `REQUIRED`


For more information on:
- SMS service: [http://docs.africastalking.com/sms](http://docs.africastalking.com/sms)
- How to fetch subscriptions: [http://docs.africastalking.com/subscriptions/fetchsubscriptions](http://docs.africastalking.com/subscriptions/fetchsubscriptions)
- How to listen for subscription notifications: [http://docs.africastalking.com/subscriptions/callback](http://docs.africastalking.com/subscriptions/callback)



### `PaymentService`

- `cardCheckoutCharge({ productName, paymentCard/checkoutToken, currencyCode, amount, narration, metadata })` Initiate a card checkout.

  - `productName`: Your payment product. `REQUIRED`
  - `paymentCard`: Card to charge.
  - `checkoutToken`: Token from a previous successful transaction. Replaces `paymentCard`.
  - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `narration`: Checkout description. `REQUIRED`
  - `metadata`: Additional info to go with the checkout


- `cardCheckoutValidate({ transactionId, otp })` Validate a card checkout.

  - `transactionId`: Transaction ID returned on charge request. `REQUIRED`
  - `otp`: A user-provided OTP. `REQUIRED`


- `bankCheckoutCharge({ productName, bankAccount, currencyCode, amount, narration, metadata })` Initiate a bank checkout.

  - `productName`: Your payment product. `REQUIRED`
  - `bankAccount`: Bank account to charge. `REQUIRED`
  - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `narration`: Checkout description. `REQUIRED`
  - `metadata`: Additional info to go with the checkout


- `bankCheckoutValidate({ transactionId, otp })` Validate a bank checkout.

  - `transactionId`: Transaction ID returned on charge request. `REQUIRED`
  - `otp`: A user-provided OTP. `REQUIRED`


- `bankTransfer({ productName, recipients })` Initiate a bank transfer.

  - `productName`: Your payment product. `REQUIRED`
  - `recipients`: A list of banks to transfer to. `REQUIRED`


- `mobileCheckout({ productName, providerChannel, phoneNumber, currencyCode, amount, metadata })`: Initiate mobile checkout.

  - `productName`: Your payment product. `REQUIRED`
  - `providerChannel`: Provider channel to consider when charging.
  - `phoneNumber`: Mobile wallet to charge. `REQUIRED`
  - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to charge. `REQUIRED`
  - `metadata`: Additional info to go with the checkout


- `mobileB2C({ productName, recipients })`:  Send mobile money to consumer.

  - `productName`: Your payment product. `REQUIRED`
  - `recipients`: A list of consumers that will receive the money. `REQUIRED`


- `mobileB2B({ productName, provider, transferType, currencyCode, destinationChannel, destinationAccount, amount, requester, metadata })`:   Send mobile money to busness.

  - `productName`: Your payment product. `REQUIRED`
  - `provider`: Provider used to process request. Checkout  `payments.PROVIDER.*`. `REQUIRED`
  - `transferType`: Checkout  `payments.TRANSFER_TYPE.*`. `REQUIRED`
  - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`
  - `destinationChannel`: Name or number of channel to receive payment. `REQUIRED`
  - `destinationAccount`: Account name used to receive money. `REQUIRED`
  - `amount`: Amount to transfer. `REQUIRED`
  - `requester`: PhoneNumber through which KPLC will send tokens when using B2B to buy electricity tokens.
  - `metadata`: Additional info to go with the transfer

- `mobileData(productName, recipients)`: Send mobile data to customers.

    - `productName`: Payment product on Africa's Talking. `REQUIRED`
    - `recipients`:  A list of recipients. Each recipient has:
      - `phoneNumber`: Customer phone number (in international format). `REQUIRED`
      - `quantity`: Mobile data amount. `REQUIRED`
      - `unit`: Mobile data unit. Can either be `MB` or `GB`. `REQUIRED`
      - `validity`: How long the mobile data is valid for. Must be one of `Day`, `Week` and `Month`. `REQUIRED`
      - `metadata`: Additional data to associate with the transaction. `REQUIRED`


- `walletTransfer({ productName, targetProductCode, currencyCode, amount, metadata })` Move money form one payment product to another.

  - `productName`: Your payment product. `REQUIRED`
  - `targetProductCode`: ID of recipient payment product on Africa's Talking. `REQUIRED`
  - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to transfer. `REQUIRED`
  - `metadata`: Additional info to go with the transfer. `REQUIRED`


- `topupStash({ productName, currencyCode, amount, metadata })` Move money from a Payment Product to an app's stash.

  - `productName`: Your payment product. `REQUIRED`
  - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`
  - `amount`: Amount to transfer. `REQUIRED`
  - `metadata`: Additional info to go with the transfer. `REQUIRED`


- `fetchProductTransactions({ productName, filters })`: Fetch payment product transactions.

  - `productName`: Your payment product. `REQUIRED`
  - `filters`: Query filters. Includes:

    - `pageNumber`: Page number to fetch results from. Starts from `1`. `REQUIRED`
    - `count`:  Number of results to fetch. `REQUIRED`
    - `startDate`: Start Date to consider when fetching.
    - `endDate`: End Date to consider when fetching.
    - `category`: Category to consider when fetching.
    - `prodiver`: Provider to consider when fetching.
    - `status`: Status to consider when fetching.
    - `source`: Source to consider when fetching.
    - `destination`: Destination to consider when fetching.
    - `providerChannel`: Provider channel to consider when fetching.


- `findTransaction({ transactionId })`: Find a particular transaction.

  - `transactionId`: Transaction ID returned on charge request. `REQUIRED`


- `fetchWalletTransactions({ filters })`: Fetch wallet transactions.

  - `filters`: Query filters. Includes:
    - `pageNumber`: Page number to fetch results from. Starts from `1`. `REQUIRED`
    - `count`: Number of results to fetch. `REQUIRED`
    - `startDate`: Start Date to consider when fetching.
    - `endDate`: End Date to consider when fetching.
    - `categories`: Comma delimited list of categories to consider when fetching.


- `fetchWalletBalance()`: Fetch your wallet's balance

For more information, please read [http://docs.africastalking.com/payments](http://docs.africastalking.com/payments)


### `VoiceService`

- `voice.call({ callFrom, callTo })`: Initiate a phone call

    - `callFrom`: Your Africa's Talking issued virtual phone number. `REQUIRED`
    - `callTo`: Comma-separated string of phone numbers to call. `REQUIRED`
    - `clientRequestId`: Additional information that can be used to tag the call in your callback URL.


- `voice.fetchQuedCalls({ phoneNumber })`: Get queued calls

    - `phoneNumber`: Your Africa's Talking issued virtual phone number. `REQUIRED`


- `voice.uploadMediaFile({ phoneNumber, url })`: Upload voice media file

    - `phoneNumber`: Your Africa's Talking issued virtual phone number. `REQUIRED`
    - `url`: URL to your media file. `REQUIRED`


> Helpers that will construct proper `xml` to send back to Africa's Taking API when it comes `POST`ing.
- `Say`, `Play`, `GetDigits`, `Dial`, `Record`, `Enqueue`, `Dequeue`, `Conference`, `Redirect`, `Reject`
> Remember to send back an HTTP 200.

For more information, please read [http://docs.africastalking.com/voice](http://docs.africastalking.com/voice) and [issue #15](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues/15)



### `TokenService`

- `generateAuthToken()`: Generate an auth token to use for authentication instead of an API key.


### `USSD`

For more information, please read [http://docs.africastalking.com/ussd](http://docs.africastalking.com/ussd)



## Development

Run all tests:

```bash
$ npm install
$ npm test
```

or on Windows...

```bash
$ npm install
$ npm run test-windows
```


## Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues).
