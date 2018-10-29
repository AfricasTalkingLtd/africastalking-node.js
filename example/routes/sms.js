const express = require('express');
const router = express.Router();

// Get authentication secrets from a file
const credentials = require('../../test/fixtures.local');

const AfricasTalking = require('africastalking')(credentials.TEST_ACCOUNT);
const sms = AfricasTalking.SMS;

// Send SMS route
router.post('/send', (req, res) => {
    const {
        to,
        message
    } = req.body;

    sms.send({ to, message, enque: true })
        .then(response => {
            console.log(response);
            res.json(response);
        })
        .catch(error => {
            console.log(error);
            res.json(error.toString());
        });
});

module.exports = router;
