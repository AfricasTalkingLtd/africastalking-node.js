'use strict'

require('should')

const { version } = require('../package.json')
const Common = require('../lib/common')

const EXPECTED_HEADERS = {
  'User-Agent': `nodejs-sdk/v${version}`
}

describe('SDK headers', function () {
  it('sends exactly the documented SDK headers', function () {
    Common.applySdkHeaders({}).should.deepEqual(EXPECTED_HEADERS)
  })

  it('sends the documented User-Agent format', function () {
    Common.applySdkHeaders({})['User-Agent'].should.match(/^nodejs-sdk\/v\d+\.\d+\.\d+/)
  })

  it('attaches every SDK header on every request', function () {
    const headers = Common.applySdkHeaders({ Accept: 'application/json' })

    for (const [name, value] of Object.entries(EXPECTED_HEADERS)) {
      headers.should.have.property(name, value)
    }

    headers.should.have.property('Accept', 'application/json')
  })

  it('does not mutate the input headers', function () {
    const input = { Accept: 'application/json' }
    Common.applySdkHeaders(input)

    for (const name of Object.keys(EXPECTED_HEADERS)) {
      input.should.not.have.property(name)
    }
  })

  it('overrides any caller supplied SDK header', function () {
    for (const name of Object.keys(EXPECTED_HEADERS)) {
      Common.applySdkHeaders({ [name]: 'someone-else' })
        .should.have.property(name, EXPECTED_HEADERS[name])
    }
  })
})
