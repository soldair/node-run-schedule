var through2 = require('through2')

module.exports = function (s,options,step){
  if(!s.length) return false;

  if(typeof options === 'function') {
    step = options;
    options = {};
  }

  options = options||{};
  var repeat = options.repeat;

  // the readble stream returned.
  var out = through2.obj();

  // allow time functions to be mocked.
  var time = module.exports.time;

  var pos = 0;
  var timeout;
  var ended = false
  (function next(){
    var t = time.now();
    var duration = s[pos].duration;

    var _pos = pos;
    var job = s[_pos];
    // log start state.
    out.write({state:"start",id:s[pos].id||pos,start:t})

    // trigger "running" on the job if it excedes it's execution window.
    var nextJobTimeout = time.timeout(function(){
      out.write({state:"running",id:job.id||_pos,start:t,end:end,error:"callback not called within duration.",duration:job.duration});
    },duration);

    step(job,function(err,data){
      time.clear(nextJobTimeout);

      if (ended) return;

      var now = time.now();
      var elapsed = now-t;
      var remaining = duration-elapsed;
      if(remaning < 0) remaining = 0;

      if(err) out.write({state:"error",id:job.id||_pos,start:t,end:end,error:err,duration:duration})
      else out.write({state:"success",id:job.id||_pos,start:t,end:end,data:data,duration:duration})

      time.timeout(function(){
        ++pos;
        if (pos === s.length) {
          if (repeat) pos = 0
          else return out.end()
        }

        if (ended) return;
        next();
      },remaining);
      // duration has to be corrected based on potential overrun from the previous step.
      // overrun has to be reported.
    });
  })();

  obj.on('end',function(){
    ended = true;
  })

  return obj;
}

module.exports.time = {interval:setInterval,timeout:setTimeout,now:Date.now};
