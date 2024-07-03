const express = require('express')
const router = express.Router()

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local')

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT)
const payments = AfricasTalking.PAYMENTS

router.post('/mobile-checkout', (req, res) => {
  const {
    productName,
    phoneNumber,
    currencyCode,
    amount
  } = req.body
  const metadata = { Joe: 'Biden', id: 'VP' }

  const options = {
    productName,
    phoneNumber,
    currencyCode,
    amount: Number(amount),
    metadata
  }

  payments.mobileCheckout(options)
    .then(response => {
      console.log(response)
      res.json(response)
    })
    .catch(error => {
      console.log(error)
      res.json(error.toString())
    })
})

router.post('/mobile-b2c', (req, res) => {
  const productName = 'TestProduct'
  const {
    phoneNumber,
    currencyCode,
    amount
  } = req.body

  const firstRecipient = {
    phoneNumber,
    currencyCode,
    amount: Number(amount),
    metadata: { foo: 'bar' },
    reason: payments.REASON.SALARY
  }

  const options = {
    productName,
    recipients: [
      firstRecipient
      // more recipients
    ]
  }

  payments.mobileB2C(options)
    .then(response => {
      console.log(response)
      res.json(response)
    })
    .catch(error => {
      console.log(error)
      res.json(error.toString())
    })
})

module.exports = router
