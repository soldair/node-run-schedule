var test = require('tape')
var runner = require('../')

var schedule = [
  {
    duration: 1000,
    data: {
      a: 1,
      b: 2
    }
  }
]

runner.time = require('mocktimers')()

test('schedule.', function (t) {
  t.plan(3)
  var readable = runner(schedule, function (job, cb) {
    t.equals(job.data.a, 1, 'should have data')
    cb()
  })

  var s = ''

  readable.on('data', function (data) {
    s += data.state
  })

  readable.on('end', function () {
    t.ok(1, 'end called')
    t.equals(s, 'startsuccess', 'should have correct event order')
  })
})
