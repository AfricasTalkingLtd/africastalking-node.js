const express = require('express');
const router = express.Router();

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local');

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT);
const payments = AfricasTalking.PAYMENTS;

// Payment routes
router.post('/', (req, res, next) => {
    let notification = req.body;
    console.log(`\n${notification.category} : `);
    console.log(notification);
});

router.get('/mobile-checkout', (req, res, next) => {
    res.render('mobileCheckout', res.locals.commonData);
});

router.post('/mobile-checkout', (req, res, next) => {
    const { productName, phoneNumber, currencyCode, amount } = req.body;
    let metadata = { "Joe": "Biden", "id": "VP" }

    let options = { productName, phoneNumber, currencyCode, amount: Number(amount), metadata }

    payments.mobileCheckout(options).then( response => {
        console.log(response);
        res.redirect('..');
    }).catch( error => {
        console.log(error);
    });
});

module.exports = router;
