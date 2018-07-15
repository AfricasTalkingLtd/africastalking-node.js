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
    // TODO: validate form submissions
    const {recipients, message} = req.body;

    sms.send({to: recipients, message: message, enque: true}).then( response => {
        console.log(response);
        res.redirect('..');
    }).catch( error => {
        console.log(error);
    });
});

router.post('/send-premium', (req, res) => {
    // TODO: validate form submissions
    const { from, recipients, keyword, linkId, retryDuration, message } = req.body;
    const options = {
        from: from,
        to: recipients,
        keyword: keyword,
        linkId: linkId,
        retryDurationInHours: retryDuration,
        message: message,
        enque: true
    }
    console.log(options);

    sms.send(options).then(response => {
        console.log(response);
        res.redirect('..');
    }).catch(error => {
        console.log(error);
    });
});

// TODO: correct redirects

module.exports = router;
