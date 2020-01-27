# TODO

## Important before every push

- remove test credentials
- bump version
- build

## Fix

- Tests error
  - grpc server
  - [payments.cardCheckoutCharge] fix API error: The request content was malformed: Expected String as JsString
- catch err: expect??

## Add

- github actions (tests, run build, push to npm)
- Idempotency-Key
- types:
  - payments: accepted currencies
  - missing types (due to no documentation)
- Improve test converage

## Rewrites

- example/
- README.md

## Yoda

- website
  - sidebar scroll issue
  - list item: convert to hyperlink
  - on click list item, show loading icon
- documentation:
  - accepted currencies: b2b, etc.
  - full pages for token: generateAuthToken() and createCheckoutToken()

## IDEAS

- one base url for api
- valid('')
- breaking:

```js
const at = AfricasTalking({});

// instead of:
at.SMS.send({ to, from, message });

// update to:
at.sendSms(to, from, message, {
  // options
});
```
