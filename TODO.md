# TODO

## [NOTES] Important before every push

- [ ] bump version

## Fix

- [x] Tests error
  - [x] grpc server
  - [x] mobile data
  - [x] [payments.cardCheckoutCharge] fix API error: The request content was malformed: Expected String as JsString
- [x] Remove sendBulkSms
- [x] deprecate expressHandler
- [ ] Improve test converage

## SDK

- [ ] Add Idempotency Key
- [ ] Add types:
  - [ ] payments: accepted currencies
  - [ ] missing types (due to no documentation)
- [ ] example/
  - [ ] refactor/update packages
  - [ ] move to independent repo
- [ ] Add tests for voice
- [ ] Update Yoda examples
- [ ] API.md: add documentation for `ActionBuilder`, `CONSTANTS`, etc.
- [ ] analytics on functions usage
- [ ] Fix grpc server
- [ ] Create general account for generating test apiKey credential

### IDEAS

```js
const client = new Client({});

// in addition to:
client.sendSms({ to, from, message });

// allow:
client.sendSms(to, from, message, {
  // options
});
```

## Yoda

- [ ] website
  - [ ] sidebar scroll issue
  - [ ] list item: convert to hyperlink
  - [ ] on click list item, show loading icon
- [ ] documentation:
  - [ ] accepted currencies: b2b, etc.
  - [ ] full pages for token: generateAuthToken() and createCheckoutToken()
