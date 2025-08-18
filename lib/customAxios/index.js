const axios = require('axios')
const airtime = require('./airtime')
const application = require('./application')

function initializeAxios (config, idempotencyKey = null) {
  const { username, apiKey, format } = config

  const baseURL = username === 'sandbox'
    ? 'https://api.sandbox.africastalking.com'
    : 'https://api.africastalking.com'

  const createAxiosInstance = (contentType) => {
    const headers = {
      apiKey,
      Accept: format,
      ...(contentType && { 'Content-Type': contentType }),
      ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey })
    }
    return axios.create({
      baseURL,
      headers
    })
  }

  const endpoints = {
    SEND_AIRTIME: '/version1/airtime/send',
    FIND_AIRTIME_TRANSACTION: '/query/transaction/find',
    GET_APPLICATION_DATA: '/version1/user'
  }

  const opts = {
    createAxiosInstance,
    endpoints,
    username
  }

  return {
    airtime: airtime(opts),
    application: application(opts)
  }
};

module.exports = initializeAxios
