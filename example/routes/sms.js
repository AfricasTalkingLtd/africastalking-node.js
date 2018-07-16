const express = require('express');
const router = express.Router();

// TODO: keep secrets secret
const credentials = {
    apiKey: 'b0a758243c8eca791dab7ff60158704e6edd955f28a16b330f032ed3c5c8d5eb',
    username: 'sandbox',
}

const AfricasTalking = require('africastalking')(credentials);
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

module.exports = router;
