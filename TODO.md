# TODO

## [NOTES] Important before every push

- [ ] remove test credentials
- [ ] bump version

## Fix

- [x] github actions (tests, run build, push to npm)
- [x] readme
- [ ] Tests error
  - [ ] grpc server
  - [ ] [payments.cardCheckoutCharge] fix API error: The request content was malformed: Expected String as JsString
- [ ] Improve test converage
- [ ] firebase: analytics
- [ ] Remove:
  - expressHandler, ActionBuilder, Server, example/
  - sendBulkSms (+bulkSMSMode)

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
