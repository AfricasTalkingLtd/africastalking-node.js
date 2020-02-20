# TODO

## [NOTES] Important before every push

- [ ] bump version

## Fix

- [ ] Tests error
  - [ ] grpc server
  - [ ] mobile data
  - [ ] [payments.cardCheckoutCharge] fix API error: The request content was malformed: Expected String as JsString
- [ ] Deprecate:
  - [ ] expressHandler
  - [ ] ActionBuilder
  - [ ] Server
  - [ ] example/
  - [ ] sendBulkSms (+bulkSMSMode?)
- [ ] Improve test converage

## Add

- [ ] Idempotency Key
- [ ] types:
  - [ ] payments: accepted currencies
  - [ ] missing types (due to no documentation)
- [ ] Rewrite:
  - [ ] example/
- [ ] Add tests for voice
- [ ] Update Yoda examples
- [ ] API.md: add documentation for `expressHandler`, `ActionBuilder`, `CONSTANTS`, etc.
- [ ] analytics

## Yoda

- [ ] website
  - [ ] sidebar scroll issue
  - [ ] list item: convert to hyperlink
  - [ ] on click list item, show loading icon
- [ ] documentation:
  - [ ] accepted currencies: b2b, etc.
  - [ ] full pages for token: generateAuthToken() and createCheckoutToken()

## IDEAS

- [ ] one base url for api
- [ ] valid('')
- [ ] functions:

```js
const client = new Client({});

// instead of:
client.sendSms({ to, from, message });

// update to:
client.sendSms(to, from, message, {
  // options
});
```
