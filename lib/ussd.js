'use strict';

var bodyParser = require('body-parser');
var validate = require('validate.js');

// as per specs http://docs.africastalking.com/ussd
var CONTENT_TYPE = "text/plain";
var SESSION_CONTINUE = "CON ";
var SESSION_END = "END ";
var RESPONSE_CODE = 200;

/**
 *
 * @param handler
 * @returns {*[]} Connect/express middleware
 * @constructor
 */
function ExpressHandler(handler) {

    return [ // connect/express middleware

        bodyParser.urlencoded({extended: true}),
        bodyParser.json(),

        function (req, res, next) {

            var params = {
                sessionId: req.body.sessionId,
                serviceCode: req.body.serviceCode,
                phoneNumber: req.body.phoneNumber,
                text: req.body.text
            };

            handler(params, (opts) => {

                var badOptions = validate(opts, {
                    response: {
                        presence: true,
                        isString: true
                    },
                    endSession: {
                        presence: true,
                        inclusion: [true, false]
                    }
                });

                // express uses next(err) to pass back errors
                if (badOptions) {
                    return next(badOptions);
                }

                var response = opts.response;

                if (opts.endSession) {
                    response = SESSION_END + response;
                } else {
                    response = SESSION_CONTINUE + response;
                }
                res.contentType(CONTENT_TYPE);
                res.status(RESPONSE_CODE).send(response);
            });

        }
    ]
}

// TODO: Helpers for other frameworks?

module.exports = ExpressHandler;
