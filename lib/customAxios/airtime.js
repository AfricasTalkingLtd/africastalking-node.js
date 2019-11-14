const qs = require('querystring');

function airtime ({ createAxiosInstance, endpoints, username }) {
    return {
        sendAirtimeRequest: data => {
            return createAxiosInstance().post(endpoints.SEND_AIRTIME, qs.stringify({
                ...data,
                username,
            }));
        },
    };
};

module.exports = airtime;
