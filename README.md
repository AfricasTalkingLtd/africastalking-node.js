# africastalking-node.js
Official AfricasTalking node.js API wrapper

### Install

```bash
$ npm install --save africastalking
```

### Initialization

```javascript
var options = {
    sandbox: true,                  // true/false to use/not sandbox
    apiKey: 'YOUR_API_KEY',         // Use sandbox username and API key if you're using the sandbox
    username: 'YOUR_USERNAME',      //
    format: 'json'                  // or xml
};
var AfricasTalking = require('africastalking')(options);
// ...

```

`Important`: If you register a callback URL with the API, always remember to acknowledge the receipt of any data it sends by responding with an HTTP `200`; e.g. `res.status(200);` for express.

### SMS

```javascript
var sms = AfricasTalking.SMS;
// all methods return a promise
sms.send(opts)
    .then(success)
    .catch(error);
```

#### [Sending SMS](http://docs.africastalking.com/sms/sending)

- `send(options)`: Send a message. `options` contains:

    - `to`: A single recipient or an array of recipients. `REQUIRED`
    - `from`: Shortcode or alphanumeric ID that is registered with Africa's Talking account.
    - `message`: SMS content. `REQUIRED`

- `sendBulk(options)`: Send bulk SMS. In addition to paramaters of `send()`, we would have: 

    - `enqueue`: "[...] would like deliver as many messages to the API before waiting for an Ack from the Telcos."
    
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
    var endSession = false;
    var message = '';
    
    var session = sessions.get(params.sessionId);
    var user = db.getUserByPhone(params.phoneNumber);

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

## Voice

```javascript
var voice = AfricasTalking.VOICE;
```
- Helpers that will construct proper `xml` to send back to Africa's Taking API when it comes `POST`ing. [Read more](http://docs.africastalking.com/voice)
    - `Say`, `Play`, `GetDigits`, `Dial`, `Record`, `Enqueue`, `Dequeue`, `Conference`, `Redirect`, `Reject`
- Initiate a call
- Fetch call queue
- ~~Media upload~~ - any url to ```Play``` will be cached by default.
- Remember to send back an HTTP 200.


#### [Initiate a call](http://docs.africastalking.com/voice/call)
```node
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

```node
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

#### [Handle call](http://docs.africastalking.com/voice/callhandler)

check issue [#15](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues/15)


### Airtime

```javascript
var airtime = AfricasTalking.AIRTIME;
```
- `airtime.send(options)`: Send airtime

    - `recipients`: An array of the following
        - `phoneNumber`: Recipient of airtime
        - `amount`: Amount sent. `>= 10 && <= 10K`


```javascript
   airtime.send(options)
    .then(success)
    .catch(error);
```      

### Account
```javascript
AfricasTalking.fetchAccount()
    .then(success)
    .catch(error);
```
- `fetchAccount()`: Fetch account info; i.e. balance


### Payments

> Mobile Consumer To Business (C2B) functionality allows your application to receive payments that are initiated by a mobile subscriber.
> This is typically achieved by disctributing a PayBill or BuyGoods number (and optionally an account number) that clients can use to make payments from their mobile devices.
> [Read more](http://docs.africastalking.com/payments/mobile-c2b)

```javascript
var payments = AfricasTalking.PAYMENTS;

// Request payment from customer A.K.A checkout
payments.checkout(opts)
        .then(success)
        .catch(error);

// Wait for payment notifications from customer(s) on your registred callback URL



// Send payment to customer(s) A.K.A B2C
payments.pay(opts)
        .then(success)
        .catch(error);


```

- `checkout(options)`: Initiate Customer to Business (C2B) payments on a mobile subscriber's device. [More info](http://docs.africastalking.com/payments/mobile-checkout)

    - `productName`: Your Payment Product. `REQUIRED`

    - `phoneNumber`: The customer phone number (in international format; e.g. `25471xxxxxxx`). `REQUIRED`

    - `currencyCode`: 3-digit ISO format currency code (e.g `KES`, `USD`, `UGX` etc.) `REQUIRED`

    - `amount`: This is the amount. `REQUIRED`

    - `metadata`: Some optional data to associate with transaction.

- `pay(options)`:  Initiate payments to mobile subscribers from your payment wallet. [More info](http://docs.africastalking.com/payments/mobile-b2c)

    - `productName`: Your Payment Product. `REQUIRED`

    - `recipients`: A list of **up to 10** recipients. Each recipient has:

        - `phoneNumber`: The payee phone number (in international format; e.g. `25471xxxxxxx`). `REQUIRED`

        - `currencyCode`: 3-digit ISO format currency code (e.g `KES`, `USD`, `UGX` etc.) `REQUIRED`

        - `amount`: Payment amount. `REQUIRED`

        - `reason`: This field contains a string showing the purpose for the payment. If set, it should be one of the following
        ```
            payments.REASON.SALARY
            payments.REASON.SALARY_WITH_CHARGE
            payments.REASON.BUSINESS
            payments.REASON.BUSINESS_WITH_CHARGE
            payments.REASON.PROMOTION
        ```

        - `metadata`: Some optional data to associate with transaction.