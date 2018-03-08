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

The package needs to be configured with your app username and API key, which you can get from the [dashboard](https://account/africastalking.com).

> You can use this SDK for either production or sandbox apps. For sandbox, the app username is **ALWAYS** `sandbox`

```javascript
const options = {
    apiKey: 'YOUR_API_KEY',         // use your sandbox app API key for development in the test environment
    username: 'YOUR_USERNAME',      // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(options);
//...
```

See [example](example/) for more usage examples.

### SMS

```javascript
const sms = AfricasTalking.SMS;
// all methods return a promise
sms.send(opts)
    .then(success)
    .catch(error);
```

#### [Sending SMS](http://docs.africastalking.com/sms/sending)

- `send(options)`: Send a message. `options` contains:

    - `message`: SMS content. `REQUIRED`
    - `to`: A single recipient or an array of recipients. `REQUIRED`
    - `from`: Shortcode or alphanumeric ID that is registered with Africa's Talking account.

    - `enqueue`: Set to `true` if you would like to deliver as many messages to the API without waiting for an acknowledgement from telcos.

- `sendPremium(options)`: Send premium SMS. In addition to paramaters of `send()`, we would have:

    - `keyword`: Value is a premium keyword `REQUIRED`
    - `linkId`: "[...] We forward the `linkId` to your application when the user send a message to your service" `REQUIRED`
    - `retryDurationInHours`: "It specifies the number of hours your subscription message should be retried in case it's not delivered to the subscriber"

#### [Retrieving SMS](http://docs.africastalking.com/sms/fetchmessages)

> You can register a callback URL with us and we will forward any messages that are sent to your account the moment they arrive. 
> [Read more](http://docs.africastalking.com/sms/callback)

- `fetchMessages(options)`: Manually retrieve your messages.

    - `lastReceivedId`: "This is the id of the message that you last processed". Defaults to `0`. `REQUIRED`


#### [Premium Subscriptions](http://docs.africastalking.com/subscriptions/fetchsubscriptions)

> If you have subscription products on your premium SMS short codes, you will need to configure a callback URL that we will invoke to notify you when users subscribe or unsubscribe from your products.
> [Read more](http://docs.africastalking.com/subscriptions/callback)

- `createSubscription(options)`:

    - `shortCode`: "This is a premium short code mapped to your account". `REQUIRED`
    - `keyword`: "Value is a premium keyword under the above short code and mapped to your account". `REQUIRED`
    - `phoneNumber`: "The phoneNumber to be subscribed" `REQUIRED`
    - `checkoutToken`: "This is a token used to validate the subscription request" `REQUIRED`

- `fetchSubscription(options)`:

    - `shortCode`: "This is a premium short code mapped to your account". `REQUIRED`
    - `keyword`: "Value is a premium keyword under the above short code and mapped to your account". `REQUIRED`
    - `lastReceivedId`: "ID of the subscription you believe to be your last." Defaults to `0`



### [USSD](http://docs.africastalking.com/ussd)

> Processing USSD requests using our API is very easy once your account is set up. In particular, you will need to:
> - Register a service code with us.
> - Register a URL that we can call whenever we get a request from a client coming into our system.
>
> Once you register your callback URL, any requests that we receive belonging to you will trigger a callback that sends the request data to that page using HTTP POST.
> [Read more.](http://docs.africastalking.com/ussd)

If you are using connect-like frameworks (*express*), you could use the middleware `AfricasTalking.USSD(handler)`:

`handler(params, next)`: Process USSD request and call `next()` when done.

- `params`: contains the following user data sent by Africa's Talking servers: `sessionId`, `serviceCode`, `phoneNumber` and `text`.
- `next(args)`: `args` must contain the following:
    - `response`: Text to display on user's device. `REQUIRED`
    - `endSession`: Boolean to decide whether to **END** session or to **CON**tinue it. `REQUIRED`

```javascript

// example (express)

app.post('/natoil-ussd', new AfricasTalking.USSD((params, next) => {
    let endSession = false;
    let message = '';
    
    const session = sessions.get(params.sessionId);
    const user = db.getUserByPhone(params.phoneNumber);

    if (params.text === '') {
        message = "Welcome to Nat Oil \n";
        message += "1: For account info \n";
        message += "2: For lost gas cylinder";

    } else if (params.text === '1') {
        message = user.getInfo();
        endSession = true;

    } else if (params.text === '2') {
        message = "Enter 1 for recovery \n";
        message += "Enter 2 for lost and found";
        endSession = true;

    } else {
        message = "Invalid option";
        endSession = true;
    }

    next({
        response: message, 
        endSession: endSession
    });
}));
```

### Voice

```javascript
const voice = AfricasTalking.VOICE;
```
- Helpers that will construct proper `xml` to send back to Africa's Taking API when it comes `POST`ing. [Read more](http://docs.africastalking.com/voice)
    - `Say`, `Play`, `GetDigits`, `Dial`, `Record`, `Enqueue`, `Dequeue`, `Conference`, `Redirect`, `Reject`
- Initiate a call
- Fetch call queue
- Upload Media File
- Remember to send back an HTTP 200.


#### [Initiate a call](http://docs.africastalking.com/voice/call)
```javascript
voice.call({
  callFrom: '+2547XXXXXXXX', // AT virtual number
  callTo: from_ 
})
.then(function(s) {
  // persist call Info
  console.log(s);
})
.catch(function(error) {
  console.log(error);
});
```

#### [Fetch call queue](http://docs.africastalking.com/voice/callqueue)

```javascript
voice.getNumQueuedCalls({ 
  phoneNumbers: destinationNumber 
})
.then(function(s) {
  // call queue
  console.log(s);
})
.catch(function(error) {
  console.log(error);
});
```

#### [Upload Media](http://docs.africastalking.com/voice/uploadmedia)

```js
voice.uploadMediaFile({ 
  phoneNumber: destinationNumber, // your Africa's Talking virtual number
  url: 'http://myOnlineMediaFile.mp3'
})
.then(function(s) {
  // upload result
  console.log(s);
})
.catch(function(error) {
  console.log(error);
});
```



#### [Handle call](http://docs.africastalking.com/voice/callhandler)

check issue [#15](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues/15)


### [Airtime](http://docs.africastalking.com/airtime/sending)

```javascript
const airtime = AfricasTalking.AIRTIME;
```
- `airtime.send(options)`: Send airtime `options` is an object which contains the key:
    - `recipients`: Contains an array of objects containing the following keys
        - `phoneNumber`: Recipient of airtime
        - `amount`: Amount sent `>= 10 && <= 10K` with currency e.g `KES 100`


```javascript
airtime.send(options)
    .then(success)
    .catch(error);
```

### Token
```javascript
const token = AfricasTalking.TOKEN;
```

- `createCheckoutToken(phoneNumber)`: Create a checkout token. Accepts the `phoneNumber` to create a token for.

```javascript
token.createCheckoutToken(phoneNumber)
    .then(success)
    .catch(error);
```

- `generateAuthToken()`: Generate an auth token to us for authentication instead of the API key.

```javascript
token.generateAuthToken()
    .then(success)
    .catch(error);
```

### [Account](http://docs.africastalking.com/userdata/balance)
```javascript
const account = AfricasTalking.ACCOUNT;
```

- `fetchAccount()`: Fetch account info; i.e. balance

```javascript
account.fetchAccount()
    .then(success)
    .catch(error);
```


### Payments

> Mobile Consumer To Business (C2B) functionality allows your application to receive payments that are initiated by a mobile subscriber.
> This is typically achieved by disctributing a PayBill or BuyGoods number (and optionally an account number) that clients can use to make payments from their mobile devices.
> [Read more](http://docs.africastalking.com/payments/mobile-c2b)

```javascript
const payments = AfricasTalking.PAYMENTS;
```

#### [mobileCheckout](http://docs.africastalking.com/payments/mobile-checkout)

```js
// Request payment from customer on mobile money
payments.mobileCheckout(opts)
        .then(success)
        .catch(error);

// Wait for payment notifications from customer(s) on your registered callback URL
```

- `mobileCheckout(options)`: Initiate Customer to Business (C2B) payments on a mobile subscriber's device. [More info](http://docs.africastalking.com/payments/mobile-checkout)

    - `productName`: Your Payment Product. `REQUIRED`

    - `phoneNumber`: The customer phone number (in international format; e.g. `25471xxxxxxx`). `REQUIRED`

    - `currencyCode`: 3-digit ISO format currency code (e.g `KES`, `USD`, `UGX` etc.) `REQUIRED`

    - `amount`: This is the amount. `REQUIRED`

    - `metadata`: Some optional data to associate with transaction.


#### [B2C](http://docs.africastalking.com/payments/mobile-b2c)


```js
// Send payment to customer
payments.mobileB2C(opts)
        .then(success)
        .catch(error);

// Wait for payment notifications on your registered callback URL
```

- `mobileB2C(options)`:  Initiate payments to mobile subscribers from your payment wallet. [More info](http://docs.africastalking.com/payments/mobile-b2c)

    - `productName`: Your Payment Product. `REQUIRED`

    - `recipients`: A list of **up to 10** recipients. Each recipient has:

        - `phoneNumber`: The payee phone number (in international format; e.g. `25471xxxxxxx`). `REQUIRED`

        - `currencyCode`: 3-digit ISO format currency code (e.g `KES`, `USD`, `UGX` etc.) `REQUIRED`

        - `amount`: Payment amount. `REQUIRED`

        - `reason`: This field contains a string showing the purpose for the payment. If set, it should be one of the following

          - ```
            payments.REASON.SALARY
            payments.REASON.SALARY_WITH_CHARGE
            payments.REASON.BUSINESS
            payments.REASON.BUSINESS_WITH_CHARGE
            payments.REASON.PROMOTION
            ```

        - `metadata`: Some optional data to associate with transaction.


#### [B2B](http://docs.africastalking.com/payments/mobile-b2b)


```js
// Send payment to business(s) like a bank
payments.mobileB2B(opts)
        .then(success)
        .catch(error);

// Wait for payment notifications on your registered callback URL
```

- `mobileB2B(options)`:  Mobile Business To Business (B2B) APIs allow you to initiate payments TO businesses eg banks FROM your payment wallet. [More info](http://docs.africastalking.com/payments/mobile-b2b)

  - `productName`: Your Payment Product as setup on your account. `REQUIRED`

    - `provider`: This contains the payment provider that is facilitating this transaction. Supported providers at the moment are:

    - ```
      payments.PROVIDER.ATHENA
      payments.PROVIDER.MPESA
      ```

  - `transferType`: This contains the payment provider that is facilitating this transaction. Supported providers at the moment are:

    - ```
      payments.TRANSFER_TYPE.BUY_GOODS
      payments.TRANSFER_TYPE.PAYBILL
      payments.TRANSFER_TYPE.DISBURSE_FUNDS
      payments.TRANSFER_TYPE.B2B_TRANSFER
      ```

  - `currencyCode`: 3-digit ISO format currency code (e.g `KES`, `USD`, `UGX` etc.) `REQUIRED`

  - `destinationChannel`: This value contains the name or number of the channel that will receive payment by the provider. `REQUIRED`

  - `destinationAccount`: This value contains the account name used by the business to receive money on the provided destinationChannel. `REQUIRED`

  - `amount`: Payment amount. `REQUIRED`

  - `metadata`: Some optional data to associate with transaction.   


#### [Bank Checkout](http://docs.africastalking.com/bank/checkout)

```javascript
// initiate a bank checkout charge request
payments.bankCheckout(opts)
        .then(success)
        .catch(error);

// Wait for payment notification on your registered callback URL
```

- `bankCheckout(opts)` Initiate a banck checkout charge request. [More info](http://docs.africastalking.com/bank/checkout)
  - `productName`: Payment Product as setup on your account. `REQUIRED`
  - `bankAccount`: Bank account to be charged. `REQUIRED`
    - `accountName`: The name of the bank account.
    - `accountNumber`: The account number `REQUIRED`
    - `bankCode`: A 6-Digit Integer Code for the bank that we allocate. `REQUIRED`
      Bank checkout is supported by the following banks:
      ```
      payments.BANK.FCMB_NG
      payments.BANK.ZENITH_NG
      payments.BANK.ACCESS_NG
      payments.BANK.PROVIDUS_NG
      payments.BANK.STERLING_NG
      ```

  - `currencyCode`: 3-digit ISO format currency code (only `NGN` is supported). `REQUIRED`
  - `amount`: Payment amount. `REQUIRED`
  - `narration`: A short description of the transaction `REQUIRED`
  - `metadata`: Some optional data to associate with transaction.

#### [Validate Bank Checkout](http://docs.africastalking.com/bank/checkout#validationRequestParameters)

```javascript
// initiate a bank OTP validation request
payments.validateBankCheckout(opts)
        .then(success)
        .catch(error);
```

- `validateBankCheckout(opts)` initiate a bank OTP validation request. [More info](http://docs.africastalking.com/bank/checkout#validationRequestParameters)
  - `transactionId`: The transaction that your application wants to validate. `REQUIRED`
  - `otp`: One Time Password that the bank sent to the client. `REQUIRED`

#### [Bank Transfer](http://docs.africastalking.com/bank/transfer)

```javascript
// initiate a bank transfer request
payments.bankTransfer(opts)
        .then(success)
        .catch(error);

// Wait for payment notification on your registered callback URL
```

- `bankTransfer(opts)` initiate a bank transfer request. [More info](http://docs.africastalking.com/bank/transfer#requestParameters)
  - `productName`: Payment Product as setup on your account. `REQUIRED`
  - `recipients`: A list of recipients. Each recipient has:
    - `bankAccount`: Bank account to be charged:
      - `accountName`: The name of the bank account.
      - `accountNumber`: The account number `REQUIRED`
      - `bankCode`: A 6-Digit Integer Code for the bank that we allocate; See `payments.BANK.*` for supported banks. `REQUIRED`
    - `currencyCode`: 3-digit ISO format currency code (only `NGN` is supported). `REQUIRED`
    - `amount`: Payment amount. `REQUIRED`
    - `narration`: A short description of the transaction `REQUIRED`
    - `metadata`: Some optional data to associate with transaction.

#### [Card Checkout](http://docs.africastalking.com/card/checkout)

```javascript
// initiate a card checkout charge request
payments.cardCheckout(opts)
        .then(success)
        .catch(error);

// Wait for payment notification on your registered callback URL
```

- `cardCheckout(opts)` initiate a card checkout charge request. [More info](http://docs.africastalking.com/card/checkout#chargeRequestParameters)
  - `productName`: Payment Product as setup on your account. `REQUIRED`
  - `checkoutToken`: Token that has been generated by our APIs as as result of charging a user's Payment Card in a previous transaction. When using a token, the `paymentCard` data should NOT be populated.
  - `paymentCard`: Payment Card to be charged:
    - `number`: The payment card number. `REQUIRED`
    - `cvvNumber`: The 3 or 4 digit Card Verification Value. `REQUIRED`
    - `expiryMonth`: The expiration month on the card (e.g `8`) `REQUIRED`
    - `authToken`: The card's ATM PIN. `REQUIRED`
    - `countryCode`: The 2-Digit countryCode where the card was issued (only `NG` is supported). `REQUIRED`
  - `currencyCode`: 3-digit ISO format currency code (only `NGN` is supported). `REQUIRED`
  - `amount`: Payment amount. `REQUIRED`
  - `narration`: A short description of the transaction `REQUIRED`
  - `metadata`: Some optional data to associate with transaction.

#### [Validate Card Checkout](http://docs.africastalking.com/card/checkout#validationRequestParameters)

```javascript
// initiate a card OTP validation request
payments.validateCardCheckout(opts)
        .then(success)
        .catch(error);
```

- `validateCardCheckout(opts)` initiate a card OTP validation request. [More info](http://docs.africastalking.com/card/checkout#validationRequestParameters )
  - `transactionId`: The transaction that your application wants to validate. `REQUIRED`
  - `otp`: One Time Password that the card issuer sent to the client. `REQUIRED`

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
