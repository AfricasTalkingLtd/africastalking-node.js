const axios = require('axios');
const qs = require('querystring');

const initializeAxios = (config, production = false) => {
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
                data: null,
            },
        });
    };

    return {
        sendAirtimeRequest: data => createAxiosInstance().post('/airtime/send', qs.stringify({
            ...data,
            username,
        })),
        sendGetApplicationDataRequest: () => createAxiosInstance().get('/user', {
            params: { username },
        })
    };
};

exports.initializeAxios = initializeAxios;
