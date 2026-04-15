'use strict'

const mocks = require('./mocks')

exports.TEST_ACCOUNT = {
  apiKey: process.env.AT_APP_API_KEY || 'demo',
  username: process.env.AT_APP_USERNAME || 'sandbox',
  format: 'json'
}
exports.phoneNumber = process.env.TEST_PHONENUMBER || '+254700000000'

exports.mockServices = () => mocks()
