const express = require('express');
const router = express.Router();

// TODO: keep secrets secret
const credentials = {
    apiKey: 'b0a758243c8eca791dab7ff60158704e6edd955f28a16b330f032ed3c5c8d5eb',
    username: 'sandbox',
}

const AfricasTalking = require('africastalking')(credentials);
const airtime = AfricasTalking.AIRTIME;

// Airtime routes
router.get('/', (req, res, next) => {
    res.render('airtime', res.locals.commonData);
});

// Send airtime
router.post('/', (req, res, next) => {
    const { to, amount } = req.body;
    const airtimeRecipientList = to.split(',').map( number => {
        return {
            phoneNumber: number.trim(),
            amount: `KES ${amount}`
        }
    });

    airtime.send( { recipients: airtimeRecipientList } ).then( response => {
        console.log(response);
        res.redirect('..');
    }).catch( error => {
        console.log(error);
    });
});

module.exports = router;
