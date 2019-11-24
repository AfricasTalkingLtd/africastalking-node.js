const axios = require('axios');
const airtime = require('./airtime');
const application = require('./application');

function initializeAxios (config, production = false) {
    const { username, apiKey, format } = config;

    const baseURL = production
        ? 'https://api.africastalking.com/version1/'
        : 'https://api.sandbox.africastalking.com/version1';

    const createAxiosInstance = (contentType = 'application/x-www-form-urlencoded') => {
        return axios.create({
            baseURL,
            headers: {
                apiKey,
                'Content-Type': contentType,
                Accept: format,
            },
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
