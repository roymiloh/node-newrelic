'use strict'

var tap = require('tap')
var configurator = require('../../../lib/config')
var Agent = require('../../../lib/agent')

tap.test('Agent should send metrics to staging-collector.newrelic.com', function(t) {
  var config = configurator.initialize({
    app_name: 'node.js Tests',
    license_key: 'd67afc830dab717fd163bfcb0b8b88423e9a1a3b',
    host: 'staging-collector.newrelic.com',
    port: 443,
    ssl: true,
    utilization: {
      detect_aws: false,
      detect_pcf: false,
      detect_gcp: false,
      detect_docker: false
    },
    logging: {
      level: 'trace'
    }
  })
  var agent = new Agent(config)

  agent.start(function(error) {
    t.notOk(error, 'started without error')

    agent.metrics.measureMilliseconds('TEST/discard', null, 101)

    var metrics = agent.metrics.toJSON()
    t.ok(findMetric(metrics, 'TEST/discard'), 'the test metric should be present')

    agent._sendMetrics(function(error) {
      if (!t.notOk(error, 'sent metrics without error')) {
        console.error(error)
      }

      agent.stop(function(error) {
        t.notOk(error, 'stopped without error')
        t.end()
      })
    })
  })
})

function findMetric(metrics, name) {
  for (var i = 0; i < metrics.length; i++) {
    var metric = metrics[i]
    if (metric[0].name === name) return metric
  }
}
