# Africa's Talking Node.js SDK

[![NPM](https://nodei.co/npm/africastalking.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/africastalking)

> The wrapper provides convenient access to the Africa's Talking API from applications written for Node.js.

## Documentation

Take a look at the [API docs here](https://developers.africastalking.com).


## Install

You can install the package from [npm](https://npmjs.com/package/africastalking) by running: 

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
const AfricasTalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = AfricasTalking.SMS

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

- [SMS Service](#sms) : `AfricasTalking.SMS`

- [Airtime Service](#airtime) : `AfricasTalking.AIRTIME`

- [Mobile Data Service](#mobiledata) : `AfricasTalking.MOBILE_DATA`

- [Voice Service](#voice) : `AfricasTalking.VOICE`

- [USSD](#ussd) : USSD API

- [Token Service](#token) : `AfricasTalking.TOKEN`

- [Insights](#insights) : `AfricasTalking.INSIGHTS`

- [Application Service](#application) : `AfricasTalking.APPLICATION`


## Services

All methods are asynchronous

All phone numbers use the international format. e.g. `+234xxxxxxxx`.


### `SMS`

- `send({ to, senderId, message, enqueue })`: Send an SMS to one or more phone numbers

- `send([{ to, senderId, message, enqueue }])`: Send multiple SMSes to one or more phone numbers
 
  - `to`: Recipient(s) phone number. Can either a single phone number or an array of phone numbers `REQUIRED`
  - `senderId`: Shortcode or alphanumeric ID that is registered with Africa's Talking account
  - `message`: SMS content. `REQUIRED`
  - `enqueue`: Set to true if you would like to deliver as many messages to the API without waiting for an acknowledgement from telcos.

- `sendPremium({ to, from, message, enqueue, keyword, linkId, retryDurationInHours })`: Send premium SMS

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
- SMS service: [https://developers.africastalking.com/docs/sms/overview](https://developers.africastalking.com/docs/sms/overview)
- How to fetch subscriptions: [https://developers.africastalking.com/docs/sms/premium_subscriptions/fetch](https://developers.africastalking.com/docs/sms/premium_subscriptions/fetch)
- How to listen for subscription notifications: [https://developers.africastalking.com/docs/sms/notifications](https://developers.africastalking.com/docs/sms/notifications)


### `Airtime`

  - `send({ recipients })`: Send airtime to a bunch of phone numbers. 

    - `recipients`: An array of objects containing the following keys:
      - `phoneNumber`: Recipient of airtime. `REQUIRED`.
      - `currencyCode`: 3-digit ISO format currency code. `REQUIRED`.
      - `amount`: Amount to charge. `REQUIRED`.

    - `maxNumRetry`: This allows you to specify the maximum number of retries in case of failed airtime deliveries due to various reasons such as telco unavailability. The default retry period is 8 hours and retries occur every 60seconds. For example, setting `maxNumRetry=4` means the transaction will be retried every 60seconds for the next 4 hours.`OPTIONAL`.

  - `findTransactionStatus(transactionId)`: Find the status of a given airtime transaction.

    - `transactionId`: ID of the transaction you would like to find.


  For more information, please read [https://developers.africastalking.com/docs/airtime/sending](https://developers.africastalking.com/docs/airtime/sending)


### `MobileData`

- `send({ productName, recipients })`

    - `productName`: This is the application's product name.
    - `recipients`: An array of objects containing the following keys:
      - `phoneNumber`: Recipient of the mobile data. `REQUIRED`.
      - `quantity`: a numeric value for the amount of mobile data. It is based on the available mobile data package[(see "Bundle Package" column of mobile data pricing)](https://africastalking.com/pricing). `REQUIRED`.
      - `unit`: The units for the specified data quantity, the format is: ``MB`` or ``GB``. It is based on the available mobile data package[(see "Bundle Package" column of mobile data pricing)](https://africastalking.com/pricing). `REQUIRED`.
      - `validity`: The period of the data bundle’s validity this can be `Day`, `Week`, `BiWeek`, `Month`, or `Quarterly`. It is based on the available mobile data package [(see "Validity" column of mobile data pricing)](https://africastalking.com/pricing). `REQUIRED`.
      - `metadata`:  A JSON object of any metadata that you would like us to associate with the request. `OPTIONAL`.


- `findTransaction({ transactionId })`:  Find a mobile data transaction

- `fetchWalletBalance()`: Fetch a mobile data product balance

For more information, please read the [https://developers.africastalking.com/docs/data/overview](https://developers.africastalking.com/docs/data/overview)


### `Voice`

- `call({ callFrom, callTo })`: Initiate a phone call

    - `callFrom`: Your Africa's Talking issued virtual phone number. `REQUIRED`
    - `callTo`: Comma-separated string of phone numbers to call. `REQUIRED`
    - `clientRequestId`: Additional information that can be used to tag the call in your callback URL.


- `fetchQuedCalls({ phoneNumber })`: Get queued calls

    - `phoneNumber`: Your Africa's Talking issued virtual phone number. `REQUIRED`


- `uploadMediaFile({ phoneNumber, url })`: Upload voice media file

    - `phoneNumber`: Your Africa's Talking issued virtual phone number. `REQUIRED`
    - `url`: URL to your media file. `REQUIRED`


> Helpers that will construct proper `xml` to send back to Africa's Taking API when it comes `POST`ing.
- `Say`, `Play`, `GetDigits`, `Dial`, `Record`, `Enqueue`, `Dequeue`, `Conference`, `Redirect`, `Reject`
> Remember to send back an HTTP 200.

For more information, please read [https://developers.africastalking.com/docs/voice/overview](https://developers.africastalking.com/docs/voice/overview) and [issue #15](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues/15)

### `USSD`

For more information, please read [https://developers.africastalking.com/docs/ussd/overview](https://developers.africastalking.com/docs/ussd/overview)


### `Token`

- `generateAuthToken()`: Generate an auth token to use for authentication instead of an API key.

### `Insights`

- `checkSimSwapState([phoneNumbers])`: Check the sim swap state of a given [set of ] phone number(s).


### `Application`

- `fetchApplicationData()`: Get app information. e.g. balance

For more information, please read [https://developers.africastalking.com/docs/application](https://developers.africastalking.com/docs/application)


## Development

Run all tests:

```bash
$ npm install
$ # add credentials AT_APP_API_KEY, AT_APP_USERNAME and TEST_PHONENUMBER to .env
$ npm test
```

or on Windows...

```bash
$ npm install
$ # add credentials AT_APP_API_KEY, AT_APP_USERNAME and TEST_PHONENUMBER to .env
$ npm run test-windows
```


## Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues).
