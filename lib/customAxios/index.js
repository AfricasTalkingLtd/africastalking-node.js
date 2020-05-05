const axios = require('axios');
const airtime = require('./airtime');
const application = require('./application');

function initializeAxios (config, idempotencyKey=null) {
    const { username, apiKey, format } = config;

    const baseURL = username === 'sandbox'
        ? 'https://api.sandbox.africastalking.com/version1'
        : 'https://api.africastalking.com/version1/';

    const createAxiosInstance = (contentType = 'application/x-www-form-urlencoded') => {
        let headers = {
            apiKey,
            'Content-Type': contentType,
            Accept: format,
        };
        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }
        return axios.create({
            baseURL,
            headers,
        });
    };

    const endpoints = {
        SEND_AIRTIME: '/airtime/send',
        GET_APPLICATION_DATA: '/user',
    };

    const opts = {
        createAxiosInstance,
        endpoints,
        username,
    };

    return {
        airtime: airtime(opts),
        application: application(opts),
    };
};

module.exports = initializeAxios;
