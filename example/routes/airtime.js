const express = require('express');
const router = express.Router();

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local');

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT);
const airtime = AfricasTalking.AIRTIME;

// Send airtime
router.post('/send', (req, res) => {
    const {
        to,
        currencyCode,
        amount
    } = req.body;

    const airtimeRecipientList = to.split(',')
        .map(number => {
            return {
                phoneNumber: number.trim(),
                currencyCode,
                amount: Number(amount)
            }
        });

    let options = { recipients: airtimeRecipientList }

    airtime.send(options).then(response => {
        console.log(response);
        res.json(response);
    }).catch(error => {
        console.log(error);
        res.json(error.toString());
    });
});

module.exports = router;
