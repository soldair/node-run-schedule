var through2 = require('through2')

module.exports = function (s, options, step) {
  if (!s.length) return false

  if (typeof options === 'function') {
    step = options
    options = {}
  }

  if (options === true) options = {repeat: true}

  options = options || {}
  var repeat = options.repeat
  var ended = false

  // the readble stream returned.
  var out = through2.obj(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  }, function (cb) {
    ended = true
    cb()
  })

  // allow time functions to be mocked.
  var time = module.exports.time

  var pos = 0

  ;(function next () {
    var t = time.now()
    var duration = s[pos].duration

    if (ended) return

    var _pos = pos
    var job = s[_pos]

    // log start state.
    out.push({state: 'start', id: s[pos].id || pos, start: t, time: t})

    // trigger "running" on the job if it excedes it's execution window.
    var nextJobTimeout = time.timeout(function () {
      out.push({state: 'running', id: job.id || _pos, start: t, time: time.now(), error: 'callback not called within duration.', duration: job.duration})
    }, duration)

    step(job, function (err, data) {
      time.clear(nextJobTimeout)

      if (ended) return

      var now = time.now()
      var elapsed = now - t
      var remaining = duration - elapsed
      if (remaining < 0) remaining = 0

      var log = {id: job.id || _pos, start: t, end: now, time: now, error: err, data: data, duration: duration}

      if (err) log.state = 'error'
      else log.state = 'success'

      out.push(log)

      time.timeout(function () {
        ++pos
        if (pos === s.length) {
          if (repeat) pos = 0
          else return out.end()
        }

        if (ended) return
        next()
      }, remaining)
    // duration has to be corrected based on potential overrun from the previous step.
    // overrun has to be reported.
    })
  })()

  return out
}

module.exports.time = {interval: setInterval, timeout: setTimeout, now: Date.now}
