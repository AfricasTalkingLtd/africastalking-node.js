'use strict'

const should = require('should')
const fixtures = require('./fixtures')
const express = require('express')

let AfricasTalking
let USSD
let request
const app = express()
const menu = 'Welcom to Nat Oil \n1: For account info \n2: For lost gas cylinder'
const accountInfo = 'You are Jacky, registered on 4th-2016-March'
const invalidOption = 'Invalid option'

const handler = function (params, next) {
  let endSession = false
  let message = ''

  if (params.text === '') {
    message = menu
  } else if (params.text === '1') {
    message = accountInfo
    endSession = true
  } else if (params.text === '2') {
    message = 'Enter 1 for recovery \n'
    message += 'Enter 2 for lost and found'
    endSession = true
  } else {
    message = invalidOption
    endSession = true
  }

  next({ response: message, endSession })
}

describe('USSD', function () {
  this.timeout(5000)

  before(function (done) {
    AfricasTalking = require('../lib')(fixtures.TEST_ACCOUNT)
    USSD = AfricasTalking.USSD

    app.post('/test-service', new USSD(handler))
    request = require('supertest').agent(app.listen((err) => {
      if (err) throw err
      done()
    }))
  })

  it('returns expected response', function (done) {
    request
      .post('/test-service')
      .send('hello')
      .expect('content-type', /text\/plain/i)
      .expect(200, function (err, resp) {
        if (err) throw err
        const match = resp.text.match(/^(CON)|(END)/)
        should(match).be.ok()
        done()
      })
  })

  it('shows menu', function (done) {
    request
      .post('/test-service')
      .send({ text: '', sessionId: '123', serviceCode: '*123#', phoneNumber: '+1234567890' })
      .expect(200)
      .end(function (err, resp) {
        if (err) throw err
        console.log(resp.text + '\n')
        const match = resp.text.match('CON ' + menu)
        should(match).be.ok()
        done()
      })
  })

  it('shows account info', function (done) {
    request
      .post('/test-service')
      .send({ text: '1', sessionId: '123', serviceCode: '*123#', phoneNumber: '+1234567890' })
      .expect(200)
      .end(function (err, resp) {
        if (err) throw err
        console.log(resp.text + '\n')
        const match = resp.text.match('END ' + accountInfo)
        should(match).be.ok()
        done()
      })
  })

  it('shows invalid choice', function (done) {
    request
      .post('/test-service')
      .send({ text: '13', sessionId: '123', serviceCode: '*123#', phoneNumber: '+1234567890' })
      .expect(200)
      .end(function (err, resp) {
        if (err) throw err
        console.log(resp.text + '\n')
        const match = resp.text.match('END ' + invalidOption)
        should(match).be.ok()
        done()
      })
  })

  it('shows submenu for lost gas cylinder option (2)', function (done) {
    request
      .post('/test-service')
      .send({ text: '2', sessionId: '123', serviceCode: '*123#', phoneNumber: '+1234567890' })
      .expect(200)
      .end((err, resp) => {
        if (err) return done(err)
        resp.text.should.equal('CON Enter 1 for recovery \nEnter 2 for lost and found')
        done()
      })
  })

  it('handles missing fields gracefully', function (done) {
    request
      .post('/test-service')
      .send({})
      .expect(200)
      .end((err, resp) => {
        if (err) return done(err)
        resp.text.should.startWith('CON')
        done()
      })
  })
})
