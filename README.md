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

- [WhatsApp](#whatsapp) : `AfricasTalking.WHATSAPP`

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
      - `metadata`:  A JSON object of any metadata that you would like us to associate with the request. `REQUIRED`.


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

### `WhatsApp`

- `sendMessage({ body, waNumber, phoneNumber })`: Send a WhatsApp message to a given number.

    - `waNumber`: The number being used to send the message that is associated with the account. `REQUIRED`
    - `phoneNumber`: The number that is to receive the message. `REQUIRED`
    - `body`: The body of message to be sent. It is an object with one of the following fields:

      - For simple text message:
        - `message`: The text message to be sent to the client.
      
      - For media messages:
        - `mediaType`: The type of media being sent. Can be one of `Image`, `Video`, `Audio` or `Voice`.
        - `url`: The hosted URL of the media being sent. 
        - `caption`: The caption associated with the media being sent.

      - For interactive list:
        - `action`: An object with a list of actions.
          - `button`: Action button title
          - `section`: A list of sections
            - `title`: A section title
            - `rows`: An array of section rows. Each row is an object `{ id, title, description }`
            - `product_items`: A list of product items. Each item is an object `{ key: value(String) }`
        - `body`:
          - `text`: Body text
        - `header`:
          - `text`: Header text
        - `footer`:
          - `text`: Footer text

      - For interactive buttons:
        - `action`: An object with a list of actions.
          - `buttons`: An array of buttons. Each is an object `{ id, title }`
        - `body`:
          - `text`: Body text
        - `header`:
          - `text`: Header text

      - For template messages:
        - `templateId`: Id of template to use
        - `headerValue`: Value of the header text
        - `bodyValues`: List of values to fill in the template

- `createTemplate({ component, waNumber, name, language, category })`: Create a template for your future messages.

    - `waNumber`: The WhatsApp phone number that will be used to send the messages associated with the template. `REQUIRED`
    - `name`: The name of the template. This must be unique. `REQUIRED`
    - `language`: The language code([ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1)) associated with the template. `REQUIRED`
    - `category`: The category associated with the template. Must be one of `MARKETING`, `UTILITY` and `AUTHENTICATION`.
    - `components`:  An object containing the template values. It can contain the following:
      - `header`: The header of the template to be sent.
        - `type`: always `HEADER`
        - `format`: One of `LOCATION`, `TEXT`, `DOCUMENT`, `IMAGE` and `VIDEO`
        - `text`: The text to be contained in the header. Can be used with variables, e.g 'Hello {{1}}' where `{{1}}` will be replaced by a value sent.
        - `example`:
          - `header_handle`: Text used for replacement when header is of type media(i.e. anything but `TEXT`)
          - `header_text`: Text used for replacement when header type is `TEXT`

      - `body`: The type of message being sent in the body of the template.
        - `type`: always `BODY`
        - `text`: The text to be contained in the body. Can be used with variables, e.g 'Hello {{1}} there {{2}}' where `{{1}}` and `{{2}}` will be replaced by values sent.
        - `example`:
          - `body_text`: A list of texts to use for replacement. e.g. `['Juma', 'Champ']`

      - `footer`: The footer of the template to be sent.
        - `type`: always `FOOTER`
        - `text`: The footer text.

      - `buttons`:
        - `type`: always `BUTTONS`
        - `buttons`: A list of buttons to be sent in the template. Each can have the following, depending on the type
          - `type`: One of `PHONE_NUMBER`, `URL`, `FLOW`, `COPY_CODE` and `QUICK_REPLY`
          - `phone_number`: Only needed for phone number type
          - `url`: Only needed for url type
          - `text`: Button text
          - `example`: An example string(Or list of string for type `URL`)
          - `flow_id`, `flow_action`(navigate or data_exchange) and `navigate_screen` are only needed for type `FLOW`

### `Application`

- `fetchApplicationData()`: Get app information. e.g. balance

For more information, please read [https://developers.africastalking.com/docs/application](https://developers.africastalking.com/docs/application)


## Development

Run all tests:

```bash
$ pnpm install
$ pnpm test
```


## Issues & Contribution

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues).

If you want to help improve this library, just send send us a PR!
