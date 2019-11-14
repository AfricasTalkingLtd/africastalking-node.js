function application ({ createAxiosInstance, endpoints, username }) {
    return {
        getApplicationData: () => {
            return createAxiosInstance().get(endpoints.GET_APPLICATION_DATA, {
                params: { username },
            });
        },
    };
};

module.exports = application;
