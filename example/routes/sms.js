const express = require('express');
const router = express.Router();

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local');

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT);
const sms = AfricasTalking.SMS;

// SMS routes
router.get('/', function (req, res) {
    res.render('sms', res.locals.commonData);
});

router.post('/send-bulk', (req, res) => {
    const {to, message} = req.body;

    sms.send({ to, message, enque: true }).then( response => {
        console.log(response);
        res.redirect('..');
    }).catch( error => {
        console.log(error);
    });
});

router.post('/send-premium', (req, res) => {
    const { from, to, keyword, linkId, retryDurationInHours, message } = req.body;

    sms.send({ from, to, keyword, linkId, retryDurationInHours, message, enque: true }).then(response => {
        console.log(response);
        res.redirect('/sms');
    }).catch(error => {
        console.log(error);
    });
});

router.post('/delivery', (req, res) => {
    console.log("SMS delivery : ", req.body);
});

router.post('/subscription', (req, res) => {
    const { phoneNumber, shortCode, keyword, updateType } = req.body;
    const alert = `User of phone number ${phoneNumber} has ${updateType} service with shortCode ${shortCode} and keyword ${keyword}`

    console.log(alert);
});

module.exports = router;
