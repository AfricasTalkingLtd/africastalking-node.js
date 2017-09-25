'use strict';

var BASE_DOMAIN        = "africastalking.com";
var BASE_SANDBOX_DOMAIN = "sandbox." + BASE_DOMAIN;

var initUrls = function (sandbox) {

    var baseDomain = sandbox ? BASE_SANDBOX_DOMAIN : BASE_DOMAIN;
    var baseUrl = "https://api." + baseDomain + "/version1";

    exports.BASE_URL = baseUrl;

    exports.CHECKOUT_TOKEN_URL = "https://api." + baseDomain + "/checkout/token/create";

    exports.USER_URL = baseUrl + "/user";

    exports.SMS_URL  = baseUrl + "/messaging";

    exports.AIRTIME_URL = baseUrl + "/airtime/send";

    exports.VOICE_URL = "https://voice." + baseDomain;

    exports.MOBILE_PAYMENT_URL = "https://payments." + baseDomain;
};

// no sandbox by default
initUrls(false);

exports.enableSandbox = function () {
    initUrls(true);
};
