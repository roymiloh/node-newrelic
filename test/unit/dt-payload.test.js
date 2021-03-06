'use strict'
var should = require('chai').should()
var expect = require('chai').expect

var makeBuffer = require('../../lib/util/hashes').makeBuffer
var DistributedTracePayload = require('../../lib/transaction/dt-payload')
var DistributedTracePayloadStub = DistributedTracePayload.stub

describe('DistributedTracePayload', function() {
  it('has a text method that returns the stringified payload', function() {
    var payload = {
      a: 1,
      b: 'test'
    }
    var dt = new DistributedTracePayload(payload)
    var output = JSON.parse(dt.text())
    should.exist(output.v)
    expect(Array.isArray(output.v)).to.be.true()
    expect(output.d).to.be.an.object
    var keys = Object.keys(output.d)
    expect(keys.length).to.equal(2)
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
      expect(output.d[key]).to.equal(payload[key])
    }
  })

  it('has a httpSafe method that returns the base64 encoded payload', function() {
    var payload = {
      a: 1,
      b: 'test'
    }
    var dt = new DistributedTracePayload(payload)
    var output = JSON.parse(makeBuffer(dt.httpSafe(), 'base64').toString('utf-8'))
    should.exist(output.v)
    expect(Array.isArray(output.v)).to.be.true()
    expect(output.d).to.be.an.object
    var keys = Object.keys(output.d)
    expect(keys.length).to.equal(2)
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
      expect(output.d[key]).to.equal(payload[key])
    }
  })
})

describe('DistributedTracePayloadStub', function() {
  it('has a httpSafe method that returns an empty string', function() {
    var payload = {
      a: 1,
      b: 'test'
    }
    var dt = new DistributedTracePayloadStub(payload)
    expect(dt.httpSafe()).to.equal('')
  })

  it('has a text method that returns an empty string', function() {
    var payload = {
      a: 1,
      b: 'test'
    }
    var dt = new DistributedTracePayloadStub(payload)
    expect(dt.text()).to.equal('')
  })
})
