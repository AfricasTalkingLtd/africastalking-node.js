'use strict'

const axios = require('axios')
const Common = require('./common')
class Token {
  constructor (options) {
    this.options = options
  };

  generateAuthToken () {
    const _self = this
    return new Promise((resolve, reject) => {
      const config = {
        method: 'post',
        url: Common.AUTH_TOKEN_URL,
        headers: {
          apiKey: _self.options.apiKey,
          Accept: _self.options.format,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          username: _self.options.username
        })
      }
      axios(config)
        .then(function (resp) {
          const results = resp.data
          if (!results.token || results.token === 'None') {
            return reject(results.description)
          };
          return resolve(results)
        })
        .catch(function (error) {
          return reject(error)
        })
    })
  }
};

module.exports = Token
