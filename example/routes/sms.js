const express = require('express');
const router = express.Router();

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local');

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT);
const sms = AfricasTalking.SMS;

router.get('/', function (req, res) {
    res.render('sms', res.locals.commonData);
});

// Send SMS route
router.post('/send', (req, res) => {
    const {
        to,
        message
    } = req.body;

    sms.send({ to, message, enque: true })
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
