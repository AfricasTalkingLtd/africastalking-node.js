const express = require('express');
const router = express.Router();

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local');

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT);
const payments = AfricasTalking.PAYMENTS;

// Payment routes
router.post('/', (req, res) => {
    let notification = req.body;
    console.log(`\n${notification.category} : `);
    console.log(notification);
});

router.get('/mobile-checkout', (req, res) => {
    res.render('mobileCheckout', res.locals.commonData);
});

router.post('/mobile-checkout', (req, res) => {
    const {
        productName,
        phoneNumber,
        currencyCode,
        amount
    } = req.body;
    let metadata = { "Joe": "Biden", "id": "VP" }

    let options = {
        productName,
        phoneNumber,
        currencyCode,
        amount: Number(amount),
        metadata
    }

    payments.mobileCheckout(options)
        .then( response => {
            console.log(response);
            res.redirect(302, '/');
        })
        .catch( error => {
            console.log(error);
            res.redirect(302, '/');
        });
});

router.get('/bank-checkout', (req, res) => {
    res.render('bankCheckout', res.locals.commonData);
});

router.post('/bank-checkout', (req, res) => {
    const {
        productName,
        currencyCode,
        amount
    } = req.body;

    let bankAccount = {
        accountName: "Test Bank Account",
        accountNumber: "12345678910",
        bankCode: payments.BANK.FCMB_NG
    }
    let narration = "Test bank checkout"
    let metadata = { "foo": "bar"}

    let options = {
        productName,
        bankAccount,
        currencyCode,
        amount: Number(amount),
        narration,
        metadata
    }

    payments.bankCheckout(options)
        .then( response => {
            console.log(response);
            res.redirect(302, '/');
        })
        .catch( error => {
            console.log(error);
            res.redirect(302, '/');
        });
});

module.exports = router;
