# africastalking-node.js
Official AfricasTalking node.js API wrapper

### Install

```shell
$ npm install --save africastalking
```

### Initialization

```javascript
var options = {
    apiKey: 'apiKey',
    username: 'atUsername',
    format: 'json' // or xml
};
var AfricasTalking = require('africastalking')(options);
// ...

```


### res.send(200)
If using express or other framework; remember to reply with a Status of 200. The AT API will retry for a duration of 10 minutes; if you don't acknowldge receiving the message.

```javascript
res.send(response, 200);
```


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

- `fetchMessages(options)`:

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


### Voice **TODO**

```javascript
var voice = AfricasTalking.VOICE;
```
- Make helpers that will construct proper `xml` to send back to Africa's Taking API when it comes `POST`ing. [Read more](http://docs.africastalking.com/voice)
    - `Say`, `Play`, `GetDigits`, `Dial`, `Record`, `Enqueue`, `Dequeue`, `Conference`, `Redirect`, `Reject`
- Initiate a call
- Fetch call queue
- Media upload


### USSD Sample

- Remember to set content type to text/plain, and respond with a Status of 200

```javascript
res.contentType("text/plain");
res.send(200);
```


```javascript
app.post('/ussd', function (req, res) {
    var sessionId = req.body.sessionId;
    var serviceCode = req.body.serviceCode;
    var phoneNumber = req.body.phoneNumber;
    var text = req.body.text;

    console.log(sessionId, serviceCode, phoneNumber, text);
    var response = '';

    if (text == '') {
        response = "CON Welcome to Nat Oil \n";
        response += "1: For account info \n";
        response += "2: For lost gas cylinder";
    }

    if (text == '1') {
        response = "END You are Jacky, registered on 4th-2016-March";
    }

    if (text == '2') {
        response = "CON Enter 1 for recovery \n";
        response += "Enter 2 for lost and found";
    }

    if (text == '2*1') {
        response += "END I don't care";
    }

    // must set contentType to text/plain
    res.contentType("text/plain");
    res.send(response, 200);
});

```
[Read more](http://docs.africastalking.com/ussd)
      

### Account
```javascript
AfricasTalking.fetchAccount()
    .then(success)
    .catch(error);
```
- `fetchAccount()`: Fetch account info; i.e. balance

### Airtime

```javascript
var airtime = AfricasTalking.AIRTIME;
```
- `airtime.send(options)`: Send airtime

    - `recipients`: An array of the following
        - `phoneNumber`: Receipient of airtime
        - `amount`: Amount sent. `>= 10 && <= 10K`


```javascript
   airtime.send(options)
    .then(success)
    .catch(error);
```
