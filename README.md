###**_IMPORTANT NOTE_**

**The new version of this SDK is a breaking version. [Read here](#notes) for more info.**

# Africa's Talking Node.js SDK

[![NPM](https://nodei.co/npm/africastalking.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/africastalking)

> The wrapper provides convenient access to the Africa's Talking API from applications written for Node.js.

## Install

You can install the package from [npm](npmjs.com/package/africastalking) by running:

```bash
npm install --save africastalking
```

### Using with Typescript

This package comes with Typescript support 'out of the box'.

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

## Quick Start Example - Send SMS

This example creates an AfricasTalking Client, and sends an SMS to two phone numbers.

```ts
import { Client } from 'africastalking';

// Instantiate the AfricasTalking client
const client = new Client({
    apiKey: 'YOUR_API_KEY', // use your sandbox app API key for development in the test environment
    username: 'YOUR_USERNAME', // use 'sandbox' for development in the test environment
});

// Send message and capture the response or error
client.sendSms({
    to: ['+254711XXXZZZ', '+254733YYYZZZ'],
    message: "I'm a lumberjack and its ok, I work all night and sleep all day"
})
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
```

See [example](example/) for more usage examples.

## API Reference

The complete API Reference is [available here](./API.md).

## Notes

### v1.0.0-beta: breaking version

Please note `v1.0.0-beta` is a breaking version. It greatly changes its usage, and you will need to update your codebase to avoid errors.

```js
const credentials = { apiKey: 'xxxx', username: 'xxxx' };
```

```js
// previously:
const africastalking = require('africastalking')(credentials);
const sms = africastalking.SMS;
sms.send({
    // options
});

// now:
import { Client } from 'africastalking'; // const { Client } = require('africastalking');
const client = new Client(credentials);
client.sendSms({
    // options
});
```

You can find the complete list of new function names [here](./API.md).

However, we understand that updating the bulk of your code can be tedious, so we have given you a way to incrementally upgrade to the new version.

To use the new version, whilst still keeping the old function calls, you only need to update your require statements as follows (**the key word is `.default`**):

```js
const africastalking = require('africastalking').default(credentials);
const sms = africastalking.SMS;
sms.send({
    // options
});
```

However, please note that even this way is altogether being deprecated and will be removed in future versions. Kindly make an effort to rewrite your codebase using the newer syntax.

Alternatively, you can use an older version of the package in your codebase, but this may expose you to certain vulnerabilities.

## Development

```bash
# install npm modules
npm i

# eslint
npm run lint

# typescript check
npm run ts-check

# test
npm t

# build
npm run build
```

## Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/AfricasTalkingLtd/africastalking-node.js/issues).
