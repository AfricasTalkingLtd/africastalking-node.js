'use strict';

const initializeAxios = require('./customAxios');

class Application {
    constructor(config) {
        this.config = config;
    }

    fetchApplicationData() {
        return new Promise((resolve, reject) => {
            const customAxios = initializeAxios(this.config);
            
            customAxios.application.getApplicationData()
            .then(function (response) {
                if (response.status === 200) {
                    resolve(response.data);
                } else {
                    reject(response.data || response.error);
                }
            })
            .catch(function (err) {
                reject(err);
            });

        });
    }

    /* backward compatibility */
    fetchAccount() {
        return this.fetchApplicationData();
    }
    /*  end backward compatibility */
}

module.exports = Application;
