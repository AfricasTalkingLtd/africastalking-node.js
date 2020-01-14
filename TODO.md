# TODO

## Add

- github actions (tests, run build, push to npm)
- Idempotency-Key
- types:
  - payments: accepted currencies
  - missing types (due to no documentation)
- [cardCheckOutCharge] fix API error: The request content was malformed: Expected String as JsString

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
- unified approach (not product-based):

```js
const at = AfricasTalking({});

// instead of:
at.SMS.send();

// update to:
AT.sendSms();
```

- breaking

```js
const at = AfricasTalking({});

// instead of:
at.SMS.send({ to, from, message });

// update to:
at.sendSms(to, from, message, {
  // options
});
```
