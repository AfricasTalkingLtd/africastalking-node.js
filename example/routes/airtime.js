const express = require('express');
const router = express.Router();

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local');

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT);
const airtime = AfricasTalking.AIRTIME;

// Airtime routes
router.get('/', (req, res, next) => {
    res.render('airtime', res.locals.commonData);
});

// Send airtime
router.post('/', (req, res) => {
    const { to, amount } = req.body;
    const airtimeRecipientList = to.split(',').map( number => {
        return {
            phoneNumber: number.trim(),
            amount: `KES ${amount}`
        }
    });

    airtime.send( { recipients: airtimeRecipientList } ).then( response => {
        console.log(response);
        res.redirect(302, '/');
    }).catch( error => {
        console.log(error);
        res.redirect(302, '/');
    });
});

module.exports = router;
