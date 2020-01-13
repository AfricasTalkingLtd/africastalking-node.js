# TODO

## Add

- Idempotency-Key
- github actions
- types for SMS, AIRTIME

## Rewrites

- example/
- README.md

## BUGS

- website: sidebar scroll issue
- documentation (currencies): b2b, etc.

## IDEAS

- one base url for api
- unified approach (+ imports):

```js
const at = AfricasTalking({});

// instead of:
at.SMS.send()

// update to:
AT.sendSms()
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
