# africastalking-node.js
Official AfricasTalking node.js API wrapper

### Install

```bash
$ npm install --save africastalking
```

### Initialization

```javascript
var options = {
    apiKey: 'YOUR_API_KEY',
    username: 'YOUR_USERNAME',
    format: 'json' // or xml
};
var AfricasTalking = require('africastalking')(options);
// ...

```

**`Important`: If you register a callback URL with the API, always remember to acknowledge the receipt of any data it sends by responding with an HTTP `200`; e.g. `res.status(200);` for express**. 

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

#### [Handle call](http://docs.africastalking.com/voice/callhandler) **TODO Build helpers

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


### Mobile Money - checkOut
```node
var payment = AfricasTalking.PAYMENT;

payment.checkOut({
  phoneNumber  : '+2547XXXXXXXX',
  productName  : 'your_productName',
  currencyCode : 'KES',
  metadata     : { id: 'A_334646364' },
  amount       : 100
})
.then(function(s) {
    // persist payment status
    console.log(s);
})
.catch(function(error) {
    console.log(error);
});
```
