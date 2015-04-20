var test = require('tape')
var runner = require('../')

var schedule = [
  {
    id: 'a',
    duration: 1000
  },
  {
    id: 'b',
    duration: 2000
  }
]

runner.time = require('mocktimers')()

test('schedule.', function (t) {
  t.plan(5)
  var lastid
  var readable = runner(schedule, true, function (job, cb) {
    t.ok(job.id !== lastid, 'should have data')
    lastid = job.id
    cb()
  })

  var s = []

  var c = 0

  readable.on('data', function (data) {
    s.push(data.id)
    if (data.state === 'start') ++c
    if (c === 4) {
      console.log('called end')
      readable.end()
    }

    console.log(JSON.stringify(data))
  })

  readable.on('end', function () {
    t.equals(s.join(','), 'a,a,b,b,a,a,b', 'should have correct event order')

  })
})
